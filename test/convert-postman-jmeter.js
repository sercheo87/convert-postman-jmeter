const convertPostmanJmeter = require('../lib/convert-postman-jmeter.js');
const expect = require('chai').expect;
const fs = require('fs');

describe('Constructor', function() {
  context('validating options', function() {
    const jmeterProjectFile1 = 'test/resources/test-api-with-out-request.postman_collection.jmx';
    const jmeterProjectFile2 = 'test/resources/test-api-without-environments.postman_collection.jmx';
    const jmeterProjectFile3 = 'test/resources/test-api-without-environments-v9.21.5.postman_collection.jmx';
    const file1 = 'test/resources/batch-projects/test-api-without-environments-1.postman_collection.jmx';
    const file2 = 'test/resources/batch-projects/test-api-without-environments-2.postman_collection.jmx';

    before(function() {
      if (fs.existsSync(jmeterProjectFile1)) {
        fs.unlinkSync(jmeterProjectFile1);
      }
      if (fs.existsSync(jmeterProjectFile2)) {
        fs.unlinkSync(jmeterProjectFile2);
      }
      if (fs.existsSync(jmeterProjectFile3)) {
        fs.unlinkSync(jmeterProjectFile3);
      }
      if (fs.existsSync(file1)) {
        fs.unlinkSync(file1);
      }
      if (fs.existsSync(file2)) {
        fs.unlinkSync(file2);
      }
    });

    after(function() {
      if (fs.existsSync(jmeterProjectFile1)) {
        fs.unlinkSync(jmeterProjectFile1);
      }
      if (fs.existsSync(jmeterProjectFile2)) {
        fs.unlinkSync(jmeterProjectFile2);
      }
      if (fs.existsSync(jmeterProjectFile3)) {
        fs.unlinkSync(jmeterProjectFile3);
      }
      if (fs.existsSync(file1)) {
        fs.unlinkSync(file1);
      }
      if (fs.existsSync(file2)) {
        fs.unlinkSync(file2);
      }
    });

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
        projectJmeter: jmeterProjectFile2,
        override: true,
      };
      expect(convertPostmanJmeter.convert(options)).to.equal(true);
    });

    it('with file project postman exists on options new version Postman v9.21.5', function() {
      const options = {
        projectPostman: 'test/resources/test-api-without-environments-v9.21.5.postman_collection.json',
        projectJmeter: jmeterProjectFile3,
        override: true,
      };
      expect(convertPostmanJmeter.convert(options)).to.equal(true);
    });

    it('with file project postman without request', function() {
      const options = {
        projectPostman: 'test/resources/test-api-with-out-request.postman_collection.json',
        projectJmeter: jmeterProjectFile1,
        override: true,
      };

      expect(convertPostmanJmeter.convert(options)).to.equal(true);
      expect(fs.existsSync(jmeterProjectFile1)).to.equal(true);
    });

    it('with folder batch project generate jmeter projects', function() {
      const file1 = 'test/resources/batch-projects/test-api-without-environments-1.postman_collection.jmx';
      const file2 = 'test/resources/batch-projects/test-api-without-environments-2.postman_collection.jmx';

      const options = {
        batchFolder: 'test/resources/batch-projects',
      };

      expect(convertPostmanJmeter.convert(options)).to.equal(true);

      expect(fs.existsSync(file1)).to.equal(true);
      expect(fs.existsSync(file2)).to.equal(true);
    });
  });
});
