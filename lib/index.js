
'use strict';

module.exports = {

  getQueryParams: function (path) {

  var queryParams = {};

  if (!this.pathContainsQuery(path)) return queryParams;

  return this.getQueryString(path)
    .split('&')
    .reduce(function (params, keyVal) {
      keyVal = keyVal.split('=');
      params[keyVal[0]] = keyVal[1];
      return params;
    }, queryParams);
  },


  getQueryString: function (path) {

    return path.substr(path.indexOf('?') + 1);
  },


  getRouteQueryKeys: function (routeQuery) {

    return routeQuery.split('&');
  },


  pathContainsQuery: function (path) {

    return path.indexOf('?') !== -1;
  },


  omitQueryString: function (path) {

    if (!this.pathContainsQuery(path)) return path;

    return path.substr(0, path.indexOf('?'));
  },


  filterParamsByKeys: function (params, keys) {

    return keys
      .reduce(function (filtered, key) {
        filtered[key] = params[key];
        return filtered;
      }, {});
  }

};