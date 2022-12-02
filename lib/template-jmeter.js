'use strict';

const fs = require('fs');
const Mustache = require('mustache');
const path = require('path');

/**
 * Constructor object
 */
function TemplateJmeter() {
}

TemplateJmeter.prototype.templateProject = function() {
  const projectJmeterTemplate = path.resolve(__dirname, '..', 'templates/jmeter-template.xml');

  try {
    return fs.readFileSync(projectJmeterTemplate, 'utf8');
  } catch (err) {
    console.error('Error reading template file: ', projectJmeterTemplate, err);
  }
};

TemplateJmeter.prototype.engineJmeterProject = function(
  templateJmeterCollection, templateVariableCollection
) {
  const requestCollection = [];
  const variableCollection = [];
  const requestParameterCollection = [];
  templateJmeterCollection.forEach(function(item) {
    requestCollection.push(item.transformToJmeterRequest());
  });

  templateVariableCollection.forEach(function(variable) {
    variableCollection.push(variable.transformToJmeterVariable());
  });

let userDefinedVariables = {};
userDefinedVariables.variableCollection = variableCollection;

  if (templateJmeterCollection) {
    const viewProjectDataRender = {
      httpTestCollections: requestCollection,
      userDefinedVariables: userDefinedVariables

    };

    return Mustache.render(this.templateProject(), viewProjectDataRender);
  }
};

module.exports = TemplateJmeter;
