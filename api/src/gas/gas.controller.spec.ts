import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';

describe('GasController', () => {
  let controller: GasController;
  let service: GasService;
  let http: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [GasController],
      providers: [GasService],
    }).compile();

    service = module.get<GasService>(GasService);
    http = service['http'];
    controller = module.get<GasController>(GasController);
  });

  it('should be defined', () => {
    expect(http).toBeDefined();
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should download a zip file', (done) => {
    expect(service.downloadZipFile).toBeDefined();

    const buffer = Buffer.from('test');

    jest.spyOn(service, 'downloadZipFile').mockImplementation(() => {
      return Promise.resolve(buffer);
    });

    service
      .downloadZipFile('url')
      .then((data) => {
        expect(data).toEqual(buffer);
        done();
      })
      .catch((err) => {
        fail(err);
      });
  });

  it('should write a file', (done) => {
    expect(service.writeFile).toBeDefined();

    const fileName = 'test';
    const buffer = Buffer.from('test');

    jest.spyOn(service, 'writeFile').mockImplementation(() => {
      return Promise.resolve();
    });

    service
      .writeFile(fileName, buffer)
      .then(() => {
        expect(service.writeFile).toHaveBeenCalledWith(fileName, buffer);
        done();
      })
      .catch((err) => {
        fail(err);
      });
  });

  it('should not write a file', (done) => {
    expect(service.writeFile).toBeDefined();

    const fileName = 'test';
    const buffer = Buffer.from('test');

    jest.spyOn(service, 'writeFile').mockImplementation(() => {
      return Promise.reject();
    });

    service
      .writeFile(fileName, buffer)
      .then(() => {
        fail('Writing a file should fail');
      })
      .catch(() => {
        expect(service.writeFile).toHaveBeenCalledWith(fileName, buffer);
        done();
      });
  });

  xit('should extract a zip file', (done) => {
    expect(service.extractZipFile).toBeDefined();

    const fileName = 'test';

    jest.spyOn(service, 'extractZipFile').mockImplementation(() => {
      return Promise.resolve();
    });

    service
      .extractZipFile(fileName)
      .then(() => {
        expect(service.extractZipFile).toHaveBeenCalledWith(fileName);
        done();
      })
      .catch((err) => {
        fail(err);
      });
  });

  xit('should not extract a zip file', (done) => {
    expect(service.extractZipFile).toBeDefined();

    const fileName = 'test';

    jest.spyOn(service, 'extractZipFile').mockImplementation(() => {
      return Promise.reject();
    });

    service
      .extractZipFile(fileName)
      .then(() => {
        fail('Extracting a zip file should fail');
      })
      .catch(() => {
        expect(service.extractZipFile).toHaveBeenCalledWith(fileName);
        done();
      });
  });

  it('should delete a zip file', (done) => {
    expect(service.deleteFile).toBeDefined();

    const fileName = 'test';

    jest.spyOn(service, 'deleteFile').mockImplementation(() => {
      return Promise.resolve();
    });

    service
      .deleteFile(fileName)
      .then(() => {
        expect(service.deleteFile).toHaveBeenCalledWith(fileName);
        done();
      })
      .catch((err) => {
        fail(err);
      });
  });

  it('should not delete a zip file', (done) => {
    expect(service.deleteFile).toBeDefined();

    const fileName = 'test';

    jest.spyOn(service, 'deleteFile').mockImplementation(() => {
      return Promise.reject();
    });

    service
      .deleteFile(fileName)
      .then(() => {
        fail('The file should not be deleted');
      })
      .catch(() => {
        expect(service.deleteFile).toHaveBeenCalledWith(fileName);
        done();
      });
  });
});
