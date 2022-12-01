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
  let jmServer = "";
  let jmProtocol = "";
  const pmVarRegEx = /^\{\{([a-zA-Z0-9_])*\}\}$/gm;
  let url;
  if (typeof varMode === 'undefined')
  {
    varMode = 'resolve';
  }
  const httpProtocolRegEx = 
  this.method = pmRequestItem.request.method;
  this.name = pmRequestItem.name;

  //TODO: Implement body data
  //is it a postman variable?

  //If so, JMeter 'server' is all elements in the Host array property of the request item
    pmRequestItem.request.url.host.forEach(item => {
      //Is it a postman variable?
      if (host.match(pmVarRegEx))
      {
          

          varKey = item.substring(2,item.length - 2);
          this.path = pmRequestItem.request.url.raw.substring(item.length);
          //Do we resolve it? Or transform to JMeter syntax?
          //resolve
          if(varMode === 'resolve')
          {
            
            item = pmVariables.get(varKey).value;
            pmVariables.get(varKey).isServerURL = true;
          }
          else if (varMode = 'jmSyntax')
          {
            item = '${' + varKey + '}';
          }
          else if (varMode = 'raw')
          {
            //do nothing
          }
      }
        jmServer = jmServer + (jmServer.length == 0 ? "" : ".") + item;
      
    });
    //if the jmServer includes the protocol, extract it
    try{
      this.url = new URL(jmServer + this.path);
      console.log("HOST:\t\t\t" + this.url.host);
      console.log("PROTOCOL:\t" + this.url.protocol);
      console.log("PATHNAME:\t" + this.url.pathname);
      console.log("SEARCH\t" + this.url.search)
      console.log("URL:\t\t" + this.url.toString());
      
    }
    catch(e)
    {
      console.log(e);
    }
    
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

RequestObject.prototype.bodyData = function() {
  //resolve or transform variables here as well
  return this.bodyData;
}



RequestObject.prototype.transformToJmeterRequest = function() {
  const view = {
    testName: this.name,
    server: this.url.host,
    port: this.url.port = '' ? 80 : this.url.port,
    protocol: this.url.protocol.substring(0, this.url.protocol.indexOf(':')),
    path: this.url.pathname,
    method: this.method,
    bodyData: this.bodyData,
    httpTestCollectionsHeader: this.headerCollection,
  };

  return view;
};

module.exports = RequestObject;
