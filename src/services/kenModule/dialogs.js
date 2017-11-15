// COPYRIGHT, Ken Silverman 2008-2013  ALL RIGHTS RESERVED,  no rights to view, modify or copy any part of this code.
// This code was built from scratch with all ideas, concepts and implementations by Ken Silverman
// if keyboard open and orientation change - because resize is called sometimes before the orientationchange event - and
//  no way to reliably know the orientation, degrees is not reliable
// records previous h and w and see if h has reduced by more than 100 and w has not changed.
// on softKeyboard event  focus on the active element AGAIN - so that the dialog will scroll automatically to the element. do NOT do this on iPhone - as iPhone does that automatically.
// if you try to do that again, it may cause an osciallation.

// adjust zoom ONE time - if mobileView and REAL screen pixel height is less than 800 down to 600 at least
// be SURE to readjust screen_HEIGHT/WIDTH now that there are more pixels simulated due to zooming out.

var LOGO_URL = "./img/small-logo.png";
var SCREEN_HEIGHT = 0;  // test
var SCREEN_WIDTH = 0;  // test
var lastResizeEventScreenHeight = SCREEN_HEIGHT;
var lastResizeEventScreenWidth = SCREEN_WIDTH;
var reorientationTimerId = 0;
var TOTAL_DIALOG_ELEMS = 6;
var emptyHTML = "<div></div>";
var MASK_IMAGE_URL="./images/shield40.png";
getScreenDims();

function getScreenDims(ignoreCurrentScale) {
     var hw = new Array();
     var actual = false;
     // to try use innerwidth for android 4.4 and above
     if ("screen" in window && (Utils.isIos() || Utils.isAndroid())) {  // android 4.4 and above is chrome no more access to actual device pixels, screen will return css pixels
         var p = true;
         // portrait mode,  height from screen object is ALWAYS the portrtait mode's vertical length .  So reversed in landscape mode
         var oh = 0; var ow = 0;
         if (window.orientation == 0 || window.orientation == 180 || window.orientation == -180 || window.orientation == "0" || window.orientation == "180"  || window.orientation == "-180" ) {
             // portraitmode,  height from screen object should ALWAYS be the portrtait mode's vertical length - but it may not be so check it here.
             if (Utils.isAndroid() && "outerHeight" in window) {  // in new webview 4.4+ this is in css pixels   in 2.3 its actual screenHeight and window.screenHeight is css adjusted!!!
                 oh = Math.max(window.outerHeight,window.outerWidth);
                 ow = Math.min(window.outerHeight,window.outerWidth);
             }
             else if ("innerHeight" in window) {
                 oh = Math.max(window.innerHeight,window.innerWidth);
                 ow = Math.min(window.innerHeight,window.innerWidth);
             }
             if (screen.height > screen.width) {
                  hw[0] =  screen.height;
                  hw[1] = screen.width;
             }
             else {
                 hw[1] = screen.height;
                 hw[0] = screen.width;
             }
             if (Math.max(oh,ow) > Math.max(hw[1],hw[0])) { // BUG in older android, outerHeight is actuall screenHeight and screenHeight is css adjusted.Should be reversed.
                 hw[0] = Math.max(oh,ow);
                 hw[1] = Math.min(ow,oh);
             }
             //alert(window.innerHeight+" "+window.innerWidth+window.outerHeight+" "+window.outerWidth+" "+screen.width+""+screen.height);
             //on android s4 mini 4.2 = window.outerHeight+" "+window.outerWidth+" "+screen.width+""+screen.height =   922 540 540 960
             //on android 2.3 = innerHeight+" "+window.innerWidth + window.outerHeight+" "+window.outerWidth+" "+screen.width+""+screen.height =   508 320 762 480 320 508
         }
         else {   // in landscape in 4.4 and above screen.height may reflect the portrait mode width and NOT be fixed at the portrait vertical like it is in 4.3 and below.
             if (Utils.isAndroid() && "outerHeight" in window) {  // in new webview 4.4+ this is in css pixels   in 2.3 its actual screenHeight and window.screenHeight is css adjusted!!!
                 ow = Math.max(window.outerHeight,window.outerWidth);
                 oh = Math.min(window.outerHeight,window.outerWidth);
             }
             else if ("innerHeight" in window) {
                 ow = Math.max(window.innerHeight,window.innerWidth);
                 oh = Math.min(window.innerHeight,window.innerWidth);
             }
             if (screen.height > screen.width) {
                  hw[1] =  screen.height;
                  hw[0] = screen.width;
             }
             else {
                 hw[0] = screen.height;
                 hw[1] = screen.width;
             }
             if (Math.max(oh,ow) > Math.max(hw[1],hw[0])) { // BUG in older android, outerHeight is actuall screenHeight and screenHeight is css adjusted.Should be reversed.
                 hw[0] = Math.min(oh,ow);
                 hw[1] = Math.max(ow,oh);
             }
            // alert(window.outerHeight+" "+window.outerWidth+" "+screen.width+""+screen.height);  // on android s4 mini 4.2   502 960 540 960
            p= false;
         }
         // use screen height mostly because outerHeight may be incorrect (subtracts keyboard height) after keyboard is hidden on ios
         // but we need outerHeight where possible becasue it is more accurate - ie reduces for software buttons on some phones outside of webview
         // innerheight and outerHeight are both ALREADY cssadjusted in 4.4+ so unadjust to give a safe comparison here only if already css adjusted
         // WAS Math.abs(hw[0]-oh)
         if (oh > 0 && (hw[0]-oh) > 115) { // large difference means outerHeight is css adjusted already - only in 4.4+   Unadjust here momentarily as needed.
             oh = (("devicePixelRatio" in window) ? Math.round(oh * window.devicePixelRatio) : oh);
         }
         if (oh > 0 && oh < hw[0] && (hw[0]-oh) < 75) {  // for when the phone has stupid software buttons that diminish the height of the window
             actual = true;
             hw[0] = oh;
         }
         if ("devicePixelRatio" in window) {   // use css dims - ie adjust (or readjust back if using oh) to css dims
             // if android 4.4 or higher, do not use devicepixelratio as screen width is already set to css pixels, however to be sure check that this is so with this conditional
             // you can't do this for ios (and possibly android below 4.4) because innerwidth does not work, ie does not reset after keyboard is hidden again on ios.
             if (!Utils.isAndroid() || screenWidthIsNotCssAdjusted(hw[1])) {
                 hw[0] = Math.round(hw[0]/window.devicePixelRatio);
                 hw[1] = Math.round(hw[1]/window.devicePixelRatio);
             }
             if (!actual) {  // so if we are here we need to estimate the space the status bar is taking up
                 //1=120=19  1.3333=160=25 1.5=180=25  2=240=38   2.6666=320=50  pixelDensity from 120 to 320   statusbar is always independent of css pixels
                 // However, this statubar height map is shown in after css pixels. 
                 // Using devicePixelRatio, css pixels appear to be fixed at 120 p/inch if scale is 1.
                 var statusH = Math.floor(window.devicePixelRatio * 19);
                 hw[0] -= (Utils.isIos() ? 15 : statusH); // subtract the status bar that we took out of webview for ios7 and that is always there in Android and ios6;
             }    
                 // alert( hw[1] +" "+window.devicePixelRatio);
         }
         // alert(hw[0]+" "+hw[1]);
         if (ignoreCurrentScale != null && ignoreCurrentScale) {
              if ("bZoom" in window && bZoom != 1) {
                   hw[0] /= bZoom;
                   hw[1] /= bZoom;
                   SCREEN_HEIGHT = hw[0];    // These are ALWAYS css screen dims so canonly be refreshed when unadjustedNonCssDims is false
                   SCREEN_WIDTH  = hw[1];
               }

             return hw;
         }
         // get dims WITH current scale set to make dims what we know we want them to be (429 or greater width always for css width)
         // FUCK ios7 after keyboard hides, the innerWidth/height is STILL set to the keyboard out dims!!!  FUCK
         // But NOTHING can use the screen dims ignoring scale. so if innerHeight does not work we are SHIT OUT OF LUCK!!!
         // USE force knowing that if hw[1] < 460,then innerWidth  = 429 after scale is set
         // so even know andoird may not have this problem with innerWidth on keyboard, use this following routine ALWAYS for consistency to avoid innerWidth and height.
         // This will casue keyboard overlayignoring height difference ie  KEEP the dialog buttons from showing when keyboard is out but so what it will be like ios6 always was.
         
         // set HW to a NEW cssScaledWidth & cssScaledHeight;
         if (hw[1] < 460) {
             hw[0] =  Math.round(hw[0] *= 429/hw[1]);        // this is what it MUST be after scale is completed.   This scaled css Height MUST be calcul;ated BEFORE we calculate the scaled width
             hw[1] = 429;   // this is what it MUST be after scale is completed.   SCALED WIDTH WILL ALWAYS BE 429 OR HIGHER BECASUE THAT IS WHAT WE set viewport scale to be.
         }
     }
     else if ("innerHeight" in window) {
          hw[0] =  window.innerHeight;
          hw[1] =  window.innerWidth;
          hw[2] = "usesCurScale";  // This param. is based on CURRENT scale.  So use current scale for new calc.of scale
     }
     else {
          hw[0] = document.documentElement.clientHeight;  // or document.body for quirks mode ie very old setup
          hw[1] = document.documentElement.clientWidth;
          hw[2] = "usesCurScale";
     }
     if ("bZoom" in window && bZoom != 1) {
         hw[0] /= bZoom;
         hw[1] /= bZoom;
     }
     SCREEN_HEIGHT = hw[0];    // These are ALWAYS css screen dims so canonly be refreshed when unadjustedNonCssDims is false
     SCREEN_WIDTH  = hw[1];
     return hw;
}



var messageDialog = new Dialog();




// ENDPOINTS! set by "type"
// Ex:   ajaxDialog.params["type"] = "silentLogin";  ajaxDialog.send(dialogsUrl);
var dialogsUrl = "https://" + document.domain + "/dialogs.php";
var ajaxSystemMessage = new Ajax();
ajaxSystemMessage.setSilent(true);
ajaxSystemMessage.params["type"] = "status";

// key = dialog type which corresponds to an exact fixed element - now there are 6 elements (and therefore types) -
// dialog1, 2 and 3 ... thus no more than 6 dialogs can be displayed a the same time.
Dialog.currentDisplayId = new Array();
Dialog.currentDisplayId[0] = 0;  // elem 0 should not be used.  Changed whenever a dialog showMessage or showChoice is called

// when set true,  the next dialog that results in total dialogs being empty calls the sleepMode with secure
// For our use, only refreshRoom() sets the lockDown when data.inactive is true
// Then, only the sleepMode("secure") sets the lockDown back to false
Dialog.lockDown = false;

// THE HIGH-LEVEL DIALOG AND AJAX OBJECTS
Dialog.DIALOG_CONTEXTUAL = 1;

//static dialog statusFunction.  Set this to an function that needs to be called when the mask is lifted or set
 // in our case we use an aax call function to update the server that the user is busy or free.
 //
Dialog.updateStatus = function(status,force) {
      if (Dialog.statusFunc != "") {
            Dialog.statusFunc(status,force);
      }
}

Dialog.statusFunc = "";

Dialog.setStatusFunc = function(func) {
     Dialog.statusFunc = func;
}

 // how often settingsSelector dialog is displayed until user adds an email address and accepts facebook email permission
 // starts at 1 minute.  Changed to 4 minutes.
var SETTINGS_REFRESH_INTERVAL = 120000;

var dialogTypeBeingDragged = -1;

// INJECT 6 hidden dialog elements into DOM
var allDialogsCSS = document.createElement('style'); allDialogsCSS.setAttribute("type","text/css");
allDialogsCSS.innerHTML = `
.dialog_buttons {
                background-color:#5599EE !important;
           }
 .dialogsWrapper {
             position : relative;
             top : 0px;
             left : 0px;
          }
.dialogMessage {
              margin : 5px;
              margin-top : 7px;
              margin-bottom : 7px;
              min-width : 240px;
              min-height : 30px;
              font-size : 14px;
              color : #336699;
              text-align : left;
              background-color : white;
          }
          .dialogMessageStructured {
              margin : 10px;
              margin-top : 7px;
              margin-bottom : 15px;
              min-width : 230px;
              max-width : 350px;
              min-height : 30px;
              font-size : 14px;
              color : #336699;
              text-align : left;
              background-color : white;
          }
          .dialogWrapper {
             position : fixed;
             margin-left : auto;
             margin-right : auto;
             top: 50%;
             left: 50%;
          }
          .dialog {
             margin-right : 0px;
             margin-left : 0px;
             position : absolute;
             left : 0px;
             top : -1000px;
             opacity : 0;
             transition : 1s;
             -moz-user-select : -moz-none;
             -webkit-user-select: none;
             transform: translate(-50%, -50%);
          }

          .dialog input {
              -moz-user-select : text;
              -webkit-user-select: text;
          }
          .dialog textarea {
              -moz-user-select : text;
              -webkit-user-select: text;
          }
          .dialogborder {

          }
          .dialogInner {
              margin : 7px;
              border : 1px solid #336699;
          }
          .maskwrapper {
             position : relative;
             z-index : 1;
             top : 0px;
             left : 0px;
          }
          .dialogMask {
             position : fixed;
             z-index : 1;
             top : 0px;
             left : 0px;
             right : 0px;
          }
          .dialogMaskimage {
            margin : 0px;
            width  : 0px;
            height : 0px;
          }
          .mask {
             z-index : 1;
             margin : 0px;
             position : absolute;
             top : 0px;
             left : 0px;
             height : 0px;
             width : 0px;
          }
          .maskimage {
            
          }
          .ajaxMaskWrapper {
             position : relative;
             z-index : 50;
             top : 0px;
             left : 0px;
          }
          .maskSpinner {
             z-index : 50;
             position : absolute;
             top : 190px;
             left : 0px;
             text-align : center;
             display : inline;
             width : 100%;
             height : 0px;
          }
         .maskSpinnerImage {
             position : relative;
             top : 0px;
             left : 0px; 
          }

.selDialogBorder {background : transparent;}
.selDialogWrapper {background-color : #FFFFFF; min-width : 100px; min-height : 20px; margin : 0px; border : 0px solid #112888;}
.selSmallDialogWrapper {background-color : #FFFFFF; min-width : 100px; min-height : 20px; margin : 7px; border : 0px solid #112888;}
.selDialogCoreWrapper {text-align : center;  margin : auto; position : relative; top : 0px; left : 0px;  background-color : #fefeff; max-height : 620px; max-width : 1000px; overflow : auto; -webkit-overflow-scrolling: touch}
.selDialogCore {text-align : center; display : inline-block; margin : auto; font-size : 14px; color : #777777; background-color : #fefeff;   min-width : 200px; }
.selDialogCoreNoTitle {position : relative; top : 0px; left : 0px; margin : 5px; font-size : 14px; color : #ffffff; background-color : #fcfcff; overflow-x : hidden; max-height : 450px; max-width : 600px; overflow-y : auto;}
.selDialogButtons {position : relative; bottom : 0px; left : 0px;  border-top : 1px solid #000888; background : #CCCCCC none }
.selectorStatus {font-size : 10px; color : red; padding : 5px}
.selDialogButtons {position : relative; bottom : 0px; left : 0px;}
.selDialogTitle {cursor : move; border-radius : 15px;  -webkit-border-top-left-radius : 15px; -webkit-border-top-right-radius : 15px; background : #336699; margin-left : 5px; margin-right : 5px; max-width : 1000px}
.SelectorButtonFooter {text-align : right }
.SelectorButtonFooterMobile {text-align : left }
.SelectorButtonWrapper {min-height : 35px; background : #0088BB url("./images/gradient2.jpg") repeat top left; cursor:pointer; text-align : center; vertical-align : middle; color : white; font-weight : bold;}
.SelectorButtonWrapper {border-radius : 4px; min-height : 35px; font-size : 20px;}
.SelectorButtonWrapperDisabled {min-height : 35px; background-color : #55DDFF; cursor:default; text-align : center; vertical-align : middle; color : white; font-weight : bold;}
.SelectorButtonWrapperDisabled {border-radius : 4px; min-height : 35px; font-size : 20px;}
.selectorRadioGroupHTML {margin-top : 5px;} .selectorRadioGroupHTML td {vertical-align:top; padding-right : 5px}
.centerTable {margin : 0px;} .centerTable td {vertical-align : middle; text-align : center}
.selectable { -moz-user-select : text; -webkit-user-select: text; -ms-user-select : text}
.unselectable { -moz-user-select : none; -webkit-user-select: none; -ms-user-select : none}
          .dialogHeadersWrapper {
             position : relative;
             top : 0px;
             left : 0px;
             z-index : 2147483647;
          }
          .dialogHeaders {
              position : relative;
              top : 0px;
              left : 0px;
          }`;
document.head.insertBefore(allDialogsCSS, document.head.firstChild);
var allDialogElems = document.createElement('div');  allDialogElems.setAttribute("class","dialogHeadersWrapper");  allDialogElems.id = "dialogHeadersWrapper";
allDialogElems.innerHTML = `<div class="dialogHeaders">
              <div class="dialogsWrapper">
                <div class="dialogMask" id="dialogMask">
                    <img class="dialogMaskimage" style="height : 0px; width : 0px" id="mask" src="./images/shield40.png" alt="" />
                </div>
                <div class="maskwrapper" id="maskWrapperAjax">
                  <div class="mask">
                    <img class="maskimage" id="ajaxMaskImage" src="images/clear.gif" alt="" />
                  </div>
                  <div class="maskSpinner">
                    <img class="maskSpinnerImage" id="maskSpinnerImage" src="images/clear.gif" alt="" />
                  </div>
                </div>
                <div class="dialogWrapper" id="dialogWrapper1">
                    <div class="dialog" id="dialog1">

                    </div>
                </div>
                <div class="dialogWrapper" id="dialogWrapper2">
                    <div class="dialog" id="dialog2">
                    </div>
                </div>
                <div class="dialogWrapper" id="dialogWrapper3">
                    <div class="dialog" id="dialog3">
                    </div>
                </div>
                <div class="dialogWrapper" id="dialogWrapper4">
                    <div class="dialog" id="dialog4">
                    </div>
                </div>
                <div class="dialogWrapper" id="dialogWrapper5">
                    <div class="dialog" id="dialog5">
                    </div>
                </div>
                <div class="dialogWrapper" id="dialogWrapper6">
                    <div class="dialog" id="dialog6">
                    </div>
                </div>
              </div>
</div>`;
document.body.insertBefore(allDialogElems, document.body.firstChild);
document.body.style.position = "relative";
document.body.style.top = "0px";
document.body.style.zIndex = "1";


// INIT dialog VARIABLES
for (var dialogCounter = 1;dialogCounter <= TOTAL_DIALOG_ELEMS; dialogCounter ++) {
   Dialog.currentDisplayId[dialogCounter] = 0;
   window["dialog"+dialogCounter] = document.getElementById("dialog"+dialogCounter);   // instanceof Stateable  instanceof Dialog  HTML positioned as dialogN  (Broadcasts and Ims)
   window["dialog"+dialogCounter+"timerId"] = 0;
   window["dialogWrapper"+dialogCounter] = document.getElementById("dialogWrapper"+dialogCounter);
   //window["dialog"+dialogCounter].onmousemove = function(e) {dialogMouseMove((e == undefined ? window.event : e),dialogCounter);};
   //window["dialog"+dialogCounter].onmousedown = function(e) {dialogDragStart((e == undefined ? window.event : e),dialogCounter);};
   //dialog1.onmouseout  = function(e) {dialogMouseOut( (e == undefined ? window.event : e),1);};
   //window["dialog"+dialogCounter].onmouseup   = function(e) {dialogDragEnd(  (e == undefined ? window.event : e),dialogCounter);};
   window["dialog"+dialogCounter+"X"] = 0;
   window["dialog"+dialogCounter+"Y"] = 0;
   window["dialog"+dialogCounter+"MouseDownX"] = -1;     // the absolute mouse X at the time the mouse button was pressed down to start a drag
   window["dialog"+dialogCounter+"MouseDownY"] = -1;
   window["dialog"+dialogCounter+"MouseDownElemStartX"] = -1; // the left offset of the dialog2 at the time the mouse was first pressed down
   window["dialog"+dialogCounter+"MouseDownElemStartY"] = -1;
}


//document.onmousemove = function(e) {dialogMouseMove(  (e == undefined ? window.event : e),1);};
//document.onmouseup =  function(e) {dialogDragEnd(  (e == undefined ? window.event : e),1);};

var dialogPending = false;

function trim(str) {
  return str.replace(/^\s+|\s+$/g,"");
}

function trimQuotes(str) {
  str = str.replace(/\"/g,"");
  str = str.replace(/\'/g,"");
  return str.replace(/^\s+|\s+$/g,"");
}



function validateFirstName(val,setGlobal) {
      var messageDialog = new Dialog();
      val = val.replace(/ /gi,"");
      if (val.length > 0) {
          if (val != "Guest" && val != "Entervalidfirstname") {
              if (val.length < 2) {
                  messageDialog.showMessage("Really","First Name is incorrect.  Please try again.","ok");
                  return false;
              }
          }
          else {
              messageDialog.showMessage("Really","First Name is incorrect.  Please type in your first name correctly.","ok");
              return false;
          }
      }
      else {
         messageDialog.showMessage("Really","Please include your first name.","ok");
         return false;
      }
      if (setGlobal != undefined && setGlobal) {
          firstName = val;
      }
      return true;
}

function validateUserName(val,setGlobal) {
      var messageDialog = new Dialog();
      val = val.replace(/ /gi,"");
      if (val.length > 0) {
          if (val != "Guest" && val != "Entervalidfirstname") {
              if (val.length < 3) {
                  messageDialog.showMessage("Really?","User Name needs more letters. Please try again.","ok");
                  return false;
              }
          }
          else {
              messageDialog.showMessage("Really?","User Name is incorrect. Please type in a user name.","ok");
              return false;
          }
      }
      else {
         messageDialog.showMessage("Really?","UserName is empty. Please try again.","ok");
         return false;
      }
      if (setGlobal != undefined && setGlobal) {
          userName = val;
      }
      return true;
}

function validatePassword(val,val2) {
      var messageDialog = new Dialog();
      if (val == undefined || val == null || typeof val != "string") {
           return "Empty password";
      }
      val = val.replace(/ /gi,"");
      if (val != val2) {
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

/*********************************/

function Base() {

}

Dialog.inheritsFrom(Base);

 // fade element leaving text in its place - remove the elements onclick immediately so it is ignored before it fades completely.
 //  @param fadeout = true (is there a final fadeout of second element after showing for @param fadeOutSeconds = 2)
   Dialog.fadeElem = function(elem,text,transitionSeconds,fadeOutSeconds,fadeOut) {
        if (elem == null) {
            return;
        }
        var div1 = document.createElement("div");
        div1.style ="position : relative; top : 0px; left : 0px;";
        var div2 = document.createElement("div");
        div2.innerHTML = text; // textContent
        div2.style = "transition : 1s; opacity : 0; position : absolute; top : 0px; left : 0px;";
        var parent = elem.parentNode;
        parent.replaceChild(div1,elem);
        div1.appendChild(elem);
        div1.appendChild(div2);
        elem.onclick = "";
        elem.style.opacity = "1";
        elem.style.transition = "1s";
        setTimeout(function() {elem.style.opacity = "0"; div2.style.opacity = "1"},80);
        if (fadeOut == undefined || fadeOut) {
            setTimeout(function() {div2.style.opacity = "0"},2000);
        }
   }

// The Dialog Alert OBJECT
function Dialog(type,context) {
   var that = this;
   var dType = (type != undefined ? type : 2); // which div to display dialog in, 1, 2 or 3.  3 has the highest priority z-index 1 overwrites 1, etc...
   var onConfirm0 = "";
   var onConfirm1 = "";
   var onConfirm2 = "";
   var onConfirm3 = "";
   var onConfirm4 = "";
   var name = "";   // setDialog uses this to confirm that no other dialog is a slepModeSecure dialog - so far used only need by set by sleepModeSecureDialog

   // vars for remembering and displaying dialog after alaready shown and erased via showLast()
   var title = "";
   var body = "";
   var confirm0Label  = "";
   var confirm1Label  = "";
   var confirm2Label  = "";
   var confirm3Label  = "";
   var confirm4Label  = "";
   var iframeSource = "";

   var dButton;
   var dButton1;
   var dButton2;
   var dButton3;
   var dButton4;
   var snap = true;
   var timer0 = 0;  // if timeout > 0, countdown is shown next to onConfirm and onConfirm button is excuted at end of timeout milliseconds
   var timer1 = 0;
   var timer2 = 0;
   var timer3 = 0;
   var timer4 = 0;
   var buttonDisable0=false;
   var buttonDisable1=false;
   var buttonDisable2=false;
   var buttonDisable3=false;
   var buttonDisable4=false;

   var autoErase = true;
   var snapOffsetX = 0;
   var snapOffsetY = 0;
   var statusUpdatesDisabled = false;
   var displayId = 0;  // changes with each call to showMessage or showChoice
   var autoMask = true;
   var maskAfterErase = false;
   var useCustomPosition = false;
   var customX = 0;
   var customY = 0;
   var embeddedElem = "";
   // actual x and y on last show or erase
   var lastX = 0;
   var lastY = 0;
   var small2 = false;   // if true,  mobile mode will still honor the small size just like aklways is the case for type=2
   var silent = false;  // in background in case there is a warning message or other that this is overwriting, it will remain in background unless nothing else is showing.  all type 2 dialogs should be highest z-index but that is not yet the case.
   var isSettingsDialog = false;
   var fixed = false;
   var dialogHeight = "500"; // default
   
   this.fadeToHtml = function(text) {
        var e = document.getElementById("dialogMessage"+that.getType()+displayId);
        if (e != null) {
            Dialog.fadeElem(e,text,0,0,false);
            return true;
        }
        return false;
   }

   // if this is the settings dialog the onclick of the down arrow will erase the dialog otherwise it will show the settings dialog
   // se setSettings
   this.setIsSettings = function() {
       isSettingsDialog = true;
   }
   
   this.isSettings = function() {
       return isSettingsDialog;
   }

   this.setName = function(n) {
       name = n;
   }
   this.getName = function() {
       return name;
   }
   this.isSmall = function() {
     return small2;
   }
   this.setSmall = function(s) {
      small2 = s;
   }
   // embed this dialog in the passed elem
   this.embed = function(e) {
       embeddedElem = e;
   }
   this.setEmbeddedElem = function(e) {
       embeddedElem = e;
   }
   
   // set dialog position as fixed position - not staying in center - but scrolling out of view when window scrolls.
   // this automaticlaly turns off scrolling so sets overflow to auto
   // @param set = default = false, overflow is set to auto (scroll) if false (default) and visible if true
   this.setFixed = function(set,dh) {
       fixed = set;
       if (dh != null) {
           dialogHeight = dh;
       }
   }
   
   // if true, dialog will appear embedded in html page - as so many websites do with JQuery - now you can do it with KenGen :)
   // Note:  fixed means position is NOT fixed,  position fixed means floats with window - so setFixed = false = default. Horrible is the css nomenclature
   this.isFixed = function() {
     return fixed;
   }

   // fixed on page with no scroll bars - user scroll main window - or floats with window (which happens to be called style = fixed - confusing)
   this.setFixedStyle = function() {
        if (that.isFixed()) {
           window["dialogWrapper"+dType].style.position="absolute";
           var space = Math.floor(Math.max(window.innerHeight - dialogHeight - 40,0)/2) + Math.floor(dialogHeight/2);
           window["dialogWrapper"+dType].style.top=(space+window.pageYOffset)+"px"; // position : fixed; top : 50%; left : 50%;  window["dialog"+dialogCounter]
           window["dialogWrapper"+dType].style.left="50%";
           window["dialogWrapper"+dType].style.bottom="";
           window["dialog"+dType].style.transform="translate(0%, -1%);";
       }
       else {
            window["dialogWrapper"+dType].style.position="fixed";
            window["dialogWrapper"+dType].style.left="50%";
            window["dialogWrapper"+dType].style.top="50%"
            window["dialog"+dType].style.transform="translate(-50%, -50%);";
       }
   }

   this.getEmbeddedElem = function() {
       return embeddedElem;
   }
   
   this.isEmbedded = function() {
       return embeddedElem != undefined && embeddedElem != "" && embeddedElem != false;
   }

   this.customPosition = function() {
      return useCustomPosition;
   }
   
   this.isCustomPosition = function() {
      return useCustomPosition;
   }
   
   this.getCustomX = function() {
       return customX;
   }
   this.getCustomY = function() {
       return customY;
   }
   this.getTitle = function() {  // the core message of the dialog - if this is an object then toHTML() is used on the object so object must be of type HTMLable (like a Publishable)
       return title;
   }
   this.setTitle = function(t) {  // the core message of the dialog - if this is an object then toHTML() is used on the object so object must be of type HTMLable (like a Publishable)
       title = t;
   }
   
   this.getBody = function() {  // the core message of the dialog - if this is an object then toHTML() is used on the object so object must be of type HTMLable (like a Publishable)
       return body;
   }
   this.setBody = function(b) {  // the core message of the dialog - if this is an object then toHTML() is used on the object so object must be of type HTMLable (like a Publishable)
       body = b;
   }
   
   this.getSilent = function() {  // puts in background
       return silent;
   }
   this.setSilent = function(s) {
       silent = s;
   }

   this.setUseCustomPosition = function(bool) {
      useCustomPosition = bool;
   }
   // set customPosition to that of the last showed position of a dialog of type of passed dialog - MUST be last displayed of the given type to be eual to the position of the passed dialog
   this.setCustomPosition = function(dialog) {
      customX = window["dialog"+dialog.getType()+"X"];
      customY = window["dialog"+dialog.getType()+"Y"];
      useCustomPosition = true;
   }
   
   this.setCustomPos = function(x,y) {
      customX = x;
      customY = y;
      useCustomPosition = true;
   }

   this.getDisplayId = function() {
       return displayId;
   }

   this.updateStatusDisabled = function() {
       return statusUpdatesDisabled;
   }
   
   this.disableStatusUpdates  = function() {
       statusUpdatesDisabled = true;
   }
   
   this.enableStatusUpdates  = function() {
       statusUpdatesDisabled = false;
   }

   this.getAutoErase = function() {
      return autoErase;
   };
   this.setAutoErase = function(er) {
      autoErase = er;
   };
   this.setErase = function(er) {
      autoErase = er;
   };
   this.erase = function() {
       // safety.  If the dialog is no longer showing becasue it has been replaced by another dialog of the same type - or otherwise erased - do NOT erase.
       if (that.getDisplayId() != Dialog.currentDisplayId[that.getType()]) {
           return;
       }
       setDialog(emptyHTML,that);
   }
   this.eraseDialog = function() {
       that.erase();
   }
   this.setMaskAfterErase = function(m) {
       maskAfterErase = true;
   }
   this.getMaskAfterErase = function() {
       return maskAfterErase;
   }
   this.getTimer = function() {
      return timer0;
   };
   this.setTimer = function(t,num) {
       if (isNaN(t)) {
           return;
       }
       if (num != undefined && !isNaN(num) && num < 5) {
           eval("timer"+num) = t;
       }
       else {
           timer0 = t;
       }
   };
   this.disableButton = function(on,buttonNum) {
       if (buttonNum != undefined && !isNaN(buttonNum) && buttonNum < 5 && buttonNum > 0) {
           eval("buttonDisable"+buttonNum) = on;
       }
       else {
           buttonDisable0 = on;
       }
       if (document.getElementById("dialog"+displayId+"Button_"+buttonNum) != undefined) {
           document.getElementById("dialog"+displayId+"Button_"+buttonNum).className = (on ? "SelectorButtonWrapperDisabled" : "SelectorButtonWrapper");
       }
   };
   this.setSnap = function(s) {
      snap = s;
   };
   this.setMask = function(s) {
       autoMask = s;
   };
   this.getMask = function() {
       return autoMask;
   };
   this.setSnapOffset= function(x,y) {
      if (x != undefined) {
          snapOffsetX = x;
      }
      if (y != undefined) {
          snapOffsetY = y;
      }
      snap = true;
   };
   this.copySnapOffset = function(dialog) {
      snapOffsetX = dialog.getSnapOffsetX();
      snapOffsetY = dialog.getSnapOffsetY();
      that.setSnap(true);
   };
   this.getSnapOffsetX = function() {
       return snapOffsetX;
   }
   this.getSnapOffsetY = function() {
       return snapOffsetY;
   }
   this.snapOnShow = function() {
      return snap;
   };
   this.getType = function() {
       return dType;
   }
   this.setType = function(t,s) {
       dType = t;
       if (s != undefined) {
           small2 = s;    // always small for type=2 anyway  see setDialog()
       }
   };

   /** return true if message is already showing and we can therefore successfully change it*/
   this.changeMessage = function(title1,body1,okText,okText1,okText2,okText3,iframeSrc,okText4) {
       var elem = document.getElementById("dialogMessage"+that.getType()+displayId);
       if (elem != undefined) {
           Utils.setInnerHTML(elem,body1);
       }
       else {
           that.showChoice(title1,body1,okText,okText1,okText2,okText3,iframeSrc,null,okText4);
       }
   };

   // public functions overridable and usable from subclasses
   this.setConfirm = function(func) {
       onConfirm0 = func;
       that.mapButtonToEvent(0);
   };
   this.setConfirm1 = function(func) {
       onConfirm1 = func;
       that.mapButtonToEvent(1);
   };
   this.setConfirm2 = function(func) {
       onConfirm2 = func;
   };
   this.setConfirm3 = function(func) {
       onConfirm3 = func;
   };
   this.setConfirm4 = function(func) {
       onConfirm4 = func;
   };

   // show lastdialog using current state of whatever text or obj.toHTML() was past as the body
   this.showLast = function(body1) {
       that.setFixedStyle();
      // create the html of a dialog alert and then call setDialog();
      snap = false; // show in same position of last showing
      displayId = new Date().getTime();  // see dialogButtonClicked()
      if (!that.isEmbedded()) { // dialogs embedded will not be displayed in the dialog div - so do NOT update the currently displayed dialog as it would be false
          Dialog.currentDisplayId[that.getType()] = displayId;  // this is necesary to allow a confirm to populate another dialog of the same type - afterwhich erase of the old dialog would not be possible
      }
      if (body1 != undefined) {
          body=body1;
      }
      setDialog(that.makeDialogHTML(title,body,confirm0Label,confirm1Label,confirm2Label,confirm3Label,confirm4Label,iframeSource),that);
      // now that the buttons are displayed AGAIN - the html is considered new - even though the ids are the same - sibce they were erased and redon their event mappings are lost
      // so we need to remap them - register the button element events
      that.mapButtonToEvent(0); that.mapButtonToEvent(1); that.mapButtonToEvent(2); that.mapButtonToEvent(3); that.mapButtonToEvent(4);
   };
   
   this.closeHtml = function(t,r) {
       t = (t== undefined ? "62px" : (t+"px"));
       r= (r == undefined ? "12px" : (r+"px"));
       var s = `<div style="z-index : 2000000; position : relative; top : 0px; left : 0px; height : 23px;"><div style='margin : auto;  background : #555555; border-radius : 11px; width : 22px; height : 22px; text-align : center; color : white; font-size : 14px; font-weight : bold; position : absolute; right : `+r+`; top : `+t+`; cursor : pointer;' onclick='eraseTopDialog()'><div style="position : relative;top : 1px; left : 0px">X</div></div></div> `;
       return s;
   }

   this.show = function(html) {
        that.setFixedStyle();
        // no confirms or separate title or body is set herein
        // all events/buttons defined in html already, this dialog is just a template for the passed html - controls such as offsets and type  (all buttons/onConfirm events are presumed embedded html)
         displayId = new Date().getTime();  // see dialogButtonClicked()
         if (!that.isEmbedded()) { // dialogs embedded will not be displayed in the dialog div - so do NOT update the currently displayed dialog as it would be false
             Dialog.currentDisplayId[that.getType()] = displayId;  // this is necesary to allow a confirm to populate another dialog of the same type - afterwhich erase of the old dialog would not be possible
         }
         // wait a quarter second to avoid freezes on many fast clicks if user is fucking around, delete queue of timeouts and jsut use last one.
        setTimeout(function() {setDialog(that.closeHtml()+html,that);},150);
   };
   
   this.setIframeSource = function(iframeSrc) {
      iframeSource = iframeSrc;
   }
   
   this.set = function(title1,body1,okText,okText1,okText2,okText3,iframeSrc,okText4) {
       if (title1 !== undefined) {
           title = title1;
       }
       if (body1 !== undefined) {
           body =  body1;
       }
       if (okText !== undefined) {
           confirm0Label = okText;
       }
       if (okText1 !== undefined) {
           confirm1Label = okText1;
       }
       if (okText2 !== undefined) {
           confirm2Label = okText2;
       }
       if (okText3 !== undefined) {
           confirm3Label = okText3;
       }
       if (okText4 !== undefined) {
           confirm4Label = okText4;
       }
       if (iframeSrc !== undefined) {
           iframeSource = iframeSrc;
       }
   }


   this.showChoice = function(title1,body1,okText,okText1,okText2,okText3,iframeSrc,noIscroll,okText4,silent) {  // iscroll is only used on mobile apps.
                  that.setFixedStyle();
                  if (noIscroll == undefined) {
                      noIscroll = false;
                  }
                  // if this same object is displayed, erased and displayed multple times - needs a NEW displayID each time - very important - so oncConfirm events can access it if necessary.
                  // we can't do the erase befre the confirm function because a confirm may need access to some elements in the dialog - for this subtle nuance we have the displayId
                  // becasue the new would take the place of the old in the innerHTML - and any attempted erase of the new would then erase the new!
                  displayId = new Date().getTime();  // see dialogButtonClicked()
                  if (!that.isEmbedded()) { // dialogs embedded will not be displayed in the dialog div - so do NOT update the currently displayed dialog as it would be false
                     Dialog.currentDisplayId[that.getType()] = displayId;  // this is necesary to allow a confirm to populate another dialog of the same type - afterwhich erase of the old dialog would not be possible
                  }
                  // store passed body and button labels
                  if (title1 !== null) {
                      title = title1;
                  }
                  body =  body1;
                  confirm0Label = okText;
                  confirm1Label = okText1;
                  confirm2Label = okText2;
                  confirm3Label = okText3;
                  confirm4Label = okText4;
                  iframeSource = iframeSrc;
                  var timerId = 0;
                  // set uniqueDisplay ID
                  // create the html of a dialog alert and then call GLOBAL setDialog();
                  if (silent == null) {
                      silent = false;
                  }
                  setDialog(that.makeDialogHTML(title,body,okText,okText1,okText2,okText3,okText4,iframeSrc),that,silent,null,noIscroll);     // setDialog(dialogHTML,dialog,silent,type,noIScroll)
                  // register the button element events
                  that.mapButtonToEvent(0); that.mapButtonToEvent(1); that.mapButtonToEvent(2); that.mapButtonToEvent(3); that.mapButtonToEvent(4);
   };
   
   this.showMessage = this.showChoice;

   this.mapButtonToEvent = function(buttonNumber) {
       var elem = document.getElementById("dialog"+displayId+"Button_"+buttonNumber);
       var timerId = 0;
       var onConfirm = eval("onConfirm"+buttonNumber);  // eval NOW not when clicked casue it wont find the local var at time of clicking in an eval.
       if (onConfirm == null) {
           return;
       }
       if (eval("timer"+buttonNumber) > 0) {
           var insideId = "#dialog"+that.getType();
           timerId =  setTimeout(function() {that.dialogButtonClicked(elem,buttonNumber,onConfirm);},eval("timer"+buttonNumber)); // auto-click at timeout
       }
       if (elem == undefined) { // button label (and therefore button) was not created so it cannot be clicked.
           return;
       }
       elem.onclick = function() {clearTimeout(timerId); that.dialogButtonClicked(elem,buttonNumber,onConfirm);};
   };

   // after clicking button:
   // 1)  confirm ACTION IS PERFORMED
   //    autoErase defaults to true - if it is set false  dialog will NOT erase after button action unless the action returns true
   //     if autoErase is left as default it does NOT MATTER WHAT YOU RETURN or if you return nothing - dialog will always erase.
   // 2)  only if action returns TRUE or getAutoErase() is true - this dialog is auto ERASED from screen (displayId ensures it is same dialog as was displayed when button was pressed before action was performed.)
   this.dialogButtonClicked = function(button, buttonNumber, nextAction) {
        // safety.  If called via a timer and the dialog is no longer showing becasue it has been replaced by another dialog of the same type - or otherwise erased - do NOT execute the button
        if (that.getDisplayId() != Dialog.currentDisplayId[that.getType()]) {
            return;
        }
         if (eval("buttonDisable"+buttonNumber)) {
            return;
        }
        // setBeep("button",50); // expensive - but now done in sound.js - setBeep just puts it on the queue
        if (button != undefined) {   // an onconfirm or settimeout to auto act an onconfirm action can all exist without any of the 4 optional button elements displayed (therefore no buttons exist).
            button.style.background = "#5599DD";
        }
        var resetButton = false;
        if (nextAction != undefined && nextAction != "") {
            resetButton = (nextAction.call() != false);  // undefined defaults to true - so setAutoErase() remains used.  If the action failed and the dialog remains, the button color should reset a short time after click
        }                                                // null would evaluate to boolean false and  undefined should also evaluate to boolean false!!
        // clearing the dialog should always be AFTER the nextAction() in case something in the callback needs access to some html element in the dialog
        // due to that it is necessary to be SMART ie do NOT erase if another dialog is now being displayed - ie it is possible
        // and probable that the confirm action (nextAction) causes some other dialog to be displayed!  We would not want that next dialog to immediatley disappear just because
        // this nextAction is now complete! change to: && (resetButton == undefined || resetButton)) ||  resetButton != undefined && resetButton)  i.e. nextAction returning false should mean do NOT erase
        //   therefore we can just add this line of code: if (resetButton != undefined then autoErase = resetButton)
        //   i.e. nextAction returning false should mean do NOT erase - and nextAction not returning anything defaults to current value for autoErase
        if (!that.isEmbedded() && (that.getAutoErase() || (resetButton != undefined && resetButton)) && (that.getDisplayId() == Dialog.currentDisplayId[that.getType()])) {
            // may already have been manually erased
            setDialog(emptyHTML, that);  // Erase the alert message and remove the shield  whenever any alert message button is clicked
        }
        else {
            // alert(that.isEmbedded()+" "+that.getAutoErase()+" "+that.getType()+" "+that.getDisplayId()+" "+Dialog.currentDisplayId[that.getType()]+" "+(that.getDisplayId() == Dialog.currentDisplayId[that.getType()])+" "+(that != undefined));
        }
        //else if (resetButton != undefined && resetButton === false) { // there was no next action or next action explicitly returned false and the dialog is still showing
            // somehow to check to see if element is visible first - ie this EXACT dialog has not yet been erased.
            setTimeout(function() {if (button != undefined && 'style' in button) {button.style.background = "#336699";} },200);
            //return;
        //}
    };


    
    this.makeDialogHTML = function(title1,bodyText,okText0,okText1,okText2,okText3,okText4,iframeSrc) {
          bodyText = (bodyText instanceof Object && "toHTML" in bodyText ? bodyText.toHTML() : bodyText)
          if (bodyText == undefined) {
             bodyText = "";
          }
      if (okText0 == undefined) {
         okText0 = "OK";
      }
      var messageClass =  'dialogMessage';
      if (bodyText.indexOf("<table") == -1 && bodyText.indexOf("<div") == -1) {
           messageClass = 'dialogMessageStructured'; // <= has a max-width because body has no structure
           if (bodyText.indexOf("<br>") != -1) {
               bodyText = wordWrapBRExists(bodyText,"<br>",50);
           }
           else if (bodyText.indexOf("<br/>") != -1) {
               bodyText = wordWrapBRExists(bodyText,"<br/>",50);
           }
           else {
               bodyText = wordWrap(bodyText,"<br>",50);
           }
      }
      // FUCKING CSS THERe IS NO WAY TO MSET THE HEIGHT OF A DIV TO THE PARENT ELEMENT
      // regardless ttht it works with width, not with height, height 100% does NOT work for shit.  Do not use it. margin 0px does not work for shit either.
      // div height is only the minimum it needs to be to support what is inside it.  unless you EXPLICITLY set the ehight that is the only basis to then do vertical centering correctly.
      // ABSOLUTE positioning BREAKS centering when using display table-cell - more BULLSHIT.  must have a third element inside the absolute.
      var header = "";
      var hdrHeight= (that.getType()  == 2 || that.isSmall()) ? "30px" : " 40px";
      var padTop = (that.getType()  == 2 || that.isSmall()) ? "1px" : " 6px";
      if (title1 != "") { // title1 is now always centered as spotwired logo will go on left so lock button can go on right
         header += "<div id='dialogTitle"+that.getType()+"'' style='background : #336699;position : relative; top: 0px; left : 0px;'>";
         header += "    <div style=' position : absolute; top: 0px; left : 20px;'>";
         header += "       <div  style='cursor : pointer; margin-top : "+ padTop +"' text-align : center; height :"+hdrHeight+";'>"; // onclick='AdminSelector.appVerify();'
         header += "             <img src='" + ("TRANS_ICON_URL" in window ? TRANS_ICON_URL : LOGO_URL) + "' alt='' style='height:28px;' />";  // BASE_URL_IMAGES + "couple1.gif
         header += "       </div>";
         header += "    </div>";
         if  (that.getType() != 2) {
             header += "    <div style=' position : absolute; top: 1px; right : 20px;'>";
             if (this.isSettings()) {
                 header += "       <div onClick='setDialog(emptyHTML,null,false,"+that.getType()+");' style='cursor : pointer; display : table-cell; text-align : center; vertical-align : middle;height :"+hdrHeight+";'>";
             }
             else {
                 header += "       <div onClick='selectSettings();' style='cursor : pointer; display : table-cell; text-align : center; vertical-align : middle;height :"+hdrHeight+";'>";
             }
             header += "         <img src='" + ("SETTINGS_ICON_URL" in window ? SETTINGS_ICON_URL : LOGO_URL) + "' alt='' style='height:26px;' />";  // BASE_URL_IMAGES + "couple1.gif
             header += "       </div>";
             header += "    </div>";
         }
         header += "    <table style='width : 100%'>";
         header += "      <tr>";
         header += "        <td style='text-align : center; vertical-align : middle; height : " + hdrHeight + "'>";
         header += "          <div style='margin : auto; text-align : center; color : white; font-size : 12px; font-weight : bold'>";
         header +=                title1;
         header += "         </div>";
         header += "       </td>";
         header += "      </tr>";
         header += "    </table>";
         header += "</div>";
      }

     var body1  = "";
         body1 += "         <div id='dialogMessage"+that.getType()+displayId+"' class='" + messageClass+"'>";
         if (that.getType() == 2) {
             body1 +=              "<div style='-webkit-touch-callout: none;-webkit-user-select: text; -moz-user-select: text;-ms-user-select: text;user-select: text;'>" + bodyText + "</div>";
         }
         else {
             body1 +=              "<div>" + bodyText + "</div>";
         }
         if (iframeSrc != undefined && iframeSrc != "") {
              body1 +=       "    <br/><iframe class='fblogin' id='dialog"+that.getType()+"Frame' src='" +iframeSrc+"' width='350' height='400'> ";
              body1 +=       "    </iframe> ";
         }
         body1 += "         </div> ";

         var align = Utils.isMobile() || Utils.isPad() ? "left" : "right";
     var buttons  = "<div align='"+align+"' id='selDialog" + that.getType() + "Buttons' class='selDialogButtons'>";
         //buttons += "        <table align='right' style='width : 100%; background-color : #CCCCCC;'>";
         //buttons += "           <tr>";
         //var ass =  isMobile ? 'left' : 'right';
         //buttons += "    <td align='ass'>";
         buttons += "     <div style='margin : 7px; display : inline-block;'>";   // inline block makes the div only as wide as the buttons so it can be shifted to the right or left
         buttons += "       <table style='margin : auto; vertical-align : middle; " + (that.getType() == 2 || that.isSmall() ? " height : 20px;" : " height : 50px;") +"'>";
         buttons += "          <tr>";


         var width1;
         var labels = new Array();
         var i;
         for (i = 0; i < 5; i++) {
             if (eval("okText"+i) != null) {
                 labels[i] = eval("okText"+i);
             }
         }
         var h = Utils.isPad() ? '35px' : (Utils.isMobile() ? '35px' : '30px');
         var bClass = "";
         for (i = 0; i < labels.length; i++) {
             if (typeof labels[i] == "string" && labels[i] == "") {
                 continue; // some cases force a button slot to be empty so the correct buitton slot lines up with the correct onConfirm slot
             }
             width1 = (labels[i].length * 7);
             width1 = width1 + "px";
             //buttons += "         <td style='width : 5px;'>";
             //buttons += "         </td>";
             if (typeof labels[i] == "string" && labels[i].toLowerCase() == "learn more") {
                 buttons += "<td><div style='margin-right : 30px;'><a href='/?splash'>"+labels[i]+"</a></div></td>";
             }
             else {
                bClass = (eval("buttonDisable"+i) ? "SelectorButtonWrapperDisabled" : "SelectorButtonWrapper");
                buttons += "         <td id='dialog"+displayId+"Button_"+i+"' class='"+bClass+"'>";
                buttons +=               "<div style='margin : 5px;'>"+ (typeof labels[i] == "string" && (labels[i].toLowerCase() == "close"  || labels[i].toLowerCase() == "done") ? "<img height='"+h+"' src='" + BACK_ARROW_URL + "' />" : that.makeDialogButton(labels[i]))      +"</div>";
                buttons += "         </td>";
             }
             buttons += "         <td style='width : 10px;'>";
             buttons += "         </td>";
         }
         buttons += "<td>    </td>"
         buttons += "          </tr>";
         buttons += "       </table>";
         buttons += "     </div>";
         buttons += "    </div>";
         // no scroll bars - show all if fixed is true (also showMessage adjusts dialogwrpper style as top pageYoffset and left 0% and position relaive or absolte in stead of fixed at 50% 50%)
         var scrolling = "style = '"+(that.isFixed() ? "overflow : visible" : "overflow : auto") + "'";
         var coreHTML = "<div id='selDialog" + that.getType()  + "CoreWrapper' class='selDialogCoreWrapper' "+scrolling+"><div id='selDialog" + that.getType()  + "Core' class='" + ((title1 != "") ? "selDialogCore" : "selDialogCoreNoTitle") + "'>" + body1 + "</div></div>";
         // the selDialogWrapper gives a cohesion to the 3 elemetns of a dialog (title body and buttons)
         // With it, ther eis a base background of white so that the margin added by selDialogCore on all duialogs has a bakcground of white and not transparent the wrapper also gives a base border before the outer border
         return "<div class='selDialogBorder'>"+that.closeHtml(32,12)+"<div class='"+ ((that.getType() == 2 || that.isSmall())? "selSmallDialogWrapper" : "selDialogWrapper") + "'> " + header + coreHTML + buttons + "</div></div>";
};

this.makeDialogButton = function(label) {
    if (typeof label == "object") {
         var t = "<table><tr><td style='text-align : center'><img  height='29' width='29' src='" + label[0] + "' /></td></tr><tr><td style='text-align : center'>"  + label[1] + "</td></tr></table>";
         return t;
      }
      else {
         return label;
      }
}

   this.setContext = function(elem) {
                         // moves this dialog to be displayed over the position of the passed element
   }

   if (context != undefined) {
      this.context = Dialog.DIALOG_CONTEXTUAL;
   }
   else {
      this.context = 0;
   }

   return that;
}



 // for server-side dialogs only - NOT javascript dialog objectw, these correspond to type 1 element dialog1
function dialogButtonClicked(button) { // button is the button element
    // setBeep("button",500); // expensive - but now done in sound.js - setBeep just puts it on the queue
    button.style.background = "#5599DD";
    // somehow to check to see if element is visible first - ie this EXACT dialog has not yet been erased.
    setTimeout(function() {if (button != undefined && 'style' in button) {button.style.background = "#336699";} },200);
}


function wordWrapBRExists(str,breakString,count) {  // add breaks to text formatted with <br> and no other html present when words are too long and dont have whitespace.
    if (str.length < count) {
        return str;
    }
    var temp = "";
    var startPos = 0;
    var endPos = str.indexOf(breakString);
    while (1 == 1) {
       if (endPos == -1) {
            temp +=  str.slice(startPos);
            return temp;
       }
       if (endPos - startPos > count) {
            temp +=  str.slice(startPos,startPos+count) + breakString;
            startPos += count;
       }
       else {
          endPos = endPos+breakString.length;
          temp +=  str.slice(startPos,endPos);
          startPos = endPos;
          endPos = str.indexOf(breakString,startPos);
       }
    }
    return str; // can never reach here but we need a return value to avoid warning message
}

// add s to str every count characters  loosely looking for a whitespace to do insert near the desired breakpoint
//  within 20% of the desired line count - ie this function attempts to preserve whole words.
function wordWrap(str,splice,count) {
    if (str.length < count) {
        return str;
    }
     var j;
     var temp = "";
     var play = Math.round(count*.2);
     var pos = count;
     var lastPos = 0;
     var whiteSpaceFound=false;
     var done = true;
     while (!done) {
         for (j = pos; j > pos - play; j--) {
             if (j >= str.length) {
                 j = str.length - 1;
                 done = true;
             }
             if (str.charAt(j) == " " || str.charAt(j) == "," || str.charAt(j) == "<") {
                  j++;
                 whiteSpaceFound = true;
                 break;
             }
         }
         if (!whiteSpaceFound) {
             j = pos;
         }
         whiteSpaceFound = false;
         temp = temp + str.slice(lastPos,j) + splice;
         lastPos = j;
         pos = j + count;
     }
     if (temp != "") {
         return temp;
     }
     else {
         return str;
     }
}

// Default ajax for editor sending its publishable as an instant note when not called with an event action callback function
//Editor.ajax = new Ajax();
//Editor.ajax.params["notifyType"] = 2;

// END DialogAlert Object definition


// Editor.inheritsFrom(Dialog);




function clearSessionFB() {
   GET = ""; // clears the FB session which is stored in the GET var.
   fbid = "";
   var d = new Date();
   d.setTime(d.getTime() - 100000);
   deleteCookie("fbid");
   // document.cookie = "vlvlfbid=; expires=" + d.toGMTString() + "; path="+PATH;
   // cookies should have been cleared via server header request to browser via session.php  BEFORE this method was called.
}

// 1) send  refresh with status of 'loggedOut' or 'gone'  - params are set instantly so session can be cleared immediately thereafter
// 2) set ajax.lock so no more Ajax can happen until refresh returns. and so spinner is displayed non-stop
// 3) on refresh callback, new sessionId cookie is now already set,    (if statusUpdate was 'loggedOut' or 'gone' to unlock ajax and call sleepMode('loggedOut')
//      should this refresh never arrive, remain locked with spinner forcing user to refresh.
function logout(mode) {
     Ajax.unlock();
     //alert("preLogout session"+getCookie("sessionId"));
     if (!Utils.isEmpty(fbid) && !Utils.isEmpty(getCookie("access_token"))) {
         logoutFaceBook(getCookie("access_token"));
     }
     fbLoginSession = null;
     if (Utils.isEmpty(uid)) {
        clearSessionNow();
        sleepMode("loggedOut");
        return;
     }
     updateStatus(mode,true,false); // <== doItNow = false sent in refresh below
     // the callback will call postLogout which calls sleepMode("loggedOut") REMOVE taht and do the sleepMode NOW!   no harm in doing the last refresh after sleepMode is called
     refreshLoop(false,false);  // refreshActive is now false, so updateStatus will not update now unless force is true, AND ten refreshLoop should not also pass the status, so call it here and then return
     Ajax.lock(true); // no more Ajax can be sent and spinner/shield is set
     clearSessionNow();   // as actual refresh jax send is in a timeout, this clear will happen FIRST - to be sure that on refresh callback, new sessionId will be set and not erased.
     sleepMode("loggedOut");
}

// called by refreshReceived Callback is status was "gone" or "loggedOut"
// for testing, alert the new sessionID that shold be here now
function postLogout() {
    //alert("postLogout session"+getCookie("sessionId"));
    Ajax.unlock();
    sleepMode("loggedOut");
}


// WARNING!  this will be circular if you call from intorSelectorEvent with mode='loggedOut' which via sleepMode() recalls the introselector for now until we cahnge it to a static dialog that does not use ajax
// deprecating this! in favor of clearSessionNow() only
function clearSession(mode) {  // clearSessionId
    // without a uid, we should be in sleepMode AND autorefresh turned off!
    // call this BEFORE erasing the uid, so Core.setStatus() can update this users status to "away" - stays in spy mode
    // until window is closed
    if (mode != undefined && mode != "ajax") {   // !Utils.isApp() &&
        sleepMode(mode);  // calls updateStatus immediately
    }
    // next line will never be caslled unless !isApp is added back in above if - also add initSession back to celarSessionNow() if you want to go back to the route of getting a sessionId all over again.
    //else if (mode != undefined && (mode == "loggedout" || mode == "gone")) {  // this will shutoff isWatching at server too so when initSession is called in clearSessionNow() isWatching will come up false and no uid either
    //    updateStatus(mode,true,true);     // sleepMode will ultimately be called by init() and so an ajax refresh will still be sent every minute or so, options refresh willr eturn with error if no uid is present...
    //}                                     // mode of gone also removes user from userLocations
    // Give one second before clearing session cookie so that updateStatus can be called via sleepMode() using ajax without server error
    //alert("clearSession(): WHAT THE FUCK IS CLEARING THE SESSION!!!!"+mode+" "+arguments.callee.caller.name);
    setTimeout(function() {clearSessionNow();},700);
}

// to be sure, there is alos a facebook set cookie that we cannot reliably know the name of, but if we do not delete it, then user will not be logged out of facebook from this domain,
// meaning if user is logged out of facebook or not,  when redirecting,  the facebook set access token will still be sent, so login will happehnh automatically - but that is not the desired effect
// if user has logged out of this application, rather, when clicking f-login again,  user should have to enter new login credentials into the facebook popup.
// therefore delete ALL domain cookies from this domain, not jsut the ones we put here, but facebook and paypal set cookies for THIS domain as well.
function clearSessionNow() {
     //  CLEAR the cookies and CLEAR ALL SESSION VARIABLES
    // cookies should have been cleared via server header request to browser via session.php  BEFORE this method was called.
    GET = "";
    uid = "";
    passKey = "";
    password = "";
    firstName = "";
    lastName="";
    fbid = "";
    FACE_IMAGE_URL = "";
    fbLoginSession = null;
    // placeId = 0;
    // placeName = "";
    // lid = 0;   // NEVER erase the lid or on return of refreshLoop (ie index.processRefreshReceived()) would cause an undesired teleport - and when not logged in could be VERY bad, causing screens to show without shield...
    // cid = 0;
    deleteCookie("sessionId");
    deleteCookie("uid");
    deleteCookie("fbid");
    deleteCookie("passKey");
    deleteCookie("access_token");
    deleteCookie("facebookError");
   
    deleteAllCookies();  // clears localStorage as well
    if (page == undefined) {
       //alert("page undefined");
    }
    if (!("clearSession" in page)) {
       //alert("page without clearSession"+ Utils.toString(page));
    }
    page.clearSession();
    //if (clearSessionId == undefined || clearSessionId) {
        // document.cookie = "vlvlsessionId=; expires=" + d.toGMTString();
    //}
    //if (mode != undefined && mode == "ajax") {
    //    return;
    //}
    //ajaxOptions.params["type"] = "getNav";
    //ajaxOptions.send(optionsUrl);
    //alert(printCookies());
    //setTimeout(function() {ajaxOptions.send(dialogsUrl);alert(printCookies());},2000);
    // if we cleared the session, user specifically logged out and so status should be set to away
    // even though as long as screen is open - user is in "spy" mode refreshes every 60 seconds
    // tht refresh is important to let us update the numbers of "spies" that are out there with windows open
    // either logged out or stepped away, not important - they are spies if the window is open and they are inactive.
    lastTimeSessionCleared = (new Date()).getTime();
    if (Utils.isApp()) {
      // MUST be in a timeout so that if there was a setCookie for a new sessionId in the same clearSession request from server, the SERVER sessionId is known BEFORE the initSession is called.
      // setTimeout(function() {initSession();},700);  // get a sessionId if this is an APP.  because  logging in again CANT get sessionId via facebook NO WAY with custom cookies to pass cookies when "code" is in request
    }
}

/*************  COOKIES  move to AJAX class  ****************************************/


function printCookies(w){
	cStr = "";
	pCOOKIES = new Array();
	pCOOKIES = document.cookie.split('; ');
	for(bb = 0; bb < pCOOKIES.length; bb++){
		NmeVal  = new Array();
		NmeVal  = pCOOKIES[bb].split('=');
		if(NmeVal[0]){
			cStr += NmeVal[0] + '=' + unescape(NmeVal[1]) + '; ';
		}
	}
	cStr+=  " <== END COOKIES Now as localStorage: ";
        for (i=0; i<=localStorage.length-1; i++)  {
          key = localStorage.key(i);
          val = localStorage.getItem(key);
          cStr+= key+" : "+val;
        }
	return cStr;
}

// will not delete server-set cookie!  To logout of facebook and paypal, must call those services separately.
//  but android phone has a clear cookie mechanism that will delete ALL the cookies.
function deleteAllCookies() {
    localStorage.clear();
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    }
}



/**************  END COOKIES,  move to AJAX class  ******************/








function getStyle(elem,prop) {
    if (elem == null) {
        return;
    }
    if (elem.currentStyle != undefined) {
        return elem.currentStyle[prop];
    }
    else if (window.getComputedStyle != undefined) {
        return window.getComputedStyle(elem,null).getPropertyValue(prop);
    }
    else {
        return elem.style[prop];
    }
}

/********  SCROLL AND DISABLE SELECTION EVENT HANDLING **********/




function disableSelection(elem) {
     if (elem == null) {
         return;
     }    
     var elems = elem.getElementsByTagName("input");
     //var elems1 = elem.getElementsByTagName("textarea");
     //if (elems.length == 0) {
     //    elems = new Array();
     //}
     //elems = elems.concat(elem.getElementsByTagName(elems1));
     //elems = elems.join() + "," + elems1.join();
     //elems = elems.split(",");
     if (typeof elem.onselectstart != "undefined") {
        if (elems.length == 0) {  // there is only the one main element, no sub elements

        }
        for (var i=0; i < elems.length; i++) {
             if (elems[i].tagName.toLowerCase() != "input") {
                 elems[i].onselectstart =  function(evt) {return false;};
             }
        }
     }
     else if (typeof elem.mozUserSelect != "undefined") {   // already done in CSS for firefox
         //elem.style.MozUserSelect = "-moz-none";
         //for (var i=0; i < elems.length; i++) {
            // alert(i);
         //   elems[i].style.MozUserSelect = "text";
         //}
     }
     else {
         // elem.onmousedown=function() {return false};
     }
}

disableSelection(dialog1);
disableSelection(dialog2);
disableSelection(dialog3);
disableSelection(dialog4);
disableSelection(dialog5);
disableSelection(dialog6);
disableSelection(document.getElementById("mask"));

function getScrollX() {
  if (window.pageXOffset != undefined) {
     return window.pageXOffset;
  }
  var ieBody = (document.compatMode != undefined && document.compatMode != "BackCompat") ? document.documentElement : document.body;
  return ieBody.scrollLeft;
}

function getScrollY() {
  if (window.pageYOffset != undefined) {
     return window.pageYOffset;
  }
  var ieBody = (document.compatMode != undefined && document.compatMode != "BackCompat") ? document.documentElement : document.body;
  return ieBody.scrollTop;
}

function initScrollEventHandler() {     // register scrolling events so dialogs stay centered in the screen
  if (window.pageYOffset != undefined) {
      //window.onscroll = function(evt) {scrollEvent(evt);};
      return;
  }
  var ieBody = (document.compatMode != undefined && document.compatMode != "BackCompat") ? document.documentElement : document.body;
  //ieBody.onscroll = function(evt) {scrollEvent(evt);};
}

// first remove any dragging action happening now as we cannot detect scroll bar as the source from any event property
// NOW dialog2 remains fixed so this part is not needed: (dialog2 is designed to scroll with user. that's because type 2 is reserved for system messages or those REQUIRING acknowledgement.)
// Friendlier popups placed by user like publishables are of type 3 and will not move invasively like type 2.
function scrollEvent(evt) {
      //dialogDragEnd();
      //return true;
      /**
      if (dialog2.innerHTML == undefined || trim(dialog2.innerHTML).toLowerCase() == trim(emptyHTML).toLowerCase() || trim(dialog2.innerHTML) == "") {
          return true;
      }
      // Is bottom of dialog is out (or close to out) of window view?   Do not allow scroll down (up only)
      if (parseInt(dialog2.style.top) + parseInt(dialog2.clientHeight) + 130 > window.innerHeight + window.pageYOffset) {
          if (dialog2Y < (40 + getScrollY())) {  // preparing to scroll down? Do not allow
              return true;
          }
      }
      // dialog2X =  180 + getScrollX();
      dialog2Y =  40 + getScrollY();
      dialog2.style.top  = dialog2Y+"px";
      dialog2.style.left = dialog2X+"px";
      return true; */
}

initScrollEventHandler();
/**************  END SCROLL EVENT HANDLING  ********/



// ** END TALK ARE FOCUS ROUTINES the only ajax dialogs depends on. Must be defined here for encapsulation

// ONLY pass a dialog elem (dialog1 ... dialog5)  (or its elemId if it has one but our paradigm stores the dialog elem as vars so you should never need to pass a string here)
// do NOT use!  This should be tested via showingDialogType() methods ONLY! not by seeing what is in the raw HTML
function isDialogEmpty(elem) {
    if (typeof elem == "string") {
        if (document.getElementById(elem) == undefined) {
            return true;
        }
        elem = document.getElementById(elem);
    }
    if (typeof elem != "object") {
        return true;
    }
    if (!Utils.isEmpty(elem.innerHTML)) {
        return false;
    }
    return true;
}

// worning!  do not use this -  this should NEVER be done outside of setDialog() method which sesFocus first and senses whether dialog is empty via lastShowingDialogType array only
function clearDialogs() {   // used only by privateRoomInvite Gift.php makeCode for now
     dialog1.innerHTML = emptyHTML;
     dialog2.innerHTML = emptyHTML;
     dialog3.innerHTML = emptyHTML;
     dialog4.innerHTML = emptyHTML;
     dialog5.innerHTML = emptyHTML;
     document.getElementById("maskWrapper").style.zIndex = "1";
     if (Dialog.lockDown) {
         setTimeout(function() {sleepMode("secure");},500);
         return true;
     }
}

var tempIndex;

function isEmptyDialogs() {
    return (isDialogEmpty(dialog1) && isDialogEmpty(dialog2) && isDialogEmpty(dialog3) && isDialogEmpty(dialog4) && isDialogEmpty(dialog5));
}

function setDialog(dialogHTML,dialog,silent,type,noIScroll) {
     if (!Utils.isEmpty(dialog) && dialog.getSilent()) {
         silent = true;
     }
     var type = (!Utils.isEmpty(dialog) ? dialog.getType() : (type != undefined ? type : 1));
     if (isNaN(type)) {
         type = 1;
     }

     if (Utils.isEmpty(dialogHTML)) {
         dialogHTML = ""; //emptyHTML;  // not "" so IE doesnt jiz all over
         // DO DO: if not embedded, and dialog was passed and dialog showing for the passed type is NOT the same as the apssed dialog (if timer was set) then dont erase the showing dialog, jsut return beasue passed dialog is not showing)
     }
     else {
        // safety - if lastshowing is of the SAME type - *and* we are currently presenting new non-empty dialog with SAME type - MUST erase showing dialog first - or setmask will fail upon closing this new window
        // that sbecaeu they both share the same dialog variable for opacity and therefore the setFocus method will get confused.
        if (type == getLastShowingDialogType()) {
            eraseTopDialog();
        }
     }
     if (!(("dialog"+type) in window) ) {
         // window not loaded
         return;
     }
     if (("dialog"+type+"timerId") in window && window["dialog"+type+"timerId"] > 0) {
         clearTimeout(window["dialog"+type+"timerId"]);
     }
     if (!Utils.isEmpty(dialog) && dialog.isEmbedded()) {
         if (dialog.getEmbeddedElem() == null) {
            //alert("dialog has no embedded element type="+dialog.getType());
            return true;
         }
         dialog.getEmbeddedElem().innerHTML = dialogHTML;
         return true;
     }
     if (!Utils.isEmpty(dialog) && dialog.isCustomPosition()) { // else get the LAST position for this dialog TYPE - not necessarily the last position of this exact dialog per se
        window["dialog"+type+"X"] = dialog.getCustomX();
        window["dialog"+type+"Y"] = dialog.getCustomY();
     }
     else if (!Utils.isEmpty(dialog) && dialog.snapOnShow()) {     // SNAP means START AT DEFAULT SPOT and do NOT remember last position
         if (Utils.isApp()) {  // android phone or iPhone app
            window["dialog"+type+"X"] = dialog.getSnapOffsetX() + ((type == 2 || dialog.isSmall()) ? 0 : 0);  // formerly 12
            window["dialog"+type+"Y"] = dialog.getSnapOffsetY() + ((type == 2 || dialog.isSmall()) ? 107 : 0);
         }
         else if (Utils.isIpad() || Utils.isPad()) {  // tablet or iPad in mobile web
            window["dialog"+type+"X"] = dialog.getSnapOffsetX() + ((type == 2 || dialog.isSmall()) ? 35 : 0);  // -12
            window["dialog"+type+"Y"] = dialog.getSnapOffsetY() + ((type == 2 || dialog.isSmall()) ? 93 : 0);
         }
         else {
             window["dialog"+type+"X"] = dialog.getSnapOffsetX() + (Utils.isMobile() ? 0 : 150); // + getScrollX();    // 180   NOW all dialogs get centered vertically  in autoadjustheight
             window["dialog"+type+"Y"] = dialog.getSnapOffsetY() + (Utils.isMobile() ? ((type == 2 || dialog.isSmall()) ? 85 : 0) : ((type == 2 || dialog.isSmall()) ? 77 : 0));  // + getScrollY();    //40   // 2 are small warning dialogs so we push them down a little more in mobile mode
         }
     }
     else {
        window["dialog"+type+"X"] = (Utils.isMobile() == 2 ? 0 : 0);
        window["dialog"+type+"Y"] = 0;
     }
     // set the position now
     tempIndex = "dialog"+type+"Y";
     //alert(tempIndex+" "+window[tempIndex]);
     // internet explorer 8 has issues sometimes the var dialog2Y is set to NaN - did  not try to debug that yet - when that happens use 0 for now
     if (isNaN(window[tempIndex])) {
        window[tempIndex] = 0;
     }


     // if silent, then we assume this will overwirte SAME dialog with new data
     // - the type is not only showing already but is the same exact selector class as well  - we want to retain user's scroll position in that case
     if (silent != undefined && silent && !Utils.isEmpty(dialogHTML)) {
         hideScrolls(type,true);
     }

     var empty=true;
     


     // SET THE FUCKING INNER HTML NOW
            if (dialogHTML == "" || !dialogHTML || dialogHTML == emptyHTML) {
                 //if (type == 2) {
                     // window["dialog"+type].style.top = "-1000px";
                     window["dialog"+type].style.transition = "1s";
                     window["dialog"+type].style.opacity = "0";
                     window["dialog"+type+"timerId"] = setTimeout(function() {window["dialog"+type].innerHTML = dialogHTML; window["dialog"+type].style.top = "-1000px";},1000);
                 //}
            }
            else {
                empty = false;
                // window["dialogWrapper"+type].style.opacity = "0";
            }
            //if (type == 2) {
               if (!empty) {
                  window["dialog"+type].style.opacity = ".96";
                  window["dialog"+type].innerHTML = dialogHTML;
                  window["dialog"+type+"Y"] = 0;
                  window["dialog"+type].style.top = "0px";
                  // window["dialog"+type].style.transform = "translate(-50%, -50%)";
               }
            //}
            //else {
            //    window["dialog"+type].innerHTML = dialogHTML;
            //}


     
     // IMMEDIATELY restore the scroll position if the event was silent
     if (silent != undefined && silent && !Utils.isEmpty(dialogHTML)) {
         restoreScrollPosition(type,true);
     }
     

     // window["dialog"+type].style.top  = "0px";
     // window["dialog"+type].style.left =  "0px";



     //if (empty) { // Utils.isEmpty(dialogHTML) || silent == undefined || !silent
         // the current or lastShowing dialog will have priority - all others masked
         // now setDialog Focus calls autoAdjustDialogHeight before calling setScroll to restore old scroll positions in the case of background dialog being brouhgt forward again on erase of foreground.
         setDialogFocus(type,dialogHTML,noIScroll,silent,dialog);  // also SETS iScroll on mobile devices as well - unless iScroll is disabled.   Now Androind can handle normal js scrolling so iScroll may be obsolete!!!! (type, dialogHTML,noIscroll)
     //}
    // else {
         // autoAdjustDialogHeight();
         // top already set by autoadjustheight and will transition over 1 second.
         //window["dialog"+type].style.opacity = ".9";
     //}
     //window["dialogWrapper"+type].style.opacity = "1";


     // MASK CONTROL -  DISPLAY OR HIDE MASK AS NECESSARY  - make it fucking simple loser!
     if (getLastShowingDialogType() > 0 || !empty) {
         document.getElementById("dialogMask").style.zIndex = "20"; // less than 23 but higher than the highest not-showing which would be 19
         document.getElementById("dialogMask").style.bottom = "0px"; // exapnd the mask wrapper div to include the entire window
         document.getElementById("mask").style.height = "100%";
         document.getElementById("mask").style.width = "100%";
     }
     else {
         document.getElementById("dialogMask").style.zIndex = "1";
         document.getElementById("dialogMask").style.bottom = null;
         document.getElementById("mask").style.height = "0px";
         document.getElementById("mask").style.width = "0px";
     }

     // IE capitilizes tags when testing the innerHTML string!!! so use toLowerCase on all compares
     /**
      if (!Dialog.lockDown && isEmptyDialogs() && (Utils.isEmpty(dialog) || !dialog.getMaskAfterErase()) ) {
             //if (Dialog.lockDown) {
                 // MUST be in timeout for safety of possible recursion - do not want to let sleepMode call setDialog when we are still in setDialog
                 //setTimeout(function() {sleepMode("secure");},500);
                 //return true;
           o focus the talkArea again
             }
      }
      // a dialog is showing, just that the passed dialog may be empty (in case of server-side selectors - for which html is passed in here instead)
      else if (Dialog.lockDown || Utils.isEmpty(dialog) || dialog.getMask()) {
          //if (!isDialogEmpty(dialog2)) { // make the index of the mask, the strongest possible if we are showing a warning or confirmation dialog to mask even a dialog of type1 - a selector
          //    document.getElementById("maskWrapper").style.zIndex = (parseInt(dialog2.style.zIndex) - 1) + "";
          //}
          //else {
              document.getElementById("maskWrapper").style.zIndex = "21";  // one less than the dialog in focus

     }      */

     return true;
 }

 // because some dialogs are not objects - like dialog1 - just an element - we need to have an object wrapper for each one to include dateLastShowing
 var showingDialogs = new Array();   // key=dialog type  val=time of last show to front
 var showingDialogsByDate = new Object();  // key=date  val= type
 var showingDialogsObject = new Object();  // key=type  val=Dialog (or null if none defined like for selectors)
 var showingTouchScrolls = new Array(); // key=type val=true if has an iScroll or false (no need to store actula iScrool cause we destroy teh active iScroll when new dialog comes into focus

 var lastAutoAdjustHeight = 0;
 var lastAutoAdjustWidth  = 0;



  
   function autoAdjustDialogHeight(delta,evt,keyboard) {
      if (document.getElementById("outerWrapper") != null && document.getElementById("outerWrapper").style.display != "block") {
         document.getElementById("outerWrapper").style.display = "block";
      }
      if (evt != undefined && evt == "orientation") {
          //if (isMobile  ) {      // && (isNaN(isMobile) || isMobile == 1)
              // needs time to get coorect scaled height
              setTimeout(function() {if (!Utils.isApp()) {window.scrollTo(0,1);} autoAdjustDialogHeight1(delta,evt); },300);

          //}
      }
      else {
          autoAdjustDialogHeight1(delta,evt,keyboard);
      }
  }

 // call this when a mobile window resizes cause stupid user - like David -  tries to use it in landscape mode
 function autoAdjustDialogHeight1(delta,evt,keyboard) {
     return;
     // Is there a DIALOG that is showing?
     var t = getLastShowingDialogType();
     if (t != 0) {
         // remove address bar first so that dialog shows at full screen height
         // window.scrollTo(0,1);
     }
     else {
       return;
     }
     var d = getDialog(t);
     // now css centered to middle automatically.  Btu renders as scroll from top animated so need to set to zero
     window["dialog"+t+"Y"] = 0;
     window["dialog"+t].style.top = "0px";
     return;

     var h; var w;
     //var hw = getScreenDims();
     h = window.innerHeight; // hw[0];
     w = window.innerWidth; // hw[1];
     
     var mid = 0;
     var dWidth = 350; // average width of a dialog element that for some reason does not have a core defined.
     mid = Math.floor(.5 * dWidth);   // offset to left of center half width of dialog
     mid = Math.floor(Math.max(0,Math.floor(w * .5) - mid) + window.pageXOffset); // small offset   // window.innerWidth
     var midh = Math.floor(Math.max(0,Math.floor(h * .5) - 300) + window.pageYOffset);
     window["dialog"+t+"X"] = (window.innerWidth - 100); // mid;
     window["dialog"+t].style.left = window["dialog"+t+"X"] + "px"; // window["dialog"+t+"X"] +"px";

     window["dialog"+t+"Y"] = midh;
     window["dialog"+t].style.top = midh + "px" // 20 + "px";

     return;

          if ( (mid + dWidth) > SCREEN_WIDTH) {
             mid = Math.max(0, mid - ((mid + dWidth) - SCREEN_WIDTH));
          }
          if (mid < 0) {
              mid = 0;
          }
          if (t == 2) {
             if (Utils.isMobile()) {
                 mid -=9; // type 2 has an invisible border/margin only on one side but seems only mobile needs correction for this
             }
             else {
                 mid -=5;
             }
          }
          // if custom and offset is off by only 1 or 2 from custom, keep at custom position
          if (!Utils.isEmpty(d) && d.isCustomPosition() && Math.abs(d.getCustomX() - mid) < 5) {
             mid = d.getCustomX();
          }
          window["dialog"+t+"X"] = mid;
          window["dialog"+t].style.left = window["dialog"+t+"X"] +"px";
          
          return;
          
          


     //alert(w+" "+h);
     if (Utils.isMobile() == 2) {
       if (w < 400) {
           //w = 400;
       }
       if (h < 611 && w < h) {
           //h = 611;
       }
     }
     else if (Utils.isPad() && w < 429) {
        // w = 429;
     }

     //LAST_SCREEN_HEIGHT = SCREEN_HEIGHT;
     //LAST_SCREEN_WIDTH  = SCREEN_WIDTH;
     lastResizeEventScreenWidth = w;
     if (delta != undefined && !isNaN(delta) && Math.abs(h-lastAutoAdjustHeight) < delta && Math.abs(w-lastAutoAdjustWidth) < delta ) {
         return;
     }
     lastAutoAdjustHeight = h;
     lastAutoAdjustWidth  = w;
     // alert(t);
     //adjustHeaderSize(t);



     var d = getDialog(t);
     // because margins of the core are NOT included in width setting, we must use the coreWrapper height and width
     var elem = document.getElementById("selDialog"+t+"CoreWrapper");
     if (elem == undefined) {
        // restoreMusicWrapper();
        return;
     }
     // on orientation there android bug with locator scrolls one of the core elements beyond its possible limit - yet scrollTop shows zero! so cant fix!
     //if (evt == "orientation") {
     //    setTimeout(function() {elem.scrollTop = 0;elem.firstChild.scrollTop = 0},1000);
     //}
     document.getElementById("mask").height = h+"";
     document.getElementById("mask").width =  w+"";
     if (Utils.isMobile() || Utils.isPad()) {
       //document.getElementById("mask").width =  (w) + "";
     }

     // due to fucking shit ass bug,  you need to set the actual width of the showing SelDialogCoreType to whatever the width of its first child element is
     // this will cause the stupid ass scroll bar in the width to DISAPPEAR when it should not be there EVEN if the vertical scroll vbar is showing  FUCK THIS FUCKING IFE WHICH SUCKS ASS IM WASTING EVERY PRECIOUS MOMNEBNT
     // ON OTHER ASS FUCKING COMPANY PROBLEM ASS ERRORS FROM THEIR FUCKING KIDDIE ASS COLLEGE PRGORAMMERS
     //if  (elem.firstChild != undefined &&  elem.firstChild.style.width != "") {
     //    elem.style.width = elem.firstChild.style.width;
     //}
     var coreHeight = h;
     hideScrolls(t,true);

     // FIRST adjust the max-height of the core screen - noClip if keyBoard or select causes core size to be less than 130
      var heightClip = 0; // (isPad ? 120 : (isMobile ? 122 : 120));   // 104 a bit less when using Mobile Internet vs.  app. (!isNaN(isMobile) && isMobile > 1) ? 122 : 122;

      // CORRECT for height of buttons
      var but = document.getElementById("selDialog" + t + "Buttons");
      var hdr = document.getElementById("dialogTitle"+t);
      if (but != undefined) {
          // alert(but.offsetHeight);
          heightClip = heightClip + (but.offsetHeight);
      }
      if (hdr != undefined) {
          heightClip = heightClip + (hdr.offsetHeight); // adjust for header size differences from localnorm of 25, ie server generated dialogs via selector.php have thicher header.
      }
      
      // for high buttons (ie with images, need to clip more than 40 already allocated.
      // FUCKING BULLSHIT!!! ClientHeight shows zero for buttonTable for elem that is showing!  same with offsetheight shows 1 - BULLSHIT!
      //if (document.getElementById("selDialog" + t + "Buttons") != undefined) {
      //    heightClip += document.getElementById("selDialog" + t + "Buttons").offsetHeight;
      //    alert(document.getElementById("selDialog" + t + "Buttons").offsetHeight);
      //}

      coreHeight = Math.max(130,h - heightClip);
      // limit maxHeight and minHeight of dialogs (and music wrapper) in a desktop mobile view mode which is now the default view for desktop
      // user should see tht dialogs (other than small dialogs) fit to screen, but when screen is very small (akin to landscape mode which we will soon disallow) the dialog
      // should stay large otherwise it looks like an exageration to have the bottom buttons almost at the top of the dialog.  Musicwrapper should stay with the bottom buttons.
      // ie header function should use same magic limits.
      if (Utils.isMobileView()) {
          if (h > 740) {
              coreHeight = 740 - heightClip;
          }
          if (h < 400) {
              coreHeight = 400 - heightClip;
          }
      }
      elem.style.maxHeight = coreHeight + "px";
      elem.style.maxWidth =  (w > 200 ? (w - ((Utils.isMobile() && t != 2) ? 0 : 40)) : 200) + "px";
      

      elem.style.width = null;
      // alert(printStackTrace());

      // NEXT adjust any autoElems maxHeight to the scrollable real height of that element - that will cause us to open up the coreElem to its max height possible if necessary
     if (autoAdjustElemId1 && document.getElementById(autoAdjustElemId1) != undefined && ("scrollHeight" in document.getElementById(autoAdjustElemId1)) ) {
         document.getElementById(autoAdjustElemId1).style.maxHeight = (document.getElementById(autoAdjustElemId1).scrollHeight - 0) + "px";
      }
      if (autoAdjustElemId2 && document.getElementById(autoAdjustElemId2) != undefined && ("scrollHeight" in document.getElementById(autoAdjustElemId2)) ) {
         document.getElementById(autoAdjustElemId2).style.maxHeight = (document.getElementById(autoAdjustElemId2).scrollHeight - 0) + "px";
      }
      if (Utils.isApp() || Utils.isIos() || (Utils.isMobile()) ) { // && "orientation" in window // small screen mobile phones should cause all dialogs to FILL the entire screen in portrait mode
          // fix Android scrollTop bug - on keyboard show we set to hidden, set it back to auto now
          if (keyboard == undefined || keyboard == "" || keyboard == "hidden") {
              elem.firstChild.style.overflow = "visible";       // MUST be set back to auto becasue hideScroll was called above so that any auto element scrolls could be adjusted.
          }
          if (t != 2 && (d == null || !d.isSmall()) ) {
              // little alerts should always stay small (type 2)
              // overflow auto seems to  scroll short if height is set - seems only to give a full scroll to max-height.  but with height set instead, the scroll stops short.
              // so set the height of the parent coreWrapper as a test instead.
              elem.style.height = coreHeight + "px";
              var p = "orientation" in window && (window.orientation == 0 || window.orientation == 180 || window.orientation == "0" || window.orientation == "180" );
              p = (Utils.isApp() || p || (!("orientation" in window) && h > w));
              if (p && !Utils.isMobileView() && w < h) {   // portrait mode   // eventually exclude this auto-width to window resize on any window where w > CORE MOBILE_WIDTH
                  elem.style.width =  (w > 120 ? (w - 0) : 120) + "px";
                  elem.style.minWidth = null;
                  //elem.style.maxWidth =  (w > 120 ? (w - 0) : 120) + "px";
              }
              else {  // set the min width equal to the centered home buttons which is fixed at 420px OR null the width property to use the natural css-set width of the dialog core
                  // elem.style.minWidth = "500px";  if you use this line,  screen will NOT fill width of landscape mode and you MUST set minWidth to null again above for portrait mode
                  if (w > 750 && Utils.isMobileView()) {
                       elem.style.minWidth = "500px";
                       elem.parentNode.border = null;
                  }
                  else {
                       elem.style.width = (w > 120 ? (w - 0) : 120) + "px"; // null;
                       elem.parentNode.border = "solid #336699 1px";
                  }
              }
              /**
              if (isMobile == 3  || isMobile == 4) {
                   var childNode = elem.childNodes;
                   if (Utils.count(childNode) == 1) {
                       childNode = childNode[0];
                       if (childNode.scrollHeight > coreHeight) {
                           childNode.style.height = coreHeight;
                       }
                       if (childNode.scrollWidth > w) {
                           childNode.style.width = w + "px";
                       }
                       childNode.style.overflow="auto";
                   }
              }  */
          }
          else {
             if (w < 350) {
                 elem.style.minWidth = w + "px";
             }
             else {
                 elem.style.minWidth = "350px";
             }
             elem.style.maxWidth = (w - 10)  + "px";
          }
          if (Utils.isMobileView() && SCREEN_HEIGHT > 550) {
              // elem.style.maxHeight = "550px";
          }
      }
      
     // fix the width problem when vertical scroll bar shows - but there is very little to no horizontal to scroll normally
     //the fuckjing V scroll bar causes a 15 pixel clip in vertical necisating an H scroll also.
     // h scrollbar should NOT show too - to fix - make overflow hidden in that case.
     // dot his AFTER the height adjust
     var core = elem.firstChild;
     if ( (!Utils.isMobile() && !Utils.isPad()) || Utils.isMobileView()) {
         if (core.clientWidth < core.scrollWidth && Math.abs(core.clientWidth - core.scrollWidth) < 30 ) {
             // alert(elem.clientWidth +" " +elem.scrollWidth);
             //core.style.width = (core.scrollWidth + 18) + "px";
             elem.firstChild.style.overflowX = "hidden";
         }
         else {
             elem.firstChild.style.overflowX = "auto";
         }
         // warning, although changing the width should reflect changes in elem.offsetWidth and scrollWidth as of now - it does NOT!
         // not until after this method completes whereby z-index makes this visible.
     }

      // CENTER all non custom position dialogs
      if (Utils.isEmpty(d)  || Utils.isMobile() || Utils.isPad() || !d.isCustomPosition()) {
          // var elem = document.getElementById("selDialog"+type+"Core");
          var mid = 0;
          var dWidth = 50; // average width of a dialog element that for some reason does not have a core defined.
          if (elem != undefined) {
              dWidth = elem.offsetWidth;
          }
          mid = Math.floor(.5 * dWidth);   // offset to left of center half width of dialog
          mid = Math.floor(SCREEN_WIDTH * .5) - mid + 1; // small offset   // window.innerWidth
          if ( (mid + dWidth) > SCREEN_WIDTH) {
             mid = Math.max(0, mid - ((mid + dWidth) - SCREEN_WIDTH));
          }
          if (mid < 0) {
              mid = 0;
          }
          if (t == 2) {
             if (Utils.isMobile()) {
                 mid -=9; // type 2 has an invisible border/margin only on one side but seems only mobile needs correction for this
             }
             else {
                 mid -=5;
             }
          }
          // if custom and offset is off by only 1 or 2 from custom, keep at custom position
          if (!Utils.isEmpty(d) && d.isCustomPosition() && Math.abs(d.getCustomX() - mid) < 5) {
             mid = d.getCustomX();
          }
          window["dialog"+t+"X"] = mid;
          window["dialog"+t].style.left = window["dialog"+t+"X"] +"px";
      }

      // shorten dialogs that are not positioned at zero and longer than the screen length (dialogs of type 2  are not positioned at zero - so are candidates for this when long)
      if (window["dialog"+t+"Y"] > 0) {
         if ((elem.clientHeight + window["dialog"+t+"Y"] + 60) > SCREEN_HEIGHT) { // 60 is approximate screen height of the buttons not included in core heights - elem is core
           window["dialog"+t+"Y"] = 0;
           window["dialog"+t].style.top = "0px";
         }
      }
      

      // now - here at bottom readjust any autoElems to the coreHeight minus their offset
      // reusing the var coreHeight - here coreHeight means the max distance possible from the top of custom autoAdjustElement to the bottom of core
      var customHeight;
      var customHeightError = Utils.isPad() ? 15 : (Utils.isMobile() ? -3 : -3);  // pad was 35 now 15    mobile was 15 now 0
      if  (autoAdjustElemId1 && document.getElementById(autoAdjustElemId1) != undefined && ("offsetTop" in document.getElementById(autoAdjustElemId1)) ) {
         // alert("coreHeight:"+coreHeight+" "+ "core clientHeight:"+elem.clientHeight +"  customElemOffsetStart:"+ Utils.getOffsetFrom(elem,document.getElementById(autoAdjustElemId1)));
         customHeight = Math.max(coreHeight,elem.clientHeight) - Utils.getOffsetFrom(elem,document.getElementById(autoAdjustElemId1));       // coreHeight -
         document.getElementById(autoAdjustElemId1).style.maxHeight = (customHeight > 30 ? customHeight + customHeightError : 20) + "px";
         document.getElementById(autoAdjustElemId1).style.marginBottom="auto";
      }
      if  (autoAdjustElemId2 && document.getElementById(autoAdjustElemId2) != undefined && ("offsetTop" in document.getElementById(autoAdjustElemId2)) ) {
         customHeight = Math.max(coreHeight,elem.clientHeight) - Utils.getOffsetFrom(elem,document.getElementById(autoAdjustElemId2));       // coreHeight -
         document.getElementById(autoAdjustElemId2).style.maxHeight = (customHeight > 30 ? customHeight + customHeightError : 20) + "px";
         document.getElementById(autoAdjustElemId2).style.marginBottom="auto";
      }
      // changing height of scrollable elements will reset their position - but setFocus restores it.  Too slow to do twice!
      restoreScrollPosition(t,true);
      // refreshTouchScrolls();  // height has changed in the dialog, so update touchScrolls if there are any
      //elem.style.overflowY = "auto";
      // elem.scrollTop = 0;

      // fucking piece of shit Android takes too long to hide or otherwise it redisplays the fucking address bar, so hide it again now!
      if (Utils.isMobile()) {
          if (evt == "orientation") {
              window.scrollTo(0,1);
          }
          // deprecated - used to fix android keyboard and scrollTop bug when overflow is auto
          // if input element is in focus - focus it again, in case keyBoard is hiding it and therefore scrolling has moved it.
          if ("activeElement" in document && document.activeElement != undefined && ("tagName" in document.activeElement)) {
              if (document.activeElement.tagName.toLowerCase() == "input" || document.activeElement.tagName.toLowerCase() == "textarea") {
                var distance = Utils.getOffsetFrom(elem,document.activeElement);
                if (distance > coreHeight - 50) {
                    // setTimeout(function() {elem.scrollTop = distance - 50},100);   // Math.min(elem.scrollHeight - coreHeight,distance - coreHeight  + 50);
                }
              }
          }
      }
      if (Utils.isAndroid()) {
          keyboardFocus(keyboard); // sets overflow to hidden if soft keyboard was just presented so android bug ignoring scrollTop and not focusing on keyboard text is fixed.
      }
 }

 // return false if there was none   - used by AndroidEvents class when backButton is pressed
 function eraseTopDialog() {
      var type = getLastShowingDialogType();
      if (type == 0) {
          return false;
      }
      setDialog("",null,false,type,false);  // setDialog(dialogHTML,dialog,silent,type,noIScroll)
      return true;
 }
 // return zero if none showing, crude implementation becasue java does not order objects by key - the ordering is unknown - we would need to make our own red-black tree argh!
 // this is no concern until we have hundreds of windows showing - not likely!
 function getLastShowingDialogType() {
     if (!(0 in showingDialogs)) {
         return 0;
     }
      var t = showingDialogs.slice(0);  // copy of array
      var temp = t.sort(function(a,b) {return b-a}); // fucking bitch javascript changes original array on sort - asshole designers!
      // showingDialogs = t;
      if (Utils.count(temp) == 0 || temp[0] <= 0) {
          return 0;  // nothing is showing
      }
      return showingDialogsByDate[temp[0]];
 }
 
 function getDialog(type) {
     return showingDialogsObject[type];
 }
 
 function getLastShowingDialog() {
     var t = getLastShowingDialogType();
     if (t == 0) {
       return null;
     }
     return getDialog(t);
 }

 function setLastShowingDialog(type,erase,obj) {
     showingDialogs[0] = 0; // formal array adds number keys that dont exist
     // really, if erase is set we could just leave the object alone except then we wouldnt know that it is erased.
     // seems to work fine that way anyway, but to make it right, set them negative by subtracting current time. 
     // This will reflect it's old last showing time proportional to others.
     var timeStamp = ( (erase != undefined && erase) ? -20 : (new Date()).getTime());
     // var timeStamp = ( (erase != undefined && erase) ? (type in showingDialogs ? -Math.abs(showingDialogs[type]) : -20) : (new Date()).getTime());
     if (showingDialogs[type] != null &&(showingDialogs[type] in showingDialogsByDate)) {
         delete showingDialogsByDate[showingDialogs[type]];
     }
     if (erase != undefined && erase) {
         if (type in showingDialogs) {
             delete showingDialogs[type];
         }
         if (type in showingDialogsObject) {
             delete showingDialogsObject[type];
         }
     }
     else {
         showingDialogs[type] = timeStamp;  // if erase is set, the new timestamp is sometime in the past.
         showingDialogsByDate[timeStamp] = type;
         if (obj != undefined && (typeof obj == 'object')) {
            showingDialogsObject[type] = obj;
         }
         else {
            showingDialogsObject[type] = null;
         }
     }    
 }


 function isDialogInFocus(type) {
      return (window["dialogWrapper"+type].style.zIndex == 23);
 }

 // iScroll use only so desteroy can be issued before setting to null
 var coreScroll = false;  // an iScroll only
 var activeScroll = false;  // an iScroll only
 var activeScroll2 = false;  // an iScroll only
 var autoAdjustElemId1 = false;
 var autoAdjustElemId2 = false;
 var coreScrollByType = new Array();  // key: type  val: elemID
 var customScroll1ByType = new Array(); // 0=elemId  1=current scroll position of elem
 var customScroll2ByType = new Array(); // 0=elemId  1=current scroll position of elem

// Androind window.device.version starts with "2."  is half the Andoird market and does not have webview overflow scroll support!
function needsIscroll() {
   if (!Utils.isMobile()) {
       return false;
   }
   if ("device" in window && (typeof window.device == "object") && ("version" in window.device) && window.device.version.indexOf("2.") == 0) {
       return true;
   }
   return false;
}

 /*** I TOUCH SCROLLS   ******/
 // side effect is to register thee elements for auto adjust to visible area of same on any call to autoAdjust
 // change name to adjustAutoElemsAndAddTouchScrolls
 function setCustomActiveTouchScrolls(elemId,elemId2,autoSense,endScrollAction1,moveAction1,dialogType) {
       return;
       if (autoSense != undefined && autoSense) {
            if (elemId == autoAdjustElemId1 && ( (Utils.isEmpty(elemId2) && Utils.isEmpty(autoAdjustElemId2)) || (elemId2 == autoAdjustElemId2))) {
               refreshTouchScrolls();
               return;
            }
       }
       deleteActiveCustomScrolls(dialogType);
       if (dialogType != undefined) {
           document.getElementById(elemId).style.overflow = "auto";  // necessary as javascript will not read a css set option - until it is set by javascript - and setScroll checks this setting
           if (Utils.isMobile()) {
               // document.getElementById(elemId).style.webkitOverflowScrolling = "touch";
           }
           var a = new Array();  a[0] = elemId; a[1] = document.getElementById(elemId).scrollTop; // scrollTop will be zero here - as element is jsut being set - we dont care what it is until we go to hide it in setScroll()
           customScroll1ByType[dialogType] = a;
           if (elemId2 != undefined &&  document.getElementById(elemId2) != undefined) {
               // document.getElementById(elemId).style.overflow = "auto";
               a = new Array();  a[0] = elemId2; a[1] = document.getElementById(elemId2).scrollTop;
               customScroll2ByType[dialogType] = a;
           }
       }
       autoAdjustElemId1 = elemId;
       autoAdjustElemId2 = elemId2 != undefined  ? elemId2 : null;
       autoAdjustDialogHeight(); // set the maxHeights of these newly populated elems that need autoadjusting - do it before adding any custom touch scrolling
       if (!Urtils.isWinPhone() && (Utils.isMobile() || Utils.isPad())) {
            if (elemId != undefined & document.getElementById(elemId) != undefined) {
                if (needsIscroll()) {
                    if (endScrollAction1 != undefined) {
                       activeScroll = new iScroll(elemId,{vScrollbar : true, onScrollEnd : endScrollAction1, onScrollMove : moveAction1});
                    }
                    else {
                       activeScroll = new iScroll(elemId);
                    }
                }
            }
            if (elemId2 != undefined && document.getElementById(elemId2) != undefined) {
                // activeScroll2 = new iScroll(elemId2);
            }
       }

 }
 
 function refreshTouchScrolls() {
    if (!Utils.isEmpty(activeScroll)) {
         activeScroll.refresh();
    }
    if (!Utils.isEmpty(activeScroll2)) {
         activeScroll2.refresh();
    }
 }

 // never delete custom scrolls that do not wrap the coreDialog elem Id.  Let the custom controller take care of its own garbage collection
 // but their autoAdjustElements can be deleted becasue if this method is called the dialog that contained the autoAdjustElements is no longer in focus.
 // when it comes back in focus, the elements would be lost but it is better to have autoAdjustDialogHeight change their heights when manipulating
 // a different foreground dialog as they should not be seen anyway.
 function deleteActiveCustomScrolls(force,dialogType) {
     if (dialogType != undefined) {
         customScroll1ByType[dialogType] = null;
         customScroll2ByType[dialogType] = null;
     }
     if (!needsIscroll()) {
         return;
     }
     if (!Utils.isEmpty(activeScroll) && ((force!=undefined && force) || activeScroll.wrapper.id.indexOf("selDialog") > -1)) {
         activeScroll.destroy();
         activeScroll = false;
         autoAdjustElemId1 = false;
     }
     if (!Utils.isEmpty(activeScroll2)  && ((force!=undefined && force) || activeScroll2.wrapper.id.indexOf("selDialog") > -1)) {
         activeScroll2.destroy();
         activeScroll2 = false;
         autoAdjustElemId2 = false;
     }
 }
 

 // deprecated   destroy any old scrollabels and wrap the focused elem in a mobile scrollable form
 function setTouchScroll(elemId,type,noIScroll) {
     deleteActiveCustomScrolls();
     if ((Utils.isMobile() || Utils.isPad()) && (noIScroll == undefined || !noIScroll)) {
         if (document.getElementById(elemId) != undefined) {
             //activeScroll = new iScroll(elemId);
             showingTouchScrolls[type] = true;
         }
     }
     else if (noIScroll != undefined && noIScroll) {
            showingTouchScrolls[type] = false;
     }
 }

 // also deletes custom scrolls for type if dialog is erased - do not call when only HIDING dialog
 function restoreScrollPosition(type,light) {
     return;
     if (type in coreScrollByType && coreScrollByType[type] != null) {
         // ok, this dialog we are showing now for first time or Reshowing again (meaning it was jsut in background)
         // if the doc is in background, the elemt will exist - if not, erase it NOW from custom
         //alert("about to show type:"+type+"   elemId:"+customScroll1ByType[type][0]+"   scrollTop:"+customScroll1ByType[type][1]);
         if (document.getElementById(coreScrollByType[type][0]) != undefined) {
             if (light == undefined || !light) {
                 document.getElementById(coreScrollByType[type][0]).style.overflow = "visible";  // Y ONLY - dont set x to auto because then a small x-scroll will be shown if content just reaches before end, that is a bug with auto
                 document.getElementById(coreScrollByType[type][0]).parentNode.style.overflow = "auto";
                 if (needsIscroll()) {
                     coreScroll = new iScroll(coreScrollByType[type][0]);
                 }
             }
             if (Utils.isAndroid()) {
                 // document.getElementById(coreScrollByType[type][0]).style.webkitTransform = "translate("+coreScrollByType[type][2]+"px,"+coreScrollByType[type][1]+"px)";
                 document.getElementById(coreScrollByType[type][0]).scrollTop  = coreScrollByType[type][1]; // restore last known scroll position
                 document.getElementById(coreScrollByType[type][0]).scrollLeft = coreScrollByType[type][2];
             }
             else {
                 document.getElementById(coreScrollByType[type][0]).scrollTop  = coreScrollByType[type][1]; // restore last known scroll position
                 document.getElementById(coreScrollByType[type][0]).scrollLeft = coreScrollByType[type][2];
             }
         }
         else {
            // should not delete the array key, as unpredictable results,  renumbering or maybe, array key will stay, as per definition of array - all keys to highest element are created by java
            // although from spec. x in y will only tshow true for explicitly added keys, the other keys may stil exist.  To be sure, we check "key in x" AND that the value is not null.
            coreScrollByType[type] = null;
         }
     }
     if (type in customScroll1ByType && customScroll1ByType[type] != null) {
         // ok, there is or WAS a custom in this dialog we are showing now for first time or Reshowing again (meaning it was jsut in background)
         // if the doc is in background, the elemt will exist - if not, erase it NOW from custom
         //alert("about to show type:"+type+"   elemId:"+customScroll1ByType[type][0]+"   scrollTop:"+customScroll1ByType[type][1]);
         if (document.getElementById(customScroll1ByType[type][0]) != undefined) {
             // alert("showing"+type+" "+customScroll1ByType[type][1]);
             document.getElementById(customScroll1ByType[type][0]).style.overflowY = "auto";  // dont set x to auto because then a small x-scroll will be shown if content just reaches before end, that is a bug with auto
             if (needsIscroll()) {
                 activeScroll = new iScroll(customScroll1ByType[type][0]);
             }
             else if (Utils.isApp()) {
                 document.getElementById(customScroll1ByType[type][0]).style.webkitOverflowScrolling = "touch";
             }
             //alert("showing"+type+" "+customScroll1ByType[type][1]);
             document.getElementById(customScroll1ByType[type][0]).scrollTop = customScroll1ByType[type][1]; // restore last known scroll position
             //alert("scrollTop set! "+type+" "+customScroll1ByType[type][1]);
         }
         else {
             // should not delete the array key, as unpredictable results,  renumbering or maybe, array key will stay, as per definition of array - all keys to highest element are created by java
             // although from spec. x in y will only tshow true for explicitly added keys, the other keys may stil exist.  To be sure, we check "key in x" AND that the value is not null.
             customScroll1ByType[type] = null;
             if (activeScroll != null) {
                 activeScroll.destroy;
                 activeScroll = null;
             }
         }
     }
     if (type in customScroll2ByType && customScroll2ByType[type] != null) {
         // ok, there is or WAS a custom in this dialog we are showing now for first time or Reshowing again (meaning it was jsut in background)
         // if the doc is in background, the elemt will exist - if not, erase it NOW from custom
         if (document.getElementById(customScroll2ByType[type][0]) != undefined) {
             //alert("about to show type:"+type+"   elemId:"+customScroll2ByType[type][0]+"   scrollTop:"+customScroll2ByType[type][1]);
             document.getElementById(customScroll2ByType[type][0]).style.overflowY = "auto";  // dont set x to auto because then a small x-scroll will be shown if content just reaches before end, that is a bug with auto
             if (needsIscroll()) {
                 activeScroll2 = new iScroll(customScroll2ByType[type][0]);
             }
             if ((Utils.isApp()) && !needsIscroll()) {
                 document.getElementById(customScroll2ByType[type][0]).style.webkitOverflowScrolling = "touch";
             }
             document.getElementById(customScroll2ByType[type][0]).scrollTop = customScroll2ByType[type][1]; // restore last known scroll position
         }
         else {
             customScroll2ByType[type] = null;
             if (activeScroll2 != null) {
                 activeScroll2.destroy;
                 activeScroll2 = null;
             }
         }
     }
 }
 
 function deleteScrolls(type) {
       coreScrollByType[type] == null;
       customScroll1ByType[type] == null;
       customScroll2ByType[type] == null;
 }
 

 // hide or erase customs scrolls for dialog of passed type, if elem exists,  hide and save current position of scroll
 function hideScrolls(type,saveOnly) {
     if (document.getElementById("selDialog"+type+"Core") != undefined) {  //because delete array[key] does not remove the key so i in x will still show true for a deleted key with null value!
         coreScrollByType[type] = new Array();
         coreScrollByType[type][0] = "selDialog"+type+"Core";
         coreScrollByType[type][1] = document.getElementById(coreScrollByType[type][0]).scrollTop;
         coreScrollByType[type][2] = document.getElementById(coreScrollByType[type][0]).scrollLeft;
         // alert(type+" "+coreScrollByType[type][2]);
         //document.getElementById(coreScrollByType[type][0]).style.overflow == "auto";
         if (saveOnly == undefined || !saveOnly) {
             document.getElementById(coreScrollByType[type][0]).style.overflow = "hidden";
             document.getElementById(coreScrollByType[type][0]).parentNode.style.overflow = "hidden";
             if (coreScroll) {
                 coreScroll.destroy();
                 coreScroll = null;
             }
         }
     }
     else {
         coreScrollByType[type] == null;
     }
     if (type in customScroll1ByType && customScroll1ByType[type] != null) {  //because delete array[key] does not remove the key so i in x will still show true for a deleted key with null value!
         if (document.getElementById(customScroll1ByType[type][0]) != undefined) {
             if (document.getElementById(customScroll1ByType[type][0]).style.overflow == "auto" || document.getElementById(customScroll1ByType[type][0]).style.overflowY == "auto") {
                 customScroll1ByType[type][1] = document.getElementById(customScroll1ByType[type][0]).scrollTop;
                 document.getElementById(customScroll1ByType[type][0]).style.overflow = "hidden";
                 if (needsIscroll()) {
                     if (activeScroll) {
                         activeScroll.destroy();
                         activeScroll = null;
                     }
                 }
                 else if (Utils.isApp()) {
                     document.getElementById(customScroll1ByType[type][0]).style.webkitOverflowScrolling = null;
                 }
             }
         }
         else {
             customScroll1ByType[type] == null;
         }
     }
     if (type in customScroll2ByType && customScroll2ByType[type] != null) {
         if (document.getElementById(customScroll2ByType[type][0]) != undefined && customScroll2ByType[type] != null) {
             if (document.getElementById(customScroll2ByType[type][0]).style.overflow == "auto" || document.getElementById(customScroll2ByType[type][0]).style.overflowY == "auto") {
                 customScroll2ByType[type][1] = document.getElementById(customScroll2ByType[type][0]).scrollTop;
                 document.getElementById(customScroll2ByType[type][0]).style.overflow = "hidden";
                 if (needsIscroll()) {
                     if (activeScroll2) {
                         activeScroll2.destroy();
                         activeScroll2 = null;
                     }
                 }
                 else if (Utils.isApp()) {
                     document.getElementById(customScroll2ByType[type][0]).style.webkitOverflowScrolling = null;
                 }
             }
         }
         else {
             customScroll2ByType[type] = null;
         }
     }
 }

 // Android scrolls MUST be hidden  (ie overflow : hidden) when overlayed with another screen due to an Android BUG
 // keeps any non-hidden scrolls from going into background - only non-overlapping and foreground scrolls can work at same time.
 // Hides and shows current scrolls for active dialog's core element.  If such dialog has custom scrolls, those are  made active scrolls instead - and core scroll is ALSO made active. - that works now.
 function setScroll(id,on,type) {  // id should be automated inner dialog cores ONLY
   if (!Utils.isMobile() && !Utils.isPad()) {
       // return;
   }
   //if (id == autoAdjustElemId1 || id == autoAdjustElemId2) {
   //    return;
   //}
   //   First,  if 'on' (ie about to show or reshow a new dialog),
   //   save the current scroll positions and hide all custom scrolls that may be on and showing or in background from any current dialog  - excluding dialog type we are about to turn on.
   //  hide/erase customs scrolls for all the dialogs BUT type if on -- BUT if !on  hide/erase ONLY scrolls for dialog of type
   if (on != undefined && on) { // save any existing potisions now before bringing new one to foreground
       for (var i = 1; i <= TOTAL_DIALOG_ELEMS; i++) {
           if (type != undefined && i == type) {
               continue;
           }
           hideScrolls(i);
       }
   }
   if ((on != undefined && !on) && type != undefined) { // hiding this type - save custom scroll position information and hide the scroll - or if not showing, erase custom positions
         hideScrolls(type);
   }
   // if on is false, we do this hide AFTER saving the positions.
   // conversely, if on is true, setting the overflow back to auto BEFORE we restore the positions - as the set to auto resets the scroll back to zero
   if (document.getElementById(id) != null) {
       if (on != undefined && on) {
            document.getElementById(id).style.overflowY = "auto";
       }
       else {
           document.getElementById(id).style.overflow = "hidden";
       }
   }
   // restore any custom positions now, if on
   if ((on != undefined && on) && type != null) {
       restoreScrollPosition(type);
   }
 }

 /************  END I TOUCH SCROLLS  *********************/

 // navItems drop down - NOT the nav bar itself which should always defer to mask
 // dialog in focus 23
 // Music 22
 // mask 21
 // last showing dialog (if there is one) 19
 // all other showing/non-showing dialogs 18
 // headers 17                // erase old before adding new
 // now calls autoAdjustDialogHeight() as well BEFORE calling setScroll as adjusting height of a scroll elem resets scroll position to zero and setScroll restores the last position
 // if there was a background dialog now being brought back to foreground.
 function setDialogFocus(type, dialogHTML,noIscroll,silent,dialog) {  // only type and dialogHTML are required
     if (silent == undefined) {
         silent = false;
     }
     var lastShowing = getLastShowingDialogType();
     var lastShowingDialog = getLastShowingDialog();
     if (!Utils.isEmpty(dialogHTML)) { // set latest dialog to focus and others underneath
         if (silent && lastShowing > 0)    {
             // a)  if silent is set, we assume the SAME dialog is showing in bgnd or frgrnd - therefore setDialog() save the scroll position of where it was - BEFORE it rewrote the innerHTML
             // we need to TEMPORARILY set the showing dialog to this type and then set it back to the other one after the adjust
             setLastShowingDialog(type,null,dialog);
             autoAdjustDialogHeight();
             setLastShowingDialog(lastShowing,null,lastShowingDialog);
             //restoreScrollPosition(type);
         }
         else {
             for (var t=1; t<=TOTAL_DIALOG_ELEMS; t++) {
                 if (t == type) {

                 }
                 else if (t == lastShowing) { // so in background if there are 3 dialogs the last showing one will remain in foreground of background - still behind the mask
                     setScroll("selDialog"+t+"Core",false,t);           // gets rid of scrolling - necessary in Android due to a BUG - hidden scrolls don't hide with z-index!!!!
                     window["dialogWrapper"+t].style.zIndex = 19;
                     window["dialog"+t].style.zIndex = 19;
                 }
                 else {
                     setScroll("selDialog"+t+"Core",false,t);
                     window["dialogWrapper"+t].style.zIndex = 18;
                     window["dialog"+t].style.zIndex = 18;
                 }
             }
             // reset type now, AFTER hiding other dialogs - as if type is restored before another dialog is put into background
             // -  elem overflow in restored may remain hidden, so setting the scrollTop in setScroll() would be ignored
              //setTouchScroll("selDialog"+type+"Core",type,noIscroll);
              window["dialogWrapper"+type].style.zIndex = 23;      // a hidden z-index may automatically set overflow to hidden - if so, the setScroll should be AFTER bringing dialog to foreground
              window["dialog"+type].style.zIndex = 2000000;
              setLastShowingDialog(type,null,dialog); // BEFORE autoAdjustHeight
              autoAdjustDialogHeight(); // BEFORE setScroll as this resets positions
              // setScroll("selDialog"+type+"Core",true,type);             // turns on scrolling - necessary in Android due to a BUG - hidden scrolls don't hide with z-index!!!!
          }
     }
     // make disappeared dialog 19 and all other showing dialogs 18 - except last showing one - if still showing comes to foreground at 23
     // if not still showing but there is another showing - we need at LEAST one of them to be in foreground so we dont mask out everything.
     else {

        for (var t=1; t<=TOTAL_DIALOG_ELEMS; t++) {
             if (t == type) {
                 deleteScrolls(t);           // gets rid of scroll - if using iScroll (otherwise because element is no longer showing, erases custom scroll)
                 if ( ("dialogWrapper"+t) in window) {
                     window["dialogWrapper"+t].style.zIndex = 18;
                     window["dialog"+t].style.zIndex = 18;
                 }
                 setLastShowingDialog(t,true); // set to background this one - erases this one from lastShowing dialogs
             }
         }
         // put new most recent showing to foreground if there is one all others put to background
         lastShowing = getLastShowingDialogType();  // check lastshowign is zero - do NOT use isEmptyFialgos becaseu we now put that in a timeout in setDialog for empty - so it  IS empty -but html is still there until a second from now to do animation!
         //alert(Utils.toString(showingDialogsByDate) +"*****"+Utils.toString(showingDialogs));
         //alert(lastShowing+" "+Utils.isEmpty(window["dialogWrapper"+lastShowing].innerHTML)+window["dialogWrapper"+lastShowing].innerHTML);
         if (lastShowing > 0 && !Utils.isEmpty(window["dialog"+lastShowing].innerHTML)) {
             window["dialogWrapper"+lastShowing].style.zIndex = 23;  
             window["dialog"+lastShowing].style.zIndex = 2000000;
             // BEFORE setScroll (but of course after we have now restored a background dialog to foreground and lastShowing), as any change to a scrollable height will reset its position back to zero!
             //autoAdjustDialogHeight();  // TO DO:  restore scroll position manually - Do NOT call autoadjustheight on an erased dialog it will fuck up the animation.
             // setScroll("selDialog"+lastShowing+"Core",true,lastShowing);
                       //setTouchScroll("selDialog"+lastShowing+"Core",lastShowing,showingTouchScrolls[lastShowing]);
         }
         else { // safety - make SURE at least one dialog has zIndex prominence if there is one showing
            for (var t=1; t<=TOTAL_DIALOG_ELEMS; t++) {
                     if (t != type && !Utils.isEmpty(window["dialog"+t].innerHTML)) {   // warning! if t is type innerHTML may still be showing becasue it is erased in a timeout in setDialog for animation!
                         window["dialogWrapper"+t].style.zIndex = 23;
                         window["dialog"+t].style.zIndex = 2000000;
                         setLastShowingDialog(t,null,dialog);
                         //autoAdjustDialogHeight();
                         //setScroll("selDialog"+t+"Core",true,t);
                                       //setTouchScroll("selDialog"+t+"Core",t,showingTouchScrolls[t]);
                         return;
                     }
            }
            // autoAdjustDialogHeight(); // any header changes that may be necessary now that no dialogs are showing, like a readjust of musicWrapper to match background buttons when scrolled or zoomed
         }
     }
 }


var dialogStartX;
var dialogStartY;
var dialogEndX;
var dialogEndY;

var srcElem;
var tempX; var tempY;

function windowX(screenX) {
    return parseInt(screenX) -  (("screenLeft" in window) ? window.screenLeft : window.screenX);
}

function windowY(screenY) {
     return parseInt(screenY) -  (("screenTop" in window) ? window.screenTop : window.screenY);
}

var tempElem;

function dialogMouseMove(evt,dType) {
    // if evt target is an input or text area do NOT move window - Firefox
    srcElem = ((evt != undefined && evt.target != null && evt.target != undefined) ? evt.target : evt.srcElement);
    //if (srcElem == undefined || !("id" in srcElem) || srcElem.id.indexOf("dialogTitle") == -1) {
    //   if (!isBeingDragged) {
    //       // dialogDragEnd(evt,dType);
    //       return true;
    //   }
    //
    //}
     if (dialogTypeBeingDragged < 1) {
           // dialogDragEnd(evt,dType);
           return true;
     }
     dType = dialogTypeBeingDragged;  // (passed dType is now deprecated)
    //if ( srcElem != undefined && (("id" in srcElem) && srcElem.id.indexOf("selectable") > -1) ||  (("id" in srcElem.parentNode) && srcElem.parentNode.id.indexOf("electable") > -1) || srcElem.scrollHeight != srcElem.clientHeight || srcElem.scrollWidth != srcElem.clientWidth) { // if scroll bars present in elem, user may be scrolling so do not move window
    //   dialogDragEnd(evt,dType);
    //   return true;  // scrolling means user does NOT want to be moving the window!
    //}
    //if (srcElem != undefined && srcElem.tagName != undefined && (srcElem.tagName.toLowerCase() == "img" || srcElem.tagName.toLowerCase() == "input" || srcElem.tagName.toLowerCase() == "textarea" || srcElem.tagName.toLowerCase() == "textfield")) {
   //    return true;
    //}
    if (eval("dialog"+dType+"MouseDownX") > -1) {
       tempX = window["dialog"+dType+"MouseDownElemStartX"] + evt.screenX - window["dialog"+dType+"MouseDownX"];
       tempY = window["dialog"+dType+"MouseDownElemStartY"] + evt.screenY - window["dialog"+dType+"MouseDownY"];
       //if ( (windowX(evt.screenX) < 50 && (tempX < window["dialog"+dType+"X"])) || (windowY(evt.screenY) < 130 && (tempY < window["dialog"+dType+"Y"])) ) { // || windowX(tempX) > window.clientWidth || windowY(tempY) > window.clientHeight) {
       //    return true;
       //}
        window["dialog"+dType+"X"] = (tempX > -100 ? tempX : -100);
        window["dialog"+dType+"Y"] = (tempY > -10 ? tempY : -10);
        //setStatusArea(evt.screenX+" "+evt.screenY+" "+dialog2MouseDownX+" "+dialog2X+" "+dialog2Y,2000);
        tempElem = document.getElementById("dialog"+dType);
        if (tempElem != null) {
            if (Math.abs(parseInt(getStyle(srcElem,"top")) - window["dialog"+dType+"Y"]) >= 2 || Math.abs(parseInt(getStyle(tempElem,"left")) - window["dialog"+dType+"X"]) >= 2) {
               tempElem.style.top  = window["dialog"+dType+"Y"]+"px";
               tempElem.style.left = window["dialog"+dType+"X"]+"px";
            }
        }
    }
    return true;
}

var dragElement;

function isContained(id,elem,stopElemId) {
    if (elem == null) {
        return false;
    }
    var daddy = elem;
    while (daddy != null) {
         if (daddy == undefined || !("id" in daddy)) {
             return false;
         }
         if (daddy.id.indexOf(id) != -1) {
             return true;
         }
         if (daddy.id == stopElemId) {
             return false;
         }
         daddy = daddy.parentNode;
    }
}

function dialogDragStart(evt,dType) {  // onmousedown of title bar in dialog - record  where mouse is
     // if evt target is an input or text area or is a scroll, do NOT move window
     srcElem = (evt.target != undefined ? evt.target : evt.srcElement);
     if (!isContained("dialogTitle",srcElem,"dialog"+dType)) {
       dialogDragEnd(evt,dType);
       return true;
    }
    dialogTypeBeingDragged = dType;
     //if (srcElem != undefined && srcElem.tagName != undefined && (srcElem.tagName.toLowerCase() == "img" || srcElem.tagName.toLowerCase() == "select"  || srcElem.tagName.toLowerCase() == "input" || srcElem.id == "publishableMessage" || srcElem.tagName.toLowerCase() == "textarea" || srcElem.tagName.toLowerCase() == "textfield" || srcElem.className == "inboxSelectorTable")) {
     //    return true;
     //}
     if (dType == 1) {
         dialog1MouseDownX = evt.screenX;
         dialog1MouseDownY = evt.screenY;
         dialog1MouseDownElemStartX = parseInt(getStyle(dialog1,"left"));
         dialog1MouseDownElemStartY = parseInt(getStyle(dialog1,"top"));
         // document.onMouseMove = function(e) {dialogMouseMove((e == undefined ? window.event : e),1);};
         // setStatusArea("down "+evt.screenX+" "+evt.screenY+" "+dialog1.style.left,1000);
     }
     else {
         window["dialog"+dType+"MouseDownX"] = evt.screenX;
         window["dialog"+dType+"MouseDownY"] = evt.screenY;
         tempElem = document.getElementById("dialog"+dType);
         if (tempElem != null) {
             window["dialog"+dType+"MouseDownElemStartX"] = parseInt(getStyle(tempElem,"left"));
             window["dialog"+dType+"MouseDownElemStartY"] = parseInt(getStyle(tempElem,"top"));
         }
     }
     // prevent IE from trying to drag an image
     srcElem.ondragstart = function() { return false; };
     dragElement = srcElem;
     // prevent text selection in IE
     document.onselectstart = function () { return false; };
     // prevent text selection for non-IE
     return false;
}

function dialogMouseOut(evt,dType) {
    dialogMouseMove(evt,dType);
    dialogTypeBeingDragged = -1;
}

function dialogDragEnd(evt,dType) {  // onmouse up or out of title bar in dialog - window can move as long as it stays in main window
    // setStatusArea("UP "+evt.screenX+" "+evt.screenY+" "+dialog2MouseDownX,1000);
    dialogTypeBeingDragged = -1;
    dialog1MouseDownX = -1;
    dialog2MouseDownX = -1;
    dialog3MouseDownX = -1;
    dialog4MouseDownX = -1;
    dialog5MouseDownX = -1;
    dialog6MouseDownX = -1;
    dialog1MouseDownY = -1;
    dialog2MouseDownY = -1;
    dialog3MouseDownY = -1;
    dialog4MouseDownY = -1;
    dialog5MouseDownY = -1;
    dialog6MouseDownY = -1;
    // document.onMouseMove = null;
    document.onselectstart = null;
    if (dragElement != undefined) {
        dragElement.ondragstart = null;
    }
}



