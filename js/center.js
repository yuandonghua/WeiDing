

function defaultImg() {
    if (mui.os.plus) {
        plus.io.resolveLocalFileSystemURL("_doc/head.jpg", function (entry) {
            var s = entry.fullPath + "?version=" + new Date().getTime();;
            document.getElementById("head-img").src = s;
            document.getElementById("head-img1").src = s;
        }, function (e) {
            document.getElementById("head-img").src = '../imgs/logo.png';
            document.getElementById("head-img1").src = '../imgs/logo.png';
        })
    } else {
        document.getElementById("head-img").src = '../imgs/logo.png';
        document.getElementById("head-img1").src = '../imgs/logo.png';
    }

}

function updateUI(){

        var dbkUrl="http://ifc.dressbook.cn";
    	$.ajax({
		url: dbkUrl+"/wtUserLogin.jsonp",
		data:"wx_openid="+user.wx_openid,
		type: "GET",
		async: true,
		dataType: 'JSONP',
		success: function(data) {

			if(data.code==1){
				document.getElementById("user-name").innerText = data.info.user_name;
                if(data.info.avatar.length)
                {
                    document.getElementById("head-img").src = data.info.avatar;
                }
                

			}
		}
	});


    //更新资产信息
        $.ajax({
		url: dbkUrl+"/wdUsersWealthGet.jsonp",
		data:"user_id="+user.user_id,
		type: "GET",
		async: true,
		dataType: 'JSONP',
		success: function(data) {

			if(data.code==1){
                document.getElementById("income-expect").innerText = data.info.saleExpect.total;
                document.getElementById("income-balance").innerText = data.info.saleIncome.total;
                document.getElementById("income-today").innerText = data.info.saleExpect.total;
                document.getElementById("income-month").innerText = data.info.saleExpect.total;
			}
		}
	});

}



