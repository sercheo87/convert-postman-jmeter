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
  return fs.readFileSync(projectJmeterTemplate, 'utf8');
};

TemplateJmeter.prototype.engineJmeterProject = function(templateJmeterCollection, argumentObject) {
  const requestCollection = [];
  (templateJmeterCollection || []).forEach(function(item) {
    requestCollection.push(item.transformToJmeterRequest());
  });

  if (templateJmeterCollection) {
    const viewProjectDataRender = {
      httpTestCollections: requestCollection,
      httpArgumentCollections: argumentObject.argumentCollection,
    };

    return Mustache.render(this.templateProject(), viewProjectDataRender);
  }
};

module.exports = TemplateJmeter;
