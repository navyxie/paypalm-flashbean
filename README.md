# pp钱包支付SDK

## pp钱包支付回调

> 异步回调是get请求。

> 同步回调是get请求。

pp钱包支付分两步：
+ 订单入库->获取pp钱包支付平台的订单号
+ 订单支付请求->通过第一步获取的订单号，加上商户支付信息组装成一条支付url(地址)

## 安装

npm install paypalm-flashbean

## API

[`getPayUrl`](#getPayUrl)

[`paySuccess`](#paySuccess)

[`getStopNotifyData`](#getStopNotifyData)[]

[`query`](#query)

<a name="getPayUrl" />

获取pp钱包支付url,异步方法

```js
var paypalm = require('paypalm-flashbean');
var config = {
	'MER_ID': "",//pp钱包商户号
	'KEY': "",//商户秘钥
	'WAP_KEY': "",//预制密钥->wap获取支付链接时，需要使用该密钥进行实名信息加密
	"PAY_API_URL":"https://www.paypalm.cn/bfsmob/http"//订单入库以及支付地址
}
var paypalmObj = new paypalm(config);
var data = {
	merorderno:'a'+Date.now(),
	merorderdate:'20150706',
	meruserid:"0000001",
	tranamt:"1",
	orderdesc:"test",
	bankcard:"6222081202007547506" || "",
	cardusername:"xxx" || "",
	idno:"360732199305000000" || "",
	payphone:"15188888888" || "",
	cardbankname:"中国工商银行" || "",
	remark:"navy" || "",
	returnurl:"http://58.67.144.241:8120/return_url/simulate_handler",
	notifyurl:"http://58.67.144.241:8120/notify_url/simulate_handler"
}
paypalmObj.getPayUrl(data,
	function(err,url){
		if(!err){
			console.log(url);//url为去pp钱包支付的地址
		}
	}
)
```

<a name="paySuccess" />

验证支付是否成功(已对数据进行验签),异步方法

**注意h5同步回调和异步回调的区别**

```js
//wap同步回调数据
var h5XmlData = "BH6ghm3dm6WigihuytFlp6l96UCO+OZIg5CCu5QTLT4SlQSKw19abVCg+Sar5rmBxAFMXFfIuVeL6TnRijPIBGYstcVBsyeNUZ8bCYbDMBJbhfJuYx+r2BXSXVj0T/X1DQxdAJ0/VuXbPM8JEgew4bzWQHv7L2HQaAM5LbDPlLgQr63MBgvFbhjclp1SjxdS9cwA6b0vi82ky3nbGeCOf38FhKDHr8QfBoaA/8VJ9/h1lTxQ/LiVihpC6euwEKvKgZNVg/TTOyJQlF43jrBoEIyyv97+jgm7Dm3M3a1YDs/Ae010mZzc/vlovwDBcStPeLWmJhcjPUFyCr6Q9jSVOTw/eG1sIHZlcnNpb249IjEuMCIgZW5jb2Rpbmc9IlVURi04IiA/PjxwYXlwYWxtPjxyc3Bjb2RlPjAwMDAwMDwvcnNwY29kZT48b3JkZXJzdGF0dXM+MTwvb3JkZXJzdGF0dXM+PHJlbWFyaz5uYXZ5PC9yZW1hcms+PG1lcm9yZGVybm8+YTE0NDM0MzYyNTY0NjA8L21lcm9yZGVybm8+PHJzcGRlc2M+s8m5pjwvcnNwZGVzYz48b3JkZXJubz4xMDAwMDE2NjE3NzQ8L29yZGVybm8+PG1lcnVzZXJpZD4wMDAwMDAxPC9tZXJ1c2VyaWQ+PHBheXBob25lPjE1MTEyMTk1NDIyPC9wYXlwaG9uZT48bWVyaWQ+MjAxNTA5MjExNzE2PC9tZXJpZD48dHJhbmFtdD4xPC90cmFuYW10PjwvcGF5cGFsbT4=";

h5同步回调
paypalmObj.paySuccess(h5XmlData,true,function(err,data){
	if(!err && data.code === 0){
		//支付成功页面跳转
		//data.data
		{
			rspcode: '000000',
			orderstatus: '1',
			remark: 'navy',
			merorderno: 'a1443436256460',
			rspdesc: '成功',
			orderno: '100001661774',
			meruserid: '0000001',
			payphone: '15112195422',
			merid: '201509211716',
			tranamt: '1'
		}
	}
});

h5异步回调

var notifyXmlData = "BePWjcFbaoz7Wu2lq3CQi3pEq+qX/cBUiJopR1+iQiNmBx3/EkqAqnVVVrWG8cUzRFD7OWbKnmmQaF7bzC+5cIQu2LQ4lXtJEIQJpM3MC9aU8cP89xRkxOtLSs9bsrELRyIJK5RnL5JdQEWn5s/9ybG608Zz/KIiCO0p893IgovDxOWrY6UyiCZe6lcy8w+xi8eU/3eWpAJgz0CfLHHHeXuwCmNRaRv7MAo09L4THSIw4k+9TCd7z7gb0DX9ID8oplxhQULoGBlHdRSlmxhu/TWfB6MrsG1iaoWq52kvxRjN6moe4cHktqi0GuFoeEiQBhLjgr8m/Rm+cGj3E2CDrpjtn3ojfdPuo2X55I41fITdUWO+UghmwtaCxRQJuGVSiB2nfGQ4lo7Ssj2n+T1uITPjWxBCuaQYKF8rqgKP1pr8eTW4ltEib66yA7s5IKh7MIFt/XPhALcvaCivtTazgiDbJIlJILK7HH8oQri3TyjDrViytrg9MAIKcwEM/qzak65jV5EGIAcC/QDKA/D8OmCV3uAlv5RF+qlUHz314/p77PS89BuMhFU88rGDHcrzHHmecCHLfDiRbaRWXddPjCciTyHktuuvCFSsJfa23EY3BqJQArjYV0s+hg564BqoleP7dPWa2enPAFtbtaemKDKi0kDZt6a7fLDOnhsKfckIu87wcRt+SpxYhbhI7vM38/qulJFKr4bR7QMJpkciCIkPJA8iTuPORBsbw/iVvNZ2PssKbFbtXrOKZA9PPcH7YapR80nt7fxaayTOiPGu/BFbLQqdYgBfEnw8aekdmU1JAW2meOKsYL7bLudDF+GqgkmJqvSEa5J4UkQ+N4iEaU0YIbm9Llr/4CYyZGvJJsfIX2f0pk8Gdevwqe7VLDP00OOIdSSlJTm990X3cVRFlCreigbfwuYPZ0qVLeIbF/lEE+PFA6zUvrPq8bKnStjzBN6SkT7tXwSLtdv3wTQ4Euyv3HRN0KPsCTsKt2rIzLbrSdsoHe2l9mE7h/z3CDjP8t4fGp5fqpZMuuNuaHGWZkW5mnOMSlHEO0YxhRKgn2e3GSeXDwFgr9QJ2T2flt+WurWtyP4wAIsopJxiKDLQPvE0LqnBZFRNOUXPs8U0/8BRSGwjS5nag4yLpmSY6iuPCFszsvPZIOJamPfR5wXbtFgWumw/S9AabgCYQZQmkyvBPRn5aOP+PDOSpoPXzSKzCMiFWR1szJFsqWcFYoZxPPrwOTpvSHlG7C5ikjSEzAk=";

paypalmObj.paySuccess(notifyXmlData,function(err,data){
	if(!err && data.code === 0){
		//已完成支付可执行订单更新或者发货了
		//data.data
		{
			merid: '201509211716',
			merorderno: 'a1443443782902',
			orderno: '100001661798',
			tranamt: '1',
			remark: 'navy',
			userid: '1000346692',
			transtime: '20150928203500',
			trantype: '1',
			orderstatus: '1',
			rspcode: '000000',
			rspdesc: '交易成功',
			meruserid: '0000001',
			notifytype: '0'
		}
	}
});

```

<a name="getStopNotifyData" />

获取终止pp钱包异步回调的相应字符串

**注：当向pp钱包相应此字符串时，代表商户已经成功处理回调，pp钱包将终止异步回调。**

```js
//wap异步回调数据
res.send(paypalmObj.getStopNotifyData());
```

<a name="query" />

查询订单支付状态


```js
//wap异步回调数据
var queryData = {
	merorderno:"a1443436256460"
}
paypalmObj.query(queryData,function(err,data){
	console.log(data);
	//data
	{
		rspcode: '000000',
		rfstatusdesc: '未退款',
		orderstatus: '1',
		orderstatusdesc: '成功',
		refundamt: '0',
		refundstatus: '0',
		merorderno: 'a1443436256460',
		rspdesc: '成功',
		orderno: '100001661774'
	}
})

```
