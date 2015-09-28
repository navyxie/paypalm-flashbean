var crypto = require('crypto');
function encrypt(plaintext,key,algorithm,iv,encode,digest){
	var encData = '';
	try{
		algorithm = algorithm || "aes-128-ecb";
		iv = iv || '';
		encode = encode || null;
		digest = digest || 'hex';
		var cipher = crypto.createCipheriv(algorithm, key, iv);
		cipher.setAutoPadding(true);
		encData = cipher.update(plaintext,encode,digest);
		encData += cipher.final(digest);
	}catch(e){
		console.error('aes encrypt data error : ',e);
	}
	return encData;
}
function decrypt(ciphertext,key,algorithm,iv,digest){
	var rawdata = '';
	try{
		algorithm = algorithm || "aes-128-ecb";
		iv = iv || '';
		digest = digest || 'utf8';
		var decipher = crypto.createDecipheriv(algorithm, key, iv);
		rawdata = decipher.update(ciphertext,null,digest);
		rawdata += decipher.final(digest);
	}catch(e){
		console.error('aes decrypt data error : ',e);
	}
	return rawdata;
}
module.exports = {
	encrypt:encrypt,
	decrypt:decrypt,
}