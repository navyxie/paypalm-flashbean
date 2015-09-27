var crypto = require('crypto');
var aes = require('./aes');
var rsa = require('./rsa');
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
		var keyEnc = rsa.encrypt(pub,randomKey);
		//对明文数据进行签名
		var signKey = rsa.sign(xmlDataPlaintext,pri);
		//对明文数据进行aes加密
		var cryptedData = aes.encrypt(xmlDataPlaintext,randomKey);
		//对明文数据进行base64编码返回
		str = base64.encode(keyEnc+signKey+cryptedData);
	}catch(e){
		console.error('crypt PPF_CommData_Encrypt data error : ',e);
	}
	return str;
}
function commdata_decrypt(xmlDataCiphertext,pri,pub){
	var str = '';
	try{
		//对密文数据进行base64解码
		xmlDataCiphertext = base64.decode(xmlDataCiphertext);
		//截取aes解密的key data
		var aesKeyData = xmlDataCiphertext.substr(0,rsasize);
		//解密得到aes解密的key
		var aesKey = rsa.decrypt(pri,aesKeyData);
		//截取签名数据
		var signData =  xmlDataCiphertext.substr(rsasize,rsasize);
		//通过aes key 解密密文数据
		var plainText = aes.decrypt(xmlDataCiphertext,aesKey);
		//签名验证
		if(!rsa.verify(plainText,signData,pub)){
			console.error('pp钱包闪豆支付签名验证失败');
		}else{
			str = plainText;
		}

	}catch(e){
		console.error('crypt PPF_CommData_Decrypt data error : ',e);
	}
	return str;
}
function sensitiveData_encrypt(str,aeskey){
	
}
function sensitiveData_decrypt(str,aeskey){
	
}
module.exports = {
	commdata_encrypt:commdata_encrypt,
	commdata_decrypt:commdata_decrypt,
	rsa_sign:rsa.sign,
	rsa_verify:rsa.verify,
	aes_encrypt:aes.encrypt,
	aes_decrypt:aes.decrypt
}