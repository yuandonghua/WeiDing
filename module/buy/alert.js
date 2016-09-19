

/*验证,提示弹出框*/
$.extend({
	
	// 服务器处理提示框，无按钮.
	tipBox : function(options){
		var default_options = {
		 	title : "正在处理，请稍候......" // 提示框文字
		};
		options = $.extend(default_options,options);
		var html = "";
		if(!$("#store_boxtips").length){
			html += '<div class="store_boxtips" id="store_boxtips">';
			html += '<p>'+options.title+'</p>',
			html += '</div>';
			$("body").append(html);
		} else {
			$("#store_boxtips p").html(options.title);
		}
		$("#store_boxtips").show();
		if(!$("#store_boxtips").is(":hidden")){
			setTimeout(function(){
				$("#store_boxtips").hide();
			},3000)
		}
	},
	//异步加载提示
	tipLoad : function(options){
		var default_options = {
		 	title : "正在加载......" // 默认提示框文字
		};
		var default_positionClassName = {
		 	documentName : "body" // 默认提示框jquery的类
		};
		var	options = $.extend(default_options,options),
			options = $.extend(default_positionClassName,options);
		console.log(options);
		var html = "";
		if(!$("#store_loadtips").length){
			html += '<div class="store_loadtips" id="store_loadtips">';
			html += '<p>'+options.title+'</p>',
			html += '</div>';
			$(options.documentName).append(html);
		} else {
			$("#store_loadtips p").html(options.title);
		}
		$("#store_loadtips").show();
		if(!$("#store_loadtips").is(":hidden")){
			setTimeout(function(){
				$("#store_loadtips").fadeOut();
			},3000)
		}
	},
	
	// 隐藏提示框
	hideTipBox : function(options){
		var default_options = {
			id  : "store_boxtips" ,
			
		};
		options = $.extend(default_options,options);
		$("#" + options.id).css("display", "none");			
	},
	objToJSONString : function(o) {
		    if (o == undefined) {
		        return "";
		    }
		    var r = [];
		    if (typeof o == "string") return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
		    if (typeof o == "object") {
		        if (!o.sort) {
		            for (var i in o)
		                r.push("\"" + i + "\":" + $.objToJSONString(o[i]));
		            if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
		                r.push("toString:" + o.toString.toString());
		            }
		            r = "{" + r.join() + "}"
		        } else {
		            for (var i = 0; i < o.length; i++)
		                r.push($.objToJSONString(o[i]))
		            r = "[" + r.join() + "]";
		        }
		        return r;
		    }
		    return o.toString().replace(/\"\:/g, '":""');
	},
})
