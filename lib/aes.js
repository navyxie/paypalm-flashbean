var crypto = require('crypto');
var UTF8TGBK = require('./utf8-gbk');
function encrypt(plaintext,key,algorithm,iv,encode,digest){
	var encData = '';
	try{
		plaintext = UTF8TGBK.encode(plaintext);
		algorithm = algorithm || "aes-128-ecb";
		iv = iv || '';
		encode = encode || 'utf8';
		digest = digest || 'hex';
		var cipher = crypto.createCipheriv(algorithm, key, iv);
		cipher.setAutoPadding(true);
		encData = cipher.update(new Buffer(plaintext,encode),encode,digest);
		encData += cipher.final(digest);
	}catch(e){
		console.error('aes encrypt data error : ',e);
	}
	return encData;
}
function decrypt(ciphertext,key,algorithm,iv,decode,digest){
	var rawdata = '';
	try{
		algorithm = algorithm || "aes-128-ecb";
		iv = iv || '';
		decode = decode || 'hex';
		digest = digest || 'utf8';
		ciphertext = new Buffer(ciphertext,'hex');
		var decipher = crypto.createDecipheriv(algorithm, key, iv);
		rawdata = decipher.update(new Buffer(ciphertext,decode),decode,digest);
		rawdata += decipher.final(digest);
		rawdata = UTF8TGBK.decode(rawdata);
	}catch(e){
		console.error('aes decrypt data error : ',e);
	}
	return rawdata;
}
module.exports = {
	encrypt:encrypt,
	decrypt:decrypt,
}