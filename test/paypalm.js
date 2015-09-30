var paypalm = require('../lib/paypalm');
var payInstance = new paypalm({});
var should = require('should');
var data = {
	merorderno:'a'+Date.now(),
	merorderdate:'20150706',
	meruserid:"0000001",
	tranamt:"1",
	orderdesc:"test",
	bankcard:"6222081202007548888" || "",
	cardusername:"程理财" || "",
	idno:"360732199305172615" || "",
	payphone:"15112198888" || "",
	cardbankname:"中国工商银行" || "",
	remark:"navy" || "",
	returnurl:"http://58.67.144.241:8120/return_url/simulate_handler",
	notifyurl:"http://58.67.144.241:8120/notify_url/simulate_handler"
};
var h5XmlData = "BH6ghm3dm6WigihuytFlp6l96UCO+OZIg5CCu5QTLT4SlQSKw19abVCg+Sar5rmBxAFMXFfIuVeL6TnRijPIBGYstcVBsyeNUZ8bCYbDMBJbhfJuYx+r2BXSXVj0T/X1DQxdAJ0/VuXbPM8JEgew4bzWQHv7L2HQaAM5LbDPlLgQr63MBgvFbhjclp1SjxdS9cwA6b0vi82ky3nbGeCOf38FhKDHr8QfBoaA/8VJ9/h1lTxQ/LiVihpC6euwEKvKgZNVg/TTOyJQlF43jrBoEIyyv97+jgm7Dm3M3a1YDs/Ae010mZzc/vlovwDBcStPeLWmJhcjPUFyCr6Q9jSVOTw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiA/PjxwYXlwYWxtPjxyc3Bjb2RlPjAwMDAwMDwvcnNwY29kZT48b3JkZXJzdGF0dXM+MTwvb3JkZXJzdGF0dXM+PHJlbWFyaz5uYXZ5PC9yZW1hcms+PG1lcm9yZGVybm8+YTE0NDM0MzYyNTY0NjA8L21lcm9yZGVybm8+PHJzcGRlc2M+s8m5pjwvcnNwZGVzYz48b3JkZXJubz4xMDAwMDE2NjE3NzQ8L29yZGVybm8+PG1lcnVzZXJpZD4wMDAwMDAxPC9tZXJ1c2VyaWQ+PHBheXBob25lPjE1MTEyMTk1NDIyPC9wYXlwaG9uZT48bWVyaWQ+MjAxNTA5MjExNzE2PC9tZXJpZD48dHJhbmFtdD4xPC90cmFuYW10PjwvcGF5cGFsbT4=";
var notifyXmlData = "BePWjcFbaoz7Wu2lq3CQi3pEq+qX/cBUiJopR1+iQiNmBx3/EkqAqnVVVrWG8cUzRFD7OWbKnmmQaF7bzC+5cIQu2LQ4lXtJEIQJpM3MC9aU8cP89xRkxOtLSs9bsrELRyIJK5RnL5JdQEWn5s/9ybG608Zz/KIiCO0p893IgovDxOWrY6UyiCZe6lcy8w+xi8eU/3eWpAJgz0CfLHHHeXuwCmNRaRv7MAo09L4THSIw4k+9TCd7z7gb0DX9ID8oplxhQULoGBlHdRSlmxhu/TWfB6MrsG1iaoWq52kvxRjN6moe4cHktqi0GuFoeEiQBhLjgr8m/Rm+cGj3E2CDrpjtn3ojfdPuo2X55I41fITdUWO+UghmwtaCxRQJuGVSiB2nfGQ4lo7Ssj2n+T1uITPjWxBCuaQYKF8rqgKP1pr8eTW4ltEib66yA7s5IKh7MIFt/XPhALcvaCivtTazgiDbJIlJILK7HH8oQri3TyjDrViytrg9MAIKcwEM/qzak65jV5EGIAcC/QDKA/D8OmCV3uAlv5RF+qlUHz314/p77PS89BuMhFU88rGDHcrzHHmecCHLfDiRbaRWXddPjCciTyHktuuvCFSsJfa23EY3BqJQArjYV0s+hg564BqoleP7dPWa2enPAFtbtaemKDKi0kDZt6a7fLDOnhsKfckIu87wcRt+SpxYhbhI7vM38/qulJFKr4bR7QMJpkciCIkPJA8iTuPORBsbw/iVvNZ2PssKbFbtXrOKZA9PPcH7YapR80nt7fxaayTOiPGu/BFbLQqdYgBfEnw8aekdmU1JAW2meOKsYL7bLudDF+GqgkmJqvSEa5J4UkQ+N4iEaU0YIbm9Llr/4CYyZGvJJsfIX2f0pk8Gdevwqe7VLDP00OOIdSSlJTm990X3cVRFlCreigbfwuYPZ0qVLeIbF/lEE+PFA6zUvrPq8bKnStjzBN6SkT7tXwSLtdv3wTQ4Euyv3HRN0KPsCTsKt2rIzLbrSdsoHe2l9mE7h/z3CDjP8t4fGp5fqpZMuuNuaHGWZkW5mnOMSlHEO0YxhRKgn2e3GSeXDwFgr9QJ2T2flt+WurWtyP4wAIsopJxiKDLQPvE0LqnBZFRNOUXPs8U0/8BRSGwjS5nag4yLpmSY6iuPCFszsvPZIOJamPfR5wXbtFgWumw/S9AabgCYQZQmkyvBPRn5aOP+PDOSpoPXzSKzCMiFWR1szJFsqWcFYoZxPPrwOTpvSHlG7C5ikjSEzAk=";
describe('payInstance',function(){
	this.timeout(10000);
	describe('#getPayUrl()',function(){
		it('should be ok',function(done){
			console.log('orderInfo',data);
			payInstance.getPayUrl(data,function(err,data){
				console.log('err',err);
				console.log('body',data);
				done(err);
			})
		})		
	});	
	describe('#paySuccess()',function(){
		it('should be ok',function(done){
			payInstance.paySuccess(h5XmlData,true,function(err,data){
				console.log('err',err);
				console.log('body',data);
				done(err);
			});
		});
		it('should not be ok',function(done){
			payInstance.paySuccess(h5XmlData,function(err,data){
				console.log('err',err);
				console.log('body',data);
				should.exist(err);
				done(null);
			});
		});	
		it('should be ok',function(done){
			payInstance.paySuccess(notifyXmlData,function(err,data){
				console.log('err',err);
				console.log('body',data);
				done(err);
			});
		});		
	});
	describe('#query()',function(){
		it('should be ok',function(done){
			payInstance.query({merorderno:"a1443436256460"},function(err,data){
				console.log('err',err);
				console.log('body',data);
				done(err);
			});
		});		
	});
	describe('#commStr_encrypt()',function(){
		it('should be ok',function(done){
			payInstance.commStr_encrypt("success",function(err,data){
				should.exist(data); 
				console.log('body',data);
				done(err);
			});
		});		
	});
	describe('#withdraw()',function(){
		var withdrawData = {
			merorderno:'a'+Date.now(),
			merorderdate:'20150706',
			meruserid:"0000001",
			tranamt:"1",
			orderdesc:"test",
			bankcard:"6222081202007547506" || "",
			cardusername:"程朝铭" || "",
			idno:"360732199305172615" || "",
			// cardphone:"15112195422" || "",
			remark:"navy" || "",
			// returnurl:"http://58.67.144.241:8120/return_url/simulate_handler",
			notifyurl:"http://58.67.144.241:8120/notify_url/payOrder/simulate_handler"
		};
		it('should be ok',function(done){
			payInstance.withdraw(withdrawData,function(err,data){
				should.exist(data); 
				console.log('body',data);
				done(err);
			});
		});		
	});
	describe('#queryWithdraw()',function(){
		it('should be ok',function(done){
			payInstance.queryWithdraw({merorderno:"a1443520683436"},function(err,data){
				console.log('err',err);
				console.log('body',data);
				done(err);
			});
		});		
	});
});