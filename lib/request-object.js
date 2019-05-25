'use strict';

function RequestObject(name, protocol, domain, port, path, method, bodyData) {
  this.name = name;
  this.protocol = protocol;
  this.domain = domain;
  this.port = port;
  this.path = path;
  this.method = method;
  this.bodyData = bodyData;
}

RequestObject.prototype.rawUrl = function() {
  return this.protocol + '://' + this.domain + '/' + this.path;
};

RequestObject.prototype.rawPath = function() {
  return '/' + this.path;
};

RequestObject.prototype.method = function() {
  return this.method;
};

RequestObject.prototype.transformToJmeterRequest = function() {
  var view = {
    testName: this.name,
    domain: this.domain,
    port: this.port,
    protocol: this.protocol,
    path: this.rawPath(),
    method: this.method,
    bodyData: this.bodyData
  };

  return view;
};

module.exports = RequestObject;
