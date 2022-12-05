'use strict';

/**
 * Dto for Request generic object.
 * @param {object} pmRequestItem
 * @param {object} pmVariables
 * @param {string} varMode //once of 'raw', 'resolve', 'jmSyntax'
 */
 function RequestObject(pmRequestItem, pmVariables, varMode) {

  this.pmVarRegEx = /^\{\{([a-zA-Z0-9_])*\}\}$/gm;
  this.httpProtocolRegEx = /^https?:/gm;
  this.method = pmRequestItem.request.method;
  this.name = pmRequestItem.name;
  this.jmServerUrl = "";
  this.jmServerString = "";
  this.varMode = varMode;
  this.bodyData = "";
  this.requestParams = [];
  this.hostVariableIncludesProtocol = false;
  this.pmRequestItem = pmRequestItem
  this.pmVariables = pmVariables
  this.varMode = varMode
  //TODO: Implement body data

  this.parseUrl();
  
  //parse parameters
  this.parseParameters();

  //this.url.search = params;
  /* console.log("HOST:\t\t\t" + this.url.host);
  console.log("PROTOCOL:\t" + this.url.protocol);
  console.log("PATHNAME:\t" + this.url.pathname);
  console.log("SEARCH\t" + this.url.search)
  console.log("URL:\t\t" + this.url.toString());
  console.log("PARAMS: " + this.url.href); */


  console.log("Done parsing request item");



};



RequestObject.prototype.parseUrl = function() {
  let varKey = "";
  let hostValue = "";
  let hostComponent = "";
  let curVar = {};
  

  //If the request item has a protocol, there's no protocol in the host array, so just use it
  if (this.pmRequestItem.request.url.protocol) {
    this.protocol = this.pmRequestItem.request.url.protocol;
  }

RequestObject.prototype.stripPmVarKey = function (pmVar) {
  return pmVar.substring(2, pmVar.length - 2);
}

  //spin the host array, resolving any variables

  this.pmRequestItem.request.url.host.forEach(host => {
    //Is this a postman variable?
    if (host.match(this.pmVarRegEx)) {
      //If so extract the key (remove the {{}})
      varKey = this.stripPmVarKey(host);
      //get the value
      curVar = this.pmVariables.get(varKey);
      //Since we're in the host, it's a server URL component, this means we'll have to strip the protocol if it exists
      curVar.isServerURL = true;
      //get the value from the variables hash
      //hostValue = curVar.value;
      if (curVar.value.match(this.httpProtocolRegEx)) {
        this.protocol = curVar.value.substring(0, curVar.value.indexOf(":"));
        //Strip the protocol
        hostValue = curVar.value.substring(curVar.value.indexOf(this.protocol) + this.protocol.length + 3);
        //this.hostVariableIncludesProtocol = true;
      }
      

      //Resolve the host component we're going to add to the `JMeter Server Name or IP` panel
      if (this.varMode === 'transform')
      //The JMeter syntax User Defined Variable  
      hostComponent = curVar.getJmeterVariableToken();
      else if (this.varMode === 'resolve')
      //The actual value  
      hostComponent = curVar.value;

    }
    //If we're not a variable just resolve it.  
    else {
      hostValue = host;
      hostComponent = host;
    }
    //Build the actual URL string, used for validation later
    this.jmServerUrl = this.jmServerUrl + (this.jmServerUrl.length == 0 ? "" : ".") + hostValue;
    if (this.varMode === 'transform') {
      //COncatenate with dots if we're transforming to JMter variable syntax
      this.jmServerString = this.jmServerString + (this.jmServerString.length == 0 ? "" : ".") + hostComponent;
    }
    else {
      //Otherwise everything is the same
      this.jmServerString = this.jmServerUrl;
    }
  });

  //If we don't have a protocol, that means one wasn't provided in the collection item and we were unable to parse one from variables
  //in the request URL
  if (typeof this.protocol === 'undefined' || this.protocol.length === 0)
  {
    throw new Error('Missing or invalid protocol in Request URL');
  }

  try {
    //validate that what we've built is a valid URL, if not bail with an error
    this.url = new URL(this.protocol + '://' + this.jmServerUrl + "/" + this.pmRequestItem.request.url.path);
  }
  catch (e) {
    console.log("Error attempting to create URL from: " + this.protocol + '://' + this.jmServerUrl + "/" + this.pmRequestItem.request.url.path);
  }
}

RequestObject.prototype.parseParameters = function () {

  this.pmRequestItem.request.url.query.forEach(item => {
    let paramKey;
    let paramValue;
    let valueKey;
    let param = {};
    let pmVar = {};

    //Is this parameter a Postman variable? If so resolve it
    
    if (item.value.match(this.pmVarRegEx)) {
      if (this.varMode === 'resolve') {
        paramKey = item.key;
        //Strip the brackets
        valueKey = this.stripPmVarKey(item.value);
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


module.exports = RequestObject;
