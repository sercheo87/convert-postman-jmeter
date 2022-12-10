const expect = require('chai').expect;
require('fs');
const RequestObject = require('../lib/request-object');

describe('Constructor RequestObject', function() {
  context('Validating constructor', function() {
    it('Validate get method', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', '/test', 'GET', 'HTTP/1.1');
      expect(a.method).to.be.to.equal('GET');
    });

    it('Validate get method null', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', '/test', undefined, 'HTTP/1.1');
      expect(a.method).to.be.to.equal(undefined);
    });

    it('Validate raw url', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', 'test', 'GET', 'HTTP/1.1');
      expect(a.rawUrl()).to.be.to.equal('http://localhost/test');
    });

    it('Validate transform to JMeter request', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', 'test', 'GET', '');
      const jmeterRequest = a.transformToJmeterRequest();
      expect(jmeterRequest).to.be.not.null;
    });

    it('Validate add header collection', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', 'test', 'GET', '');
      a.addHeaderCollection('test', 'test');
      expect(a.headerCollection).to.be.not.null;
    });
  });
});
