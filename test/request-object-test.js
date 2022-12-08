const expect = require('chai').expect;
require('fs');
const RequestObject = require('../lib/request-object');

describe('Constructor RequestObject', function() {
  context('Validating constructor', function() {
    it('Validate get method', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', '/test', 'GET', 'HTTP/1.1');
      expect(a.method).to.be.to.equal('GET');
    });

    it('Validate raw url', function() {
      const a = new RequestObject('', 'http', 'localhost', '8080', 'test', 'GET', 'HTTP/1.1');
      expect(a.rawUrl()).to.be.to.equal('http://localhost/test');
    });
  });
});
