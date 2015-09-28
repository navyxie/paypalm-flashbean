var paypalm = require('../lib/paypalm');
var payInstance = new paypalm({});
var should = require('should');
var data = {
	merorderno:'a'+Date.now(),
	merorderdate:'20150706',
	meruserid:"0000001",
	tranamt:"1",
	orderdesc:"test",
	bankcard:"6222081202007547506" || "",
	cardusername:"程朝铭" || "",
	idno:"360732199305172615" || "",
	payphone:"15112195422" || "",
	cardbankname:"中国工商银行" || "",
	remark:"navy" || "",
	returnurl:"http://58.67.144.241:8120/notify_url/simulate_handler",
	notifyurl:"http://58.67.144.241:8120/notify_url/simulate_handler"
};
describe('payInstance',function(){
	describe('#getPayUrl()',function(){
		payInstance.getPayUrl(data,function(err,data){
			console.log('body',data);
			done(err);
		})
	});	
});