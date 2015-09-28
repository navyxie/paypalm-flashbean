var iconvLite = require('iconv-lite');
function encode(plaintext){
	return iconvLite.encode(plaintext,'gbk');
}
function decode(ciphertext){
	return iconvLite.decode(new Buffer(ciphertext),'gbk');
}
module.exports = {
	encode:encode,
	decode:decode
}