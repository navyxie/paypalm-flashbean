var should = require('should');
var UTF8TGBK = require('../lib/utf8-gbk');
var plaintext1 = '6222081202007547506';
var ciphertext1 = '6222081202007547506';
var plaintext2 = '中国工商银行';
var ciphertext2 = 'ÖÐ¹ú¹¤ÉÌÒøÐÐ';
describe('utf8-gbk',function(){
	describe('encode',function(){
		it('en should be ok',function(){
			UTF8TGBK.encode(plaintext1).should.be.equal(ciphertext1);
		});
		it('cn should be ok',function(){
			UTF8TGBK.encode(plaintext2).should.be.equal(ciphertext2);
		});	
	});
	describe('decode',function(){
		it('en should be ok',function(){
			UTF8TGBK.decode(ciphertext1).should.be.equal(plaintext1);
		});
		it('cn should be ok',function(){
			UTF8TGBK.decode(ciphertext2).should.be.equal(plaintext2);
		});	
	});
})