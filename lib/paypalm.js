var config = require('./config');
var request = require('request');
var paypalmCrypto = require('./crypto');
var util = require('./util');
var parseString = require('xml2js').parseString;
function parseXML(xmlData,cbf){
	parseString(xmlData,function(err,result){
		if(err){
			cbf('invalid xml data.');
		}else{
			cbf(null,result);
		}
	});
}
function _pickParamFromXML(json){
	var rootData = json.paypalm;
	var result = {};
	rootData.merId && (result['merId'] = rootData.merId[0]);
	rootData.merOrderNo && (result['merOrderNo'] = rootData.merOrderNo[0]);
	rootData.orderNo && (result['orderNo'] = rootData.orderNo[0]);
	rootData.payAmt && (result['payAmt'] = rootData.payAmt[0]);
	rootData.remark && (result['remark'] = rootData.remark[0]);
	rootData.userId && (result['userId'] = rootData.userId[0]);
	rootData.transTime && (result['transTime'] = rootData.transTime[0]);
	rootData.bankId && (result['bankId'] = rootData.bankId[0]);
	rootData.bankName && (result['bankName'] = rootData.bankName[0]);
	rootData.orderStatus && (result['orderStatus'] = rootData.orderStatus[0]);
	rootData.errorCode && (result['errorCode'] = rootData.errorCode[0]);
	rootData.errorMsg && (result['errorMsg'] = rootData.errorMsg[0]);
	rootData.merUserId && (result['merUserId'] = rootData.merUserId[0]);
	rootData.bindId && (result['bindId'] = rootData.bindId[0]);
	return result;
}
/**
 * Constructor config
 * @param ppwallet_config
 * @constructor
 */
function Paypalm(ppwallet_config){
  //default config
  this.config = config;
  //config merge
  for(var key in ppwallet_config){
    this.config[key] = ppwallet_config[key];
  }
  if(this.config['PRE_KEY']){
  	this.config['PRE_KEY'] = new Buffer(this.config['PRE_KEY'],'hex');
  }
  if(this.config['FILE_KEY']){
  	this.config['FILE_KEY'] = new Buffer(this.config['FILE_KEY'],'hex');
  }
}

Paypalm.prototype.getPayUrl = function(data,cbf){
	if(!util.isObject(data)){
		return cbf('the first param must be object.');
	}
	var self = this;
	var cloneData = util.clone(data);
	var config = this.config;
	var qs = self._getOrderNoParams(cloneData);//获取pp钱包入库的参数

	var url = config.PAYPALMURL_API + '?merid=' + config.MER_ID + '&transdata=' + this._getTransData(qs);
	console.log('url:',url);
	request.get(url, function (err, response, body){
		if(!err){
			cb(err,body);
			// var result = util.searchToJson(body);
			// if(result.tranResult === '000000'){
			// 	//获取wap支付url		
			// 	cbf(null,self._getConfirmUrl(cloneData,result.orderNo));
			// }else{
			// 	cbf('请求pp钱包订单入库失败了,tranResult:'+result.tranResult,result);
			// }
		}else{
			cbf(err,body);
		}     
    })
}
Paypalm.prototype.verify = function(data){
	if(!util.isObject(data)){
		console.warn('paypalm SDK log : the param must be object.');
		return false;
	}
	//注意，pp钱包支付nativeSDK支付回调的参数和wap支付回调的参数不一样,native回调参数带transData
	if(data.transData){
		//Native SDK notify Data
		return this._verifyNative(data);
	}else{
		//wap notify Data
		return this._verifyWap(data);
	}
}
Paypalm.prototype.paySuccess = function(data,cbf){
	var code = 0,msg = 'ok';
	if(!util.isObject(data)){
		msg = 'paypalm SDK log : the param must be object.';
		console.warn(msg);
		return cbf(msg);
	}
	var verifyData = this.verify(data);
	if(!verifyData){
		msg = '验签不通过';
		return cbf(msg);
	}
	if(util.isString(verifyData)){
		//native
		parseXML(verifyData,function(err,result){
			if(err){
				code = 2,msg = err;
			}else{
				result = _pickParamFromXML(result);//将XML转化的js的对象解析为pp钱包支付的json参数对象
				if(result.errorCode !== '000000' || !(result.errorCode === '000000' && result.orderStatus === '1')){
					code = 1,msg = '未支付成功，请勿执行订单更新操作。';
				}		
			}
			cbf(null,{code:code,msg:msg,data:result});
		});
	}else{
		//wap
		if(data.tranResult !== '000000' || !(data.tranResult === '000000' && data.orderStatus === '1')){
			code = 1,msg = '未支付成功，请勿执行订单更新操作。';
		}
		cbf(null,{code:code,msg:msg,data:data});
	}	
}
Paypalm.prototype.getStopNotifyString = function(){
	return 'success';
}
Paypalm.prototype.getStopNotifyData = function(){
	return this.getStopNotifyString();
}
Paypalm.prototype._verifyWap = function(data){
	var config = this.config;
	if(!util.isObject(data)){
		console.warn('paypalm SDK log : the param must be object.');
		return false;
	}
	var verifyParam = {
		tranResult:data.tranResult,
		resultInfo:data.resultInfo,
		merId:data.merId,
		merOrderNo:data.merOrderNo,
		merUserId:data.merUserId,
		orderNo:data.orderNo,
		payAmt:data.payAmt,
		remark:data.remark,
		transTime:data.transTime,
		orderStatus:data.orderStatus
	};
	var signStr = util.makeParamStr(verifyParam)+config.KEY;
	var sign = paypalmCrypto.md5Decode(signStr);
	return sign === data.sign;
}
Paypalm.prototype._verifyNative = function(data){
	var config = this.config;
	if(!util.isObject(data)){
		console.warn('paypalm SDK log : the param must be object.');
		return false;
	}
	return paypalmCrypto.decTranData(data,config.WAP_KEY);
}
Paypalm.prototype.parseNativeData = function(data,cbf){
	var parseData = this._verifyNative(data);
	if(parseData){
		parseXML(parseData,cbf);
	}else{
		cbf('data verify error.');
	}
}
Paypalm.prototype._getOrderNoParams = function(data){
	var config = this.config;
	return {
		opcode:"MH1001",
		merorderno:data.merorderno,
		merorderdate:data.merorderdate,
		meruserid:data.meruserid,
		productid:data.productid || "LCDS0201",
		tranamt:data.tranamt,
		orderdesc:data.orderdesc,
		bankcard:data.bankcard || "",
		cardusername:data.cardusername || "",
		idno:data.idno || "",
		payphone:data.payphone || "",
		cardbankname:data.cardbankname || "",
		remark:data.remark || "",
		returnurl:data.returnurl,
		notifyurl:data.notifyurl
	}
}
Paypalm.prototype._getConfirmUrl = function(data,orderNo){
	var config = this.config;
	var confirmData = {
		merId:config.MER_ID,
		opCode:"33A12H",
		orderNo:orderNo
	}
	confirmData.sign = paypalmCrypto.md5Decode(util.makeParamStr(confirmData)+config.KEY);
	//encdata为加密参数，主要用于wap支付页面显示用户姓名，身份证，银行卡以及预留手机号
	var encdataStr = "";
	data.phone && (encdataStr += 'phone=' + data.phone);
	data.cardNum && (encdataStr += '&cardNum=' + data.cardNum);
	data.idCard && (encdataStr += '&idCard=' + data.idCard);
	data.accName && (encdataStr += '&accName=' + data.accName);
	confirmData.encdata = paypalmCrypto.encTranData(encdataStr,config.WAP_KEY) + ';' + paypalmCrypto.signData(paypalmCrypto.hex2bin(encdataStr));
	return config.PAY_API_URL + '?' + util.jsonToSearch(confirmData);
}
Paypalm.prototype._xmlFmt = function(orderJson){
	var PRE_KEY = this.config.PRE_KEY;
	if(!util.isObject(orderJson)){
		throw new Error('xmlFmt参数非法，需要json对象');
	}
	var str = '<?xml version="1.0" encoding="UTF-8"?><paypalm>';
	if(orderJson.cardusername){
		orderJson.cardusername = paypalmCrypto.aes_encrypt(orderJson.cardusername,PRE_KEY);
	}
	if(orderJson.idno){
		orderJson.idno = paypalmCrypto.aes_encrypt(orderJson.idno,PRE_KEY);
	}
	if(orderJson.bankcard){
		orderJson.bankcard = paypalmCrypto.aes_encrypt(orderJson.bankcard,PRE_KEY);
	}
	for(var key in orderJson){
		str += '<' + key + '>' + orderJson[key] + '</' + key + '>';
	}
	str += '</paypalm>';
	return str;
}
Paypalm.prototype._xmlRequest = function(xmldata){
	var tranData = '';
	var PRE_KEY = this.config.PRE_KEY;
	var MERPRIVATE = this.config.MERPRIVATE;
	var PAYPALMPUBLIC = this.config.PAYPALMPUBLIC;
	tranData = paypalmCrypto.commdata_encrypt(xmldata,MERPRIVATE,PAYPALMPUBLIC);
	return tranData;
}
Paypalm.prototype._getTransData = function(orderJson){
	// return encodeURIComponent(this._xmlRequest(this._xmlFmt(orderJson)));
	var xmlData = this._xmlFmt(orderJson);
	console.log('加密前报文',xmlData);
	var ciphertextXmlData = this._xmlRequest(xmlData);
	console.log('加密后报文',ciphertextXmlData);
	return encodeURIComponent(ciphertextXmlData);
}
module.exports = Paypalm;




