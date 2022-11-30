'use strict';

/**
 * Dto for Postman Variable generic object.
 * @param {string} key
 * @param {string} value
 * @param {string} type
 */
function VariableObject(key, value, type) {
  this.key = key;
  this.value = value;
  this.type = !type ? "string" : type
}


VariableObject.prototype.transformToJmeterVariable = function() {
  const view = {
    variableName: this.key,
    variableValue: this.value
  };

  return view;
};

VariableObject.prototype.getJmeterVariableToken = function () { 

  return '${' + this.key + '}';
}

module.exports = VariableObject;
