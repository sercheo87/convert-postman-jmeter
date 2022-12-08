'use strict';

/**
 * Dto for Argument generic object.
 * @constructor
 */
function ArgumentObject() {
  this.argumentCollection = [];
}

ArgumentObject.prototype.addArgumentsCollection = function(key, value) {
  const argumentsItem = {
    argumentName: key || '',
    argumentValue: value || '',
  };

  this.argumentCollection.push(argumentsItem);
};

ArgumentObject.prototype.transformToJmeterRequest = function() {
  return {
    httpTestCollectionsArgument: this.argumentCollection,
  };
};

module.exports = ArgumentObject;
