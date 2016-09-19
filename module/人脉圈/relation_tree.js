
var relation_count;

function walk(nodes, data) {
    if (!nodes) { return; }
    $.each(nodes, function (id, node) {
        if (node.user) {
            //father
            var obj = {
                id: id,
                text: node.user.wxOpenid,
                headimage: node.user.avatar,
                tags: [node.friends.length > 0 ? node.friends.length : '']
            };
            relation_count++;
            if (node.friends.length > 0) {
                obj.nodes = [];
                walk(node.friends, obj.nodes);
            }
            data.push(obj);
        }
        else {
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
    let dbkUrl = "http://ifc.dressbook.cn";

    $.ajax({
        url: dbkUrl + "/wdUsersFriendShipGet.jsonp",
        data: "user_id="+user.user_id,
        type: "GET",
        async: true,
        dataType: 'JSONP',
        success: function (data) {
            console.log(JSON.stringify(data));
            if (data.code == 1) {

                relation_count = 0;
                var circle = [];
                walk(data.info.friends, circle);

                var defaultData = [
                    {
                        id: "root",
                        text: "总人脉",
                        headimage: "",
                        tags: [relation_count],
                        nodes: circle
                    },
                ];


                $('#treeview6').treeview({
                    color: "#4F4F4F",
                    //expandIcon: "glyphicon glyphicon-stop",
                    //collapseIcon: "glyphicon glyphicon-unchecked",
                    showTags: true,
                    data: defaultData
                });

                $('#treeview6').treeview('expandAll', { levels: 3, silent: true });

            }
        }
    });
}
