var should = require('should');
var aes = require('../lib/aes');
var config = require('../lib/config');
var utf8 = require('utf8');
var UTF8TGBK = require('../lib/utf8-gbk');
var key = config.PRE_KEY;
var plaintext1 = '6222081202007547506';
var ciphertext1 = '2b07820f0cc574272c62d326c8d456ab6b81fbac8985e35f2b346a99c48bab7e';
var plaintext2 = '程朝铭';
var ciphertext2 = '051281e0c03e878a30dc44c10d8f5bab';
var plaintext3 = '360732199305172615';
var ciphertext3 = '03120554641f98a6a2eccf3c15a41991e34273559e0b623ef018fbe1fe1e3058';
describe('AES',function(){
	describe('encrypt',function(){
		it('en should be ok',function(){
			aes.encrypt(UTF8TGBK.encode(plaintext1),key).should.be.equal(ciphertext1);
		});
		it('cn should be ok',function(){
			aes.encrypt(UTF8TGBK.encode(plaintext2),key).should.be.equal(ciphertext2);
		});	
		it('en should be ok',function(){
			aes.encrypt(UTF8TGBK.encode(plaintext3),key).should.be.equal(ciphertext3);
		});	
	});
	describe('decrypt',function(){
		it('en should be ok',function(){
			UTF8TGBK.decode(aes.decrypt(ciphertext1,key)).should.be.equal(plaintext1);
		});
		it('cn should be ok',function(){
			UTF8TGBK.decode(new Buffer(aes.decrypt(ciphertext2,key),'binary')).should.be.equal(plaintext2);
		});	
		it('en should be ok',function(){
			UTF8TGBK.decode(aes.decrypt(ciphertext3,key)).should.be.equal(plaintext3);
		});	
	});
})