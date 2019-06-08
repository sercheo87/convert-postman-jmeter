'use strict';

const fs = require('fs');
const Mustache = require('mustache');

/**
 * Constructor object
 */
function TemplateJmeter() {}

TemplateJmeter.prototype.templateProject = function() {
  const projectJmeterTemplate = 'templates/jmeter-template.xml';

  try {
    return fs.readFileSync(projectJmeterTemplate, 'utf8');
  } catch (err) {
    console.error('Error reading template file: ', projectJmeterTemplate, err);
  }
};

TemplateJmeter.prototype.engineJmeterProject = function(
  templateJmeterCollection
) {
  const requestCollection = [];
  templateJmeterCollection.forEach(function(item) {
    requestCollection.push(item.transformToJmeterRequest());
  });

  if (templateJmeterCollection && templateJmeterCollection.length() > 0) {
    const viewProjectDataRender = {
      httpTestCollections: requestCollection,
    };

    return Mustache.render(this.templateProject(), viewProjectDataRender);
  }
};

module.exports = TemplateJmeter;
