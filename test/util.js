var should = require('should');
var util = require('../lib/util');
describe('util',function(){
	describe('generateKey',function(){
		it('should be ok',function(){
			util.generateKey(16).length.should.be.equal(16);
		});
		it('should be ok',function(){
			util.generateKey(32).length.should.be.equal(32);
		});	
	});
	describe('isFunction',function(){
		it('should be ok',function(){
			util.isFunction(function(){}).should.be.equal(true);
		});
		it('should be ok',function(){
			util.isEmpty('').should.be.equal(true);
		});	
	});
});