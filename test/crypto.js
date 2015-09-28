var should = require('should');
var myCrypto = require('../lib/crypto');
var config = require('../lib/config');
var plaintext1 = '<?xml version="1.0" encoding="UTF-8" ?><paypalm><merorderdate>20150706</merorderdate><notifyurl>http://58.67.144.241:8120/notify_url/simulate_handler</notifyurl><remark>navy</remark><merorderno>a1443350809426</merorderno><returnurl>http://58.67.144.241:8120/notify_url/simulate_handler</returnurl><opcode>MH1001</opcode><bankcard>2b07820f0cc574272c62d326c8d456ab6b81fbac8985e35f2b346a99c48bab7e</bankcard><productid>LCDS0201</productid><orderdesc>test</orderdesc><cardusername>051281e0c03e878a30dc44c10d8f5bab</cardusername><meruserid>0000001</meruserid><payphone>15112195422</payphone><idno>03120554641f98a6a2eccf3c15a41991e34273559e0b623ef018fbe1fe1e3058</idno><cardbankname>中国工商银行</cardbankname><tranamt>1</tranamt></paypalm>';
var ciphertext1 = 'In4NfCGiJnma3Gv72l/9Ur4FZTIEM51V3Z+L6eXSFrOTbwr5ZYsRcA1K/qSIiqmNFAVZ88uCXqCAdk2OcINEE67nKy+cVSMBL3+YTiDY4dppabcfNSYW05ZAIAfoTfB9/tXfvnWtw8W4BC2sQ8IhLvcMmgRJ579j3ZESQJDs9mVWc4CJANRB2WEBmPttdjqhY95shmgYGXSnbgYIppkr+yM6e8yt8KFsV8oJSxIreqoFbqpSW7Vl0ycBfwLJPK5XNVfmbM8HnkLN1xOrZ6DVDjrJdef/3VlGFrLxYe885EeUw/gdXUaLICGmO7E9MxhIcBAg6VKsTp6ao5oa0Ec5CmH3aalT6fEAAThm87qedevl2sKC2m1fGhMDN9QZiXVor9qBWq0TvKzqzgvwVkRw/5Wr7Ar3gSluLbaE+h2AKa18Z2eitC2UuTclpjHcpNPdaHBjRYKz9fGvkh3adeE39Z9+l5uRNZxmSF/UWfl9nIgieYWDdo44TydjsuJavcqw6E6W1Ugt6g88VZFFQFdg4vQl81hGA0FQdJL5Q7LdP1OmThYDy9T4lygqWNPhTKiS7SSsoupkJLhqgnRzh9DPVyjh52hPFjkPVRNjwejvD6+0qSMkW5JPuEICQq1Y0MqpT56PEZ4aa8hMezcb3W0Ht0JsjMCpxKZVg6dkFnUeVvaei950/N7c/Noklz7T/YG5IgKx/E2u0i3v+EDxvJRZCC+iJNjlJJNoQejauZkQgRMRe76s+oPff9nNTj013G9Wiz+TZHxR0TBetRGvwOPpd12ooAaM/R7B0Dnd7imySJJ0hYkyieZr2ufWc9nz1hxKnqLT2ofrOg6tTvyABXfXKTqr95b75RsnEci2/rFFLbI=';
describe('myCrypto',function(){
	describe('#commdata_encrypt()',function(){
		it('should be ok!',function(){
			myCrypto.commdata_encrypt(plaintext1,config.MERPRIVATE,config.PAYPALMPUBLIC).should.not.be.equal('');
		});
	});
	describe('#commdata_decrypt()',function(){
		it('should be not ok!',function(){
			myCrypto.commdata_decrypt(ciphertext1,config.MERPRIVATE,config.PAYPALMPUBLIC).should.be.equal('');
		});
	});
});