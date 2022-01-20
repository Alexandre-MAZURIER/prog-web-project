import { HttpModule, HttpService } from '@nestjs/axios';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';

describe('GasController', () => {
  let controller: GasController;
  let service: GasService;
  let http: HttpService;

  // let model: Model<PointDeVente>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [GasController],
      providers: [
        GasService,
        {
          provide: getModelToken('PointDeVente'),
          useValue: {
            new: jest.fn().mockResolvedValue(null),
            constructor: jest.fn().mockResolvedValue(null),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GasService>(GasService);
    http = service['http'];
    controller = module.get<GasController>(GasController);
    // model = module.get<Model<PointDeVente>>(getModelToken('PointDeVente'));
  });

  it('should be defined', () => {
    expect(http).toBeDefined();
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('#populateDatabaseWithDailyData() with resolved promised', () => {
    it('should download a zip file', (done) => {
      expect(service.downloadZipFile).toBeDefined();

      const url = 'http://example.com';

      const buffer = Buffer.from('test');

      jest.spyOn(service, 'downloadZipFile').mockImplementation(() => {
        return Promise.resolve(buffer);
      });

      service
        .downloadZipFile(url)
        .then((data) => {
          expect(service.downloadZipFile).toHaveBeenCalledWith(url);
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

    it('should extract a zip file', (done) => {
      expect(service.extractZipFile).toBeDefined();

      const zipName = 'test.zip';

      const zipContent = ['test.txt', 'test.xml'];

      jest.spyOn(service, 'extractZipFile').mockImplementation(() => {
        return Promise.resolve(zipContent);
      });

      service
        .extractZipFile(zipName)
        .then((content) => {
          expect(service.extractZipFile).toHaveBeenCalledWith(zipName);
          expect(content).toEqual(zipContent);
          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it('should read xml file content correctly', (done) => {
      expect(service.readXmlFile).toBeDefined();

      const file = 'test.xml';

      const fileContent = 'test';

      jest.spyOn(service, 'readXmlFile').mockImplementation(() => {
        return Promise.resolve(fileContent);
      });

      service
        .readXmlFile(file)
        .then((content) => {
          expect(service.readXmlFile).toHaveBeenCalledWith(file);
          expect(content).toEqual(fileContent);
          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it("should parse a xml with 'latin1' encoding correctly", (done) => {
      expect(service.parseXml).toBeDefined();

      const xmlContent =
        '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>' +
        '<pdv id="1000009" latitude="4619566" longitude="522935" cp="01000" pop="R">' +
        '<adresse>56 Rue du Stand</adresse>' +
        '<ville>Bourg-en-Bresse</ville>' +
        '<horaires automate-24-24="">' +
        '<jour id="1" nom="Lundi" ferme=""/>' +
        '<jour id="2" nom="Mardi" ferme=""/>' +
        '<jour id="3" nom="Mercredi" ferme=""/>' +
        '<jour id="4" nom="Jeudi" ferme=""/>' +
        '<jour id="5" nom="Vendredi" ferme=""/>' +
        '<jour id="6" nom="Samedi" ferme=""/>' +
        '<jour id="7" nom="Dimanche" ferme=""/>' +
        '</horaires>' +
        '<services>' +
        '<service>Vente de gaz domestique (Butane, Propane)</service>' +
        '<service>DAB (Distributeur automatique de billets)</service>' +
        '<service>Vente de fioul domestique</service>' +
        '</services>' +
        '<prix nom="Gazole" id="1" maj="2022-01-18T11:56:52" valeur="1609"/>' +
        '<prix nom="SP95" id="2" maj="2022-01-18T11:57:08" valeur="1689"/>' +
        '<prix nom="E10" id="5" maj="2022-01-18T11:56:33" valeur="1649"/>' +
        '<prix nom="SP98" id="6" maj="2022-01-18T11:57:24" valeur="1739"/>' +
        '<rupture id="4" nom="GPLc" debut="2015-09-17T10:57:00" fin=""/>' +
        '<rupture id="3" nom="E85" debut="2015-09-17T10:58:00" fin=""/>' +
        '</pdv>';

      const expected = {
        pdv: {
          id: '1000009',
          latitude: '4619566',
          longitude: '522935',
          cp: '01000',
          pop: 'R',
          adresse: '56 Rue du Stand',
          ville: 'Bourg-en-Bresse',
          horaires: {
            'automate-24-24': '',
            jour: [
              { id: '1', nom: 'Lundi', ferme: '' },
              { id: '2', nom: 'Mardi', ferme: '' },
              { id: '3', nom: 'Mercredi', ferme: '' },
              { id: '4', nom: 'Jeudi', ferme: '' },
              { id: '5', nom: 'Vendredi', ferme: '' },
              { id: '6', nom: 'Samedi', ferme: '' },
              { id: '7', nom: 'Dimanche', ferme: '' },
            ],
          },
          services: {
            service: [
              'Vente de gaz domestique (Butane, Propane)',
              'DAB (Distributeur automatique de billets)',
              'Vente de fioul domestique',
            ],
          },
          prix: [
            {
              nom: 'Gazole',
              id: '1',
              maj: '2022-01-18T11:56:52',
              valeur: '1609',
            },
            {
              nom: 'SP95',
              id: '2',
              maj: '2022-01-18T11:57:08',
              valeur: '1689',
            },
            { nom: 'E10', id: '5', maj: '2022-01-18T11:56:33', valeur: '1649' },
            {
              nom: 'SP98',
              id: '6',
              maj: '2022-01-18T11:57:24',
              valeur: '1739',
            },
          ],
          rupture: [
            { id: '4', nom: 'GPLc', debut: '2015-09-17T10:57:00', fin: '' },
            { id: '3', nom: 'E85', debut: '2015-09-17T10:58:00', fin: '' },
          ],
        },
      };

      jest.spyOn(service, 'parseXml');

      service
        .parseXml(xmlContent)
        .then((data) => {
          expect(service.parseXml).toHaveBeenCalledWith(xmlContent);
          expect(data).toEqual(expected);
          done();
        })
        .catch((err) => {
          fail(err);
        });
    });

    it('should delete a zip file', (done) => {
      expect(service.deleteFiles).toBeDefined();

      const fileNames = ['test'];

      jest.spyOn(service, 'deleteFiles').mockImplementation(() => {
        return Promise.resolve();
      });

      service
        .deleteFiles(fileNames)
        .then(() => {
          expect(service.deleteFiles).toHaveBeenCalledWith(fileNames);
          done();
        })
        .catch((err) => {
          fail(err);
        });
    });
  });

  describe('#populateDatabaseWithDailyData() with rejected promised', () => {
    it('should not download a zip file', (done) => {
      expect(service.downloadZipFile).toBeDefined();

      const url = 'http://example.com';

      jest.spyOn(service, 'downloadZipFile').mockImplementation(() => {
        return Promise.reject();
      });

      service
        .downloadZipFile(url)
        .then(() => {
          fail('Download should have failed');
        })
        .catch(() => {
          expect(service.downloadZipFile).toHaveBeenCalledWith(url);
          done();
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

    it('should not extract a zip file', (done) => {
      expect(service.extractZipFile).toBeDefined();

      const zipName = 'test';

      jest.spyOn(service, 'extractZipFile').mockImplementation(() => {
        return Promise.reject();
      });

      service
        .extractZipFile(zipName)
        .then(() => {
          fail('Extracting a zip file should have failed');
        })
        .catch(() => {
          expect(service.extractZipFile).toHaveBeenCalledWith(zipName);
          done();
        });
    });

    it('should not read xml file content correctly', (done) => {
      expect(service.readXmlFile).toBeDefined();

      const file = 'test.xml';

      jest.spyOn(service, 'readXmlFile').mockImplementation(() => {
        return Promise.reject();
      });

      service
        .readXmlFile(file)
        .then(() => {
          fail('Reading a file should have failed');
        })
        .catch(() => {
          expect(service.readXmlFile).toHaveBeenCalledWith(file);
          done();
        });
    });

    it('should not parse a xml correctly', (done) => {
      expect(service.parseXml).toBeDefined();

      const badXmlContent = 'Some bad XML';

      jest.spyOn(service, 'parseXml');

      service
        .parseXml(badXmlContent)
        .then(() => {
          fail('Parsing should have failed');
        })
        .catch(() => {
          expect(service.parseXml).toHaveBeenCalledWith(badXmlContent);
          done();
        });
    });

    it('should not delete a zip file', (done) => {
      expect(service.deleteFiles).toBeDefined();

      const fileNames = ['test'];

      jest.spyOn(service, 'deleteFiles').mockImplementation(() => {
        return Promise.reject();
      });

      service
        .deleteFiles(fileNames)
        .then(() => {
          fail('The files should not be deleted');
        })
        .catch(() => {
          expect(service.deleteFiles).toHaveBeenCalledWith(fileNames);
          done();
        });
    });
  });
});
