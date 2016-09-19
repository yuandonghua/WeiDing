var getQueryString = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return r[2];
	return "";
}
var SERVER_IMG = 'http://st.dressbook.cn/';
var SERVER='http://st.dressbook.cn/share/wd/';
//var SERVER='';