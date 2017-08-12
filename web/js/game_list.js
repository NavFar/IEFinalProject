////////////////////////////////////////////////////////////////////////////////
var filters={
rates:[],
categories:[]
}
var reqProc=false;
var offset=0;
////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
  addCategories();
  doFirstSearch();
});
////////////////////////////////////////////////////////////////////////////////

function changeCateg(event){

  var e=event;
  if(reqProc)
    return;
  var temp=document.getElementById(e.target.id);
  var changedCateg=filters.categories.indexOf(temp.innerHTML);
  if(changedCateg==-1)
{
  document.getElementById(e.target.id).className+=" categorySelected"
  filters.categories.push(temp.innerHTML);
}  else
{
  filters.categories.splice(changedCateg,1);
  var res=document.getElementById(e.target.id).className.search("categorySelected");
  document.getElementById(e.target.id).className=document.getElementById(e.target.id).className.substr(0,res)+document.getElementById(e.target.id).className.substr(res+16);
}
if(document.getElementById(e.target.id).className.search("categoryOption")==-1);
    document.getElementById(e.target.id).className+=" categoryOption";
 // (filters);
 offset=0;
getGameBasedOnSpec();
}
////////////////////////////////////////////////////////////////////////////////
function changeRate(e)
{
  if(reqProc)
    return;
  var number= e.id.substr(3);
  var changedRate = filters.rates.indexOf(number);
  if(changedRate==-1)
{

  document.getElementById(e.id).className+=" categorySelected"
  filters.rates.push(number);
}  else
{
  filters.rates.splice(changedRate,1);
  var res=document.getElementById(e.id).className.search("categorySelected");
  document.getElementById(e.id).className=document.getElementById(e.id).className.substr(0,res)+document.getElementById(e.id).className.substr(res+16);
}
offset=0;
getGameBasedOnSpec();
}
////////////////////////////////////////////////////////////////////////////////
function getGameBasedOnSpec()
{
  reqProc=true;
//   var reqQuery=JSON.stringify(filters);
//   var xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange=function() {
//     console.log(this.responseText);
//   if (this.readyState == 4 && this.status == 200) {
//     reqProc=false;
//
//   }
// };
// var url = "http://api.ie.ce-it.ir/F95/games_list.json?dummy="+Math.random()+"&offset="+offset;
// xhttp.open("POST",url, true);
// console.log('{"filters"'+':'+reqQuery+'}');
// xhttp.send('{"filters"'+':'+reqQuery+'}');
if(filters.categories.length==0 && filters.rates.length==0)
{
  var gameResultPlace=document.getElementById("gameResultPlace");
  while (gameResultPlace.hasChildNodes())
  {
    gameResultPlace.removeChild(gameResultPlace.lastChild);
  }
  reqProc=false;
  return;
}
 $.ajax({
  type: "POST",
  url: "http://localhost:8000/games_list.json?dummy="+Math.random()+"&offset="+offset,
  data: {"filters" : JSON.stringify(filters)},
  cache: false,
  success: function(result){
    reqProc=false;
    var responseJson=result.response;
        if(responseJson.ok)
        {
          // console.log(responseJson.result.games_list);

          var gameResultPlace=document.getElementById("gameResultPlace");
          while (gameResultPlace.hasChildNodes())
          {
            gameResultPlace.removeChild(gameResultPlace.lastChild);
          }
          var i=0;
          for(;i<responseJson.result.games_list.games.length;i++)
          {
            var row;
            if(i%3==0)
            {
              row=document.createElement("div");
              row.className="resultRow";
            }
            if(i%3==2)
            {
              gameResultPlace.appendChild(row);
            }

            var resultGame=document.createElement("a");
            resultGame.className="resultGame block noUnderLine";
            resultGame.setAttribute("href","./games?game="+responseJson.result.games_list.games[i].title);
            var resultGameImage =document.createElement("div");
            resultGameImage.className="resultGameImage";
            resultGameImage.style.background="url("+responseJson.result.games_list.games[i].small_image+")";
            resultGame.appendChild(resultGameImage);
            var resultGameTitle=document.createElement("div");
            resultGameTitle.className="resultGameTitle blue";
            var node=document.createTextNode(responseJson.result.games_list.games[i].title);
            resultGameTitle.appendChild(node);
            resultGame.appendChild(resultGameTitle);
            var resultGameCate=document.createElement("div");
            resultGameCate.className="resultGameCate";
            var j=0;
            var text="";
            for(;j<responseJson.result.games_list.games[i].categories.length;j++){
              text+=responseJson.result.games_list.games[i].categories[j]+" "
            }
            var node=document.createTextNode(text);
            resultGameCate.appendChild(node);
            resultGame.appendChild(resultGameCate);
            var resultGameStars=document.createElement("div");
            resultGameStars.className="resultGameStars";
            var k=0;
            for(;k<5;k++)
            {
              var star=document.createElement("i")
              star.className="mdi mdi-star stars";
              if(k+1<=responseJson.result.games_list.games[i].rate)
              star.className+=" blue ";
              resultGameStars.appendChild(star);
            }
            resultGame.appendChild(resultGameStars);
            row.appendChild(resultGame);
            if(i%3==2)
            {
              gameResultPlace.appendChild(row);
            }
          }
          if(i-1%3!=2 && responseJson.result.games_list.games.length>0)
          {
            gameResultPlace.appendChild(row);
          }
          offset+=responseJson.result.games_list.games.length;
          if(responseJson.result.games_list.count>offset)
          {
            var button= document.createElement("button");
            button.setAttribute("id","loadMore");
            var node= document.createTextNode("بارگذاری بیشتر")
            button.appendChild(node);
            button.addEventListener("click",getGameBasedOnSpec);
            gameResultPlace.appendChild(button);

          }
        }
  }
});
}
////////////////////////////////////////////////////////////////////////////////
function addCategories()
{
  var catCont = document.getElementById("CategoryContainer");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function() {
  if (this.readyState == 4 && this.status == 200) {
    var responseJson=JSON.parse(this.responseText).response;
    if(responseJson.ok)
    {
      var div = document.createElement("div");
      div.className="categoryOption";
      div.id="cat0";
      var node = document.createTextNode("همه");
        div.appendChild(node);
      div.addEventListener("click", changeCateg);
      catCont.appendChild(div);
      var i=0;
      for(;i<responseJson.result.categories.length;i++)
      {
        var div = document.createElement("div");
        div.className="categoryOption";
        div.id="cat"+(i+1);
        var node = document.createTextNode(responseJson.result.categories[i]);
          div.appendChild(node);
        div.addEventListener("click", changeCateg);
        catCont.appendChild(div);
      }
    }

  }
};
var url = "http://localhost:8000/categories.json?dummy="+Math.random()+"&offset=3";
xhttp.open("get",url, true);
xhttp.send();
}
////////////////////////////////////////////////////////////////////////////////
function doFirstSearch(){
  if(!getQuerys("q")||getQuerys("q")=="")
  {
    changeTitle("");
    return;
  }
  var searchField=getQuerys("q");
  changeTitle(searchField);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function() {
  if (this.readyState == 4 && this.status == 200) {
    var responseJson=JSON.parse(this.responseText).response;

    if(responseJson.ok)
    {

      var gameResultPlace=document.getElementById("gameResultPlace");
      var i=0;
      for(;i<responseJson.result.games.length;i++)
      {
        var row;
        if(i%3==0)
        {
          row=document.createElement("div");
          row.className="resultRow";
        }
        if(i%3==2)
        {
          gameResultPlace.appendChild(row);
        }
        var resultGame=document.createElement("a");
        resultGame.className="resultGame block noUnderLine";
        resultGame.setAttribute("href","./games?game="+responseJson.result.games[i].title);
        var resultGameImage =document.createElement("div");
        resultGameImage.className="resultGameImage";
        resultGameImage.style.background="url("+responseJson.result.games[i].small_image+")";
        resultGame.appendChild(resultGameImage);
        var resultGameTitle=document.createElement("div");
        resultGameTitle.className="resultGameTitle blue";
        var node=document.createTextNode(responseJson.result.games[i].title);
        resultGameTitle.appendChild(node);
        resultGame.appendChild(resultGameTitle);
        var resultGameCate=document.createElement("div");
        resultGameCate.className="resultGameCate";
        var j=0;
        var text="";
        for(;j<responseJson.result.games[i].categories.length;j++){
          text+=responseJson.result.games[i].categories[j]+" "
        }
        var node=document.createTextNode(text);
        resultGameCate.appendChild(node);
        resultGame.appendChild(resultGameCate);
        var resultGameStars=document.createElement("div");
        resultGameStars.className="resultGameStars";
        var k=0;
        for(;k<5;k++)
        {
          var star=document.createElement("i")
          star.className="mdi mdi-star stars";
          if(k+1<=responseJson.result.games[i].rate)
          star.className+=" blue ";
          resultGameStars.appendChild(star);
        }
        resultGame.appendChild(resultGameStars);
        row.appendChild(resultGame);
        if(i%3==2)
        {
          gameResultPlace.appendChild(row);
        }
      }
      if(i-1%3!=2)
      {
        gameResultPlace.appendChild(row);
      }
    }
    }
  };
  var url = "http://localhost:8000/game_list.json?dummy="+Math.random()+"&q="+searchField;
  xhttp.open("GET",url, true);
  xhttp.send();
}
function changeTitle(title){
  var searchTitle=document.getElementById("searchTitle");
    if(title=="")
    {
      searchTitle.style.display="none";
    }
    else {
      searchTitle.innerHTML=title;
    }
}
