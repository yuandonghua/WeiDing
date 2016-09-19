
var payment = function () {
    return {
        config: {

        },

        init: function init() {
            //this.applyBinding();
        },

        applyBinding: function applyBinding(user_id, address_id, store_id, goodsSet_id, buy_num) {
            var self = this;

            var dbkUrl = "http://ifc.dressbook.cn";
            $.ajax({
                url: dbkUrl + "/wtWdGoodsBuy.jsonp",
                //data: "user_id=" + user.user_id + "&address_id=302" + "&store_id=1" + "&goodsSet_id=1",
                data: "user_id=" + user_id + "&address_id=" + address_id + "&store_id=" + store_id + "&goodsSet_id=" + goodsSet_id + "&buy_num=" + buy_num,
                type: "GET",
                async: true,
                dataType: 'JSONP',
                success: function (data) {
                    console.log(JSON.stringify(data));
                    if (data.code == 1) {
                        self.prepay_id = data.info.wxResult.prepay_id;
                        self.order_id = data.info.order.id; //返回定单号
                        self.priceInfo = data.info.priceInfo;
                        if (self.prepay_id) {
                            self.invokeWeixinJSBridge();
                        }
                    }
                }
            });

            // $.getJSON('prepay-id', function(response) {
            //     console.log(response);
            //     self.prepay_id = response.prepay_id;
            //     self.invokeWeixinJSBridge();
            // });
        },



        calculateSign: function calculateSign(params) {
            var keys = Object.keys(params).sort();
            var str = '';
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                var value = params[key];
                str += key + "=" + value + "&";
            }

            str += "key=03e3d812cbd6e2f2f0e890d3be5aa44e";
            var sign = $.md5(str).toUpperCase();
            params.paySign = sign;
        },

        onBridgeReady: function onBridgeReady() {
            var self = this;
            var requestParams = {
                "appId": "wxcded79a899c9ef25", //公众号名称，由商户传入
                "nonceStr": "e61463f8efa94090b1f366cccfbbb444", //随机串
                "package": "prepay_id=" + self.prepay_id,
                "signType": "MD5", //微信签名方式：
                "timeStamp": Math.round((new Date().getTime()) / 1000).toString(), //时间戳，自1970年以来的秒数
                //    "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名
            };

            self.calculateSign(requestParams);

            console.log(requestParams);
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest', requestParams,
                function (res) {
                    $('.test').text(res);
                    // alert(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        //通知支付成功
                        var dbkUrl = "http://ifc.dressbook.cn";
                        $.ajax({
                            url: dbkUrl + "/wtWdGoodsPay.jsonp",
                            data: "order_id=" + self.order_id + "&price_net=" + self.priceInfo.price_net + "&money_available=" + self.priceInfo.money_available + "&pay_mode=" + self.priceInfo.pay_mode,
                            type: "GET",
                            async: true,
                            dataType: 'JSONP',
                            success: function (data) {
                                console.log(JSON.stringify(data));
                                if (data.code == 1) {
                                    alert(data.info.redesc);
                                    window.history.back();
                                }
                            }
                        });
                    } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                }
            );
        },

        invokeWeixinJSBridge: function invokeWeixinJSBridge() {
            var self = this;
            //本地测试或者帐户钱多，直接支付
            if (window.location.protocol == "file:" || self.priceInfo.price_net<self.priceInfo.money_available) {
                //local test
                //通知支付成功
                var dbkUrl = "http://ifc.dressbook.cn";
                $.ajax({
                    url: dbkUrl + "/wtWdGoodsPay.jsonp",
                    data: "order_id=" + self.order_id + "&price_net=" + self.priceInfo.price_net + "&money_available=" + self.priceInfo.money_available + "&pay_mode=" + self.priceInfo.pay_mode,
                    type: "GET",
                    async: true,
                    dataType: 'JSONP',
                    success: function (data) {
                        console.log(JSON.stringify(data));
                        if (data.code == 1) {
                            alert(data.info.redesc);
                        }
                    }
                });
            }


            if (typeof WeixinJSBridge == "undefined") {
                $('.test').text('WeixinJSBridge not defined!');
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                }
            } else {
                this.onBridgeReady();
            }
        }
    }
};

$(document).ready(function () {
    (new payment()).init();
});