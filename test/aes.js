var should = require('should');
var aes = require('../lib/aes');
var config = require('../lib/config');
var key = config.PRE_KEY;
var plaintext1 = '6222081202007547506';
var ciphertext1 = '2b07820f0cc574272c62d326c8d456ab6b81fbac8985e35f2b346a99c48bab7e';
var plaintext2 = '程朝铭';
var ciphertext2 = 'a7aaf0a86100aaafddca39f1867a971c';
describe('AES',function(){
	describe('encrypt',function(){
		it('en should be ok',function(){
			aes.encrypt(plaintext1,key).should.be.equal(ciphertext1);
		});
		it('cn should be ok',function(){
			aes.encrypt(plaintext2,key).should.be.equal(ciphertext2);
		});	
	});
	describe('decrypt',function(){
		it('en should be ok',function(){
			aes.decrypt(ciphertext1,key).should.be.equal(plaintext1);
		});
		it('cn should be ok',function(){
			aes.decrypt(ciphertext2,key).should.be.equal(plaintext2);
		});	
	});
})