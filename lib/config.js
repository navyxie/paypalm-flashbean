var ppUrlPrefix = "http://124.193.184.93:8061/";
var serverUrlPrefix = "http://192.168.1.120:8090/";
module.exports = {
  //商户编码
  MER_ID: "201509211716",
  //api方式的url
  PAYPALMURL_API: ppUrlPrefix + "cloud-moneymgr/xml",
  //wap方式的url
  PAYPALMURL_WAP: ppUrlPrefix + "cloud-moneymgr/h5",
  //加密地址
  ENCODEDATA_URL: serverUrlPrefix + "rest/encodeservices/paypalmEncode",
  //解密地址
  DECODEDATA_URL: serverUrlPrefix + "rest/encodeservices/paypalmDecode",
  //获取支付h5支付地址
  GET_WAP_URL: serverUrlPrefix + "rest/encodeservices/paypalmWapurl",
  //解析h5同步回调地址
  GET_H5RETURN_DATA_URL: serverUrlPrefix + "rest/encodeservices/h5ReturnData",
  //解析异步回调地址
  GET_RETURN_DATA_URL: serverUrlPrefix + "rest/encodeservices/returnData",
  GET_COMMON_STRCRYPTO_URL: serverUrlPrefix + "rest/encodeservices/encryptData"
};
