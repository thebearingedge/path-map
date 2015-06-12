
'use strict';

var assign = require('object-assign');
var UrlPattern = require('url-pattern');

var EventEmitter = require('events').EventEmitter;

module.exports = PathMap;

function PathMap() {

  this.routes = {};
  this.pathMatchers = [];

}

assign(PathMap.prototype, EventEmitter.prototype, {

  add: function (route) {

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

    matcher = this._createPathMatcher(route.path);

    this.routes[route.path] = route;
    this.pathMatchers.push(matcher);

    return this;
  },


  _createPathMatcher: function (path) {

    var pathOnly = this._omitQuery(path);
    var pattern = new UrlPattern(pathOnly);

    return {
      path: path,
      match: pattern.match.bind(pattern)
    };
  },


  _getQuery: function (path) {

    return path.substr(path.indexOf('?') + 1);
  },


  _hasQuery: function (path) {

    return path.indexOf('?') !== -1;
  },


  _omitQuery: function (path) {

    if (!this._hasQuery(path)) return path;

    return path.substr(0, path.indexOf('?'));
  },


  _getQueryParams: function (path) {

    return this._getQuery(path)
      .split('&')
      .reduce(function (params, keyVal) {
        keyVal = keyVal.split('=');
        params[keyVal[0]] = keyVal[1];
        return params;
      }, {});
  },


  match: function (path) {

    var pathOnly = this._omitQuery(path);
    var i = 0;
    var matchers = this.pathMatchers;
    var len = matchers.length;
    var params;

    for (; i < len; i++) {
      params = matchers[i].match(pathOnly);
      if (params) {
        assign(params, this._getQueryParams(path));
        break;
      }
    }

    return params;
  }

});
