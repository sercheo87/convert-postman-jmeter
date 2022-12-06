'use strict';

const contains = require('string-contains');
const path = require('path');
const fs = require('fs');
const RequestObject = require('./request-object');
const TemplateJmeter = require('./template-jmeter');
const VariableObject = require('./variable-object');
let pmRequests = [];
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
function parseEnvironmentVariables(options,vars)
{
  let env = {};
  if (fs.existsSync(options.envFile))
  {
    env = JSON.parse(fs.readFileSync(options.envFile));
  }
  else
  {
    console.error("Error reading environment file");
  }
  env.values.forEach(function (variable) {
    const varObj = new VariableObject(
      variable.key,
      variable.value,
      variable.type,
      variable.enabled,
      "Environment"
    );

    vars.set(varObj.key, varObj);
    

  });
}

function exportByProject(options) {

  console.log('Read file:', path.resolve(options.projectPostman));
  console.log('Export to file:', path.resolve(options.projectJmeter));
  const isParsed = loadFileProject(options.projectPostman);
  let planDetails = [];

  if (fs.existsSync(options.projectPostman)) {
    if (isParsed) {
      const requestCollection = [];
      const collectionVariables = new Map();
      //parse Postman Collection variables

      planDetails.push({"planname" : dataPostman.info.name.replaceAll(" ", "_")});

      dataPostman.variable.forEach(function (variable) {
        const varObj = new VariableObject(
          variable.key,
          variable.value,
          variable.type,
          true,
         "Collection"
        );

        collectionVariables.set(varObj.key, varObj);

      })
      if(!(typeof options.envFile === 'undefined'))
      {
        parseEnvironmentVariables(options, collectionVariables);
      }
      


      findAllRequests(dataPostman, "request");
      pmRequests.forEach(function (item) {

        if (item !== undefined & item.request !== undefined && item.request.url !== null) {
          requestCollection.push(new RequestObject(item, collectionVariables, options.varMode));
        }

        else {
          console.log('Request with data incomplete');
        }

      });

      const templateJmeter = new TemplateJmeter();
      const projectContentFile = templateJmeter.engineJmeterProject(
        requestCollection, Array.from(collectionVariables.values()), planDetails);


      if (!options.projectJmeter) {
        options.projectJmeter = options.projectPostman.toString().replace('.json', '.jmx');
      }

      if (fs.existsSync(options.projectJmeter) && options.override === false) {
        console.error(
          'File project destination exists: ',
          path.resolve(options.projectJmeter),
        );
      } else {
        fs.writeFile(options.projectJmeter, projectContentFile, function (err) {
          if (err) throw err;
          console.log('File is created successfully: ', options.projectJmeter);
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
    options.projectPostman = options.projectPostman || '';
    options.projectJmeter = options.projectJmeter || '';
    options.override = options.override || false;
    options.batchFolder = options.batchFolder || '';
    options.varMode = options.varMode || 'resolve';
    
    if (options.batchFolder !== '') {
      console.log('Export by batch project');

      fs.readdirSync(options.batchFolder).forEach((file) => {
        if (fs.lstatSync(path.resolve(options.batchFolder, file)).isFile()) {
          if (contains(file, '.postman_collection.json')) {
            const projectJmeterGenerated = path.resolve(options.batchFolder, file.replace('.json', '.jmx'));
            const projectPostman = path.resolve(options.batchFolder, file);
            console.log('File project: ' + projectPostman);
            exportByProject(options);
          }
        }
      });
      isParsed = true;
    } else {
      console.log('Export individual project');
      if (options.projectPostman !== '' && options.projectJmeter !== '') {
        isParsed = exportByProject(options);
      }
    }
  }
  return isParsed;
}

function isObject(value) {
  return !!(value && typeof value === "object" && !Array.isArray(value));
}

//Recursively find all the 'request' items, since folders and other stuff also have the 'item' key
function findAllRequests(object = {}, keyToMatch = "") {

  if (isObject(object)) {
    const entries = Object.entries(object);

    for (let i = 0; i < entries.length; i += 1) {
      const [objectKey, objectValue] = entries[i];
      if (objectKey === keyToMatch) {
        pmRequests.push(object);
        return object;
      }
      if (Array.isArray(objectValue)) {
        for (let z = 0; z < objectValue.length; z += 1) {
          findAllRequests(objectValue[z], keyToMatch);
        }
      }
      if (isObject(objectValue)) {

        const child = findAllRequests(objectValue, keyToMatch);

        if (child !== null) {
          return child;
        }
      }

    }
  }

  return null;
};

module.exports.convert = convertProject;
