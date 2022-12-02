'use strict';

/**
 * Dto for Request generic object.
 * @param {string} name
 * @param {string} method
 * @param {string} bodyData
 * @param {string} varMode //once of 'raw', 'resolve', 'jmSyntax'
 */

RequestObject.prototype.parseUrl = function() {
  let varKey = "";
  let hostValue = "";
  let hostComponent = "";
  

  if (this.pmRequestItem.request.url.protocol) {
    this.protocol = this.pmRequestItem.request.url.protocol;
  }

  this.pmRequestItem.request.url.host.forEach(host => {



    if (host.match(this.pmVarRegEx)) {
      varKey = host.substring(2, host.length - 2);
      this.pmVariables.get(varKey).isServerURL = true;
      hostValue = this.pmVariables.get(varKey).value;
      if (hostValue.match(this.httpProtocolRegEx)) {
        this.protocol = hostValue.substring(0, hostValue.indexOf(":"));
        this.hostVariableIncludesProtocol = true;
      }
      hostValue = hostValue.substring(hostValue.indexOf(this.protocol) + this.protocol.length + 3);

      if (this.varMode === 'transform')
        hostComponent = "${" + varKey + "}";
      else if (this.varMode === 'resolve')
        hostComponent = this.pmVariables.get(varKey).value;

    }
    else {
      hostValue = host;
      hostComponent = host;
    }

    this.jmServerUrl = this.jmServerUrl + (this.jmServerUrl.length == 0 ? "" : ".") + hostValue;
    if (this.varMode === 'transform') {
      this.jmServerString = this.jmServerString + (this.jmServerString.length == 0 ? "" : ".") + hostComponent;
    }
    else {
      this.jmServerString = this.jmServerUrl;
    }


  });

  if (this.pmRequestItem.request.url.protocol) {
    this.protocol = this.pmRequestItem.request.url.protocol;
  }



  try {
    this.url = new URL(this.protocol + '://' + this.jmServerUrl + "/" + this.pmRequestItem.request.url.path);


  }
  catch (e) {
    console.log("Error attempting to create URL from: " + this.protocol + '://' + this.jmServerUrl + "/" + this.pmRequestItem.request.url.path);
    console.log(e);
  }
}

RequestObject.prototype.parseParameters = function () {
  this.pmRequestItem.request.url.query.forEach(item => {
    let paramKey;
    let paramValue;
    let valueKey;

    if (item.value.match(this.pmVarRegEx)) {
      if (this.varMode === 'resolve') {
        paramKey = item.key;
        valueKey = item.value.substring(2, item.value.length - 2)
        paramValue = this.pmVariables.get(valueKey).value;
      }

      else if (this.varMode = 'transform') {
        paramKey = item.key;
        paramValue = '${' + item.value.substring(2, item.value.length - 2) + '}';
      }
    }
    else {
      paramKey = item.key;
      paramValue = item.value;

    }
    
    this.requestParams.push({
      "key": paramKey,
      "value": paramValue
    })
})
};


function RequestObject(pmRequestItem, pmVariables, varMode) {

  //get the URL

  
  let varKey = "";
  this.pmVarRegEx = /^\{\{([a-zA-Z0-9_])*\}\}$/gm;
  let url;
  this.httpProtocolRegEx = /^https?:/gm;
  this.method = pmRequestItem.request.method;
  this.name = pmRequestItem.name;
  this.jmServerUrl = "";
  this.jmServerString = "";
  this.varMode = varMode;
  this.bodyData = "";
  this.requestParams = [];
  let params = "";
  let hostComponent = "";
  let hostValue = "";
  this.hostVariableIncludesProtocol = false;
  this.pmRequestItem = pmRequestItem
  this.pmVariables = pmVariables
  this.varMode = varMode
  //TODO: Implement body data

  this.parseUrl();
  
  //parse parameters
  this.parseParameters();

  //this.url.search = params;
  console.log("HOST:\t\t\t" + this.url.host);
  console.log("PROTOCOL:\t" + this.url.protocol);
  console.log("PATHNAME:\t" + this.url.pathname);
  console.log("SEARCH\t" + this.url.search)
  console.log("URL:\t\t" + this.url.toString());
  console.log("PARAMS: " + this.url.href);


  console.log("Done");



};


RequestObject.prototype.method = function () {
  return this.method;
};

RequestObject.prototype.addHeaderCollection = function (key, value) {
  //Resolve or transform variables in headers as well

  const headerItem = {
    headerName: key || '',
    headerValue: value || '',
  };

  this.headerCollection.push(headerItem);
};

RequestObject.prototype.getBodyData = function () {
  //resolve or transform variables here as well
  return this.bodyData;
}

RequestObject.prototype.transformToJmeterRequest = function () {
  const view = {
    testName: this.name,
    server: this.varMode === 'resolve' ? this.url.host : this.jmServerString,
    port: this.url.port = '' ? 80 : this.url.port,
    protocol: this.url.protocol.substring(0, this.url.protocol.indexOf(':')),
    path: this.url.pathname,
    method: this.method,
    bodyData: this.getBodyData(),
    httpTestCollectionsHeader: this.headerCollection,
    requestParams: this.requestParams

  };

  return view;
};

RequestObject.prototype.transformRequestParam = function (param) {
  const view = {
    paramKey: param.key,
    paramValue: param.value
  }
}

module.exports = RequestObject;
