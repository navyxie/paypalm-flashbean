var config = require('./config');
var util = require('./util');
var request = require('request');
var parseString = require('xml2js').parseString;
var async = require('async');
function parseXML(xmlData,cbf){
	parseString(xmlData,{trim: true,explicitArray:false},function(err,result){
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
	rootData.merId && (result['merId'] = rootData.merId);
	rootData.merOrderNo && (result['merOrderNo'] = rootData.merOrderNo);
	rootData.orderNo && (result['orderNo'] = rootData.orderNo);
	rootData.payAmt && (result['payAmt'] = rootData.payAmt);
	rootData.remark && (result['remark'] = rootData.remark);
	rootData.userId && (result['userId'] = rootData.userId);
	rootData.transTime && (result['transTime'] = rootData.transTime);
	rootData.bankId && (result['bankId'] = rootData.bankId);
	rootData.bankName && (result['bankName'] = rootData.bankName);
	rootData.orderStatus && (result['orderStatus'] = rootData.orderStatus);
	rootData.errorCode && (result['errorCode'] = rootData.errorCode);
	rootData.errorMsg && (result['errorMsg'] = rootData.errorMsg);
	rootData.merUserId && (result['merUserId'] = rootData.merUserId);
	rootData.bindId && (result['bindId'] = rootData.bindId);
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
}

Paypalm.prototype.getPayUrl = function(data,cb){
	var config = this.config;
	var MER_ID = config.MER_ID;
	var getWapUrl = config.GET_WAP_URL;
	var self = this;
	async.waterfall([
		//获取订单id
		function(cb){
			self.getOrderId(data,cb);
		},
		//获取支付加密数据
		function(orderid,cb){
			var payInfo = {
				opcode:"MH1002",
				orderno:orderid,
				merverifycodeflag:"0"
			};
			console.log('payInfo',payInfo);
			var errMsg = '获取加密信息失败，请检查java服务';
			//getWapUrl
			request.post({url:getWapUrl,body:JSON.stringify(payInfo)},function(error, response, body){
				if(!error && response.statusCode == 200){
					try{
						return cb(null,body);
					}catch(e){
						console.error(errMsg);
					}
				}
				return cb(errMsg);
			});
		}
	],function(err,payUrl){
		cb(err,payUrl);
	});
}
Paypalm.prototype.getOrderId = function(data,cb){
	if(!util.isObject(data)){
		return cbf('the first param must be object.');
	}
	var self = this;
	var cloneData = util.clone(data);
	var config = this.config;
	var orderInfo = self._getOrderNoParams(cloneData);//获取pp钱包入库的参数
	var MER_ID = config.MER_ID;
	async.waterfall([
		//获取订单入库加密数据
		function(cb){
			self._commdata_encrypt(orderInfo,cb);
		},
		//订单入库
		function(base64Data,cb){
			var getOrderInfoXmlUrl = config.PAYPALMURL_API + '?merid='+MER_ID + '&transdata=' + base64Data;
			request.get(getOrderInfoXmlUrl,function(error, response, body){
				if(!error && response.statusCode == 200){
					return cb(null,body);
				}
				return cb('订单入库失败');
			})
		},
		//解密订单入库xml数据
		function(base64Data,cb){
			self._commdata_decrypt(base64Data,cb);
		},
		//解析xml数据结构，获取订单id
		function(xmlData,cb){
			parseXML(xmlData,function(err,json){
				if(json.paypalm.rspcode === "000000"){
					cb(null,json.paypalm.orderno);
				}else{
					cb('pp钱包订单入库失败,rspcode:'+json.paypalm.rspcode+',rspdesc:'+json.paypalm.rspdesc);
				}
			})
		}
	],function(err,orderid){
		cb(err,orderid);
	});
}
Paypalm.prototype.paySuccess = function(data,isH5,cb){
	util.isFunction(isH5) ? (cb = isH5,isH5=false) : "";
	var url = this.config.GET_RETURN_DATA_URL;
	var code = 0,msg = 'ok';
	if(!data){
		return cb("pp理财产品支付解密数据不能为空");
	}
	if(isH5){
		url = this.config.GET_H5RETURN_DATA_URL;
	}
	this.parseData(data,url,function(err,jsonData){
		if(err){
			cb(err,data);
		}else{
			if(util.isObject(jsonData)){
				if((jsonData.orderstatus !== '1' && jsonData.rspcode === "000000" )|| jsonData.rspcode !== "000000"){
					code = 1,msg = '未支付成功，请勿执行订单更新操作。';
				}
				cb(null,{code:code,msg:msg,data:jsonData});
			}else{
				cb('pp理财产品支付解密数据出错了',jsonData);
			}		
		}
	});
}
Paypalm.prototype.query = function(queryData,cb){
	var self = this;
	if(!util.isObject(queryData)){
		return cb("查询参数必须是json对象");
	}
	queryData.productid = this.config.PAY_PRODUCTID || "LCDS0201";
	self._queryOrder(queryData,cb);
}
Paypalm.prototype.queryWithdraw = function(queryData,cb){
	var self = this;
	if(!util.isObject(queryData)){
		return cb("查询参数必须是json对象");
	}
	queryData.productid = this.config.WITHDRAW_PRODUCTID || "LCDF0202";
	self._queryOrder(queryData,cb);
}
Paypalm.prototype._queryOrder = function(queryData,cb){
	var self = this;
	queryData.opcode = "MQ1001";
	async.waterfall([
		function(cb){
			self._commdata_encrypt(queryData,cb);
		},
		function(decryptData,cb){
			var queryUrl = self.config.PAYPALMURL_API + '?merid='+self.config.MER_ID + "&transdata="+decryptData;
			request.get(queryUrl,function(error, response, body){
				if(!error && response.statusCode == 200){
					return cb(null,body);
				}
				return cb('订单入库失败');
			})
		},
		function(base64Data,cb){
			self._commdata_decrypt(base64Data,cb);
		},
		function(xmlData,cb){
			parseXML(xmlData,function(err,jsonData){
				if(err){
					cb(err,xmlData)
				}else{
					cb(null,jsonData.paypalm);
				}
			});
		}
	],function(err,result){
		cb(err,result);
	});
}
Paypalm.prototype.withdraw = function(withdrawData,cb){
	var self = this;
	if(!util.isObject(withdrawData)){
		return cb("提现参数必须是json对象");
	}
	withdrawData.opcode = "MA2001";
	withdrawData.productid = this.config.WITHDRAW_PRODUCTID || "LCDF0202";
	async.waterfall([
		function(cb){
			self._commdata_encrypt(withdrawData,cb);
		},
		function(decryptData,cb){
			var queryUrl = self.config.PAYPALMURL_API + '?merid='+self.config.MER_ID + "&transdata="+decryptData;
			request.get(queryUrl,function(error, response, body){
				if(!error && response.statusCode == 200){
					return cb(null,body);
				}
				return cb('提现订单入库失败');
			})
		},
		function(base64Data,cb){
			self._commdata_decrypt(base64Data,cb);
		},
		function(xmlData,cb){
			parseXML(xmlData,function(err,jsonData){
				if(err){
					cb(err,xmlData)
				}else{
					cb(null,jsonData.paypalm);
				}
			});
		}
	],function(err,result){
		cb(err,result);
	});
}
Paypalm.prototype.getStopNotifyData = function(){
	return 'success';
}
Paypalm.prototype.commStr_encrypt = function(text,cb){
	this._commStr_encrypt(text,cb);
}
Paypalm.prototype._commStr_encrypt = function(text,cb){
	if(!util.isString(text)){
		return cb("加密参数必须为字符串");
	}
	var errMsg = '数据加密失败，请检查java服务';
	request.post({url:this.config.GET_COMMON_STRCRYPTO_URL,body:text},function(error, response, body){
		if(!error && response.statusCode == 200){
			try{
				return cb(null,JSON.parse(body).encodeData);
			}catch(e){
				console.error(errMsg);
			}					
		}
		return cb(errMsg);
	});
}
Paypalm.prototype._commdata_encrypt = function(json,cb){
	var encodeDataUrl = this.config.ENCODEDATA_URL;
	if(!util.isObject(json)){
		return cb('加密参数必须是json对象');
	}
	var	errMsg = '获取加密信息失败，请检查java服务';	
	request.post({url:encodeDataUrl,body:JSON.stringify(json)},function(error, response, body){
		if(!error && response.statusCode == 200){
			try{
				return cb(null,JSON.parse(body).encodeData);
			}catch(e){
				console.error(errMsg);
			}
		}
		return cb(errMsg);
	});
}
Paypalm.prototype._commdata_decrypt = function(base64Data,cb){
	if(!base64Data){
		return cb("解密参数不能为空");
	}
	var decodeDataUrl = this.config.DECODEDATA_URL;
	var errMsg = '解密订单入库xml数据失败，请检查java服务';
	request.post({url:decodeDataUrl,body:base64Data},function(error, response, body){
		if(!error && response.statusCode == 200){
			try{
				return cb(null,JSON.parse(body).decodeData);
			}catch(e){
				console.error(errMsg);
			}					
		}
		return cb(errMsg);
	});
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
Paypalm.prototype.parseData = function(transDataRev,url,cb){
	var errMsg = '数据解密失败';
	request.post({url:url,body:transDataRev},function(error, response, body){
		if(!error && response.statusCode == 200){
			try{
				var xmlData = JSON.parse(body).decodeData;
				parseXML(xmlData,function(err,jsonData){
					if(err){
						cb(err,xmlData)
					}else{
						cb(null,jsonData.paypalm);
					}
				});
			}catch(e){
				console.error(errMsg);
				cb(e,body);
			}					
		}else{
			cb(errMsg);
		}
	});
}
module.exports = Paypalm;




