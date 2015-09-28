var should = require('should');
var rsa = require('../lib/rsa');
var config = require('../lib/config');
var UTF8TGBK = require('../lib/utf8-gbk');
var pri = config.MERPRIVATE;
var pub = config.PAYPALMPUBLIC;
var plaintext1 = 'test_english';
var ciphertext1 = 'IKu79RpreSUnGZTmXFqN/npkd/vaZg209bEuhb/RCTZyaZfMneOmTDh1pVA2DMHFnRY92plbgQs4hkd/Rv+tuA0TWHWkLqqDrCOxJF9i5f0ujy406gpDk39eBJJs7q80LtNtVmmiZnQMXVWFQjFkMUX5/CmHssOxxeek9ctIn5/+x9UhByCX5XeiY9T2WXUB2OZRIUCqEeSrYFhATb7o9w6LYi5JHiozkJORxU2Zvei2YMrVPwYj98wvCaGc4v2hUFDPbivO6m8ZEoBD9ZtusQZPkPi0dsmz50UqLmi1QIZdgomT75FknQ/trdSnIUWT2m2IET7NYesOA7dhC5JEsQ==';
var sign1 = 'a71a71KwDKvF9qjxOnmH8ZqBRU9ny2bFZdL2fmvFSFFxhlDkViQgy3W0VObPhW06goFICedUWH7O1X5w+KiXz5ITlI7dzFlpLLi46P8mkOLtLkZZTiOTPvOK2GaDV/MNPXrX/b3Hva8/WD4eHNZzYFYFZJsaIYH7WhjoW5utqa2Jjo85lb/63vmEkGm7yE/WfFFfGP3BPeIwRT2yXCuoULbWN2THFfnDsfLWnOu1u0YL168Sdg9NqACrhzmlWBcUFgcyUPP76SPJc1uJ1z68yYem+LEOKCU2IT8+NFpNprCiuTd72EfqTtsygUSHFRqJJw/oiV0WSUdplVt5wV1QiA==';
var plaintext2 = '海军';
var ciphertext2 = 'F1yJoxlFEZxaf9mWslw5NQf3dkK7b2AQwi8YTe1yYCbQtB1RZm8sJwTyNJ1/zH+xJlKi+tFGQHovGA+oHBVK9B7tYQ8TVuP7px3Rfu9cf/ethvXMRwVPNSt3Kx5cJsjZSHIv4x7Cc1UI7OD25L3dnvsDakH6PRwXsfsiAHtnvW0YrOs1UqbgGOWLDR04TPiBLYOjuAK0+Ft5ocEo0ZzRvYhv71mcXzh/9wOv17Sj7WHbVHaJ8luLP26N/zxUrcWXQNL4Tr9zqKWyIMJwcfktaQF1UyK6su00UhnLa0S5LUERTosgNHqPSH/CXfHRg2W/oLTojK58qvZw9oJTmFcWog==';
var sign2 = 'RJSphbO6mPBb4mpqfeF0cuRhdMxKkF2msVOwux/Ao5VCDPNboIx6QucsqiIWb/rztnndO1KEldVOa0NOB8kiqWQsOVXG0x5c1FElWX8gcq9e0muLR56UfVwKv6+9WnH4BJgH2Z76nUWjE9ngSJAT1s8RyDunMdTrOQAQyRotWKgAdUA4ES9MH5FV820nfwvCbMfy/M6B4mOzwbjaJzmMVMUoUCLY2RYH33bRQBwd/xoq1I4mvUlVoz0XH9QlazVqkiyYjD6MSJCsifLPRVwCY3p9JwbplDlDYZa3sj5Zm6GqgB32u98MMvd4sfoqtPrPIUbBu+PkHGp966nIGtrZ6w==';
var plaintext3 = 'test data';
var sign3 = 'H1HcgO0h+pjDAzi+YwRHg1MDn5/ACzy/A0l28TTRT4881+VsQLgHwE9FmWQjEHcHHpYGUJbtCHTCOQ5rJqeFe9BSb6KFrBuAcov7i4d1G9YMrUc9ypqfPufm5wpSIEae7Ajdg3it2/4P0ALmZizzFtHJ5W33YdceyeIWmVgHtPT3uPVDrLjm+/ko1GYMV/RNlbLU5+C61NgyGWJpEMI/oRXPnrVhcJ5Gs8vdZ4yzldzDr34WAIpDNtD6S31SXpBlLc9siZWAvH4kXsAmDWrJcMBRG3/EivPSkwr8qVqWkEVc/ZI4aZIb+7t0k+CDgUVkfp5aKvvi421WqMLWdxXPZw==';
var plaintext4 = "海军";
var sign4 = "RJSphbO6mPBb4mpqfeF0cuRhdMxKkF2msVOwux/Ao5VCDPNboIx6QucsqiIWb/rztnndO1KEldVOa0NOB8kiqWQsOVXG0x5c1FElWX8gcq9e0muLR56UfVwKv6+9WnH4BJgH2Z76nUWjE9ngSJAT1s8RyDunMdTrOQAQyRotWKgAdUA4ES9MH5FV820nfwvCbMfy/M6B4mOzwbjaJzmMVMUoUCLY2RYH33bRQBwd/xoq1I4mvUlVoz0XH9QlazVqkiyYjD6MSJCsifLPRVwCY3p9JwbplDlDYZa3sj5Zm6GqgB32u98MMvd4sfoqtPrPIUbBu+PkHGp966nIGtrZ6w==";
describe('RSA',function(){
	describe('encrypt',function(){
		it('en should be ok',function(){
			rsa.encrypt(pub,UTF8TGBK.encode(plaintext1)).should.not.be.equal('');
		});	
		it('cn should be ok',function(){
			rsa.encrypt(pub,UTF8TGBK.encode(plaintext2)).should.not.be.equal('');
		});
	});
	describe('decrypt',function(){
		it('en should be ok',function(){
			rsa.decrypt(pri,ciphertext1).should.be.equal(plaintext1);
		});	
		// it('cn should be ok',function(){
		// 	UTF8TGBK.decode(new Buffer(rsa.decrypt(pri,ciphertext2),'binary')).should.be.equal(plaintext2);
		// });
	});
	describe('sign',function(){
		it('en should be ok',function(){
			rsa.sign(UTF8TGBK.encode(plaintext1),pri).should.be.equal(sign1);
		});	
		it('cn should be ok',function(){
			rsa.sign(UTF8TGBK.encode(plaintext2),pri).should.be.equal(sign2);
		});
		it('en should be ok',function(){
			rsa.sign(plaintext3,pri).should.be.equal(sign3);
		});	
		it('cn should be ok',function(){
			rsa.sign(UTF8TGBK.encode(plaintext4),pri).should.be.equal(sign4);
		});
	});
	describe('verify',function(){
		it('en should be ok',function(){
			rsa.verify(plaintext1,sign1,pub).should.be.equal(false);
		});	
		it('cn should be ok',function(){
			rsa.verify(plaintext2,sign2,pub).should.be.equal(false);
		});
		it('en should be ok',function(){
			rsa.verify(plaintext3,new Buffer(sign3,'base64'),pub).should.be.equal(true);
		});
		it('cn should be ok',function(){
			rsa.verify(UTF8TGBK.encode(plaintext4),new Buffer(sign4,'base64'),pub).should.be.equal(true);
		});
	});
});
