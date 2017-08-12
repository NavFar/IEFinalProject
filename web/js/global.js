function getQuerys(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
////////////////////////////////////////////////////////////////////////////////
function searchfunc(){
  var query=document.getElementById("search").value;
   (query);
  var temp=window.location.href.lastIndexOf("/");
  var url=window.location.href.substr(0,temp)+"/game_list?q="+query;
  window.location.href=url;
}
////////////////////////////////////////////////////////////////////////////////
function changeNumberLang(){
  persian={0:'۰',1:'۱',2:'۲',3:'۳',4:'۴',5:'۵',6:'۶',7:'۷',8:'۸',9:'۹'};
function traverse(el){
    if(el.nodeType==3){
        var list=el.data.match(/[0-9]/g);
        if(list!=null && list.length!=0){
            for(var i=0;i<list.length;i++)
                el.data=el.data.replace(list[i],persian[list[i]]);
        }
    }
    for(var i=0;i<el.childNodes.length;i++){
        traverse(el.childNodes[i]);
    }
}
}
