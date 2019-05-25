'use strict';

const path = require('path');
const fs = require('fs');
const RequestObject = require('./request-object');
const TemplateJmeter = require('./template-jmeter');

var dataPostman;

function loadFileProject(projectPostman) {
  try {
    var fileContents = fs.readFileSync(projectPostman, 'utf8');

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

function convertProject(options) {
  console.log('Starting convert...');

  var isParsed = false;
  if (options == undefined) {
    console.error('Options is undefined');
  } else {
    const projectPostman = options.projectPostman || '';
    var projectJmeter = options.projectJmeter || '';
    var override = options.override || false;

    console.log('Read file:', path.resolve(projectPostman));
    isParsed = loadFileProject(projectPostman);

    if (fs.existsSync(projectPostman)) {
      if (isParsed) {
        var requestCollection = new Array();

        dataPostman.item.forEach(function(item) {
          const urlItem = item.request.url;
          var bodyData = '';

          if (item.request.body !== undefined) {
            bodyData = item.request.body.raw || '';
          }

          var request = new RequestObject(
            item.name,
            urlItem.protocol,
            urlItem.host.join('.'),
            '',
            urlItem.path.join('/'),
            item.request.method,
            bodyData
          );

          requestCollection.push(request);
        });

        var templateJmeter = new TemplateJmeter();
        var projectContentFile = templateJmeter.engineJmeterProject(
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
