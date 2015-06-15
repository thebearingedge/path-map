'use strict';

var expect = require('chai').expect;
var PathMap = require('../PathMap');

describe('PathMap', function () {

  var pm;

  it('should not require `new`', function () {

    var pathMap = require('../PathMap');

    expect(pathMap() instanceof PathMap).to.equal(true);
  });


  beforeEach(function () {

    pm = new PathMap();

  });


  describe('#add(route)', function () {

    it('should register a route', function () {

      pm.add('/foo');

      expect(pm.routes['/foo']).not.to.equal(undefined);
    });


    it('should be chainable', function () {

      expect(pm.add('/foo')).to.equal(pm);
    });


    it('should register a path matcher', function () {

      pm.add('/foo');

      expect(pm.pathMatchers.length).to.equal(1);
    });


    it('should throw if the route is not a string', function () {

      expect(pm.add.bind(pm, null))
        .to.throw(Error, 'route `null` must be a string');
    });


    it('should throw if route is already added', function () {

      pm.add('/foo');

      expect(pm.add.bind(pm, '/foo?bar&baz'))
        .to.throw(Error, 'cannot add path /foo?bar&baz - already added /foo');
    });

  });


  describe('#match(path)', function () {

    it('should return an array of route, params, and query', function () {

      pm.add('/foo/:bar/baz');
      pm.add('/corge/:grault');

      var desired = [
        '/foo/:bar/baz',
        { bar: '1' },
        { qux: 'corge' }
      ];

      var actual = pm.match('/foo/1/baz?qux=corge');

      expect(actual).to.deep.equal(desired);
    });


    it('should filter query params if route has keys', function () {

      pm.add('/foo/:bar/baz?qux');

      var desired = [
        '/foo/:bar/baz?qux',
        { bar: '42' },
        { qux: 'corge' }
      ];

      var actual = pm.match('/foo/42/baz?qux=corge&grault=garpley');

      expect(actual).to.deep.equal(desired);
    });


    it('should return `null` if no match is found', function () {

      var notFound = pm.match('/not-found');

      expect(notFound).to.equal(null);
    });

  });


  describe('#_createPathMatcher(route)', function () {

    it('should create path matcher', function () {

      var matcher = pm._createPathMatcher('/foo/:bar/baz?qux');

      expect(matcher.route).to.equal('/foo/:bar/baz?qux');
      expect(typeof matcher.match).to.equal('function');
      expect(matcher.queryKeys.length).to.equal(1);
    });


    it('should omit query string from match path', function () {

      var matcher = pm._createPathMatcher('/foo?bar&baz');

      expect(matcher.match('/foo')).to.deep.equal({});
    });

  });

});