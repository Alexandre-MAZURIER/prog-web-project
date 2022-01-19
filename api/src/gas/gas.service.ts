import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as AdmZip from 'adm-zip';
import { unlink, writeFile } from 'fs';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class GasService {
  private readonly logger = new Logger(GasService.name);
  private readonly tmpFolder = '/tmp/';

  constructor(private readonly http: HttpService) {}

  async getDailyData(): Promise<void> {
    this.logger.verbose('#getDailyData()');
    const zipName = `dailyData_${new Date().toISOString().split('T')[0]}.zip`;

    // Download zip file
    const zipBuffer = await this.downloadZipFile(
      'https://donnees.roulez-eco.fr/opendata/jour',
    );

    // Create locally a zip with the zip buffer
    await this.writeFile(zipName, zipBuffer);

    // Extract zip file previously created
    const files = await this.extractZipFile(zipName);

    // Read xml file and match it with the schema (see api/src/gas/dto/PointOfSale.dto.ts)

    // Write the result in mongo db

    // Delete the zip file and extracted files
    await this.deleteFiles(files.concat(zipName));
  }

  async downloadZipFile(url: string): Promise<Buffer> {
    this.logger.debug(`#downloadZipFile(${url})`);
    return await firstValueFrom(
      this.http
        .get(url, {
          responseType: 'arraybuffer',
        })
        .pipe(map((response: any) => response.data)),
    );
  }

  async writeFile(fileName: string, data: Buffer): Promise<void> {
    this.logger.debug(`#writeFile(${fileName})`);
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
    this.logger.debug(`#extractZipFile(${zipName})`);
    return new Promise((resolve, reject) => {
      const zip = new AdmZip(this.tmpFolder + zipName);
      if (zip.getEntries().length === 0) {
        reject('Zip file is empty');
      } else {
        zip.extractAllTo(this.tmpFolder, true);
        resolve(zip.getEntries().map((entry: any) => entry.entryName));
      }
    });
  }

  async deleteFiles(fileNames: Array<string>): Promise<void> {
    this.logger.debug(`#deleteZipFile(${fileNames})`);
    const errors: Array<any> = new Array<any>();
    return new Promise((resolve, reject) => {
      fileNames.forEach((fileName) => {
        unlink(this.tmpFolder + fileName, (err) => {
          if (err) {
            errors.push(err);
          }
        });
        if (errors) {
          reject(errors);
        } else {
          resolve();
        }
      });
    });
  }
}
