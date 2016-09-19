var relation_count;

function walk(nodes, data) {
	if(!nodes) {
		return;
	}
	$.each(nodes, function(id, node) {
		if(node.user) {
			var obj;
			if(node.friends != null && node.friends.length > 0) {
				//father
				obj = {
					id: id,
					text: node.user.wxOpenid,
					headimage: node.user.avatar,
					tags: [node.friends.length]
				};
			} else {
				//father
				obj = {
					id: id,
					text: node.user.wxOpenid,
					headimage: node.user.avatar,
					tags: ['']
				};
			}

			relation_count++;
			if(node.friends != null && node.friends.length > 0) {
				obj.nodes = [];
				walk(node.friends, obj.nodes);
			}
			data.push(obj);
		} else {
			//the last children
			var obj = {
				id: id,
				text: node.wxOpenid,
				headimage: node.avatar
			};
			relation_count++;
			obj.nodes = [];
			data.push(obj);
		}

	});
}

function loadLifeCircle() {

	//http://ifc.dressbook.cn/wdOrdersGet.json?user_id=1095550
	var dbkUrl = "http://ifc.dressbook.cn";
	mui.toast('开始加载朋友圈');
	$.ajax({
		url: dbkUrl + "/wdUsersFriendShipGet.jsonp",
		data: "user_id=" + user.user_id,//		data: "user_id=" + 1095563,//陈总id
		type: "GET",
		async: true,
		dataType: 'JSONP',
		success: function(data) {

			if(data.code == 1) {

				relation_count = 0;
				var circle = [];
				walk(data.info.friends, circle);

				var defaultData = [{
					id: "root",
					text: "总人脉",
					headimage: "",
					tags: [relation_count],
					nodes: circle
				}, ];

				$('#treeview6').treeview({
					color: "#4F4F4F",
					//expandIcon: "glyphicon glyphicon-stop",
					//collapseIcon: "glyphicon glyphicon-unchecked",
					showTags: true,
					data: defaultData
				});

				$('#treeview6').treeview('expandAll', {
					levels: 3,
					silent: true
				});

			}
		}
	});
}