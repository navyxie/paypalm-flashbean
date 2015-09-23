var iconvLite = require('iconv-lite');
function encode(plaintext){
	return iconvLite.encode(plaintext,'gbk').toString('binary');
}
function decode(ciphertext){
	return iconvLite.decode(new Buffer(ciphertext,'binary'),'gbk');
}
module.exports = {
	encode:encode,
	decode:decode
}