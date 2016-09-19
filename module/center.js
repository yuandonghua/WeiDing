

mui.init();
//初始化单页view
var viewApi = mui('#app').view({
    defaultPage: '#setting'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();


// setTimeout(function () {
//     defaultImg();
//     setTimeout(function () {
//         initImgPreview();
//     }, 300);
// }, 500);

var view = viewApi.view;
(function ($) {
    //处理view的后退与webview后退
    var oldBack = $.back;
    $.back = function () {
        if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
            viewApi.back();
        } else { //执行webview后退
            oldBack();
        }
    };
    //监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
    //第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
    view.addEventListener('pageBeforeShow', function (e) {
        //				console.log(e.detail.page.id + ' beforeShow');
    });
    view.addEventListener('pageShow', function (e) {
        //				console.log(e.detail.page.id + ' show');
    });
    view.addEventListener('pageBeforeBack', function (e) {
        //				console.log(e.detail.page.id + ' beforeBack');
    });
    view.addEventListener('pageBack', function (e) {
        //				console.log(e.detail.page.id + ' back');
    });
})(mui);


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

        let dbkUrl="http://ifc.dressbook.cn";
    	$.ajax({
		url: dbkUrl+"/wtUserLogin.jsonp",
		data:"wx_openid="+user.wx_openid,
		type: "GET",
		async: true,
		dataType: 'JSONP',
		success: function(data) {
            console.log(JSON.stringify(data));
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
            console.log(JSON.stringify(data));
			if(data.code==1){
                document.getElementById("income-expect").innerText = data.info.saleExpect.total;
                document.getElementById("income-balance").innerText = data.info.saleIncome.total;
                document.getElementById("income-today").innerText = data.info.saleExpect.total;
                document.getElementById("income-month").innerText = data.info.saleExpect.total;
			}
		}
	});

}


document.getElementById("head-img1").addEventListener('tap', function (e) {
    e.stopPropagation();
});
document.getElementById("welcome").addEventListener('tap', function (e) {
    //显示启动导航
    mui.openWindow({
        id: 'guide',
        url: 'guide.html',
        show: {
            aniShow: 'fade-in',
            duration: 300
        },
        waiting: {
            autoShow: false
        }
    });
});

function initImgPreview() {
    var imgs = document.querySelectorAll("img.mui-action-preview");
    imgs = mui.slice.call(imgs);
    if (imgs && imgs.length > 0) {
        var slider = document.createElement("div");
        slider.setAttribute("id", "__mui-imageview__");
        slider.classList.add("mui-slider");
        slider.classList.add("mui-fullscreen");
        slider.style.display = "none";
        slider.addEventListener("tap", function () {
            slider.style.display = "none";
        });
        slider.addEventListener("touchmove", function (event) {
            event.preventDefault();
        })
        var slider_group = document.createElement("div");
        slider_group.setAttribute("id", "__mui-imageview__group");
        slider_group.classList.add("mui-slider-group");
        imgs.forEach(function (value, index, array) {
            //给图片添加点击事件，触发预览显示；
            value.addEventListener('tap', function () {
                slider.style.display = "block";
                _slider.refresh();
                _slider.gotoItem(index, 0);
            })
            var item = document.createElement("div");
            item.classList.add("mui-slider-item");
            var a = document.createElement("a");
            var img = document.createElement("img");
            img.setAttribute("src", value.src);
            a.appendChild(img)
            item.appendChild(a);
            slider_group.appendChild(item);
        });
        slider.appendChild(slider_group);
        document.body.appendChild(slider);
        var _slider = mui(slider).slider();
    }
}

if (mui.os.stream) {
    document.getElementById("check_update").display = "none";
}
