//global variables
var startX,startY;
//this variables sets from game xml
var gameData;
//timer
var timer;
//
var countDownTimer;
//player Name
var playerName
window.onload=function (){
// create game element should go here
addPrimaryElement();
// add movability to window class
makewindowMovable();
// make close button works
makeCloseWindow();
// make minimize button works
makeMinimizeWindow();
//make resize works
makeWindowResizeable();
//add modal listeners
modalListeners()
//get and save game information
getGameXML(saveData);
//change title
changeGameWindowTitle();
//creaet new game
newGame();

};
function addPrimaryElement(){
  //create modal alert
  var alertModal = document.createElement("div");
  alertModal.setAttribute("id", "alertModal");
  alertModal.className="modal";
  //create contentModal
  var contentModal = document.createElement("div");
  contentModal.className="modal-content";
  alertModal.appendChild(contentModal);
  //add content Modal to modal alert
  alertModal.appendChild(contentModal);
  //create text input
  var textInput = document.createElement("input");
  textInput.className="field";
  textInput.setAttribute("id","name");
  textInput.setAttribute("placeholder","Enter Your Name");
  // create OK button
  var button = document.createElement("button");
  //create OK button text
  var buttonText = document.createTextNode("OK");
  //stick OK button text to button itself
  button.appendChild(buttonText);
  //add text input and button to modal content
  contentModal.appendChild(textInput);
  contentModal.appendChild(button);
  //create title bar
  var titleBar = document.createElement("div");
  titleBar.className="title-bar";
  // titleBar.style.cursor='move';
  //create titel span
  var titleSpan = document.createElement("span");
  titleSpan.setAttribute("id","game-title");
  var titleSpanText = document.createTextNode("MineSweeper Online - Beginner!");
  //stick title text to span
  titleSpan.appendChild(titleSpanText);
  //create minimize span
  var minimizeDiv= document.createElement("span");
  minimizeDiv.className="btn";
  minimizeDiv.setAttribute("id","btn-minimize");
  //creaet minimize text
  var minimizeText = document.createTextNode("-");
  //add minimize text to close span
  minimizeDiv.appendChild(minimizeText);
  //create close span
  var closeDiv= document.createElement("span");
  closeDiv.className="btn";
  closeDiv.setAttribute("id","btn-close");
  //creaet close text
  var closeText = document.createTextNode("\u274C");
  //add close text to close span
  closeDiv.appendChild(closeText);
  //create close and minimize div
  var closeANDMinDiv=document.createElement("div");
  closeANDMinDiv.appendChild(minimizeDiv);
  closeANDMinDiv.appendChild(closeDiv);
  //stick all title element together
  titleBar.appendChild(titleSpan);
  titleBar.appendChild(closeANDMinDiv);
  //create gameTop div
  var gameTop = document.createElement("div");
  gameTop.className="top";
  //create left counter  span
  var leftCounter = document.createElement("span");
  // var leftCounterText = document.createTextNode("000");
  leftCounter.className="counter";
  // leftCounter.appendChild(leftCounterText);
  //create middle smile
  var smile = document.createElement("span");
  smile.className = "smile";
  smile.addEventListener('mousedown',smileNewGame,true);
  //create right counter  span
  var rightCounter = document.createElement("span");
  // var rightCounterText = document.createTextNode("000");
  rightCounter.className="counter";
  // rightCounter.appendChild(rightCounterText);
  //add to gameTop
  gameTop.appendChild(leftCounter);
  gameTop.appendChild(smile);
  gameTop.appendChild(rightCounter);
  //create grid div
  var gridDiv = document.createElement("div");
  gridDiv.className = "grid";
  //creaet window div
  var gameWindow=document.createElement("div");
  gameWindow.className="window";
  //add title to gameWindow
  gameWindow.appendChild(titleBar);
  gameWindow.appendChild(gameTop);
  gameWindow.appendChild(gridDiv);
  //get body element by tag name :(
  var bodyElement = document.getElementsByTagName("body")[0];
  //add alert Modal to body
  bodyElement.appendChild(alertModal);
  bodyElement.appendChild(gameWindow);
}
//make window class movable
function makewindowMovable(){
    document.getElementsByClassName('title-bar')[0].addEventListener('mousedown', startMove, false);
    window.addEventListener('mouseup',endMove , false);
}
function endMove (){
    window.removeEventListener('mousemove', gameWindowMove, true);
}
function startMove(e){
  startX = e.clientX;
  startY = e.clientY;
  window.addEventListener('mousemove', gameWindowMove, true);
}
function gameWindowMove(e){
  var gameWindow = document.getElementsByClassName('window')[0];
  gameWindow.style.position = 'absolute';
  if(isNaN(parseInt(gameWindow.style.top,10)))
  {
    var style=window.getComputedStyle(gameWindow,null);
    gameWindow.style.top = parseInt(style.top,10)+ 'px';
    gameWindow.style.left = parseInt(style.left,10)+ 'px';
  }
    gameWindow.style.top = (parseInt(gameWindow.style.top,10)+(e.clientY-startY)) + 'px';
    gameWindow.style.left = (parseInt(gameWindow.style.left,10)+(e.clientX-startX)) + 'px';
    startY = e.clientY;
    startX = e.clientX;
}
//make close button works
function makeCloseWindow(){
  var closeFunction=function ()
  {
  var gameWindow = document.getElementsByClassName('window')[0];
  var body = document.getElementsByTagName('body')[0];
  body.removeChild(gameWindow);
  }
  gameEnded('');
  var closeButton = document.getElementById('btn-close');
  closeButton.addEventListener('mouseup',closeFunction);
  closeButton.style.cursor='default';
}
//make minimize button works
function makeMinimizeWindow(){
  var minimizeFunction = function(){
    var topWindow = document.getElementsByClassName('top')[0]
    var gridDiv = document.getElementsByClassName('grid')[0]
    var gameWindow = document.getElementsByClassName('window')[0];
    if(topWindow.style.display=='none')
    {
      gameWindow.style.height='320px';
      topWindow.style.display='';
      gridDiv.style.display='';
    }
    else{
      gameWindow.style.height=0;
      topWindow.style.display='none';
      gridDiv.style.display='none';
    }
  }
  var minimizeButton = document.getElementById('btn-minimize');
  minimizeButton.addEventListener('mouseup',minimizeFunction);
  minimizeButton.style.cursor='default';

}
//getGameXML();
function saveData(xml){
  // var isValid = validate(xml);
  var xmlDOM = new DOMParser().parseFromString(xml,"text/xml");
  var gameObj = new Object();
  gameObj.id=xmlDOM.getElementsByTagName("game")[0].getAttribute("id");
  gameObj.title=xmlDOM.getElementsByTagName("game")[0].getAttribute('title');
  gameObj.defaultLevel=xmlDOM.getElementsByTagName("levels")[0].getAttribute('default');
  var levels = xmlDOM.getElementsByTagName("level");
  gameObj.levels=new Array();
  for( i=0;i<levels.length;i++){
  var levelObj= new Object();
  levelObj.id=levels[i].getAttribute('id');
  levelObj.title=levels[i].getAttribute('title');
  levelObj.timer=levels[i].getAttribute('timer');
  levelObj.rows=xmlDOM.getElementsByTagName('rows')[i].innerHTML;
  levelObj.cols=xmlDOM.getElementsByTagName('cols')[i].innerHTML;
  levelObj.mines=xmlDOM.getElementsByTagName('mines')[i].innerHTML;
  levelObj.time=xmlDOM.getElementsByTagName('time')[i].innerHTML;
  gameObj.levels[i]=levelObj;
  }
  gameData=gameObj;
}
// function validate(xml){
//   var xmlHttp = new XMLHttpRequest();
//     console.log(xmlHttp.open( "GET","https://rawgit.com/AUT-CEIT/ie/master/2016/fall/HW-3/js/lib.js", false));
//     xmlHttp.send( null );
  // xmllin.validateXML('xml':xml , '');
// }

// getNewGame(`
//     <request>
//     <rows>3</rows>
//     <cols>3</cols>
//     <mines>3</mines>
//     </request>
// `);

function changeGameWindowTitle(){
  var title = document.getElementById('game-title');
  var i=0;
  for(;i<gameData.levels.length;i++)
  {
    if(gameData.levels[i].id==gameData.defaultLevel)
      break;
  }
  title.innerHTML=gameData.title +" - "+gameData.levels[i].title ;
}
function newGame(){
  gameEnded('');
  var gridDiv = document.getElementsByClassName('grid')[0];
  while (gridDiv.firstChild) {
    gridDiv.removeChild(gridDiv.firstChild);
                              }
  var counters= document.getElementsByClassName('counter');
  for(i=0;i<counters.length;i++)
  {
    counters[i].innerHTML = '000';
  }
  var smile = document.getElementsByClassName('smile')[0];
  var levelId = gameData.defaultLevel;
  var i=0;
  for(;i<gameData.levels.length;i++)
  {
    if(gameData.levels[i].id==levelId)
      break;
  }

  var request = '<rows>'+gameData.levels[i].rows+'</rows>';
  request += '<cols>'+gameData.levels[i].rows+'</cols>';
  request += '<mines>'+gameData.levels[i].mines+'</mines>';
  request = '<request>'+request+'</request>';
  getNewGame(request,xsltrunner);
  var smile=document.getElementsByClassName('smile')[0];
  smile.setAttribute('data-value','ok');
  document.getElementsByClassName('grid')[0].addEventListener('mouseup',cellsListener,false);
  document.getElementsByClassName('grid')[0].addEventListener('mousedown',mouseDown,false);
  document.getElementsByClassName('grid')[0].addEventListener('mouseup',mouseUp,false);
  document.addEventListener('contextmenu', event => event.preventDefault());
  var leftCounter = document.getElementsByClassName('counter')[0];
  leftCounter.innerHTML = gameData.levels[i].mines;
  leftCounter.innerHTML=('000' + leftCounter.innerHTML).substr(-3);
  var rightCounter = document.getElementsByClassName('counter')[1];
  if(gameData.levels[i].time){
  rightCounter.innerHTML = gameData.levels[i].time;
  rightCounter.innerHTML=('000' + rightCounter.innerHTML).substr(-3);
}
}
function xsltrunner(xml){
//      var schema = `<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
// <xs:element name="grid">
// <xs:complexType>
// <xs:sequence>
// <xs:element name="row">
// <xs:complexType>
// <xs:sequence>
// <xs:element name="col">
// <xs:complexType>
// <xs:simpleContent>
// <xs:extension base="xs:string">
// <xs:attribute type="xs:integer" name="col"/>
// <xs:attribute type="xs:boolean" name="mine" use="optional"/>
// </xs:extension>
// </xs:simpleContent>
// </xs:complexType>
// </xs:element>
// </xs:sequence>
// <xs:attribute type="xs:integer" name="row"/>
// </xs:complexType>
// </xs:element>
// </xs:sequence>
// </xs:complexType>
// </xs:element>
// </xs:schema>`;
//      var Module = {
//            'xml': xml,
//            'schema': schema,
//      };
//      var xmllint = validateXML(Module);
//      console.log(xmllint);
//
//

  var xsl = `<?xml version="1.0" encoding="UTF-8"?>
                <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
                  <xsl:template match="/grid">

                      <xsl:for-each select="./row">
                        <xsl:for-each select="./col">
                          <span>
                          <xsl:attribute name="id">
                              <xsl:text>c</xsl:text><xsl:value-of select="(../@row -1)*count(../col)+(./@col )"/>
                          </xsl:attribute>
                          <xsl:if test="@mine">
                          <xsl:if test="@mine='true'">
                          <xsl:attribute name="data-value">
                              <xsl:text>mine</xsl:text>
                          </xsl:attribute>
                          </xsl:if>
                          </xsl:if>
                          </span>
                        </xsl:for-each>
                      </xsl:for-each>

                  </xsl:template>
               </xsl:stylesheet>
  `;
  var xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(new DOMParser().parseFromString(xsl,"application/xml"));
  xml=new DOMParser().parseFromString(xml,"text/xml");
  var result = xsltProcessor.transformToFragment(xml, document);
  // console.log(result);
  var gameWindow = document.getElementsByClassName('grid')[0];
  gameWindow.appendChild(result);
  addCellNumbers();
}
function cellsListener(){
  var rightCounter = document.getElementsByClassName('counter')[1];
  var i=0;
  for(;i<gameData.levels.length;i++)
  {
    if(gameData.levels[i].id==gameData.defaultLevel)
      break;
  }
  if(gameData.levels[i].timer){
    //timer
    rightCounter.innerHTML=gameData.levels[i].time;
    rightCounter.innerHTML=('000' + rightCounter.innerHTML).substr(-3);
    timer=window.setTimeout(function(){
      gameEnded("Time Ended");
    }, parseInt(gameData.levels[i].time)*1000,false);
    countDownTimer = window.setInterval(function(){
      if(parseInt(rightCounter.innerHTML)>0)
      {
        rightCounter.innerHTML=parseInt(rightCounter.innerHTML)-1;
        rightCounter.innerHTML=('000' + rightCounter.innerHTML).substr(-3);
      }
    }, 1000);
  }
  else{
    //no timer
      rightCounter.innerHTML=0;
      rightCounter.innerHTML=('000' + rightCounter.innerHTML).substr(-3);
      document.getElementsByClassName('grid')[0].addEventListener('mouseup',incMove,false);
  }
  document.getElementsByClassName('grid')[0].removeEventListener('mouseup',cellsListener,false);
}

function incMove()
{
  var rightCounter = document.getElementsByClassName('counter')[1];
    rightCounter.innerHTML=parseInt(rightCounter.innerHTML)+1;
    rightCounter.innerHTML=('000' + rightCounter.innerHTML).substr(-3);
}
function gameEnded(message){
  if(!message==""){
  alert(message);
  var smile=document.getElementsByClassName('smile')[0];
  smile.setAttribute('data-value','lost');
  }
  if(timer)
  clearTimeout(timer);
  if(countDownTimer)
  clearInterval(countDownTimer);
  var allcells=document.getElementsByClassName('grid')[0].childNodes;
  for(i=0;i<allcells.length;i++)
  {
    allcells[i].className='revealed';
  }
  document.getElementsByClassName('grid')[0].removeEventListener('mouseup',cellsListener,false);
  document.getElementsByClassName('grid')[0].removeEventListener('mousedown',mouseDown,false);
  document.getElementsByClassName('grid')[0].removeEventListener('mouseup',mouseUp,false);
  document.addEventListener('contextmenu', event => event.preventDefault());
}
function increaseCounter()
{
  var leftCounter = document.getElementsByClassName('counter')[0];
  var i=0;
  for(;i<gameData.levels.length;i++)
  {
    if(gameData.levels[i].id==gameData.defaultLevel)
      break;
  }
  if(parseInt(leftCounter.innerHTML)==gameData.levels[i].mines)
  {
    return false;
  }
  else {
    leftCounter.innerHTML=parseInt(leftCounter.innerHTML)+1;
    leftCounter.innerHTML=('000' + leftCounter.innerHTML).substr(-3);
    return true;
  }
}
function decCounter()
{

  var leftCounter = document.getElementsByClassName('counter')[0];
  if(parseInt(leftCounter.innerHTML)==0)
  {
    return false;
  }
  else {
    leftCounter.innerHTML=parseInt(leftCounter.innerHTML)-1;
    leftCounter.innerHTML=('000' + leftCounter.innerHTML).substr(-3);
    if(parseInt(leftCounter.innerHTML)==0)
    checkEndGame();
    return true;
  }
}
function mouseDown(e)
{
  var clickedSpan = e.target;

  if(clickedSpan.tagName!="SPAN"){

    return;

  }
  if(e.button==0)
  {
    if(clickedSpan.className!='revealed'&&(clickedSpan.getAttribute('view-value')=='clear'||!clickedSpan.getAttribute('view-value')))
      {
        clickedSpan.className+="active";
        document.getElementsByClassName('smile')[0].setAttribute('data-value','hover')
    }
  }
}
function mouseUp(e)
{
  if(e.button==0){
  var clickedSpan = e.target;
  if(clickedSpan.tagName!="SPAN"){
    return;
  }
  countClicks();
  document.getElementsByClassName('smile')[0].setAttribute('data-value','ok');
  if(e.target.className!='revealed')
  revealNeighbors(clickedSpan.id);
  else {
    e.target.className='revealed';
    checkAround(e.target.id);
  }
}
else if(e.button ==2)
{
    if(e.target.tagName=="SPAN"&&e.target.className!='revealed'){
    var cell = document.getElementById(e.target.id);
    cell.className='right'
    if(cell.getAttribute('opened')!=1)
    {
      if(!cell.getAttribute('view-value')||cell.getAttribute('view-value')=='clear')
      {
        if(decCounter())
        cell.setAttribute('view-value','flag');
      }
      else if(cell.getAttribute('view-value')=='flag')
      {
        if(increaseCounter())
        cell.setAttribute('view-value','question');
      }
      else if(cell.getAttribute('view-value')=='question')
      {

        cell.setAttribute('view-value','clear');
        cell.className = "";
      }
    }
  }
}
}
  function revealNeighbors(id){
  if(document.getElementById(id).getAttribute('view-value')=='flag')
    {
      document.getElementById(id).className='right';
      return;
    }

  document.getElementById(id).className='revealed';
  document.getElementById(id).setAttribute('opened','1');
  if(document.getElementById(id).getAttribute('data-value')=='mine')
  {
    gameEnded('You touch mine ');
  }
  if(document.getElementById(id).getAttribute('data-value')==0)
  {


    // console.log(document.getElementById(id).getAttribute('data-value'));
    var defaultId=0;
    for(;defaultId<gameData.levels.length;defaultId++)
    {
      if(gameData.levels[defaultId].id==gameData.defaultLevel)
        break;
    }
    var cell=parseInt(id.substr(1))-1;
    var row = Math.floor(cell/gameData.levels[defaultId].cols);
    var col = (cell%gameData.levels[defaultId].cols)+1;
    var i = -1;
    for(i=-1;i<2;i++)
    {
      // console.log("another i");
      if(row+i>=0&&row+i<gameData.levels[defaultId].rows)
      {
        var j=-1;
        for(j=-1;j<2;j++)
        {
          // console.log("another j");
          if(col+j>0&&col+j<=gameData.levels[defaultId].cols)
          {
            if(i==0&&j==0)
              continue;
              // console.log(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j))));
              if(document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).getAttribute('opened')!='1'){
                // console.log(document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).getAttribute('opened'));
                revealNeighbors('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)));
                // console.log("back-to"+id+"-"+i+'-'+j);
            }

          }
        }

      }
    }
  }
  // console.log("end-of"+id);
}
function addCellNumbers()
{
  var defaultId=0;
  for(;defaultId<gameData.levels.length;defaultId++)
  {
    if(gameData.levels[defaultId].id==gameData.defaultLevel)
      break;
  }

for(cell=0;cell<gameData.levels[defaultId].rows*gameData.levels[defaultId].cols;cell++)
{
  if(document.getElementById('c'+(cell+1)).getAttribute('data-value')=='mine')
    continue;
  var number = 0;
  var row = Math.floor(cell/gameData.levels[defaultId].cols);
  var col = (cell%gameData.levels[defaultId].cols)+1;
  for(i=-1;i<2;i++)
  {
    if(row+i>=0&&row+i<gameData.levels[defaultId].rows)
    {
      for(j=-1;j<2;j++)
      {
        if(col+j>0&&col+j<=gameData.levels[defaultId].cols)
        {
          if(i==0&&j==0)
            continue;
            if(document.getElementById('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j))).getAttribute('data-value')=='mine')
              number++;
        }
      }
    }
  }
  temp = ('c'+(cell+1));
  document.getElementById(temp).setAttribute('data-value',number);
}
}
function modalListeners()
{
  var okButton = document.getElementsByTagName("button")[0];
  var nameInput = document.getElementById('name');
  // console.log(okButton);
  okButton.addEventListener('click',okButtonClick,true);
  nameInput.addEventListener('keydown',inputFilter,true);
}
function okButtonClick()
{
  // console.log('hello');
  var nameInput = document.getElementById('name');
  if(nameInput.value=="")
  {
    alert("please enter Your Name then click OK" );
  }
  else{
    alert("Thank You for Entering Name");
    var modal = document.getElementById('alertModal');
    modal.style.display='none';
  }
}
function inputFilter(e) {
  var pattern = /[a-zA-z]/
  var result =pattern.test(e.key);

  if(!result){
    e.preventDefault();
}
}
function smileNewGame()
{
  var message = "";
  for(i=0;i<gameData.levels.length;i++)
  {
    message+=(i+1)+'- '+gameData.levels[i].title;
    if(gameData.levels[i].id == gameData.defaultLevel)
      message+=" <-- default";
    message+="\n";
  }
  message = "Please select From these levels (0 to leave default) \n"+message;
  var response = prompt(message);
  // response = parseInt(response);
  while(!(response&&!isNaN(response) && response<=gameData.levels.length && response>=0))
  {
    alert("please enter a correct number");
    response = prompt(message);
  }
  if(response!=0)
  gameData.defaultlevel=gameData.levels[response-1].id;
  newGame();
}
function countClicks(){
  var defaultId=0;
  for(;defaultId<gameData.levels.length;defaultId++)
  {
    if(gameData.levels[defaultId].id==gameData.defaultLevel)
      break;
  }
  if(!gameData.levels[defaultId].timer)
  {
    incMove();
  }
}
function checkEndGame()
{
  var cells = document.getElementsByClassName('grid')[0].childNodes;
  var flag = true;
  for(var i=0;i<cells.length;i++){
    if(cells[i].getAttribute('view-value')=='flag'&&cells[i].getAttribute('data-value')!='mine')
        flag=false;
  }
  if(flag)
  {
    var  score =  document.getElementsByClassName('counter')[1].innerHTML;
    $.ajax({
        type:"POST",
        data:{'score':score},
        url:"../save/minesweeper",
        success:function(data){
          if(data.response==true)
          {
            if(data.changed==true){
              alert("You Have break you record");
            }
          }
        }
    });
    gameEnded(" You Won !!!");

    document.getElementsByClassName('smile')[0].setAttribute('data-value','win')
  }
  else{
    // alert('game goes on');
  }

}
function  checkAround(id) {

  if(document.getElementById(id).getAttribute('data-value')==0)
    return;
console.log(id);
    var defaultId=0;
    for(;defaultId<gameData.levels.length;defaultId++)
    {
      if(gameData.levels[defaultId].id==gameData.defaultLevel)
        break;
    }
    var cell=parseInt(id.substr(1))-1;
    var row = Math.floor(cell/gameData.levels[defaultId].cols);
    var col = (cell%gameData.levels[defaultId].cols)+1;

    var number = 0
    var i=-1;
    for(i=-1;i<2;i++)
    {
      if(row+i>=0&&row+i<gameData.levels[defaultId].rows)
      {
        var j=-1;
        for(j=-1;j<2;j++)
        {
          if(col+j>0&&col+j<=gameData.levels[defaultId].cols)
          {
            if(i==0&&j==0)
              continue;
              if(document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).getAttribute('view-value')=='flag'){
                number++;
            }

          }
        }

      }
    }
    console.log(number);
    if(number!=document.getElementById(id).getAttribute('data-value'))
      return;

    var i = -1;
    for(i=-1;i<2;i++)
    {
      if(row+i>=0&&row+i<gameData.levels[defaultId].rows)
      {
        var j=-1;
        for(j=-1;j<2;j++)
        {
          if(col+j>0&&col+j<=gameData.levels[defaultId].cols)
          {
            if(i==0&&j==0)
              continue;
              if(document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).getAttribute('opened')!='1'&&document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).getAttribute('view-value')!="flag"){
                document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).className='revealed';
                if(document.getElementById(('c'+(((row+i)*gameData.levels[defaultId].cols)+(col+j)))).getAttribute('data-value')=='mine')
                  gameEnded("You blow it ");
            }

          }
        }

      }
    }
}








function makeWindowResizeable(){
    // document.getElementsByClassName('window')[0].addEventListener('mousedown', startResize, false);
    // window.addEventListener('mouseup',endResize , false);
}
function endResize (){
    window.removeEventListener('mousemove', gameWindowMove, true);
}
function startResize(e){
  startX = e.clientX;
  startY = e.clientY;
  window.addEventListener('mousemove', gameWindowMove, true);
}
function gameWindowResize(e){
  var gameWindow = document.getElementsByClassName('window')[0];
  // gameWindow.style.position = 'absolute';
  if(isNaN(parseInt(gameWindow.style.width,10)))
  {
    var style=window.getComputedStyle(gameWindow,null);
    gameWindow.style.width = parseInt(style.width,10)+ 'px';
    gameWindow.style.height = parseInt(style.height,10)+ 'px';
  }
    gameWindow.style.width = (parseInt(gameWindow.style.width,10)+(e.clientY-startY)) + 'px';
    gameWindow.style.height = (parseInt(gameWindow.style.height,10)+(e.clientX-startX)) + 'px';
    startY = e.clientY;
    startX = e.clientX;
}
