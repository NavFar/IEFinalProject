
$(document).ready(function(){
  document.getElementById("email").addEventListener("change",emailCheck);
  document.getElementById("passwd").addEventListener("change",passwdCheck);

});
function emailCheck(){
  var informPlace= document.getElementById("emailInform");
  var emailRoute = "/emailchecker"
  var email = $("#email").val();
  informPlace.innerHTML="";
       $.post(emailRoute,
       {
         "email": email,
       },
       function(data,status){
          if(status=="success"){
            if(data.ok=="true"){

              $("#emailInform").html("ایمیل شما معتبر است");
              $("#emailInform").removeClass("green");
              $("#emailInform").removeClass("red");
              $("#emailInform").addClass("green");
            }
            else{
              $("#emailInform").html("ایمیل شما نامعتبر است");
              $("#emailInform").removeClass("green");
              $("#emailInform").removeClass("red");
              $("#emailInform").addClass("red");
            }
          }
       });
}
function passwdCheck(){
  var informPlace= document.getElementById("passwdInform");
  informPlace.innerHTML="";
  var passwdRoute="/passwordchecker";
  var passwd = $("#passwd").val();
  $.post(passwdRoute,
  {
    "passwd": passwd,
  },
  function(data,status){
     if(status=="success"){
       console.log(data.passwd);
       if(data.ok=="true"){

         $("#passwdInform").html("رمز عبور شما مناسب است");
         $("#passwdInform").removeClass("green");
         $("#passwdInform").removeClass("red");
         $("#passwdInform").addClass("green");
       }
       else{
         $("#passwdInform").html("رمز عبور شما مناسب نیست");
         $("#passwdInform").removeClass("green");
         $("#passwdInform").removeClass("red");
         $("#passwdInform").addClass("red");
       }
     }
  });
}
