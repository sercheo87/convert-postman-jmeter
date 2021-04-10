const convertPostmanJmeter = require('../lib/convert-postman-jmeter.js');
const expect = require('chai').expect;
const fs = require('fs');

describe('Constructor', function() {
  context('validating options', function() {
    beforeEach(function() {
      // runs before each test in this block
    });

    afterEach(function() {
      if (fs.existsSync('test/resources/test-api-with-out-request.postman_collection.jmx')) {
        fs.unlinkSync('test/resources/test-api-with-out-request.postman_collection.jmx');
      }
      if (fs.existsSync('test/resources/test-api-without-environments.postman_collection.jmx')) {
        fs.unlinkSync('test/resources/test-api-without-environments.postman_collection.jmx');
      }
    });

    it('without options', function() {
      expect(convertPostmanJmeter.convert(undefined)).to.equal(false);
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
        override: true,
      };
      expect(convertPostmanJmeter.convert(options)).to.equal(true);
    });

    it('with file project postman without request', function() {
      const options = {
        projectPostman: 'test/resources/test-api-with-out-request.postman_collection.json',
        projectJmeter: 'test/resources/test-api-with-out-request.postman_collection.jmx',
        override: true,
      };

      expect(convertPostmanJmeter.convert(options)).to.equal(true);
      expect(fs.existsSync('test/resources/test-api-with-out-request.postman_collection.jmx')).to.equal(true);
    });
  });
});
