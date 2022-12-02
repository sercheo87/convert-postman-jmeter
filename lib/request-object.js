'use strict';

/**
 * Dto for Request generic object.
 * @param {string} name
 * @param {string} method
 * @param {string} bodyData
 * @param {string} varMode //once of 'raw', 'resolve', 'jmSyntax'
 */

function RequestObject(pmRequestItem, pmVariables, varMode) {

  //get the URL
  
  let host = pmRequestItem.request.url.host[0];
  let varKey = "";
  let jmProtocol = "";
  const pmVarRegEx = /^\{\{([a-zA-Z0-9_])*\}\}$/gm;
  let url;
  const httpProtocolRegEx = 
  this.method = pmRequestItem.request.method;
  this.name = pmRequestItem.name;
  this.jmServerUrl = "";
  this.jmServerString = "";
  this.varMode = varMode;
  this.bodyData = "";
  this.requestParams = [];
  let params = "";

  //TODO: Implement body data
  //is it a postman variable?

  //If so, JMeter 'server' is all elements in the Host array property of the request item
    pmRequestItem.request.url.host.forEach(item => {
      //Is it a postman variable?
      if (host.match(pmVarRegEx))
      {
          varKey = item.substring(2,item.length - 2);
          //this.path = pmRequestItem.request.url.raw.substring(item.length);
          //Do we resolve it? Or transform to JMeter syntax?
          //resolve
            item = pmVariables.get(varKey).value;
            
            pmVariables.get(varKey).isServerURL = true;
      }
      this.jmServerUrl = this.jmServerUrl + (this.jmServerUrl.length == 0 ? "" : ".") + item;
      if(this.varMode === 'transform')
      {
        this.jmServerString = this.jmServerString + (this.jmServerString.length == 0 ? "" : ".") + "${" + varKey + "}";
      }
    });

    
    
    
    //if the jmServer includes the protocol, extract it
      try{
        this.url = new URL(this.jmServerUrl + "/" + pmRequestItem.request.url.path);
        
        
      }
      catch(e)
      {
        console.log(e);
      }
    //parse parameters
    pmRequestItem.request.url.query.forEach(item => {
      let paramKey;
      let paramValue;
      let valueKey;
      if(item.value.match(pmVarRegEx))
      {
        if(this.varMode === 'resolve')
        {
          paramKey = item.key;
          valueKey = item.value.substring(2,item.value.length - 2)
          paramValue = pmVariables.get(valueKey).value;
        }
      
        else if (this.varMode = 'transform')
        {
          paramKey = item.key;
          paramValue = '${' + item.value.substring(2,item.value.length - 2) + '}';
        }
      }
      else{
        paramKey = item.key;
        paramValue = item.value;
        
      }
        params = (params.length == 0 ? params  : params + '&') + paramKey +'='+ paramValue;  
        this.requestParams.push({
          "key":paramKey,
          "value":paramValue
        })
        
      
      
      
      
      
    
    });
    this.url.search = params;
    console.log("HOST:\t\t\t" + this.url.host);
        console.log("PROTOCOL:\t" + this.url.protocol);
        console.log("PATHNAME:\t" + this.url.pathname);
        console.log("SEARCH\t" + this.url.search)
        console.log("URL:\t\t" + this.url.toString());
    console.log("PARAMS: " + this.url.href);
    
    
    console.log("Done");
    
  
  
  };




RequestObject.prototype.rawUrl = function() {
  return this.url.toString;
};

RequestObject.prototype.rawPath = function() {
  return '/' + this.url.pathname;
};

RequestObject.prototype.method = function() {
  return this.method;
};

RequestObject.prototype.addHeaderCollection = function(key, value) {
//Resolve or transform variables in headers as well

  const headerItem = {
    headerName: key || '',
    headerValue: value || '',
  };

  this.headerCollection.push(headerItem);
};

RequestObject.prototype.getBodyData = function() {
  //resolve or transform variables here as well
  return this.bodyData;
}



RequestObject.prototype.transformToJmeterRequest = function() {
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

RequestObject.prototype.transformRequestParam = function(param) {
  const view = {
    paramKey: param.key,
    paramValue: param.value
  }
}

module.exports = RequestObject;
