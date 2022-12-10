const expect = require('chai').expect;
require('fs');
const TemplateJmeter = require('../lib/template-jmeter');

describe('Constructor RequestObject', function() {
  context('Validating constructor', function() {
    it('Validate template project', function() {
      const a = new TemplateJmeter();
      expect(a.templateProject()).not.to.be.null;
    });

    it('Validate engine jmeter project', function() {
      const a = new TemplateJmeter();
      expect(a.engineJmeterProject(undefined, [])).not.to.be.throw;
    });
  });
});
