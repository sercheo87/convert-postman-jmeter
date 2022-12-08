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
function loadFileProject(projectPostman) {
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
 * Load file environment project Postman to convert JMeter
 * @param {*} projectEnvironmentFile
 * @return {boolean} true only loaded success.
 */
function loadFileEnvironmentProject(projectEnvironmentFile) {
  try {
    const fileContents = fs.readFileSync(projectEnvironmentFile, 'utf8');

    try {
      dataEnvironmentPostman = JSON.parse(fileContents);
      return true;
    } catch (err) {
      console.error('Error parsing json environment file', err);
    }
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
 * Export individual project postman
 * @param {string} projectPostman Path project postman.
 * @param {string} projectJmeter Name project out JMeter.
 * @param {boolean} override Flag is override.
 * @param {string} projectEnvironmentFile Path file environment postman.
 * @return {boolean} Is success.
 */
function exportByProject(projectPostman, projectJmeter, override, projectEnvironmentFile) {
  console.log('Read file:', path.resolve(projectPostman));
  console.log('Export to file:', path.resolve(projectJmeter));
  const isParsed = loadFileProject(projectPostman);
  const isParsedEnvironmentFile = loadFileEnvironmentProject(projectEnvironmentFile);
  const argumentObject = new ArgumentObject();

  if (fs.existsSync(projectEnvironmentFile) && isParsedEnvironmentFile) {
    console.log('Read file environment:', path.resolve(projectEnvironmentFile));
    dataEnvironmentPostman.values.forEach((item) => {
      argumentObject.addArgumentsCollection(item.key, item.value);
    });
  }

  if (fs.existsSync(projectPostman)) {
    if (isParsed) {
      const requestCollection = [];

      dataPostman.item.forEach(function(item) {
        if (item !== undefined && item.request !== undefined && item.request.url !== undefined && item.request.url !== null) {
          const urlItem = item.request.url;
          let bodyData = '';

          if (item.request.body !== undefined) {
            bodyData = item.request.body.raw || '';
          }

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
    }
  }
  return isParsed;
}

/**
 * Configure converter
 * @param {*} options
 * @return {boolean} true only converted success.
 */
function convertProject(options) {
  console.log('Starting convert...');

  let isParsed = false;
  if (options === undefined) {
    console.error('Options is undefined');
  } else {
    const projectPostman = options.projectPostman || '';
    const projectJmeter = options.projectJmeter || '';
    const override = options.override || false;
    const batchFolder = options.batchFolder || '';
    const projectEnvironmentFile = options.projectEnvironmentPostman || '';

    if (batchFolder !== '') {
      console.log('Export by batch project');

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
      isParsed = true;
    } else {
      console.log('Export individual project');
      if (projectPostman !== '' && projectJmeter !== '') {
        isParsed = exportByProject(projectPostman, projectJmeter, override, projectEnvironmentFile);
      }
    }
  }
  return isParsed;
}

module.exports.convert = convertProject;
