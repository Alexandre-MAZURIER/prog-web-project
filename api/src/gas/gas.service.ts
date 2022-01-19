import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { unlink, writeFile } from 'fs';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class GasService {
  private readonly logger = new Logger(GasService.name);
  private readonly tmpFolder = '/tmp/';

  constructor(private readonly http: HttpService) {}

  async getDailyData(): Promise<void> {
    this.logger.verbose('#getDailyData()');
    const fileName = `dailyData_${new Date().toISOString().split('T')[0]}.zip`;

    // Download zip file
    const zipBuffer = await this.downloadZipFile(
      'https://donnees.roulez-eco.fr/opendata/jour',
    );

    // Create locally a zip with the zip buffer
    await this.writeFile(fileName, zipBuffer);

    // Extract zip file previously created
    await this.extractZipFile(fileName);

    // Read xml file and match it with the schema (see api/src/gas/dto/PointOfSale.dto.ts)

    // Write the result in mongo db

    // Delete the zip file
    await this.deleteFile(fileName);
    // Delete the xml file
    // await this.deleteFile([XML]);
  }

  async downloadZipFile(url: string): Promise<Buffer> {
    this.logger.debug(`#downloadZipFile(${url})`);
    return await firstValueFrom(
      this.http
        .get(url, {
          responseType: 'arraybuffer',
        })
        .pipe(map((response) => response.data)),
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

  async extractZipFile(fileName: string): Promise<void> {
    this.logger.debug(`#extractZipFile(${fileName})`);
    return new Promise((resolve, reject) => {
      // TODO
      resolve();
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    this.logger.debug(`#deleteZipFile(${fileName})`);
    return new Promise((resolve, reject) => {
      unlink(this.tmpFolder + fileName, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
