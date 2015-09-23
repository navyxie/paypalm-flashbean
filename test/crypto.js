var should = require('should');
var myCrypto = require('../lib/crypto');
var config = require('../lib/config');
var plaintext1 = '<?xml version="1.0" encoding="UTF-8"?><paypalm><merorderno>0000011002410</merorderno><opcode>MH1001</opcode><merorderdate>20150706</merorderdate><meruserid>0000001</meruserid><productid>LCDS0201</productid><tranamt>1</tranamt><orderdesc>test</orderdesc><bankcard>2b07820f0cc574272c62d326c8d456ab6b81fbac8985e35f2b346a99c48bab7e</bankcard><cardusername>051281e0c03e878a30dc44c10d8f5bab</cardusername><idno>03120554641f98a6a2eccf3c15a41991e34273559e0b623ef018fbe1fe1e3058</idno><payphone>18658150058</payphone><cardbankname>中国工商银行</cardbankname><remark></remark><returnurl>http://192.168.24.16:8088/paypalm-server-sdk-php-api/WebContent/demo/merNotify.php</returnurl><notifyurl>http://192.168.24.16:8088/paypalm-server-sdk-php-api/WebContent/demo/merNotify.php</notifyurl></paypalm>';
var ciphertext1 = 'UpwG0WxmDNmGdW+ZV8l0HEp4jaYG4mcmsfHIi7ZoZRctDdLh3ltYa3gKjX1w31lStqTNqMOd23kEMCOdRqX0hEFhsZkU6uYopqRyYEdXd6OIDfVXBoZXW+7HrzHBjHjg9AIgb0rxTkUjIEasmgOah+dqXJeVN82KBSfU3Jx8kLzCreBb5PiSIOux5ZdjdkNKHLXve0mjXqIUbBng3m4WpOJuYBWah+vx4M5VHuzs/MhG3mu0U0y1s5mHQ8IMUJEZGYoFZm01+Cka8NY0ej3xPLCh818c4YErPe1NSZjyvVJnbRItqb0lYvZS/W96z4tKYRPiUISiYhERuwckNNGd/GBhAkQbyUsACpAp0Tt+GienR6hH0QzMkp4qrIeS7sw1/TWDbxw9paC+AoQqcyZfn8dUHacMLBmufWDxkOkDVjPanqBDx8jv44ig1jNOEXPUp7gtU5qeJa6MQKEfKruLj+OkmE8d665L6HRst2BMWkub5y9jdqFYMCirW27wM2ONc92wCXyOV1HaJJmdW9XBpkZLbIq3Hi5UacqnBAyIbYvalYVVsGQ65oWVVIpDZXMJtyszE9HZVLyR80l7pSjrGTzmQIzRM7qxD69LM7t1t5YFr4OyS9Y+Zq+mXvhJ2R0Inxuwp69wL8IFWiRBBgSFmXp+vU7BzDeqXwVnQ9L0ornduuPN39nrjmVPv//imSksI1XlCvcSNn6uimoJQXNJ3Y3yegsXiM40fw0lnV8gkICDhY2CcbOXldxDS6g9FpCrDGmmnOYBzm8WsGXgJf7qL9ds+b1+N4y0kuI8bHQJ8TUN1UbrcAyIymN9j8ayGg679t4NxRFFbaUsF5FK0QIku+nWCZuy81JNdkJaa8bhmnjL08lh1hmiuUUmDLpSv7GidOdg0+iOiqW1eYr086u1RgJiY8SBF1arwvtEtJ0l4UHgiHXhoYV861p8XsPrccdLw3PNhE4zQWfNDXFaNvMBjQmCnC0UjQFQIrwa8nz9sbJ3VmQgyPY/U34TWPQq1orCKyM7R1UhNcGnWrGjlJq6QOrAaYFuwnDhmxj9tO+WrXDiRz64e9JlSa8H8+8SIqdYrrAUCt5ApW1L5w7t7uZVkZtp0urbDK1RRg0HJW15eOsrT+Y4ZjiclriZJWx4VH3/t+d2t0elKpWEdIEd3XW+laOqO8/o8Jrpn+iKR3Ga0P+HAxgW+FFcSYpy9rNUKmoFi+bJDknhvs2D21o9wfe27xklZ2dCNA6uhd6Bei13/vd6WlMspc/wUefQkZL5OoW0MKvrhkgXtPGLUtzULhAj4RlJJ6DeN2GEyey23icABkLcOqFnzYQ2Vu/fZxrrN+9qNJAZx04Pd/K7pRRySMC/S9rwZ2fuyeY4Tuky91QFGUcsQ+FkDNHhDvy9tN8wH6FoVTE8o30vsqu3r4fKYJxsdJyVzc2buLlj3a9LEadUN9M89dUJCsng1N+VXKZ5ELd5xlsjW4xev7rlZY0TBI7lBonsHmhHhQHLysnI5Bh09cBKE7w9C2jU+iz0BgvyhDrH+zGAD19dkXPm7DTnhwpuBLpopSLB0tzAzHxyB5GNlCb7GBlcTqt5x/7WFTd7ab2POA5q5izVy5LeqOOIBDpPjk7ay/hjceDug8DaQpY4t2rPceNj8hEyLonr97MQM2mQUrrqvXHaWYGXgeZ+GgCYVM/OOeYoi3I3r5zGAW0loQgboIVyJ1JbIemgE696Qb9GMxWE2YLf+GOizPP++sb9jw==';
describe('myCrypto',function(){
	describe('#commdata_encrypt()',function(){
		it('should be ok!',function(){
			myCrypto.commdata_encrypt(plaintext1,config.MERPRIVATE,config.PAYPALMPUBLIC).should.not.be.equal('');
		});
	});
	describe('#commdata_decrypt()',function(){
		it('should be not ok!',function(){
			myCrypto.commdata_decrypt(ciphertext1,config.MERPRIVATE,config.PAYPALMPUBLIC).should.be.equal('');
		});
	});
})