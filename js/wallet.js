mui.init();
//初始化单页view
var viewApi = mui('#app').view({
	defaultPage: '#wallet'
});
//初始化单页的区域滚动
mui('.mui-scroll-wrapper').scroll();

var view = viewApi.view;
(function($) {
	//处理view的后退与webview后退
	var oldBack = $.back;
	$.back = function() {
		if(viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			oldBack();
		}
	};
	//监听页面切换事件方案1,通过view元素监听所有页面切换事件，目前提供pageBeforeShow|pageShow|pageBeforeBack|pageBack四种事件(before事件为动画开始前触发)
	//第一个参数为事件名称，第二个参数为事件回调，其中e.detail.page为当前页面的html对象
	view.addEventListener('pageBeforeShow', function(e) {
		//				console.log(e.detail.page.id + ' beforeShow');
	});
	view.addEventListener('pageShow', function(e) {
		//				console.log(e.detail.page.id + ' show');
	});
	view.addEventListener('pageBeforeBack', function(e) {
		//				console.log(e.detail.page.id + ' beforeBack');
	});
	view.addEventListener('pageBack', function(e) {
		//				console.log(e.detail.page.id + ' back');
	});

})(mui);

tmp = [
	'			<li class="mui-table-view-cell">',
	'				<a id="tel" class="mui-navigate-right"><span class="mui-pull-right">{addTimeShow}</span> {vary}</a>',
	'			</li>'
].join('');

function renderAll(datas) {
	if(!datas) return;
	datas.forEach(function(e) {
		render(e);
	});
	// while( data = datas.shift() ){
	//     render( data );
	// }
}

function render(data) {

	var _dom = document.createElement('div');
	_dom.setAttribute('class', "mui-card");
	_dom.innerHTML = tmp.replace(/(\{.+?\})/g, function($1) {
		var layer = $1.slice(1, $1.length - 1).split('.');
		if(layer.length == 1)
			return data[layer[0]];
		if(layer.length == 2)
			return data[layer[0]][layer[1]];

	});
	document.getElementById('detail-table-view').appendChild(_dom);
}

function updateUI() {

	var dbkUrl = "http://ifc.dressbook.cn";

	//更新资产信息
	$.ajax({
		url: dbkUrl + "/wdUsersWealthGet.jsonp",
		data: "user_id=" + user.user_id,
		type: "GET",
		async: true,
		dataType: 'JSONP',
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.code == 1) {
				document.getElementById("cashSubtract").innerText = data.info.cashSubtract.total + "￥";
				document.getElementById("moneyExt").innerText = data.info.moneyExt.total + "￥";
				document.getElementById("costSubtract").innerText = data.info.costSubtract.total + "￥";
				document.getElementById("saleExpect").innerText = data.info.saleExpect.total + "￥";

				document.getElementById("saleIncome").innerText = data.info.saleIncome.total + "￥";
				document.getElementById("myWealth").innerText = data.info.myWealth.total + "￥";
				
				var cells = ["cashSubtract", "moneyExt", "costSubtract", "saleExpect", "saleIncome", "myWealth"];
				var cell;
				while(cell = cells.shift()) {
				
					function index(){
						return cell;
					};
					//cell_dom.setAttribute("href","#detail");
					document.getElementById("cell-" + cell).addEventListener('tap', function() {
						var d = data.info[index];

						//remove children
						var node = document.getElementById('detail-table-view');
						while(node.hasChildNodes()) {
							node.removeChild(node.lastChild);
						}

						if(d.infos) {
							renderAll(d.infos);
						}
					});
				}

			}
		}
	});

}