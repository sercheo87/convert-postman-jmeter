const expect = require('chai').expect;
require('fs');
const ArgumentObject = require('../lib/argument-object');

describe('Constructor ArgumentObject', function() {
  context('Validating options', function() {
    it('Validate constructor with valid values', function() {
      const a = new ArgumentObject();
      a.addArgumentsCollection('key', 'value');
      expect(a.argumentCollection.length).to.be.to.equal(1);
    });

    it('Validate constructor with invalid values', function() {
      const a = new ArgumentObject();
      a.addArgumentsCollection(null, null);
      expect(a.argumentCollection.length).to.be.to.equal(1);
    });

    it('Validate transform', function() {
      const a = new ArgumentObject();
      a.addArgumentsCollection('key', 'value');
      expect(a.transformToJmeterRequest()).to.be.to.equal(1);
    });
  });
});
