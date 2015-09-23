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
	payphone:"18658150058" || "",
	cardbankname:"中国工商银行" || "",
	remark:"navy" || "",
	returnurl:"http://192.168.24.16:8088/paypalm-server-sdk-php-api/WebContent/demo/merNotify.php",
	notifyurl:"http://192.168.24.16:8088/paypalm-server-sdk-php-api/WebContent/demo/merNotify.php"
};
describe('payInstance',function(){
	describe('#getPayUrl()',function(){
		payInstance.getPayUrl(data,function(err,data){
			console.log('body',data);
			done(err);
		})
	});	
});