var select_goodsset;
var select_goods_id = 14;
$(function () {
    $.tipBox();
    $("a[data-detailBox]").bind("click", function (event) {
        var id = $(this).attr("data-detailBox");
        $("#" + id).show();
        $("#" + id).find(".p-box-c").removeClass("b-bottom").addClass("b-active");
        // $('#a_buyNow').show();
    });
    $("span[data-detailBox]").click(function (event) {
        var id = $(this).attr("data-detailBox");
        $("#" + id).find(".p-box-c").removeClass("b-active").addClass("b-bottom");
        setTimeout(function () {
            $("#" + id).fadeOut()
        }, 300)
        //		$("#c_productDetail").html($("#h_productDetail").val());
        //		$("#head_price").html($("#h_productPrice").val());
        //		$("#head_profit").html($("#h_productProfit").val());
        //		$(".btn_go_cart").addClass("isProductShow");
        //		$("#a_buyNow").addClass("isProductShow");
    });

    var t = $("#number_text_box");
    $("#add").click(function(){       
        t.val(parseInt(t.val())+1)
    })
    $("#min").click(function(){
        t.val(parseInt(t.val())-1)
    })

    $("#s_confirm").bind("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        if ($(this).attr("data-confirm") == "false") {
            return;
        }
        if ($("#productDetail_u").val() == "0") {
            $.tipBox({ title: "检测到网络异常，请重试！" });
            return;
        }

        var next = $(this).attr("data-action");
        if (next == "addCart") {
            $("#a_addToCart").addClass("isProductShow");
            addShoppingCart($("#a_addToCart"));
        } else if (next == "buyNow") {
            $("#a_buyNow").addClass("isProductShow");
            buyNow($("#a_buyNow"));
        } else {

        }
        var num = $("input[data-num='1']").val();
        if (num <= 0) {
            $.tipBox({ title: "购买数量必须大于0!" });
            $("input[data-num='1']").val(1);
            return;
        }
        var limitBay = $("#h_productLimitBay").val();
        if (limitBay && parseInt(num) > parseInt(limitBay) && parseInt(limitBay) > 0) {
            $.tipBox({ title: "该商品为限购商品，限购数量为" + limitBay });
            return;
        }
        $("span[data-dele]").click();
    });

    $(window).load(function () {
        if ($('#activityProductFlag').val()) return;

        //获取规格
        $.ajax({
            url: "http://ifc.dressbook.cn/wdGoodsSetListGet.jsonp",
            type: "get",
            data: { "goods_id": select_goods_id },
            dataType: "jsonp",
            jsonp: 'callback',
            success: function (data) {
                $.hideTipBox();
                //set product image

                if (data && data != "ERROR") {
                    var list = data.info.goodsSets;
                    var temp = 0;
                    var html = "";
                    var typeProduct = "";
                    var flag = false;
                    for (var i = 0; i < list.length; i++) {
                        if (temp != list.id) {
                            if (i == 0) {
                                //html+="<li><span class='prid_name'>"+list[i].pf_name+"</span>";
                                html += '<div class="p-b-sList clearfix"><label>' + list[i].title + '</label>'
                                typeProduct += list[i].title
                            } else {
                                //html+="</li><li><span class='prid_name'>"+list[i].pf_name+"</span>";
                                html += '</div><div class="p-b-sList clearfix"><label>' + list[i].title + '</label>';
                                if (typeProduct.indexOf(list[i].title) <= 0) {
                                    typeProduct += "、" + list[i].title;
                                }
                            }
                            flag = true;
                            temp = list.id;
                        }
                        //						if(flag){
                        //							//html+="<a class='stand_alist product_active' href=\"javascript:;\" onclick='selectFormat(this)' data-id=\""+list[i].pfd_id+"\" data-pfid=\""+list[i].pfd_id+"\" data-pid=\""+list[i].pid_id+"\" data-price=\""+list[i].price+"\">"+list[i].pfd_name+"</a>";
                        //							html += '<a href="javascript:;" class="product_active" onclick="selectFormat(this)" data-pfid="' +list[i].pfd_id + '">' + list[i].pfd_name + '</a>';
                        //							flag=false;
                        //						}else{
                        html += '<a href="javascript:;" onclick="selectFormat(this)" data-pfid="' + i + '">' + list[i].title + '</a>';
                        //html+="<a class='stand_alist' href=\"javascript:;\" onclick='selectFormat(this)' data-id=\""+list[i].pfd_id+"\" data-pfid=\""+list[i].pfd_id+"\" data-pid=\""+list[i].pid_id+"\" data-price=\""+list[i].price+"\">"+list[i].pfd_name+"</a>";
                        //						}
                    }
                    //$("#chooseText").html("<font>选择" + typeProduct + "</font>");
                    //typeProduct = "请选择" + typeProduct;
                    //$("#typeProductP").text(typeProduct);
                    html += "</div>";
                    $("#productFormatUl").html(html);
                    // alert($.objToJSONString(list));
                    //$("#detailFormatJson").val($.objToJSONString(list));
                    $("#detailFormatJson").val(JSON.stringify(list));
                    //selectFormat();
                }
            },
            error: function () {
                $.hideTipBox();
            }
        });
    });
})

function selectFormat(obj) {
    if (obj) {
        $(obj).addClass("product_active").siblings().removeClass("product_active");
    }
    var pf_id;
    var totalFormat = "";
    $(".p-box-stand").animate({ scrollTop: 60 + 'px' }, 100);
    $(".product_active").each(function () {
        if (pf_id) {
            pf_id += "_" + $(this).attr("data-pfid");
        } else {
            pf_id = $(this).attr("data-pfid");
        }
        if (totalFormat) {
            totalFormat += "、";
        }
        totalFormat += $(this).text();
    });
    $("#productDetail").html("已选:" + totalFormat);
    $("#h_productDetail").val("已选:" + totalFormat);
    // alert($("#detailFormatJson").val());
    var objData = $.parseJSON($("#detailFormatJson").val());
    if (objData[pf_id]) {
        var data = objData[pf_id];
        $("#pro_profit").text("消费积分：" + data.price + "V");
        $("#productPriceB").text("￥" + data.price);
        $("#h_productPrice").val(data.price);
        $("#h_productProfit").val(0);
        $("#productSickCount").text("库存" + 100 + "件");
        $("#detailFormatId").val(data.id);
        $("#h_productStockCount").val(100);
        $("#h_productStockCount").val(100);
        $("#productImgURL").attr('src',"http://st.dressbook.cn/" + data.pic);

        select_goodsset = data;
        //if (data.stock_count > 0) {
        if (1) {
            $("#s_confirm").css("background-color", "");
            $("#s_confirm").css("color", "");
            $("#s_confirm").attr("data-confirm", true);
            $("#s_confirm").css("letter-spacing", "10px");
            $("#s_confirm").text("确定");
        } else {
            $("#s_confirm").css("background-color", "#F0F0F0");
            $("#s_confirm").css("color", "black");
            $("#s_confirm").css("letter-spacing", "0px");
            $("#s_confirm").attr("data-confirm", false);
            $("#s_confirm").text("库存为0");
        }
    } else {
        $("#s_confirm").css("background-color", "#F0F0F0");
        $("#s_confirm").css("color", "black");
        $("#s_confirm").attr("data-confirm", false);
        $("#s_confirm").css("letter-spacing", "10px");
        $("#s_confirm").text("请选择规格");
    }
}

function addShoppingCart(obj) {
    $("#s_confirm").attr("data-action", "addCart");
    if (!$(obj).hasClass("isProductShow")) {
        $("a[data-boxs='standard']").click();
        //$(obj).addClass("isProductShow");
    } else {

        $(obj).removeClass("isProductShow");
        var detailFormatId = $("#detailFormatId").val();
        if (detailFormatId <= 0) {
            $.tipBox({ title: "请先选择产品规格" });
            return;
        }
        var productStockCount = $("#h_productStockCount").val();
        var num = $("input[data-num='1']").val();
        if (num <= 0) {
            $.tipBox({ title: "购买数量必须大于0!" });
            return;
        }
        var limitBay = $("#h_productLimitBay").val();//限购数量
        if (limitBay && parseInt(num) > parseInt(limitBay) && parseInt(limitBay) > 0) {
            $.tipBox({ title: "该商品为限购商品，限购数量为" + limitBay });
            return;
        }
        if (productStockCount <= 0 || parseInt(num) > parseInt(productStockCount)) {
            $.tipBox({ title: "没有库存了，请稍后再试" });
            return;
        }
        // $.post("json/mall/addProductToCart.action", {
        //     "shoppingCart.productDetailId": detailFormatId,
        //     "shoppingCart.num": num,
        //     "shoppingCart.productId": $("#product_id").val(),
        //     "shoppingCart.companyId": $("#s_companyId").val(),
        //     "shoppingCart.limitBay": limitBay
        // }, function (data) {
        //     var messages = data.messages;
        //     if (data.messages == 'ok') {
        //         $.tipBox({ title: "成功加入购物车" });
        //         $("div[data-dele='true']").click();
        //     } else {
        //         $.tipBox({ title: data.messages });
        //     }
        // });
    }
}

function buyNow(obj) {
    // $(obj).hide();
    if ($(obj).attr('data-buy') == 'timeout') {
        $.tipBox({ title: "活动已结束！" });
        $(obj).show();
        return;
    }
    if ($("#productDetail_u").val() == "0") {
        $.tipBox({ title: "检测到网络异常，请重试！" });
        $(obj).show();
        return;
    }
    $("#s_confirm").attr("data-action", "buyNow");
    if (!$(obj).hasClass("isProductShow")) {
        $("a[data-boxs='standard']:eq(0)").click();
        //$(obj).addClass("isProductShow");
    } else {
        if (!$('#activityProductFlag').val()) {
            var detailFormatId = $("#detailFormatId").val();
            if (detailFormatId <= 0) {
                $.tipBox({ title: "请先选择产品规格" });
                $(obj).show();
                return;
            }
            var productStockCount = $("#h_productStockCount").val();
            var num = $("input[data-num='1']").val();
            if (num <= 0) {
                $.tipBox({ title: "购买数量必须大于0!" });
                return;
            }
            var limitBay = $("#h_productLimitBay").val();
            if (limitBay && parseInt(num) > parseInt(limitBay) && parseInt(limitBay) > 0) {
                $.tipBox({ title: "该商品为限购商品，限购数量为" + limitBay });
                $(obj).show();
                return;
            }
            if (productStockCount <= 0 || parseInt(num) > parseInt(productStockCount)) {
                $.tipBox({ title: "没有库存了，请稍后再试" });
                $(obj).show();
                return;
            }
            $("#b_productDetailId").val(detailFormatId);
            $("#b_productNum").val(num);
        }
        //$("#buyNow").submit();

        //转到付款
        var count = $("#b_productNum").val();
        var cart = {
            goodsSet: select_goodsset,
            count: count,
            freight: 0
        };
        sessionStorage.setItem('_cart_', JSON.stringify(cart));
        if(window.location.protocol == "file:"){
            window.location.href = "buyConfirm.html";
        }
        else
        {
            //for server
            window.location.href = "module/buy/buyConfirm.html";
        }
        
    }
}