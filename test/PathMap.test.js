'use strict';

var expect;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(sinonChai);

expect = chai.expect;

var PathMap = require('../PathMap');

describe('PathMap', function () {

  var pm;

  beforeEach(function () {
    pm = new PathMap();
  });

  describe('#add(route)', function () {

    it('should register a route object by path', function () {
      var home = { path: '/home' };

      pm.add(home);

      expect(pm.routes['/home']).to.equal(home);
    });


    it('should be chainable', function () {

      expect(pm.add({ path: '/home' })).to.equal(pm);
    });


    it('should register a path matcher', function () {

      pm.add({ path: '/foo' });

      expect(pm.pathMatchers.length).to.equal(1);
    });


    it('should throw if the route does not have a path', function () {

      expect(pm.add.bind(pm, {}))
        .to.throw(Error, 'routes must contain a string path');
    });


    it('should throw if route path is already used', function () {

      pm.add({ path: '/foo' });

      expect(pm.add.bind(pm, { path: '/foo?bar&baz' }))
        .to.throw(
          Error,
          'cannot add path /foo?bar&baz - already added /foo'
        );
    });

  });


  describe('#match(route, onMatch)', function () {

    it('should call onMatch with route, params, and query', function () {

      var onMatch = sinon.spy();

      pm.add({ path: '/foo/:bar/baz?qux&quux' }, onMatch);

      pm.match('/foo/1/baz?qux=corge&quux=grault');

      expect(onMatch.calledOnce).to.equal(true);
    });


  });


  describe('#_createPathMatcher(path)', function () {

    it('should create path matcher', function () {

      var matcher = pm._createPathMatcher('/foo/:bar/baz');

      expect(matcher.path).to.equal('/foo/:bar/baz');
      expect(typeof matcher.match).to.equal('function');
    });


    it('should omit query string from match path', function () {

      var matcher = pm._createPathMatcher('/foo?bar&baz');

      expect(matcher.match('/foo')).to.deep.equal({});
    });

  });


  describe('#_getQueryParams(path)', function () {

    it('should return a params object from query string', function () {

      expect(pm._getQueryParams('/foo?bar=baz&qux=quux'))
        .to.deep.equal({ bar: 'baz', qux: 'quux' });
    });

  });


  describe('#_getQuery(path)', function () {

    it('should return the query portion of a path', function () {

      expect(pm._getQuery('/foo?bar&baz')).to.equal('bar&baz');
    });

  });


  describe('#_hasQuery(path)', function () {

    it('should return `true` if path has query string', function () {

      expect(pm._hasQuery('/foo?bar')).to.equal(true);
    });


    it('should return `false` if path does not have query string', function () {

      expect(pm._hasQuery('/foo')).to.equal(false);
    });

  });


  describe('#_omitQuery(path)', function () {

    it('should return the path unchanged', function () {

      expect(pm._omitQuery('/foo')).to.equal('/foo');
    });


    it('should return the path without its query', function () {

      expect(pm._omitQuery('/foo?bar&baz')).to.equal('/foo');
    });

  });


});