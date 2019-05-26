'use strict';

const path = require('path');
const fs = require('fs');
const RequestObject = require('./request-object');
const TemplateJmeter = require('./template-jmeter');

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
 * Configure converter
 * @param {*} options
 * @return {boolean} true only converted sucess.
 */
function convertProject(options) {
  console.log('Starting convert...');

  let isParsed = false;
  if (options == undefined) {
    console.error('Options is undefined');
  } else {
    const projectPostman = options.projectPostman || '';
    let projectJmeter = options.projectJmeter || '';
    const override = options.override || false;

    console.log('Read file:', path.resolve(projectPostman));
    isParsed = loadFileProject(projectPostman);

    if (fs.existsSync(projectPostman)) {
      if (isParsed) {
        const requestCollection = [];

        dataPostman.item.forEach(function(item) {
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
            bodyData
          );

          if (item.request.header !== undefined) {
            item.request.header.forEach(function(headerItem) {
              request.addHeaderCollection(headerItem.key, headerItem.value);
            });
          }

          requestCollection.push(request);
        });

        const templateJmeter = new TemplateJmeter();
        const projectContentFile = templateJmeter.engineJmeterProject(
          requestCollection
        );

        if (projectJmeter === undefined || projectJmeter === '') {
          projectJmeter = projectPostman.toString().replace('.json', '.jmx');
        }

        if (fs.existsSync(projectJmeter) && override == false) {
          console.error(
            'File project destination exists: ',
            path.resolve(projectJmeter)
          );
        } else {
          fs.writeFile(projectJmeter, projectContentFile, function(err) {
            if (err) throw err;
            console.log('File is created successfully: ', projectJmeter);
          });
        }
      }
    }
  }
  return isParsed;
}

module.exports.convert = convertProject;
