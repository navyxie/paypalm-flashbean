var crypto = require('crypto');
var ursa = require('ursa');
var base64 = require('base64');
/**
	获取rsa私钥的前缀
	@return string
*/
function getRSAPrivateKeyPrefix(){
	return '-----BEGIN RSA PRIVATE KEY-----\r\n';
}
/**
	获取rsa私钥的后缀
	@return string
*/
function getRSAPrivateKeySuffix(){
	return '-----END RSA PRIVATE KEY-----';
}
/**
	获取rsa公钥的前缀
	@return string
*/
function getRSAPublickKeyPrefix(){
	return '-----BEGIN PUBLIC KEY-----\r\n';
}
/**
	获取rsa公钥的后缀
	@return string
*/
function getRSAPublicKeySuffix(){
	return '-----END PUBLIC KEY-----';
}
/**
	@param string key
	格式化rsa的私钥，64位长度为一行
	@return string
*/
function formatRSAKey(key){
	var len = key.length;
	var privateLen = 64;//private key 64 length one line
	var space = Math.floor(len/privateLen);
	var flag = len%privateLen === 0 ? true : false;
	var str = "";
	for(var i = 0 ; i < space ; i++){
		str += key.substr(i*privateLen,privateLen) + '\r\n';
	}
	if(!flag){
		str += key.substring(space*privateLen) + '\r\n';
	}
	return str;
}
/**
	@param string key rsa的私钥
	返回标准格式的rsa的私钥
	@return string
*/
function getRSAPrivateKey(key){
	return getRSAPrivateKeyPrefix() + formatRSAKey(key) + getRSAPrivateKeySuffix();
}
/**
	@param string key rsa的私钥
	返回标准格式的rsa的公钥
	@return string
*/
function getRSAPublicKey(key){
	return getRSAPublickKeyPrefix() + formatRSAKey(key) + getRSAPublicKeySuffix();
}
function encrypt(publicKey,plaintext,encode,digest){
	var str = '';
	try{
		encode = encode || null;
		digest = digest || 'base64';
		var crt = ursa.createPublicKey(getRSAPublicKey(publicKey));
  		str = crt.encrypt(plaintext, encode, digest,ursa.RSA_PKCS1_PADDING);
	}catch(e){
		console.error('rsa encrypt data error : ',e);
	}
	return str;
}
function decrypt(merchantPrivateKey,ciphertext,encode,digest){
	var str = '';
	try{
		encode = encode || 'binary';
		digest = digest || 'utf8';
		ciphertext = base64.decode(ciphertext);
		var pem = ursa.createPrivateKey(getRSAPrivateKey(merchantPrivateKey));
		str = pem.decrypt(ciphertext, encode, digest, ursa.RSA_PKCS1_PADDING);
	}catch(e){
		console.error('rsa decrypt data error : ',e);
	}
	return str;
}
function sign(plaintext,merchantPrivateKey,digest,algorithm){
	var signText = '';
	try{
		digest = digest || 'base64';
		algorithm = algorithm || "RSA-SHA1";
		var RSA = crypto.createSign(algorithm);
		var pem = getRSAPrivateKey(merchantPrivateKey);
		RSA.update(plaintext);	
		signText = RSA.sign(pem,digest);
	}catch(e){
		console.error('rsa sign data error : ',e);
	}
	return signText;
}
function verify(plaintext,signText,publicKey,encode,algorithm){
	var isVerify = false;
	try{
		encode = encode || "base64";
		algorithm = algorithm || "RSA-SHA1";
		var verifier = crypto.createVerify(algorithm);
		verifier.update(plaintext);
		isVerify = verifier.verify(publicKey,signText,encode);
	}catch(e){
		console.error('rsa verify data error : ',e);
	}
	return isVerify;
}
module.exports = {
	encrypt:encrypt,
	decrypt:decrypt,
	sign:sign,
	verify:verify
}