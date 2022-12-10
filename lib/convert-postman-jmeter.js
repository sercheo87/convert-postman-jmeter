'use strict';

const contains = require('string-contains');
const path = require('path');
const fs = require('fs');
const RequestObject = require('./request-object');
const TemplateJmeter = require('./template-jmeter');
const ArgumentObject = require('./argument-object');

let dataPostman;
let dataEnvironmentPostman;

/**
 * Load file project Postman to convert JMeter
 * @param {*} projectPostman
 * @return {boolean} true only loaded success.
 */
function importProjectFromFile(projectPostman) {
  try {
    const fileContents = fs.readFileSync(projectPostman, 'utf8');

    try {
      dataPostman = JSON.parse(fileContents);
      return true;
    } catch (err) {
      console.error('Error parsing json file', err);
    }
  } catch (err) {
    console.log('Error loading file', err);
  }

  return false;
}

/**
 * Import project postman from API Postman
 * @param {string}idProjectPostman Id project postman.
 * @param {string}keyUserPostman Key user postman.
 * @return {Promise<void>} Promise.
 */
async function importProjectPostman(idProjectPostman, keyUserPostman) {
  await fetch(`https://api.getpostman.com/collections/${idProjectPostman}`, {
    method: 'GET',
    headers: {
      'X-Api-Key': keyUserPostman,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data === undefined || data['collection'] === undefined) {
        console.error('Error: Project postman importing.', data);
        return false;
      }

      dataPostman = data['collection'];
      return (dataPostman !== undefined);
    });
}

/**
 * Load file environment project Postman to convert JMeter
 * @param {string} projectEnvironmentFile
 * @return {boolean} true only loaded success.
 */
function loadFileEnvironmentProject(projectEnvironmentFile) {
  try {
    if (projectEnvironmentFile !== undefined && projectEnvironmentFile !== '') {
      const fileContents = fs.readFileSync(projectEnvironmentFile, 'utf8');
      dataEnvironmentPostman = JSON.parse(fileContents);
    }

    return true;
  } catch (err) {
    console.log('Error loading environment file', err);
  }

  return false;
}

/**
 * Update environment flag from Postman to JMeter
 * @param {*} projectContentFile Raw content file.
 * @return {*}
 */
function convertEnvironmentFlags(projectContentFile) {
  return projectContentFile.replace(/{{/g, '${').replace(/}}/g, '}');
}

/**
 * Load environment file
 * @param {string}projectEnvironmentFile Path file environment postman.
 * @return {ArgumentObject} Object arguments.
 */
function loadEnvironmentFile(projectEnvironmentFile) {
  const isParsedEnvironmentFile = loadFileEnvironmentProject(projectEnvironmentFile);
  const argumentObject = new ArgumentObject();

  if (fs.existsSync(projectEnvironmentFile) && isParsedEnvironmentFile) {
    console.log('Read file environment:', path.resolve(projectEnvironmentFile));
    dataEnvironmentPostman.values.forEach((item) => {
      argumentObject.addArgumentsCollection(item.key, item.value);
    });
  }
  return argumentObject;
}

/**
 *  Execute convert project postman to JMeter
 * @param {string}argumentObject Object arguments.
 * @param {string}projectJmeter Name project out JMeter.
 * @param {string}projectPostman Path project postman.
 * @param {boolean}override Flag is override.
 * @return {Promise<boolean>} Name project out JMeter.
 */
async function executeConvert(argumentObject, projectJmeter, projectPostman, override) {
  return await new Promise((resolve, reject) => {
    if (dataPostman === undefined || dataPostman === null || dataPostman === '' || dataPostman.item === undefined || dataPostman.item === null || dataPostman.item === '') {
      console.error('Error: File project postman is empty.');
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(false);
    }

    const requestCollection = [];

    console.log('👉 Total requests:', dataPostman.item.length + ' requests');

    dataPostman.item.forEach(function(item) {
      if (item !== undefined && item.request !== undefined && item.request.url !== undefined && item.request.url !== null) {
        const urlItem = item.request.url;
        let bodyData = '';

        if (item.request.body !== undefined) {
          bodyData = item.request.body.raw || '';
        }

        console.log('\t🤖 Importing request:', item.name);
        const request = new RequestObject(
          item.name,
          urlItem.protocol,
          urlItem.host.join('.'),
          '',
          urlItem.path.join('/'),
          item.request.method,
          bodyData,
        );

        if (item.request.header !== undefined) {
          item.request.header.forEach(function(headerItem) {
            request.addHeaderCollection(headerItem.key, headerItem.value);
          });
        }

        requestCollection.push(request);
      } else {
        console.log('Request with data incomplete');
      }
    });

    const templateJmeter = new TemplateJmeter();
    let projectContentFile = templateJmeter.engineJmeterProject(
      requestCollection,
      argumentObject,
    );

    projectContentFile = convertEnvironmentFlags(projectContentFile);

    if (!projectJmeter) {
      projectJmeter = projectPostman.toString().replace('.json', '.jmx');
    }

    if (fs.existsSync(projectJmeter) && override === false) {
      console.error(
        'File project destination exists: ',
        path.resolve(projectJmeter),
      );
    } else {
      fs.writeFile(projectJmeter, projectContentFile, function(err) {
        if (err) throw err;
        console.log('File is created successfully: ', projectJmeter);
      });
    }
    resolve(true);
  });
}

/**
 * Export individual project postman
 * @param {string} projectPostman Path project postman.
 * @param {string} projectJmeter Name project out JMeter.
 * @param {boolean} override Flag is override.
 * @param {string} projectEnvironmentFile Path file environment postman.
 * @return {Promise<boolean>} Promise.
 */
async function exportByProject(projectPostman, projectJmeter, override, projectEnvironmentFile) {
  console.log('Read file:', path.resolve(projectPostman));
  console.log('Export to file:', path.resolve(projectJmeter));
  const isParsed = importProjectFromFile(projectPostman);
  const argumentObject = loadEnvironmentFile(projectEnvironmentFile);

  if (fs.existsSync(projectPostman) && isParsed) {
    return executeConvert(argumentObject, projectJmeter, projectPostman, override);
  }
}

/**
 * Export individual project postman by Id Postman
 * @param {string}idProjectPostman Id project postman.
 * @param {string}keyUserPostman Key user postman.
 * @param {string}projectJmeter Name project out JMeter.
 * @param {boolean}override Flag is override.
 * @param {string}projectEnvironmentFile Path file environment postman.
 * @return {Promise<boolean>} Promise.
 */
async function exportByIdProject(idProjectPostman, keyUserPostman, projectJmeter, override, projectEnvironmentFile) {
  console.log('Export to file:', path.resolve(projectJmeter));
  const isParsed = await importProjectPostman(idProjectPostman, keyUserPostman);
  const argumentObject = loadEnvironmentFile(projectEnvironmentFile);

  if (isParsed) {
    return executeConvert(argumentObject, projectJmeter, idProjectPostman, override);
  }
}

/**
 * Configure converter
 * @param {*} options
 * @return {Promise<boolean>} true only converted success.
 */
async function convertProject(options) {
  console.log('Starting convert...');

  if (options === undefined) {
    console.error('Options is undefined');
  } else {
    const projectPostman = options.projectPostman || '';
    const projectJmeter = options.projectJmeter || '';
    const override = options.override || false;
    const batchFolder = options.batchFolder || '';
    const projectEnvironmentFile = options.projectEnvironmentPostman || '';
    const idProjectPostman = options.idProjectPostman || '';
    const keyUserPostman = options.keyUserPostman || '';
    const executeConvertFromBatchProcess = batchFolder !== '';
    const executeConvertFromProjectFile = projectPostman !== '';
    const executeConvertFromIdProject = idProjectPostman !== '' && keyUserPostman !== '';

    if (executeConvertFromBatchProcess) {
      console.log('Export by batch project');

      return new Promise((resolve, reject) => {
        fs.readdirSync(batchFolder).forEach((file) => {
          if (fs.lstatSync(path.resolve(batchFolder, file)).isFile()) {
            if (contains(file, '.postman_collection.json')) {
              const projectJmeterGenerated = path.resolve(batchFolder, file.replace('.json', '.jmx'));
              const projectPostman = path.resolve(batchFolder, file);
              console.log('File project: ' + projectPostman);
              exportByProject(projectPostman, projectJmeterGenerated, true, undefined);
            }
          }
        });

        resolve(true);
      });
    }

    if (executeConvertFromProjectFile && projectJmeter !== '') {
      console.log('Export individual project');
      await exportByProject(projectPostman, projectJmeter, override, projectEnvironmentFile);
    }

    if (executeConvertFromIdProject && projectJmeter !== '') {
      console.log('Export individual project from id project');

      await exportByIdProject(idProjectPostman, keyUserPostman, projectJmeter, override, projectEnvironmentFile);
    }
  }
}

module.exports.convert = convertProject;
