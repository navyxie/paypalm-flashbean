var should = require('should');
var iconvLite = require('iconv-lite'); 
var UTF8TGBK = require('../lib/utf8-gbk');
var plaintext1 = '6222081202007547506';
var ciphertext1 = '6222081202007547506';
var plaintext2 = '中国工商银行';
var ciphertext2 = 'ÖÐ¹ú¹¤ÉÌÒøÐÐ';
var plaintext3 = '中国工商银行6222081202007547506';
var ciphertext3 = 'ÖÐ¹ú¹¤ÉÌÒøÐÐ6222081202007547506';
describe('utf8-gbk',function(){
	describe('encode',function(){
		it('en should be ok',function(){
			UTF8TGBK.encode(plaintext1).toString('binary').should.be.equal(ciphertext1);
		});
		it('cn should be ok',function(){
			UTF8TGBK.encode(plaintext2).toString('binary').should.be.equal(ciphertext2);
		});	
		it('cn_en should be ok',function(){
			UTF8TGBK.encode(plaintext3).toString('binary').should.be.equal(ciphertext3);
		});	
	});
	describe('decode',function(){
		it('en should be ok',function(){
			UTF8TGBK.decode(ciphertext1).should.be.equal(plaintext1);
		});
		it('cn should be ok',function(){
			UTF8TGBK.decode(new Buffer(ciphertext2,'binary')).should.be.equal(plaintext2);
		});	
		it('cn_en should be ok',function(){
			UTF8TGBK.decode(new Buffer(ciphertext3,'binary')).should.be.equal(plaintext3);
		});
	});
})