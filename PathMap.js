
'use strict';

var UrlPattern = require('url-pattern');
var lib = require('./lib');


module.exports = PathMap;


function PathMap() {

  this.routes = {};
  this.pathMatchers = [];

}


PathMap.prototype.add = function (route) {

  if (typeof route !== 'string') {
    throw new Error('route `' + route + '` must be a string');
  }

  var pathOnly = lib.omitQueryString(route);

  var existing = this.routes[pathOnly];

  if (existing !== undefined) {
    throw new Error(
      'cannot add path ' + route + ' - already added ' + existing.route
    );
  }

  var matcher = this._createPathMatcher(route);

  this.routes[pathOnly] = matcher;
  this.pathMatchers.push(matcher);

  return this;
};


PathMap.prototype.match = function (path) {

  var pathOnly = lib.omitQueryString(path);
  var matchers = this.pathMatchers;
  var i = matchers.length;

  var params, route, query, queryKeys;

  while (i--) {

    params = matchers[i].match(pathOnly);

    if (!params) continue;

    route = matchers[i].route;
    query = lib.getQueryParams(path);
    queryKeys = matchers[i].queryKeys;

    if (queryKeys !== undefined) {
      query = lib.filterParamsByKeys(query, queryKeys);
    }

    return [route, params, query];
  }

};


PathMap.prototype._createPathMatcher = function (route) {

  var pathOnly = lib.omitQueryString(route);
  var pattern = new UrlPattern(pathOnly);
  var queryKeys = lib.pathContainsQuery(route)
    ? lib.getQueryKeys(lib.getQueryString(route))
    : undefined;

  return {
    route: route,
    match: pattern.match.bind(pattern),
    queryKeys: queryKeys
  };
};
