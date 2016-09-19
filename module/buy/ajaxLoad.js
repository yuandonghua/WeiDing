$(function(){
	$(document).scroll(function(){
		var t = $(this).scrollTop();
		$("div[data-ajaxLoad]").each(function(){
			var sTop = $(this).position().top;
			var functonName = $(this).attr("data-ajaxLoad");
			var pageId  = $(this).attr("data-page");
			var complete = $(this).attr("data-complete");
			var WH = $(window).height();
			if(t>=sTop - WH){
				var val = parseInt($("#" + pageId).val()) + 1;
				$("#" + pageId).val(val);
				if(complete == 0 && functonName){
					try {
						eval(functonName + "()");
					} catch (e) {
						$(this).attr("data-complete", 1);
						console.info("异步加载资源出错");
					}
				}
			}
		})
	})
})