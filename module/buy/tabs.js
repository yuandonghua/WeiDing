
/**
 * tabs 实现订单分类 tab。通过设置当前activity.  tabs.set("nav",);
 */
var tabs=function(){
    function tag(name,elem){
        return (elem||document).getElementsByTagName(name);
    }
    //获得相应ID的元素
    function id(name){
        return document.getElementById(name);
    }

    return {
        set:function(elemId){
            var elem=tag("li",id(elemId));
            var listNum=elem.length;
            for(var i=0;i<listNum;i++){
                    elem[i].onclick=(function(i){
                        return function(){
                            for(var j=0;j<listNum;j++){
                                if(i==j){
                                    elem[j].className="active";
                                }
                                else{
                                    elem[j].className="";
                                }
                            }
                        }
                    })(i)
            }
        }
    }
}();