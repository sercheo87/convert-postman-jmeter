'use strict';

/**
 * Dto for Postman Variable generic object.
 * @param {string} key
 * @param {string} value
 * @param {string} type
 * @param {boolean} isServerURL
 */
function VariableObject(key, value, type, enabled, source) {
  this.key = key;
  this.value = value;
  this.type = !type ? "string" : type
  this.enabled = enabled;
  this.source = source;
  this.isServerURL = false;
 }

VariableObject.prototype.getValue = function () {
  //If this variable is part of a request URL, strip the protocol.
  if(this.isServerURL)
  {
    return new URL(this.value).host;
  }
  else
  {
    return this.value;
  }
}

VariableObject.prototype.transformToJmeterVariable = function() {
  const view = {
    variableName: this.key,
    variableValue: this.getValue()
  };

  return view;
};

VariableObject.prototype.getJmeterVariableToken = function () { 
  return '${' + this.key + '}';
}



VariableObject.prototype.isURL = function () {
  
  var urlRegEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  if (!this.value.match(urlRegEx))
  {
    return null;
  }
  {
    this.url  = new URL(this.value);
    return this.url;
  }
  
}

module.exports = VariableObject;
