
'use strict';

var UrlPattern = require('url-pattern');

var EventEmitter = require('events').EventEmitter;

module.exports = PathMap;

function PathMap() {

  this.routes = {};
  this.pathMatchers = [];

}

PathMap.prototype.add = function (route, onMatch) {

  var path, existing, matcher;

  path = route.path;

  if (typeof route.path !== 'string') {
    throw new Error('routes must contain a string path');
  }

  existing = this.routes[this._omitQuery(path)];

  if (existing !== undefined) {
    throw new Error(
      'cannot add path ' + path + ' - already added ' + existing.path
    );
  }

  matcher = this._createPathMatcher(route.path, onMatch);

  this.routes[route.path] = route;
  this.pathMatchers.push(matcher);

  return this;
};


PathMap.prototype.match = function (path) {

  var pathOnly = this._omitQuery(path);
  var matchers = this.pathMatchers;
  var l = matchers.length;
  var params, route, query;

  while (l--) {
    params = matchers[l].match(pathOnly);
    if (params) {
      route = matchers[l].path;
      query = this._getQueryParams(path);
      return matchers[l].onMatch(params, query, route);
    }
  }
};


PathMap.prototype._createPathMatcher = function (path, onMatch) {

  var pathOnly = this._omitQuery(path);
  var pattern = new UrlPattern(pathOnly);

  return {
    path: path,
    match: pattern.match.bind(pattern),
    onMatch: onMatch
  };
};


PathMap.prototype._getQuery = function (path) {

  return path.substr(path.indexOf('?') + 1);
};


PathMap.prototype._hasQuery = function (path) {

  return path.indexOf('?') !== -1;
};


PathMap.prototype._omitQuery = function (path) {

  if (!this._hasQuery(path)) return path;

  return path.substr(0, path.indexOf('?'));
};


PathMap.prototype._getQueryParams = function (path) {

  var queryParams = {};

  return this._getQuery(path)
    .split('&')
    .reduce(function (params, keyVal) {
      keyVal = keyVal.split('=');
      params[keyVal[0]] = keyVal[1];
      return params;
    }, queryParams);
};


for (var prop in EventEmitter.prototype) {
  PathMap.prototype[prop] = EventEmitter.prototype[prop];
}
