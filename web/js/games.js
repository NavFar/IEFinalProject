//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var currentTab=0;
var loaded=[0,0,0,0,0];
var commentsNum=0;
var offset=0;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
 $(window).scrollTop()
 loadBanner();
 getTab();
 loadModal()
 changeNumberLang();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function changeTab(e)
{
  var currentClasses=document.getElementById("t"+currentTab).className;
  var res=currentClasses.search("markedTab");
    if(res!=-1)
  currentClasses=currentClasses.substr(0,res)+currentClasses.substr(res+9);
  document.getElementById("t"+currentTab).className=currentClasses;
  if(document.getElementById("c"+currentTab).className.search("hidden")==-1)
  document.getElementById("c"+currentTab).className=document.getElementById("c"+currentTab).className+" hidden";
  currentTab=e.id.substr(1);
  var currentClasses=document.getElementById("c"+currentTab).className;
  var res=currentClasses.search("hidden");
    if(res!=-1)
  currentClasses=currentClasses.substr(0,res)+currentClasses.substr(res+6);
  console.log(currentClasses);
  document.getElementById("c"+currentTab).className=currentClasses;
  document.getElementById("t"+currentTab).className=document.getElementById("t"+currentTab).className+" markedTab";
  loadTabContent(currentTab);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getTab()
{
  var tabId="t0";
  if(window.location.href.indexOf("#t")!=-1)
  tabId=window.location.href.substr(window.location.href.indexOf("#t")+1,window.location.href.indexOf("#t")+2);
  $("#"+tabId).trigger("click");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadBanner()
{
  var bannerContainer= document.getElementsByClassName("bannerContainer")[0];
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function() {
  if (this.readyState == 4 && this.status == 200) {
    var responseJson=JSON.parse(this.responseText).response;
    if(responseJson.ok)
    {
    document.getElementsByClassName("banner")[0].style.background="linear-gradient(to bottom,rgba(0, 0, 0,0.65), rgba(0, 0, 0, 0.65)),url("+ responseJson.result.game.large_image +")"
    var button=document.createElement("button");
    button.setAttribute("type","button");
    button.className="btn btn-primary lfloat";
    button.setAttribute("id","startGame");
    button.addEventListener("click",function(){
      if(responseJson.result.game.title!="minesweeper")
      {
        alert("Game is no playable????");
        return;
      }
      location.href='play/'+responseJson.result.game.title;
    });
    var node=document.createTextNode("شروع بازی");
    button.appendChild(node);
    bannerContainer.appendChild(button);
    var bannerData=document.createElement("div");
    bannerData.className="bannerData rfloat";
    var bannerImage=document.createElement("div");
    bannerImage.className="bannerImage rfloat";
    bannerImage.style.background="url("+ responseJson.result.game.small_image +")";
    bannerData.appendChild(bannerImage);
    var bannerContent=document.createElement("div");
    bannerContent.className="rfloat bannerContent";
    var bannerTitle=document.createElement("div");
    bannerTitle.className="bannerTitle";
    var node=document.createTextNode(responseJson.result.game.title);
    bannerTitle.appendChild(node);
    console.log(responseJson.result.game.title);
    bannerContent.appendChild(bannerTitle);
    var bannerCateg=document.createElement("div");
    bannerCateg.className="bannerCateg";
    var i=0;
    var text="";
    for(;i<responseJson.result.game.categories.length;i++)
    {
      text+= responseJson.result.game.categories[i]+",";
    }
    var node=document.createTextNode(text);
    bannerCateg.appendChild(node);
    bannerContent.appendChild(bannerCateg);
    var bannerRating=document.createElement("div");
    bannerRating.className="bannerRating rfloat";
    var bannerStar=document.createElement("i");
    var node=document.createTextNode("("+ responseJson.result.game.number_of_comments+") "+responseJson.result.game.rate +"  ");
    commentsNum=responseJson.result.game.number_of_comments;
    bannerStar.appendChild(node);
    for(i=5;i>0;i--)
    {
      var star=document.createElement("i");
      star.className="mdi mdi-star"
      if(i<=responseJson.result.game.rate)
      star.className+=" blue";
      bannerStar.appendChild(star);
    }
    bannerRating.appendChild(bannerStar);
    bannerContent.appendChild(bannerRating);
    bannerData.appendChild(bannerContent);
    bannerContainer.appendChild(bannerData);
  }
  }
};
  var url = "http://localhost:8000/games/"+ getQuerys("game") +"/header.json?dummy="+Math.random();
  xhttp.open("GET",url, true);
xhttp.send();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadTabContent(currentTab){
  if(loaded[currentTab]==1)
    return;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange=function() {
    if (this.readyState == 4 && this.status == 200) {
      var responseJson=JSON.parse(this.responseText).response;
      // console.log(responseJson);
      if(responseJson.ok)
      {
        while (document.getElementById("ci"+currentTab).hasChildNodes()) {
          document.getElementById("ci"+currentTab).removeChild(document.getElementById("ci"+currentTab).lastChild);
            }
        if(currentTab==0)
        {
          var tab=document.getElementById("ci"+currentTab);
        tab.innerHTML=responseJson.result.game.info;
        }
        else if(currentTab==1){

          var tab=document.getElementById("ci"+currentTab);
          var topThreeContainer = document.createElement("div");
          topThreeContainer.className="topThreeContainer";


          var leaderFirst=document.createElement("div");
          leaderFirst.className="leaderFirst rfloat";
          var avatar= document.createElement("div");
          avatar.className="topThreeAvatar gold"
          avatar.style.background="url("+ responseJson.result.leaderboard[0].player.avatar +")"
          var name=document.createElement("div");
          name.className="topThreeName";
          name.innerHTML=responseJson.result.leaderboard[0].player.name;
          var score = document.createElement("div")
          score.className="topThreeScore";
          score.innerHTML=responseJson.result.leaderboard[0].score;

          leaderFirst.appendChild(avatar);
          leaderFirst.appendChild(name);
          leaderFirst.appendChild(score);
          var leaderSecond=document.createElement("div");
          leaderSecond.className="leaderSecond rfloat";
          var avatar= document.createElement("div");
          avatar.className="topThreeAvatar silver"
          avatar.style.background="url("+ responseJson.result.leaderboard[1].player.avatar +")"
          var name=document.createElement("div");
          name.className="topThreeName";
          name.innerHTML=responseJson.result.leaderboard[1].player.name;
          var score = document.createElement("div")
          score.className="topThreeScore";
          score.innerHTML=responseJson.result.leaderboard[1].score;
          leaderSecond.appendChild(avatar);
          leaderSecond.appendChild(name);
          leaderSecond.appendChild(score);


          var leaderThird=document.createElement("div");
          leaderThird.className="leaderThird rfloat";
          var avatar= document.createElement("div");
          avatar.className="topThreeAvatar bronze"
          avatar.style.background="url("+ responseJson.result.leaderboard[2].player.avatar +")"
          var name=document.createElement("div");
          name.className="topThreeName";
          name.innerHTML=responseJson.result.leaderboard[2].player.name;
          var score = document.createElement("div")
          score.className="topThreeScore";
          score.innerHTML=responseJson.result.leaderboard[2].score;
          leaderThird.appendChild(avatar);
          leaderThird.appendChild(name);
          leaderThird.appendChild(score);




          topThreeContainer.appendChild(leaderThird);
          topThreeContainer.appendChild(leaderFirst);
          topThreeContainer.appendChild(leaderSecond);

          tab.appendChild(topThreeContainer);
          var leaderHeader= document.createElement("div");
          leaderHeader.className=" leaderHeader rfloat";
          var rate=document.createElement("div");
          rate.className="rate rfloat";
          rate.innerHTML="رتبه";
          leaderHeader.appendChild(rate);

          var player=document.createElement("div");
          player.className="player rfloat";
          player.innerHTML="بازیکن";
          leaderHeader.appendChild(player);

          var level=document.createElement("div");
          level.className="level rfloat";
          level.innerHTML="سطح";
          leaderHeader.appendChild(level);

          var change=document.createElement("div");
          change.className="change rfloat";
          change.innerHTML="تغیر رتبه";
          leaderHeader.appendChild(change);

          var score=document.createElement("div");
          score.className="score rfloat";
          score.innerHTML="امتیاز";
          leaderHeader.appendChild(score);
          tab.appendChild(leaderHeader);
          var i=0;
          for(;i<responseJson.result.leaderboard.length;i++)
          {

            var row= document.createElement("div");
            row.className=" leaderRow rfloat";
            if(i%2==0)
            row.className+=" commentDark";
            var rate=document.createElement("div");
            rate.className="rate rfloat leader Gray";
            rate.innerHTML=i+1;
            row.appendChild(rate);

            var player=document.createElement("div");
            player.className="player rfloat blue";
            var avatar=document.createElement("div");
            avatar.className="leaderRowAvatar rfloat";
            avatar.style.background="url("+ responseJson.result.leaderboard[i].player.avatar +")"
            player.appendChild(avatar);
            var node =document.createTextNode(responseJson.result.leaderboard[i].player.name)
            player.appendChild(node);
            row.appendChild(player);

            var level=document.createElement("div");
            level.className="level rfloat leaderGreen";
            level.innerHTML=responseJson.result.leaderboard[i].level;
            row.appendChild(level);

            var change=document.createElement("div");
            change.className="change rfloat leader leaderLightGray";
            change.innerHTML=responseJson.result.leaderboard[i].displacement;
            row.appendChild(change);

            var score=document.createElement("div");
            score.className="score rfloat leaderGreen";
            score.innerHTML=responseJson.result.leaderboard[i].score;
            row.appendChild(score);
            tab.appendChild(row);
          }

        }else if(currentTab==2){
          {
            var commentPlace=document.getElementById("ci"+currentTab);
            while (commentPlace.hasChildNodes()) {
                  commentPlace.removeChild(commentPlace.lastChild);
                                          }

            var i=0;
            document.getElementById("comNum").innerHTML=commentsNum;
            // var title=document.createElement("h1");
            // title.innerHTML="نظرات کاربران"+"<h3 class='inline'>"+commentsNum+"نظر"+"</h3>";
            // var line=document.createElement("hr");
            // commentPlace.appendChild(title);
            // commentPlace.appendChild(line);
            for(;i<responseJson.result.comments.length;i++)
            {
              var commentRow=document.createElement("div");
              commentRow.className="commentRow";
              if(i%2==0)
              commentRow.className+=" commentDark";
              var commentAvatar=document.createElement("div");
              commentAvatar.className="commentAvatar rfloat";

              commentAvatar.style.background="url("+responseJson.result.comments[i].player.avatar+")";
              commentRow.appendChild(commentAvatar);
              var commentStars=document.createElement("div");
              commentStars.className="commentStars lfloat";
              var j=0
              for(;j<5;j++)
              {
                var star=document.createElement("i")
                star.className="mdi mdi-star stars";
                if(j<responseJson.result.comments[i].rate)
                star.className+=" blue";
                commentStars.appendChild(star);
              }
              commentRow.appendChild(commentStars);
              var commentDate=document.createElement("div");
              commentDate.className="commentDate ";
              var node=document.createTextNode(responseJson.result.comments[i].date);
              commentDate.appendChild(node);
              commentRow.appendChild(commentDate);

              var commentContent=document.createElement("div");
              commentContent.className="commentContent ";
              var node=document.createTextNode(responseJson.result.comments[i].player.name+" : "+responseJson.result.comments[i].text);
              commentContent.appendChild(node);
              commentRow.appendChild(commentContent);
              commentPlace.appendChild(commentRow);
            }
            offset+=responseJson.result.comments.length;
            if(offset<commentsNum)
            {
            var loadMore=document.createElement("button")
            loadMore.setAttribute("id","loadMore")
            var node=document.createTextNode("بار گزاری نظرات بعدی");
            loadMore.appendChild(node);
            loadMore.addEventListener("click",function(){
              loaded[currentTab]=0;
              loadTabContent(currentTab);
            })
            commentPlace.appendChild(loadMore);
          }
          }
        }else if(currentTab==3){
          var gameResultPlace=document.getElementById("ci3");
          var i=0;
          for(;i<responseJson.result.games.length;i++)
          {
            var row;
            if(i%4==0)
            {
              row=document.createElement("div");
              row.className="resultRow";
            }
            if(i%4==3)
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
              text+=responseJson.result.games[i].categories[j]+", "
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
            if(i%4==3)
            {
              gameResultPlace.appendChild(row);
            }
          }
          if(i-1%4!=3)
          {
            gameResultPlace.appendChild(row);
          }

        }else if(currentTab==4){

        }
      }
    }
  };
  if(currentTab==0)
  var url = "http://localhost:8000/games/"+ getQuerys("game") +"/info.json?dummy="+Math.random();
  if(currentTab==1)
  var url = "http://localhost:8000/games/"+ getQuerys("game") +"/leaderboard.json?dummy="+Math.random();
  if(currentTab==2)
  var url = "http://localhost:8000/games/"+ getQuerys("game") +"/comments.json?offset="+ offset +"dummy="+Math.random();
  if(currentTab==3)
  var url = "http://localhost:8000/games/"+ getQuerys("game") +"/related_games.json?dummy="+Math.random();
  if(currentTab==4)
  var url = "http://localhost:8000/games/"+ getQuerys("game") +"/info.json?dummy="+Math.random();

  xhttp.open("GET",url, true);
  xhttp.send();
  var temp =document.getElementById("ci"+currentTab);
  temp.innerHTML='<div class="loader" ></div>'
  loaded[currentTab]=1
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadModal(){
var modal = document.getElementById('myModal');
// Get the button that opens the modal
var btn = document.getElementById("commentSave");
console.log(modal);
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
document.getElementById("saveComment").onclick = function() {
    var comment = document.getElementById("commentText").value;
    var rate=document.getElementById("rate").value;
    var game=getQuerys("game");
    $.ajax({
        type:"POST",
        data:{'comment':comment,
              'rate':rate},
        url:"/comment/"+game,
        success:function(data){
          if(data.log==false)
          {
            window.location.href="/login";
          }
          if(data.response==true){
            alert("نظر شما ثبت شد");
          }
          else{
            alert("به دلیل برخی خطاها نظر شما ثبت نشد");
          }
        }
    });
    console.log(rate);

    modal.style.display = "none";
}
var textarea=document.getElementById("commentText");
textarea.value="";

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
