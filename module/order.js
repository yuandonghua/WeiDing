


var oShareStateList =  document.getElementById('item1'),
    tmp = [
                        /*'    <div class="mui-card">',*/
                        '        <div class="mui-card-header mui-card-media">',
                        '            <div class="mui-media-body">',
                        '                <label class="lable-title">定单号：{origOrder}</label>',
                        '                <label class="lable-state">{order.stateShow}</label>',
                        '            </div>',
                        '        </div>',
                        '        <div class="mui-card-content">',
                        '            <ul class="mui-table-view">',
                        '                <li class="mui-table-view-cell mui-media">',
                        '                    <a href="javascript:;">',
                        '                        <img class="mui-pull-left" id="order-picture" src="http:/st.dressbook.cn/{wdGoodsSet.pic}">',
                        '                        <div class="mui-media-body" id="order-desc">',
                        '                            <h4 class="mui-ellipsis" style="line-height:1.5">{wdGoodsSet.title}</h4>',
                        '                            <p class="mui-ellipsis" style="line-height:2">{wdGoodsSet.descr}</p>',
                        '                            <p class="mui-ellipsis" style="line-height:2">{wdGoodsSet.descr}</p>',
                        '                        </div>',
                        '                    </a>',
                        '                </li>',
                        '            </ul>',
                        '       </div>',
                        '        <div class="mui-card-footer">',
                        '            <button type="button" class="mui-btn mui-btn-outlined">取消定单</button>',
                        '            <button type="button" class="mui-btn mui-btn-outlined mui-btn-danger">&nbsp;&nbsp;付&nbsp;款&nbsp;&nbsp;</button>',
                        '        </div>'
            ].join('');

function fetchData(){

    //异步获取数据

  //http://ifc.dressbook.cn/wdOrdersGet.json?user_id=1095550
    let dbkUrl = "http://ifc.dressbook.cn";

    $.ajax({
        url: dbkUrl + "/wdOrdersGet.jsonp",
        data: "user_id="+user.user_id,
        type: "GET",
        async: true,
        dataType: 'JSONP',
        success: function (data) {
            console.log(JSON.stringify(data));
            if (data.code == 1) {
                renderAll( data.info.buyOrders );
            }     
        }
    });
    

}

function renderAll( datas ){
    var data;
    while( data = datas.shift() ){
        render( data );
    }
}    

function render( data ){

    var _dom = document.createElement( 'div' );
    _dom.setAttribute( 'class', "mui-card" );
    _dom.innerHTML = tmp.replace( /(\{.+?\})/g, function($1){
        var layer = $1.slice( 1, $1.length-1 ).split('.');
        if(layer.length==1)
            return data[ layer[0] ];
        if(layer.length==2)
            return data[ layer[0] ][ layer[1] ];
        
    } );
    document.getElementById('cards-all').appendChild( _dom );
    //
    if( data.order.stateShow == "待付款")
        document.getElementById('cards-topay').appendChild( _dom );

    if( data.order.stateShow == "待发货")
        document.getElementById('cards-toship').appendChild( _dom );

    if( data.order.stateShow == "待收货")
        document.getElementById('cards-shipping').appendChild( _dom );

}