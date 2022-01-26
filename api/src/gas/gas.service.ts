import { HttpService } from '@nestjs/axios';
import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as AdmZip from 'adm-zip';
import { Cache } from 'cache-manager';
import { readFile, unlink, writeFile } from 'fs';
import { Model } from 'mongoose';
import { firstValueFrom, map } from 'rxjs';
import * as xmlParser from 'xml2js';
import { LocationDto } from './dto/LocationDto';
import { Jour } from './schemas/Jour.schema';
import {
  PointDeVente,
  PointDeVenteDocument,
} from './schemas/PointDeVente.schema';

@Injectable()
export class GasService implements OnModuleInit {
  private readonly logger = new Logger(GasService.name);

  private readonly gasApi =
    process.env.URL_GAS_API || 'https://donnees.roulez-eco.fr/opendata/jour';
  private readonly xmlEncoding = 'latin1'; // ISO-8859-1 == latin1
  private readonly tmpFolder = '/tmp/';

  constructor(
    private readonly http: HttpService,
    @InjectModel(PointDeVente.name)
    private readonly pointDeVenteModel: Model<PointDeVenteDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit(): void {
    this.populateDatabaseWithDailyData()
      .then(() =>
        this.logger.debug(
          '#onModuleInit: populateDatabaseWithDailyData() done',
        ),
      )
      .catch(() => this.logger.error("Couldn't populate database"));
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async populateDatabaseWithDailyDataCron(): Promise<void> {
    this.logger.verbose('#populateDatabaseWithDailyDataCron()');
    await this.cacheManager.reset();
    await this.populateDatabaseWithDailyData();
    this.logger.verbose('#populateDatabaseWithDailyDataCron() done');
  }

  async populateDatabaseWithDailyData(): Promise<void> {
    this.logger.verbose('#populateDatabaseWithDailyData()');
    const zipName = `dailyData_${new Date().toISOString().split('T')[0]}.zip`;

    // Download zip file
    const zipBuffer = await this.downloadZipFile(this.gasApi);

    // Create locally a zip with the zip buffer
    await this.writeFile(zipName, zipBuffer);

    // Extract zip file previously created
    const files = await this.extractZipFile(zipName);

    // Read xml file and match it with the schema (see api/src/gas/schema/PointDeVente.schema.ts)
    const xmlFile = files.filter((fileName) => fileName.endsWith('.xml'))[0];
    const xmlContent = await this.readXmlFile(xmlFile);
    const jsonContent = await this.parseXml(xmlContent);

    // Write the result in mongo db
    await this.pushDataToMongoDB(jsonContent.pdv_liste.pdv);

    // Delete the zip file and extracted files
    await this.deleteFiles(files.concat(zipName));

    this.logger.verbose('#populateDatabaseWithDailyData() done');
  }

  async downloadZipFile(url: string): Promise<Buffer> {
    this.logger.verbose(`#downloadZipFile(${url})`);
    return await firstValueFrom(
      this.http
        .get(url, {
          responseType: 'arraybuffer',
        })
        .pipe(map((response: any) => response.data)),
    );
  }

  async writeFile(fileName: string, data: Buffer): Promise<void> {
    this.logger.verbose(`#writeFile(${fileName})`);
    return new Promise((resolve, reject) => {
      writeFile(this.tmpFolder + fileName, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async extractZipFile(zipName: string): Promise<Array<string>> {
    this.logger.verbose(`#extractZipFile(${zipName})`);
    return new Promise((resolve, reject) => {
      const zip = new AdmZip(this.tmpFolder + zipName);
      if (zip.getEntries().length === 0) {
        reject(Error('Zip file is empty'));
      } else {
        zip.extractAllTo(this.tmpFolder, true);
        resolve(zip.getEntries().map((entry: any) => entry.entryName));
      }
    });
  }

  readXmlFile(xmlFile: string): Promise<string> {
    this.logger.verbose(`#readXmlFile(${xmlFile})`);
    return new Promise((resolve, reject) => {
      readFile(this.tmpFolder + xmlFile, this.xmlEncoding, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.toString());
        }
      });
    });
  }

  parseXml(xml: string): Promise<any> {
    this.logger.verbose(`#parseXml()`);
    return new Promise((resolve, reject) => {
      xmlParser
        .parseStringPromise(xml, {
          mergeAttrs: true,
          explicitArray: false,
        })
        .then((json: any) => {
          resolve(json);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  async pushDataToMongoDB(data: Array<any>): Promise<void> {
    this.logger.verbose(`#pushDataToMongoDB()`);
    // First we clean the database
    await this.pointDeVenteModel.deleteMany();

    // Then we push the data
    const pointDeVentes: Array<PointDeVente> = new Array<PointDeVente>();

    data.forEach((item) => {
      // Preprocess some attributes to match with db schema
      const { horaires } = item;
      if (horaires?.jour) {
        horaires.jour.forEach((jour: Jour) => {
          if (!Array.isArray(jour.horaire)) {
            jour.horaire = [jour.horaire];
          }
        });
      }
      const pointDeVente: PointDeVente = {
        id: item.id,
        position: {
          latitude: Number(item.latitude) / 100000,
          longitude: Number(item.longitude) / 100000,
        },
        cp: item.cp,
        pop: item.pop,
        adresse: item.adresse,
        ville: item.ville,
        horaires: item.horaires,
        services: item.services?.service,
        prix: item.prix,
        rupture: item.rupture,
      };

      pointDeVentes.push(pointDeVente);
    });

    if (pointDeVentes.length) {
      await this.pointDeVenteModel.create(pointDeVentes);
    }
  }

  async deleteFiles(fileNames: Array<string>): Promise<void> {
    this.logger.verbose(`#deleteZipFile(${fileNames})`);
    const errors: Array<NodeJS.ErrnoException> =
      new Array<NodeJS.ErrnoException>();
    return new Promise((resolve, reject) => {
      fileNames.forEach((fileName) => {
        unlink(this.tmpFolder + fileName, (err) => {
          if (err) {
            errors.push(err);
          }
        });
      });
      if (errors.length) {
        reject(errors);
      } else {
        resolve();
      }
    });
  }

  async getAllPointDeVente(): Promise<Array<PointDeVente>> {
    this.logger.verbose('#getAllPointDeVente()');
    return await this.pointDeVenteModel.find();
  }

  async getPointDeVenteById(id: string): Promise<PointDeVente> {
    this.logger.verbose(`#getPointDeVenteById(${id})`);
    return await this.pointDeVenteModel.findOne({ id });
  }

  async getPointDeVentesByLocation(
    location: LocationDto,
  ): Promise<Array<PointDeVente>> {
    this.logger.verbose(
      `#getPointDeVentesByLocation(): Latitude: ${location.position.latitude}, Longitude: ${location.position.longitude}`,
    );
    return await this.pointDeVenteModel.find({
      position: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              location.position.longitude,
              location.position.latitude,
            ],
          },
          $maxDistance: location.distance,
        },
      },
    });
  }
}
