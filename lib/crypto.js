var crypto = require('crypto');
var aes = require('./aes');
var rsa = require('./rsa');
var UTF8TGBK = require('./utf8-gbk');
var util = require('./util');
var blocksize = 16; 
var rsasize = 256;
var generateKey = util.generateKey;
var base64 = require('base64');
function commdata_encrypt(xmlDataPlaintext,pri,pub){
	var str = '';
	try{
		//随机的aes加密key
		var randomKey = generateKey(blocksize);
		var keyEnc = rsa.encrypt(pub,UTF8TGBK.encode(randomKey),"","binary");
		//对明文数据进行签名
		var signKey = rsa.sign(UTF8TGBK.encode(xmlDataPlaintext),pri,"binary");
		//对明文数据进行aes加密
		var cryptedData = aes.encrypt(UTF8TGBK.encode(xmlDataPlaintext),randomKey,"","","","binary");
		//对明文数据进行base64编码返回
		str = base64.encode(new Buffer((keyEnc+signKey+cryptedData),'binary'));
	}catch(e){
		console.error('crypt PPF_CommData_Encrypt data error : ',e);
	}
	return str;
}
function commdata_decrypt(xmlDataCiphertext,pri,pub){
	var str = '';
	function toByteArray(buf){
		var i = 0,len=0;
		var rt = [];
		for(i = 0 , len = buf.length ; i < len ; i++){
			rt.push(buf.readInt8(i))
		}
		return rt;
	}
	function encryptedBytes(nums){
		var code = 'a'.charCodeAt();
		var encodeBytes = '';
		for (var i = 0; i < nums.length; i++) {
		encodeBytes += String.fromCharCode(code + ((nums[i] << 5) & 0xF))
		// encodeBytes += String.fromCharCode(code + ((nums[i]) & 0xF));
		}
		return encodeBytes;
	}
	try{
		//对密文数据进行base64解码
		xmlDataCiphertext = new Buffer(xmlDataCiphertext,'base64');
		//截取aes解密的key data
		var aesKeyData = new Buffer(rsasize);
		xmlDataCiphertext.copy(aesKeyData,0,0,rsasize);
		//解密得到aes解密的key
		var aesKey = rsa.decrypt(pri,aesKeyData);
		//截取签名数据
		var signData = new Buffer(rsasize);
		xmlDataCiphertext.copy(signData,0,rsasize,rsasize);
		//通过aes key 解密密文数据
		var encryptedData = new Buffer(xmlDataCiphertext.length-rsasize*2);
		xmlDataCiphertext.copy(encryptedData,0,rsasize*2,xmlDataCiphertext.length);
		var plainText = aes.decrypt(encryptedData,aesKey);
		// plainText = '<?xml version="1.0" encoding="UTF-8" ?><paypalm><rspcode>000000</rspcode><rspdesc>成功</rspdesc><orderno>100001661758</orderno></paypalm>';
		// plainText = UTF8TGBK.encode(plainText).toString('utf8');
		console.log('plainText',plainText);
		// signData = signData.toString('binary');
		//签名验证
		if(!rsa.verify(plainText,signData,pub)){
			console.error('pp钱包闪豆支付签名验证失败');
		}else{
			str = plainText;
		}
	}catch(e){
		console.error('crypt commdata_decrypt data error : ',e);
	}
	return str;
}
function sensitiveData_encrypt(str,aeskey){
	return aes.encrypt(UTF8TGBK.encode(str),aeskey);
}
function sensitiveData_decrypt(str,aeskey){
	return UTF8TGBK.decode(new Buffer(aes.decrypt(str,aeskey),'binary'));
}
function rsa_sign(str,pri){
	return rsa.sign(UTF8TGBK.encode(str).toString('binary'),pri);
}
function rsa_verify(str,sign,pub){
	return rsa.verify(str,sign,pub);
}
module.exports = {
	commdata_encrypt:commdata_encrypt,
	commdata_decrypt:commdata_decrypt,
	sensitiveData_encrypt:sensitiveData_encrypt,
	sensitiveData_decrypt:sensitiveData_decrypt,
	rsa_sign:rsa_sign,
	rsa_verify:rsa_verify
}