import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { LocationDto } from './dto/LocationDto';
import { GasController } from './gas.controller';
import { GasService } from './gas.service';
import { PointDeVente } from './schemas/PointDeVente.schema';

describe('GasController', () => {
  let controller: GasController;
  let service: GasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, CacheModule.register(), ScheduleModule.forRoot()],
      controllers: [GasController],
      providers: [
        GasService,
        {
          provide: getModelToken('PointDeVente'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GasService>(GasService);
    controller = module.get<GasController>(GasController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('root', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
      expect(service).toBeDefined();
    });
  });

  describe('#populateDatabaseWithDailyData() with resolved promised', () => {
    it('should download a zip file', (done) => {
      expect.assertions(3);

      expect(service.downloadZipFile).toBeDefined();

      const url = 'http://example.com';

      const buffer = Buffer.from('test');

      jest.spyOn(service, 'downloadZipFile').mockResolvedValue(buffer);

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
      expect.assertions(2);

      expect(service.writeFile).toBeDefined();

      const fileName = 'test';
      const buffer = Buffer.from('test');

      jest.spyOn(service, 'writeFile').mockResolvedValue();

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
      expect.assertions(3);

      expect(service.extractZipFile).toBeDefined();

      const zipName = 'test.zip';

      const zipContent = ['test.txt', 'test.xml'];

      jest.spyOn(service, 'extractZipFile').mockResolvedValue(zipContent);

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
      expect.assertions(3);

      expect(service.readXmlFile).toBeDefined();

      const file = 'test.xml';

      const fileContent = 'test';

      jest.spyOn(service, 'readXmlFile').mockResolvedValue(fileContent);

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
      expect.assertions(3);

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
            nonStop: false,
            jour: [
              { id: '1', nom: 'Lundi', ferme: false },
              { id: '2', nom: 'Mardi', ferme: false },
              { id: '3', nom: 'Mercredi', ferme: false },
              { id: '4', nom: 'Jeudi', ferme: false },
              { id: '5', nom: 'Vendredi', ferme: false },
              { id: '6', nom: 'Samedi', ferme: false },
              { id: '7', nom: 'Dimanche', ferme: false },
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
      expect.assertions(2);

      expect(service.deleteFiles).toBeDefined();

      const fileNames = ['test'];

      jest.spyOn(service, 'deleteFiles').mockResolvedValue();

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
      expect.assertions(2);

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
      expect.assertions(2);

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
      expect.assertions(2);

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
      expect.assertions(2);

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
      expect.assertions(2);

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
      expect.assertions(2);

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

  describe('#populateDatabaseWithDailyData()', () => {
    it('should return nothing', async () => {
      expect.assertions(2);

      jest.spyOn(service, 'populateDatabaseWithDailyData').mockResolvedValue();

      expect(await controller.populateDatabaseWithDailyData()).toEqual(
        undefined,
      );
      expect(service.populateDatabaseWithDailyData).toHaveBeenCalled();
    });
  });

  describe('#getPointsDeVente', () => {
    it('should an empty list', async () => {
      expect.assertions(2);

      const result: Array<PointDeVente> = new Array<PointDeVente>();

      jest.spyOn(service, 'getAllPointDeVente').mockResolvedValue(result);

      expect(await controller.getPointsDeVente()).toEqual(result);
      expect(service.getAllPointDeVente).toHaveBeenCalled();
    });

    it('should a list', async () => {
      expect.assertions(2);

      const result: Array<PointDeVente> = [
        {
          prix: [],
          services: [],
          ville: 'BELLEGARDE',
          adresse: '79 RUE DE LA REPUBLIQUE',
          pop: 'R',
          cp: Number('01200'),
          position: {
            longitude: 0,
            latitude: 0,
          },
          id: 1200004,
        },
        {
          prix: [],
          services: [
            'Toilettes publiques',
            'Boutique alimentaire',
            'Station de gonflage',
            'Boutique non alimentaire',
            'Piste poids lourds',
            'Lavage automatique',
          ],
          ville: 'SAINT QUENTIN',
          adresse: '60 BIS RUE DE LA FERE',
          pop: 'R',
          cp: Number('02100'),
          position: {
            longitude: 0,
            latitude: 0,
          },
          id: 2100014,
        },
      ];

      jest.spyOn(service, 'getAllPointDeVente').mockResolvedValue(result);

      expect(await controller.getPointsDeVente()).toEqual(result);
      expect(service.getAllPointDeVente).toHaveBeenCalled();
    });
  });

  describe('#getPointDeVenteById(:id)', () => {
    const resultForId1: PointDeVente = {
      prix: [],
      services: [],
      ville: 'BELLEGARDE',
      adresse: '79 RUE DE LA REPUBLIQUE',
      pop: 'R',
      cp: Number('01200'),
      position: {
        longitude: 0,
        latitude: 0,
      },
      id: 1,
    };

    it('should return an object when we specify a correct id', async () => {
      expect.assertions(2);

      jest
        .spyOn(service, 'getPointDeVenteById')
        .mockResolvedValue(resultForId1);

      expect(await controller.getPointDeVenteById(1)).toEqual(resultForId1);
      expect(service.getPointDeVenteById).toHaveBeenCalledWith(1);
    });

    it('should return an empty object when we specify an incorrect id', async () => {
      expect.assertions(2);

      jest
        .spyOn(service, 'getPointDeVenteById')
        .mockResolvedValue({} as PointDeVente);

      expect(await controller.getPointDeVenteById(2)).toEqual({});
      expect(service.getPointDeVenteById).toHaveBeenCalledWith(2);
    });
  });

  describe('#getPointDeVentesByLocation()', () => {
    const pointsDeVente: Array<PointDeVente> = [
      {
        prix: [],
        services: [],
        ville: 'BELLEGARDE',
        adresse: '79 RUE DE LA REPUBLIQUE',
        pop: 'R',
        cp: Number('01200'),
        position: {
          longitude: 0,
          latitude: 0,
        },
        id: 1200004,
      },
      {
        prix: [],
        services: [
          'Toilettes publiques',
          'Boutique alimentaire',
          'Station de gonflage',
          'Boutique non alimentaire',
          'Piste poids lourds',
          'Lavage automatique',
        ],
        ville: 'SAINT QUENTIN',
        adresse: '60 BIS RUE DE LA FERE',
        pop: 'R',
        cp: Number('02100'),
        position: {
          longitude: 0,
          latitude: 0,
        },
        id: 2100014,
      },
    ];

    it('should get all gas station near the position given in the perimeter specified', async () => {
      expect.assertions(2);

      const locationDto: LocationDto = {
        position: {
          latitude: 0,
          longitude: 0,
        },
        distance: 0,
      };
      const spy = jest
        .spyOn(service, 'getPointsDeVenteByLocation')
        .mockResolvedValue(pointsDeVente);

      expect(await controller.getPointsDeVenteByLocation(locationDto)).toEqual(
        pointsDeVente,
      );
      expect(spy).toHaveBeenCalledWith(locationDto);
    });
  });
});
