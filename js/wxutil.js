/**
 * 此模块功能为微信认证，使用时将此文件加载到页面中即可。
 * 条件：1.在引入此js之前要先引入jquery；2.必须在微信中打开。
 * 本认证流程已经最大限度降底了认证过程对页面的影响，
 * 但在认证过程中仍可能要遇到页面跳转的情况（主要是用户首次打开页面时）
 * 
 * 当认证成功后，全局变量user中会有值，user的结构如下：
 *  { user_id=1095549, mobile=null, user_name=Oldbig, 
 * 	wx_openid=oobZas9-CmdeIQYifyIJZ0l5KZkE, 
 *  avatar=http://wx.qlogo.cn/mmopen/.....,
 *  sex=1}
 * 
 *  页面可使用此值进行需要的操作。
 *  由于微信认证过程需要时间，所以有可能主页面加载完成时并不能立即获取用户信息。
 *  本模块将用户信息获得作成一个事件userReadyEvent，监听这个事件就能保证获取用户信息。即在页面中：
 *  document.addEventListener("userReadyEvent",function(){
 *  	//代码
 *  });
 */
var debug_mode = 0;
var user = {};
//var dbkUrl = "http://192.168.1.109:8080";
//var dbkUrl = "http://192.168.31.205:8080";
var dbkUrl = "http://ifc.dressbook.cn";

var wxUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcded79a899c9ef25&redirect_uri={0}" +
	"&response_type=code&scope={1}&state=123#wechat_redirect";
var snsBase = "snsapi_base";
var snsUser = "snsapi_userinfo";

var curLoc = window.location.href;
var code = getQueryString("code");

var sharefrom = getQueryString("sharefrom");

var ev = document.createEvent('HTMLEvents');
ev.initEvent('userReadyEvent', false, false);

$(function() {
	checkUser();
});
/**
 * 校验用户，需提交到后端检查
 * 在session中检查，如果不存在，则需要调用微信接口获取openid
 * @param  userId
 */
function checkUser() {
	if(code == null || code == "") {
		$.ajax({
			url: dbkUrl + "/wd/userCheck.auth",
			type: "GET",
			async: true,
			dataType: 'JSONP',
			success: function(data) {

				//从session中获取user
				if(data.code == 1) {
					buildUser(data.info);
				} else {
					navToWx(snsBase);
				}
			}
		});
	} else {
		getUserByWxCode();
	}
}

/**
 * 检查微信登录状况
 * 目的是重新获取code,此方法调用后，再次返回本页面，并且带code值
 * curLoc:当前页面的Url
 */

function navToWx(snsType) {
	if(debug_mode) {
		/**
		 * 	
		 * $('#userId').html(user.user_id);
	$('#userName').html(user.user_name);
	$('#openid').html(user.wx_openid);
	$('#sex').html(user.sex);
	$('#avatar').attr('src',user.avatar);
		 */
		//		user.user_id = "1095492";
		//		user.user_name = "测试用户";
		//		user.wx_openid = "o3LILj6brjbkgq-A6bUXsJCL-180";
		//		user.sex = "女";
		//		user.avatar = "http://wx.qlogo.cn/mmopen/PiajxSqBRaEIXKBdxwreickibbDHuyxFXvPc2YJpBPdmuC2urk5tfdClJGNiaLEOGhv8fOEeibRZy1WHkCdSb4lagpw/0";
		//		document.dispatchEvent(ev);
		//		return;
	}

	//如果code有值，则snsType就没有用
	if(curLoc.indexOf("#")) {
		curLoc = curLoc.split("#")[0];
	}
	curLoc = escUrl(curLoc);//将code参数去掉，如果原来有的话
	var fromUrl = encodeURIComponent(curLoc);
	var toUrl = wxUrl.format(fromUrl, snsType);
	location.href = toUrl;
}



/**
 * 使用code到后台获取用户信息
 * 后台操作：
 * 1.获取Openid,access_token等；
 * 2.使用openid在用户库中查询用户信息，如查到，存入session,并返回；
 * 3.查不到，说明用户未注册，则尝试在后台调用微信url直接获取用户微信信息，拿这些信息注册一个用户，存入session并返回；
 * 4.后台调用微信url获取不到用户微信信息，返回前台，改用snsapi_userinfo方式再从checkWx走一遍。
 * 
 */
function getUserByWxCode() {
	if(!sharefrom) {
		sharefrom = "";
	}
	$.ajax({
		url: dbkUrl + "/wd/userInfoGetByWxCode.auth",
		data: "code=" + code + "&sharefrom=" + sharefrom,
		type: "GET",
		async: true,
		dataType: 'JSONP',
		success: function(data) {

			if(data.code == 1) {
				buildUser(data.info);
			} else {
				//当静默方式无法获取用户信息时，需要再次采用授权方式
				if(data.message == "need_auth_user") {
					navToWx(snsUser);
				}
				if(data.message == "link_again") {
					location.href="auth_failure.html";
				}
			}
		}
	});
}

/**
 * 获得用户并赋给全局变量
 * 只要调用完这个函数说明用户认证已完成
 * @param {Object} uinf
 */
function buildUser(uinf) {
	user = uinf;
	document.dispatchEvent(ev);
}

//获取当前连接的请求参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) {
		return unescape(r[2]);
	} else {
		return null;
	}
}

String.prototype.format = function() {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g,
		function(m, i) {
			return args[i];
		});
}

//去除url中code=xxxx这一部分
function escUrl(url){	
	return url.replace(/code=.*&|code=.*/,"").replace(/[?&]$/gi,"");
}


