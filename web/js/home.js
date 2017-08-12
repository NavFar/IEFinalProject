////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var loaded=false;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$(document).ready(function(){
getData();
window.addEventListener("click",function(e){
      console.log("ATTT");
      console.log(e.target)
    });
var owl = $('#firstOwl');
owl.owlCarousel({
    loop:true,
    // nav:true,
    autoplay:true,
    autoplayTimeout:5000,
    callbacks:true,
     dotsContainer: '#carousel-custom-dots',
     margin:220,
     responsive:{
         0:{
             items:4
         },
         600:{
             items:4
         },
         960:{
             items:4
         },
         1200:{
               items:8
           }
     }
   });
owl.on('changed.owl.carousel',function(e){
// console.log(+e.item.index);
copyAll(document.getElementsByClassName("changer")[e.item.index%e.item.count])
});
owl.on('translate.owl.carousel',function(e){
// console.log(+e.item.index);
document.getElementsByClassName("changer")[e.item.index%e.item.count].className+=" current";
console.log(e.item.index);
});
$(".item.changer").on("click",function(e)
{
  // console.log(carousel.relative($(this).index()));
  // $('#firstOwl').trigger("to.owl.carousel",$(this).index());
  console.log("hello");
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function copyAll(loc){
  var poster=document.getElementsByClassName("poster")[0];
  var changer_style=loc.currentStyle||window.getComputedStyle(loc, false);
  var poster_style=poster.currentStyle||window.getComputedStyle(poster, false);
  loc.style.visibility="invisible";
  poster.style.backgroundImage="linear-gradient(to bottom,rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)),"+changer_style.backgroundImage;
  var goGame=document.getElementById("goGame");
  var button=loc.getElementsByClassName("btn")[0];
  goGame.temp=button.getAttribute("href");
  var trailer= document.getElementById("trailer");
  trailer.temp=button.getAttribute("href");

  goGame.addEventListener("click",function(){
    if(this.temp)
  window.location.href=this.temp;
});
trailer.addEventListener("click",function(){
  if(this.temp)
  window.location.href=this.temp+"#t4";
})

var tit = document.getElementById("tit");
 var gameName=loc.getElementsByClassName("gameName")[0];
 tit.innerHTML=gameName.innerHTML;

var desc = document.getElementById("desc");
var display = loc.getElementsByClassName("noDisplay")[0];
var temp =display.innerHTML.substr(0,200)+" ..."
desc.innerHTML=temp;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var owl = $('#secondOwl');
owl.owlCarousel({
    loop:true,
    // nav:true,
     dotsContainer: '#carousel-custom-dots',
    //  margin:-224,
    // width:1500,
    responsive:{
        0:{
            items:4
        },
        600:{
            items:4
        },
        960:{
            items:4
        },
        1200:{
              items:4
          }
    }
});
$('.owl-dot').click(function () {
    owl.trigger('#firstOwl to.owl.carousel', [$(this).index(), 300]);
});
owl.on('mousewheel', '.owl-stage', function (e) {
    if (e.deltaY>0) {
        owl.trigger('next.owl');
    } else {
        owl.trigger('prev.owl');
    }
    e.preventDefault();
});


});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getData(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange=function() {
  if (this.readyState == 4 && this.status == 200) {
    var responseJson=JSON.parse(this.responseText).response;
    if(responseJson.ok)
    {
      loadComments(responseJson.result.homepage.comments);
      // loadTuts(responseJson.result.homepage.tutorials);
      loadFirstSlider(responseJson.result.homepage.slider);
      loadSecondSlider(responseJson.result.homepage.new_games);
    }
  }
}
  var url = "http://localhost:8000/home.json?dummy="+Math.random();
  xhttp.open("get",url, true);
  xhttp.send();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadComments(commentJson)
{
  var commentSection=document.getElementById("su");
  var i=0;
  for(;i<commentJson.length;i++)
  {
    var comment = document.createElement("div");
    comment.className="comment";
    var picture=document.createElement("div");
    picture.className="picture";
    picture.style.background="url("+commentJson[i].player.avatar+")";
    comment.appendChild(picture);
    var a=document.createElement("a");
    a.className="cont noUnderLine";
    a.setAttribute("href","../games.");
    a.setAttribute("href","../games?game="+commentJson[i].game.title+"#t2");
    var text=document.createTextNode(commentJson[i].text);
    a.appendChild(text);
    comment.appendChild(a);
    var date=document.createElement("div");
    date.className="date";
    var text=document.createTextNode(commentJson[i].date);
    date.appendChild(text);
    comment.appendChild(date);
    commentSection.appendChild(comment);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadTuts(tutJson)
{
  var tuturSection=document.getElementById("tu");
  var i=0;
  for(;i<tutJson.length;i++)
  {
    var tutur = document.createElement("div");
    tutur.className="tutur";
    var picture=document.createElement("div");
    picture.className="picture";
    picture.style.background="url("+tutJson[i].game.small_image+")";
    tutur.appendChild(picture);
    var a=document.createElement("a");
    a.className="cont noUnderLine";
    a.setAttribute("href","../games?game="+tutJson[i].game.title);

    var text=document.createTextNode(tutJson[i].title);
    a.appendChild(text);
    tutur.appendChild(a);
    var date=document.createElement("div");
    date.className="date";
    var text=document.createTextNode(tutJson[i].date);
    date.appendChild(text);
    tutur.appendChild(date);
    tuturSection.appendChild(tutur);
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadSecondSlider(newGameJson){
  var secondSlider = document.getElementById("secondOwl");
  var i=0;
  for(;i<newGameJson.length;i++)
  {
    var items = document.createElement("a")
    items.setAttribute("href","../games?game="+newGameJson[i].title);
    items.className="cusitems items block noUnderLine";
    var gameList=document.createElement("div");
    gameList.className="gameList";
    var gameListImage = document.createElement("div");
    gameListImage.className="gameListImage";
    gameListImage.style.background="url("+ newGameJson[i].small_image +")";
    gameList.appendChild(gameListImage);
    var gameListName=document.createElement("div");
    gameListName.className="gameListName blue";
    var node=document.createTextNode(newGameJson[i].title);
    gameListName.appendChild(node);
    gameList.appendChild(gameListName);
    var gameListType = document.createElement("div");
    gameListType.className="gameListType";
    var j=0;
    var text=""
    for(;j<newGameJson[i].categories.length;j++)
    {
      text+=newGameJson[i].categories[j]+" ";
    }
    var node=document.createTextNode("text");
    gameListType.appendChild(node);
    var gameListStar=document.createElement("div");
    gameListStar.className="gameListStar";
    j=5;
    for(;j>0;j--)
    {
      var star=document.createElement("i");
      star.className="mdi mdi-star";
      if(j<=newGameJson[i].rate)
      {
        star.className="mdi mdi-star blue";
      }
      gameListStar.appendChild(star);
    }
    gameList.appendChild(gameListStar);
    items.appendChild(gameList);
    $('#secondOwl').owlCarousel().trigger('add.owl.carousel', [jQuery(items)]);
    // secondSlider.appendChild(items);
  }
  $('#secondOwl').owlCarousel().trigger('refresh.owl.carousel');
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadFirstSlider(SliderJson)
{
  var firstOwl=document.getElementById("firstOwl");
  var i=0;
  for(;i<SliderJson.length;i++)
  {
  var item = document.createElement("div");
  item.className="item changer";
  item.style.background="url("+SliderJson[i].small_image+")";
  var inner = document.createElement("div");
  inner.className="inner";
  var gameName=document.createElement("div");
  gameName.className="gameName";
  var node = document.createTextNode(SliderJson[i].title);
  gameName.appendChild(node);
  inner.appendChild(gameName);
  var numComment= document.createElement("div");
  numComment.className="numComment";
  var node =document.createTextNode(SliderJson[i].number_of_comments);
  numComment.appendChild(node);
  inner.appendChild(numComment);
  var noDisplay=document.createElement("div");
  noDisplay.className="noDisplay";
  var node=document.createTextNode((SliderJson[i].abstract));
  noDisplay.appendChild(node);
  inner.appendChild(noDisplay);
  var button = document.createElement("button");
  button.className="btn slider-btn";
  var node = document.createTextNode("ورود به صفحه بازی");
  button.appendChild(node);
  button.setAttribute("href","../games?game="+SliderJson[i].title);
  button.temp="../games?game="+SliderJson[i].title;
  button.addEventListener("click",function(){
    window.location.href=this.temp;
  });
  inner.appendChild(button);
  item.appendChild(inner);
  $('#firstOwl').owlCarousel().trigger('add.owl.carousel', [jQuery(item)]);
  console.log(item);
  }

$('#firstOwl').owlCarousel().trigger("refresh.owl.carousel");
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
