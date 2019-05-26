const convertPostmanJmeter = require('../lib/convert-postman-jmeter.js');
const expect = require('chai').expect;
const fs = require('fs');

describe('Constructor', function() {
  context('validating options', function() {
    it('without options', function() {
      expect(convertPostmanJmeter.convert()).to.equal(false);
    });

    it('with file empty value on options', function() {
      expect(convertPostmanJmeter.convert({projectPostman: ''})).to.equal(false);
    });

    it('without file project postman not exists on options', function() {
      expect(convertPostmanJmeter.convert({projectPostman: 'not-exists.json'})).to.equal(false);
    });

    it('with file project postman exists on options', function() {
      const options = {
        projectPostman: 'test/resources/test-api-without-environments.postman_collection.json',
        projectJmeter: 'test/resources/test-api-without-environments.postman_collection.jmx',
        override: true
      };
      expect(convertPostmanJmeter.convert(options)).to.equal(true);
    });
  });
});
