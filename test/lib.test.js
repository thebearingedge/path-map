
'use strict';

var expect = require('chai').expect;

describe('lib', function () {

  var lib = require('../lib');

  describe('#pathContainsQuery(path)', function () {

    it('should return `true` if path has query string', function () {

      var path = '/foo?bar=baz';

      expect(lib.pathContainsQuery(path)).to.equal(true);
    });


    it('should return `false` if path does not have query string', function () {

      var path = '/foo/bar';

      expect(lib.pathContainsQuery(path)).to.equal(false);
    });

  });


  describe('#getQueryString(path)', function () {

    it('should return the query string portion of a path', function () {

      var path = '/foo?bar=baz';

      expect(lib.getQueryString(path)).to.equal('bar=baz');
    });

  });


  describe('#omitQueryString(path)', function () {

    it('should return the path without the query string', function () {

      var path = '/foo?bar=baz';

      expect(lib.omitQueryString(path)).to.equal('/foo');
    });


    it('should return the path if it has no query string', function () {

      var path = '/foo/bar';

      expect(lib.omitQueryString(path)).to.equal('/foo/bar');
    });

  });


  describe('#getQueryParams(path)', function () {

    it('should return an empty object if path has no query', function () {

      var path = '/foo';

      expect(lib.getQueryParams(path)).to.deep.equal({});
    });


    it('should return an object of query params', function () {

      var path = '/foo?bar=baz&qux=quux';

      expect(lib.getQueryParams(path))
        .to.deep.equal({ bar: 'baz', qux: 'quux' });
    });

  });


  describe('#getQueryKeys(routeQuery)', function () {

    var routeQuery = 'bar&baz';

    var queryKeys = lib.getQueryKeys(routeQuery);

    expect(queryKeys).to.deep.equal(['bar', 'baz']);
  });


  describe('#filterParamsByKeys(params, keys)', function () {

    it('should return an object containing select keys', function () {

      var keys = ['foo', 'bar', 'baz'];

      var params = {
        foo: 'qux',
        bar: 'quux',
        baz: 'corge',
        grault: 'garpley'
      };

      var filtered = lib.filterParamsByKeys(params, keys);

      expect(filtered)
        .to.deep.equal({ foo: 'qux', bar: 'quux', baz: 'corge' });
    });

  });

});