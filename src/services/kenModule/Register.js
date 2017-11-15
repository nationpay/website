
Register.inheritsFrom(Stateable);

// new paradigm, set the needed client object vars in server only, do not set them in client-side first, pass them in Ajax.params
function Register(json) {
    // DECLARE PROPS. that server will set in mirrored object Register.php
     this.response = new Object();  // state:"verifyEmail","error","verified","redirect" etc ....   all possible and needed vars for all possible server responses are stored in Class vars. (except sessionId in Ajax)
     // this object's server-side properties needed back at client are none - only sessionId
     // and server-set first letter of first name and second name to be sure.
     this.nameSymbol = "";


     // if json is array - all properties will be declared from super!
     this.superConstructor.call(this,json);
     this.populateFrom.call(this,json);

     var buyButtonPressedCount = 0;
     var regPopup = new Dialog(1);
     var loginPopup = new Dialog(1);
     var signUpDialog2;
     // declare locals BEFORE this next statement
     var that = this;

/***********  HTML click EVENTS   **************/

     this.registerNow = function(name,email,p2,p2c) {
         var err = that.validate(name,email,p2,p2c);

         if (err) {
             var sm = new Dialog();
             sm.setTimer(2000);
             sm.setFixed(true,200);
             sm.showMessage("Please Correct",err,"");
             return;
         }
         var ajaxRegister = new Ajax();
         ajaxRegister.setSilent(true);
         ajaxRegister.params.type = "Register";  // <== parallel class name will be automatically detected in future.
         ajaxRegister.params["task"] = "register";
         ajaxRegister.params["name"] = name;
         ajaxRegister.params["email"] = email;
         ajaxRegister.params["hashedPass"] = sha512(p2); // server NEVER gets to see real value of your pasword as it is encrypted here and then Multi salt stroing encrypted again at server!
         document.getElementById("password2").value = "";
         document.getElementById("passwordConf2").value = "";
         ajaxRegister.send(dialogsUrl,that); // send using this object as callback - act() method is implied.
     }

     this.loginNow = function(email,p2) {
         var err = that.validate(null,email,p2);
         if (err) {
             var sm = new Dialog();
             sm.setTimer(2000);
             sm.setFixed(true,200);
             sm.showMessage("Please Correct",err,"");
             return;
         }
         var ajaxRegister = new Ajax();
         ajaxRegister.setSilent(true);
         ajaxRegister.params.type = "Register";  // <== parallel class name will be automatically detected in future.
         ajaxRegister.params["task"] = "login";
         ajaxRegister.params["email"] = email;
         ajaxRegister.params["hashedPass"] = sha512(p2); // server NEVER gets to see real value of your pasword as it is encrypted here and then Multi salt stroing encrypted again at server!
         document.getElementById("password1").value = "";
         ajaxRegister.send(dialogsUrl,that); // send using this object as callback - act() method is implied.
     }

     // user entered code!  verify email now!
     this.sendCode = function(code) {
         Dialog.fadeElem(document.getElementById("Register_requestCodeButtonWrapper"),"verifying ..",1,2);
         Dialog.fadeElem(document.getElementById("Register_reregisterButtonWrapper"),"",1,2);
         var ajaxRegister = new Ajax();
         ajaxRegister.setSilent(true);
         ajaxRegister.params.type = "Register";
         ajaxRegister.params["task"] = "code";
         ajaxRegister.params["code"] = code;
         ajaxRegister.send(dialogsUrl,that);
     }
     
     // resend code in email to user - no more than once per 5 minutes
     this.requestCode = function() {
         Dialog.fadeElem(document.getElementById("Register_requestCodeButtonWrapper"),"sending ..",1,2);
         var ajaxRegister = new Ajax();
         ajaxRegister.setSilent(true);
         ajaxRegister.params.type = "Register";
         ajaxRegister.params["task"] = "requestCode";
         ajaxRegister.send(dialogsUrl,that);
     }
     // delete this user and reregister - can only do it if user has given up on getting a code - maybe emntered wrong enail address - no more than once per 5 minutes
     this.reregister = function() {
         Dialog.fadeElem(document.getElementById("Register_reregisterButtonWrapper"),"signing out ..",1,2);
         var ajaxRegister = new Ajax();
         ajaxRegister.setSilent(true);
         ajaxRegister.params.type = "Register";
         ajaxRegister.params["task"] = "reregister";
         ajaxRegister.send(dialogsUrl,that);
     }
     
     this.loginLogoutButtonPressed = function(event) {
         var num = Ajax.getSessionState();
         if (num >= 20) { // user is logged in, so ... log him out
             Ajax.setSessionId("11");
             that.setLogButtonState();
             if (num >= 30) {
                 var sm = new Dialog();
                 sm.setTimer(7000);
                 sm.showMessage("You've logged out","  Thank you for participating in our pre-ICO.",""); 

                 return false;
             }
             else {
                 var sm = new Dialog();
                 sm.setTimer(9000);
                 sm.showMessage("You've logged out","When you're ready, please continue registration by logging back in and entering your verification code.","");
                 return false;
             }
         }
         else if (num >= 11) {  // Was logged in and has been logged out due to expiring session or manual logout.
            setTimeout(function() {that.loginPopup();},100);
            return false;
         }
         else if (num < 11) { // let register, new entry to website, there is no session ID or an anonymous guest or request to reregister
            setTimeout(function() {that.registerPopup();},100);
            return false;
        }
        return false;
     }

       // if sessionId is -1 - user has been specifically logged out - so present login screen
      // if sessionId is 0  - user was never logged in, present registration screen again.
      // if sessionId starts with 1 or 2+ - logout by 1) erasing sessionId 2) changing logout button to login button and 3) present dialog "Thank you for visiting RealSafe. You are logged out."
     this.buyButtonPressed = function(event) {
        buyButtonPressedCount++;
        if (buyButtonPressedCount > 1) {
            return false;
        }
        setTimeout(function() {buyButtonPressedCount = 0;},750);
        var num = Ajax.getSessionState();
        if (num >= 30) {
             var sm = new Dialog();
             sm.setTimer(6000);
             sm.showMessage(" &nbsp;&nbsp;&nbsp; Thanks for registering","The RST token buy page for pre-ICO is almost here!  We'll update you soon.","");
             return false;
        }
        else if (num == 20) { // still verifying, user did not enter code yet.
             setTimeout(that.verifyEmail("verifyEmail1"),100);
             return false;
        }
        else if (num == 11) { // there was a forced logout from an expired sessionId - this means user already registered. If login shows unverified it will make sessionId with "20" again.
            setTimeout(function() {that.loginPopup();},100);
            return false;
        }
        else if (num < 11) { // let register, there is no session ID or an anonymous guest or request to reregister
            setTimeout(function() {that.registerPopup();},100);
            return false;
        }
     }

// **********  END HTML click EVENTS  ***************************

    this.setLogButtonState = function(event) {
        if (Ajax.getSessionState() >= 20) {
            document.getElementById("loginLogoutButton").style.backgroundImage = "url(img/logout.png)";
        }
        else {
            document.getElementById("loginLogoutButton").style.backgroundImage = "url(img/login.png)";
        }
    }
    

     this.send = function() {
         Ajax.ajaxDialog.params["type"] = "Register";
         Ajax.ajaxDialog.send(dialogsUrl,that);
     };

     Register.prototype.serverErrorCheck = function(data) {
         return Stateable.prototype.serverErrorCheck(data);
     };

      // callback action act is the first method called at the server in the php version AND here at the client in thes method
     this.act = function(data) {
         if (data== null) {
             return;
         }
         // if no error, blur rthe registration screen
         // document.getElementById("popup").blur();
         this.deserializeAndPopulateFrom.call(that,data);
         that.store(); // so an html event can call a function in this object via Stateable.callMethod()
         //if (data.html != undefined) { // I dont use this anymore but it still works if you dont want anyone to steal your html - you can define it all on the server object and stream it here!
         //   setDialog(data.html);   // undefined on reply
         //   document.getElementById("newUser_firstName").focus();
         //}

         // first if sessionState is 2+ and not 9, make sure login icon is now a logout icon
         that.setLogButtonState();
         if ("state" in that.response && ["userAdded","verifyEmail2","codeResent","codeResentMailProblem","codeSentMailProblem","incorrectCode"].indexOf(that.response['state'])>-1) {
             regPopup.erase();
             that.verifyEmail();
         }
         else if ("state" in that.response && (that.response['state'] == "userDeleted") ) {
             eraseTopDialog();
             that.registerPopup();
         }
         else if ("state" in that.response && (that.response['state'] == "emailExists")) {
             var sm = new Dialog();
             sm.setTimer(4000);
             sm.setFixed(true,200);
             sm.showMessage("Email error","Sorry, the email you selected is in use.  Please try registering with another email address.","");
             // update Login symbol with a nice Google Circle with first initial in the middle of it.
             return;
         }
         else if ("state" in that.response && (that.response['state'] == "emailVerified")) {
             regPopup.erase(); // should be nothing to erase, respopup shoudl not be showing - just an enter verify code popup
             var sm = new Dialog();
             sm.setTimer(10000);
             sm.setFixed(true,200);
             sm.showMessage("Email Verified!","Thank you for registereing with RealSafe!  The RST token buy page for pre-ICO is coming Soon. We will update you as soon as it is here.","");
             // update Login symbol with a nice Google Circle with first initial in the middle of it.
             return;
         }
         else if ("state" in that.response && (that.response['state'] == "userLoggedIn")) {
             loginPopup.erase();
             if (Ajax.getSessionState() < 30) {
                 that.verifyEmail("justLoggedIn");
                 return;
             }
             var sm = new Dialog();
             sm.setTimer(8000);
             sm.setFixed(true,200);
             sm.showMessage("Welcome Back","Thanks again for registering! The RST token buy page for pre-ICO is almost here. We'll update you soon.","");
             // update Login symbol with a nice Google Circle with first initial in the middle of it.
             return;
         }
          else if ("state" in that.response && (that.response['state'] == "invalidPasswordOrEmail")) {
             var sm = new Dialog();
             sm.setTimer(4000);
             sm.setFixed(true,200);
             sm.showMessage("Try again","The email or password entered is invalid.  Please try again.","");
             // update Login symbol with a nice Google Circle with first initial in the middle of it.
             return;
         }
         that.response = new Object();
      };
      
/******  REGISTER POPUP HTML DIALOGS   ***********************************/

this.loginPopup = function() {
   var t = `
     <div class="form-login" id="form-login" style="width : 480px;">
        <h4>Login</h4>
       <!-- <form role="form" method="POST" action="https://RealSafe.co/login" id="contactform1"> -->
            <label for="email">E-mail</label>
            <input type="email" name="email" value="" id="email1">
            <label for="password">Password</label>
            <input type="password" name="password" id="password1">
            <div class="error1 error_style"></div>
            <input type="submit" value="Login" onclick='Stateable.getCreateStore("Register").loginNow(document.getElementById("email1").value,document.getElementById("password1").value);'>
        <!-- </form> -->
        <p>Don\'t have account? <a class="form-register-btn" href="/" onclick='Stateable.getCreateStore("Register").registerPopup();return false;'>Register</a></p>
        <!-- <h6>or Login by social:</h6>
        <a href="" class="fb"><img src="img/fb-icon-yellow.png" alt="facebook"></a>
        <a href="" class="google"><img src="img/google-icon-yellow.png" alt="google+"></a>  -->
    </div> `;
    loginPopup.setFixed(true,730); // 700 is approximate height of login dialog.  Need to sepcify for embedded positioning because it is not rendered yet.
    loginPopup.show(t);
}

this.registerPopup = function() {
   var t = `
     <div class="form-register" id="form-register" style="height : 800px; width : 480px;">
        <h4>Register</h4>
        <!-- <form role="form" method="POST" action="#" id="contactform2">   -->
            <label for="name">Name</label>
            <input type="text" name="name" value="" id="name2">
            <label for="email">E-mail</label>
            <input type="email" name="email" value="" id="email2">
            <label for="password">Password</label>
            <input type="password" name="password" id="password2">
            <label for="password-againe">Password again</label>
            <input type="password" name="password_confirmation" id="passwordConf2">
            <div class="error2 error_style"></div>
            <input type="submit" value="Register" onclick='Stateable.getCreateStore("Register").registerNow(document.getElementById("name2").value,document.getElementById("email2").value,document.getElementById("password2").value,document.getElementById("passwordConf2").value);'>
            <!-- onclick="fbqNO('track', 'CompleteRegistration', {value: 25.00,currency: 'USD'});ga('send', 'event', 'RealSafeico', 'registr');" -->
       <!-- </form> -->
        <p>Already have account?<a class="form-register-btn" href="#form-login" onclick='Stateable.getCreateStore("Register").loginPopup();return false;'> Login</a></p>
       <!--  <h6>or Login by social</h6>
        <a href="" class="fb"><img src="/img/fb-icon-yellow.png" alt="facebook"></a>
        <a href="" class="google"><img src="/img/google-icon-yellow.png" alt="google+"></a> -->
     </div> `;
    regPopup.setFixed(true,950); // 1000 is approximate height of register dialog.  Need to sepcify for embedded positioning because it is not rendered yet.
    regPopup.show(t);
}

    
    this.getVerifyHTML = function(allowResend) {
       var text1 = "            <table>";
       text1 +=    "             <tr> ";
       text1 +=    "               <td  style='width : 120px;'>";
       text1 +=    "                  Verify Code";
       text1 +=    "               </td>";
       text1 +=    "               <td style='padding-right : 40px;'>";
       text1 +=    "                   <input id='verifyEmailCode' style='background-color : #F3F9FF; border : solid #668899 1px; font-size : 16px' type='text' size='20' value='' onkeyup='Stateable.getCreateStore(\"Register\").checkCode(this.value)'/>";
       text1 +=    "               </td>";
       text1 +=    "             </tr> ";
       text1 +=    "             <tr> ";
       text1 +=    "              <td   style='padding : 5px; padding-top : 15px; width : 120px; height : 30px; '>";
       if (allowResend == undefined || allowResend) {
           text1 +=    "                   <input id='Register_requestCodeButtonWrapper' style='border-radius : 5px;' type='button'  value='Resend Code' onclick='Stateable.getCreateStore(\"Register\").requestCode()'/>";
       }
       text1 +=   "               </td> ";
       text1 +=    "              <td  style='padding : 5px; padding-top : 15px; text-align : right;'>";
       text1 +=    "                   <input id='Register_reregisterButtonWrapper' style='border-radius : 5px;' type='button' value='Re-register' onclick='Stateable.getCreateStore(\"Register\").reregister()' />";
       text1 +=   "               </td> ";
       text1 +=    "             </tr>";
       text1 +=    "            </table>";
       return text1;
    }
    
    this.checkCode = function(code) {
       if (code.length == 6) {
           //signUpDialog2.disableButton(false,0);
           that.sendCode(code);
       }
       else {
          //signUpDialog2.disableButton(true,0);
       }
    }

    signUpDialog2 = new Dialog();
    signUpDialog2.setAutoErase(false);
    //signUpDialog2.setConfirm(function() {if (document.getElementById("verifyEmailCode").value.length != 6) return false; that.sendCode(document.getElementById("verifyEmailCode").value);return true;});
    //signUpDialog2.setConfirm1(function() {return true});


    this.verifyEmail = function(force) {
        var s = "<div style='margin : 5px; width : 280px; height : 70px;font-weight : bold'>";
        if (that.response['state'] == "userLoggedIn") {
                  //signUpDialog2.disableButton(true,0);
                  signUpDialog2.showMessage("Welcome back",s+"Please enter the code sent to your email address or request it to be sent again.</div>"+that.getVerifyHTML(),"","");
                  return;
        }
        if (that.response['state'] == "userAdded" || (force != undefined && force == "verifyEmail1")) {
                  //signUpDialog2.disableButton(true,0);
                  signUpDialog2.showMessage("Verify Email",s+"A code was sent to your email address. Please enter it here.</div>"+that.getVerifyHTML(),"","");
                  return;
         }
         if (["incorrectCode","verifyEmail2"].indexOf(that.response['state'])>-1 || (force != undefined && force == "verifyEmail2")) {
                  //signUpDialog2.disableButton(true,0);
                  signUpDialog2.showMessage("Verify Email",s+"Incorrect code entered. Please try again or request code to be resent.</div>"+that.getVerifyHTML(),"");
                  return;
         }
         else if (that.response['state'] == "codeResent") {
                  //signUpDialog2.disableButton(true,0);
                  if (!signUpDialog2.fadeToHtml(s+"Code resent. Please copy the code from the email when you get it.</div>"+that.getVerifyHTML(false))) {
                      signUpDialog2.showMessage("Verify Email",s+"Code resent. Please copy the code from the email when you get it.</div>"+that.getVerifyHTML(false),"");
                  }
                  return;
         }
         else if (that.response['state'] == "codeResentMailProblem") {
                  //signUpDialog2.disableButton(true,0);
                  signUpDialog2.showMessage("Verify Email",s+"Server email is under maintenance. <div style='font-size : 8px'>"+that.response['mailError']+"</div> Please check back later.</div>"+that.getVerifyHTML(false),"");
                  return;
         }
         else if (that.response['state'] == "codeSentMailProblem") {
                  //signUpDialog2.disableButton(true,0);
                  signUpDialog2.showMessage("Verify Email",s+"Server email is under maintenance. "+that.response['mailError']+" Please check back later.</div>"+that.getVerifyHTML(false),"");
                  return;
         }
    }
    

    
  this.validate = function(name,email,p,p2) {
    var r = that.validateName(name);
    if (r) {
        return r;
    }
    r = that.validateEmail(email);
    if (r) {
        return r;
    }
    return that.validatePassword(p,p2);
}

this.validateName = function(name) {
   if (name == undefined) {
       return false;
   }
   name = name.trim();
   if (name.length < 4) {
       return "Full name must have more characters."
   }
   var pattern = /^[a-zA-ZàáâäãåacceèéêëeiìíîïlnòóôöõøùúûüuuÿýzzñçcšžÀÁÂÄÃÅACCEEÈÉÊËÌÍÎÏILNÒÓÔÖÕØÙÚÛÜUUŸÝZZÑßÇŒÆCŠŽ?ð ,.'-]+$/u
   if (!pattern.test(name)) {
       return "Name cannot have any digits and must have at least one space";
   }
   var s = name.split(" ");
   if (s.length != 2 && name.length != 3) {
       return "Full name should have one or two last names please."
   }
   return false;
}

this.validateEmail = function(email) {
   if (email == undefined) {
       return false;
   }
   if (email == null || email == undefined) {
       return false;
   }
   var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{2,4}\.)?[a-z]{2,4}$/i;
   if (pattern.test(email)) {
       return false;
   }
   return "Invalid email address";
}

this.validatePassword = function(val,val2) {
      var messageDialog = new Dialog();
      if (val == undefined || val == null || typeof val != "string") {
           return "Empty password";
      }
      val = val.replace(/ /gi,"");
      if (val2 != undefined && val != val2) {
           return "Passwords do not match";
      }
      if (val.length > 0) {
          if (val.length < 6) {
              return "password must be 6 or more characters."
          }
      }
      else {
         return "Password is empty."
      }
      return false;
}




}




