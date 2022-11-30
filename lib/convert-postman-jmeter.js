'use strict';

const contains = require('string-contains');
const path = require('path');
const fs = require('fs');
const RequestObject = require('./request-object');
const TemplateJmeter = require('./template-jmeter');
const VariableObject = require('./variable-object');

let dataPostman;


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
 * Export individual project postman
 * @param {string} projectPostman Path project postman.
 * @param {string} projectJmeter Name project out JMeter.
 * @param {boolean} override Flag is override.
 * @return {boolean} Is success.
 */
function exportByProject(projectPostman, projectJmeter, override) {
  console.log('Read file:', path.resolve(projectPostman));
  console.log('Export to file:', path.resolve(projectJmeter));
  const isParsed = loadFileProject(projectPostman);

  if (fs.existsSync(projectPostman)) {
    if (isParsed) {
      const requestCollection = [];
      const collectionVariables = [];
//parse Postman Collection variables

      dataPostman.variable.forEach(function(variable) {
        const varObj = new VariableObject(
          variable.key,
          variable.value,
          variable.type
        );

        collectionVariables.push(varObj);

      })


      dataPostman.item.forEach(function(item) {
        if (item !== undefined & item.request !== undefined && item.request.url !== null) {
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
      const projectContentFile = templateJmeter.engineJmeterProject(
        requestCollection, collectionVariables
      );

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

    if (batchFolder !== '') {
      console.log('Export by batch project');

      fs.readdirSync(batchFolder).forEach((file) => {
        if (fs.lstatSync(path.resolve(batchFolder, file)).isFile()) {
          if (contains(file, '.postman_collection.json')) {
            const projectJmeterGenerated = path.resolve(batchFolder, file.replace('.json', '.jmx'));
            const projectPostman = path.resolve(batchFolder, file);
            console.log('File project: ' + projectPostman);
            exportByProject(projectPostman, projectJmeterGenerated, true);
          }
        }
      });
      isParsed = true;
    } else {
      console.log('Export individual project');
      if (projectPostman !== '' && projectJmeter !== '') {
        isParsed = exportByProject(projectPostman, projectJmeter, override);
      }
    }
  }
  return isParsed;
}

module.exports.convert = convertProject;
