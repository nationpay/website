const Ajax = require('./Ajax')

/* the Class function (first 25 lines) is Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 *  The balance of classes and the Stateable paradigm (remaining 1500 lines) are prorpietary and Copyright 2009-2012, Ken Silverman and Place Groove Incorporated.
 *  No use without written permission
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    _super.child1 = this;
    initializing = true;
    var prototype = new this(); //  the new subclass object is just a copy of the class object.
    _super.child = prototype;   // addition to get access to the child and thus the childs class name - yay!!!!
    initializing = false;

    // Copy the properties over onto the new prototype
    prototype["className"] = prototype.constructor;
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }



    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();


Function.prototype.inheritsFrom = function( parentClassOrObject ){
	if ( parentClassOrObject.constructor == Function )
	{
		//Normal Inheritance
		this.prototype = new parentClassOrObject;
		this.prototype.getThis = function() {return this;};
		this.prototype.constructor = this;
		this.prototype._super = this.prototype; // parentClassOrObject.prototype; // this.prototype is better I think
		this.prototype.superConstructor = parentClassOrObject; // constructor is like a static property because it is the name of the class function itself that is called - so this works for using the parent constructor...
		//this.prototype.parent.child = this;
	}
	else
	{
		//Abstract Inheritance  (passed object is not a function - just an object that cannot be instanitated directly)
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype._super = parentClassOrObject;  // the static properties of the parent class
	}
	return this;
};

function Utils() {
    Utils._isMobile = 0;
    Utils._isIpad = 0;
    Utils._isAndroid = 0;
    Utils._isIphone = 0;
    Utils._isPad = 0;
    Utils._isMobileTest = 0;
}

Utils.timers = new Object();  // key elemIds val: endTimes for isClear
Utils.timersMasked = new Object();
Utils.timersTimerIds = new Object();

// if no elemId is passed, returns 0 or 1 for all elementsReady
// if there is an existing timeOut time for passed elemId, passed timeToWait is ignored.
// passedTimeToWait must be > 1000
// however if timeToWait is 0 then it means a callback is calling this and NO elemId should be set, rather if time is ready just delete the timer herein - reset values and return 1 or 2
Utils.isClear = function(elemId,timeToWait,maskOn,soundOn,warnOn) { // independent for each passed id - returns 0=elementNotReady  1=element is new or otherwise ready 2=allClearall elements are ready
    var endTime = 0;
    var now = (new Date()).getTime();
    var newTimer = false;
    if (elemId != null) {
        if (timeToWait != null && timeToWait > 0) {
            timeToWait = (timeToWait == null || timeToWait < 1000) ? 1000 : timeToWait;
            if (!(elemId in Utils.timers) ) {
                Utils.timers[elemId] = (now + timeToWait);  // endTime is set, restore with timeout at endTime
                Utils.timersMasked[elemId] = (maskOn == null || !maskOn) ? false : true;
                if (maskOn != null && maskOn) {   // SHOW the mask over the button - button is busy until timeOut or callback calls this.
                     if (document.getElementById(elemId) != null) {
                         document.getElementById(elemId).style.cursor = "default";
                         if (document.getElementById(elemId+"mask") != null) {
                             document.getElementById(elemId+"mask").src = WAITING_IMAGE_URL;
                             document.getElementById(elemId+"mask").display = "inline";
                         }
                         else {
                             document.getElementById(elemId).style.backgroundImage = 'url("'+WAITING_IMAGE_URL+'")';
                         }
                     }
                }
                var temp = elemId; // timeout function will stupidly use last set value of elemId in this function rather than current value when code is reached.
                Utils.timersTimerIds[elemId] = setTimeout(function() {  // MUST delete timer on timeout so new timer can add new timeout and return 1
                              if (document.getElementById(temp) != null) {
                                  document.getElementById(temp).style.cursor = "pointer";
                                  if (Utils.timersMasked[temp] != null && Utils.timersMasked[temp]) {
                                      if (document.getElementById(temp+"mask") != null) {
                                          document.getElementById(temp+"mask").src = CLEAR_IMAGE_URL;
                                          document.getElementById(temp+"mask").display = "none";
                                      }
                                      else {
                                          document.getElementById(temp).style.backgroundImage = 'url("'+CLEAR_IMAGE_URL+'")';
                                      }
                                  }
                              }
                              delete Utils.timers[elemId];
                              delete Utils.timersMasked[elemId];
                              delete Utils.timersTimerIds[elemId];
                          } , timeToWait);
                newTimer = true; //  return 1 or 2 // timer ready and isClear because it is the first call to it.
            }
        }
        else {   // timeToWait is zero.
            // this is a callback - did timeout happen yet to clear masks?
            var mask = Utils.timersMasked[elemId] != null && Utils.timersMasked[elemId];
            if (elemId in Utils.timers) {
                clearTimeout(Utils.timersTimerIds[elemId]);
            }
            if (document.getElementById(elemId) != null) {
                document.getElementById(elemId).style.cursor = "pointer";
                if (mask) {
                    if (document.getElementById(elemId+"mask") != null) {
                        document.getElementById(elemId+"mask").src = CLEAR_IMAGE_URL;
                        document.getElementById(elemId+"mask").display = "none";
                    }
                    else {
                        document.getElementById(elemId).style.backgroundImage = 'url("'+CLEAR_IMAGE_URL+'")';
                    }
                }
            }
            if (elemId in Utils.timers) {
                delete Utils.timers[elemId];
                delete Utils.timersMasked[elemId];
                delete Utils.timersTimerIds[elemId];
            }
        }
    }


    if (newTimer || elemId == null || (Utils.timers[elemId] - now) < 0) {  // passed timer is now inactive or none was passed so it is the same as inactive if here with an elemId,timeout is about to happen
        if (elemId != null) {
            //delete Utils.timers[elemId];
            //delete Utils.timersMasked[elemId];
        }
        for (elemId in Utils.timers) {  // are any other timers still active ?
             if ( (Utils.timers[elemId] - now) > 0) {
                 return 1;  // at least one other timer is still active
             }
             // do NOT delete other timers here because a new call with same idwould need to know that it is clearso would delete at that time (to return 1) and replace with new endTime
        }
        return 2;  //no timers are active
    }
    else {
       if (soundOn != null && soundOn) {
           setBeep("ajaxBlocked");
       }
      return 0;
    }
}

// call async so that deviceReady finishes and native base screen is displayed regardless if no internet connection
Utils.initFBStuff = function(count) {
      if (count == null) {
          count = 0;
      }
      if (!("FB" in window) && count < 10) { // try up to 10 more times at longer intervals each time.
          setTimeout(function() {Utils.initFBStuff(count+1)},(300*count));
          return;
      }
      FB.Event.subscribe('auth.login', function(response) {fbAuthEventLogin(response);});
      FB.Event.subscribe('auth.statusChange', function(response) {fbAuthEventStatusChange(response);});
      FB.Event.subscribe('auth.authResponseChange', function(response) {fbAuthEventSessionChange(response);});
      FB.init( {appId: "407362932665048", useCachedDialogs: false, channelUrl : (BASE_URL + "channel.php"), cookie : true, status : false, xfbml : false,version : 'v2.0' });  // nativeInterface: CDV.FB,  channelUrl : (BASE_URL + "channel.php"),
      fbInitiated = true;
}

Utils.getStatusFB = function(callback,count) {
     if (Utils.isApp()) {
         facebookConnectPlugin.getLoginStatus(callback,callback);
     }
     else {
          if (count == null) {
              count = 0;
          }
          if (!("FB" in window) && count < 10) { // try up to 10 more times at longer intervals each time.
              setTimeout(function() {Utils.getStatusFB(callback,count+1)},(300*count));
              return;
          }
         FB.getLoginStatus(callback);
     }
}

// pass perms as comma separated string or array
Utils.loginFB = function(callback,perms,count) {
    if (count == null) {
        count = 0;
    }
    if (callback == null) {
        callback =  function(response) {};
    }
    if (Utils.isApp()) {
        if (Utils.isEmpty(perms)) {
            perms = new Array();
        }
        else if(typeof perms == "string") {
            perms = perms.split(",");
        }
        facebookConnectPlugin.login(perms, callback, callback);  // perms is array
    }
    else {
         if (!("FB" in window) && count < 10) { // try up to 10 more times at longer intervals each time.
              setTimeout(function() {Utils.loginFB(callback,perms,count+1)},(300*count));
              return;
         }
        if(typeof perms == "object") {
           perms.join()
        }
        FB.login(callback, {scope: perms});  // perms is string separated by commas
    }
}

Utils.logoutFB = function(callback) {
      if (Utils.isApp()) {
          facebookConnectPlugin.logout(callback);
      }
      else {
          FB.logout(callback);
      }
      //var d = new Dialog();
      //d.setType(3,true);
      //d.setSmall(true);
      //d.setTimer(3000);
      //d.showMessage("Logout successful","Now Logged out of FaceBook and Spotwired","ok");
      //document.location.reload();
}

Utils.inviteFB = function(fbIds) {
    // var fbids = Utils.objectToArray(that.task["friendIds"],6);   // maximum 5 people - put 6 because facebook uses one less - its an error
    //FB.ui({method: 'apprequests', app_id : '407362932665048', message: 'Hey, meet me here at Spotwired'}, function(){});  // to: fbids is omitted so friend picker can be selected, expects true javascript array  - not an object
    var lin;
    if (Utils.isApp()) {
       var au = 'http://www.spotwired.com/?refLid='+lid; // for non-renderable urls like in an sms textmessage.
       var u = au +'&spice='+(new Date()).getTime()+Math.random();    //alwasy different so not cached to in theory when used in renderable situations like facebook - allow the html title to be dybnamic based on user name - no longer done though.
       lin = "<a href='"+u+"' src='"+placeLogoUrl+"'></a>";
       var s = placeName + " is on "+APP_NAME+".  You're invited!";
       var smsText = placeName + " is on "+APP_NAME+".\nYou're invited!";
       var t = "Install Spotwired to connect with friends and send gifts at "+placeName+".";
       var c = placeName + " is on "+APP_NAME+". Invite someone!";
       var message = {chooserHeader : c, subject : s, text : t, smsText: smsText, url : u, altUrl : au, link : lin, image : getThumb(placeLogoUrl)};  // image : placeLogoUrl,
       socialMessagePlugin.send(message);
       // facebookConnectPlugin.showDialog({app_id : '407362932665048', link: 'http://www.spotwired.com/?refLid='+lid+'&spice='+(new Date()).getTime()+Math.random()},that.fbSendSuccess,that.fbSendFailure);
    }
    else {
        lin =  BASE_URL+'?refLid='+lid+'&spice='+(new Date()).getTime()+Math.random();
        if (!("FB" in window)) {
            return;
        }
        if (fbIds != null) {
            FB.ui({method: 'send', app_id : '407362932665048', link: lin, to : fbIds});
        }
        else {
            FB.ui({method: 'send', app_id : '407362932665048', link: lin});
        }
    }
}

// use this if person inviting does NOT have an fbid in the app.
// No difference phone or otherwise form the email look and feel here in a dialog and send off to server to send via pear.
Utils.inviteEmail = function(email) {

}



Utils.isLocFinished = function(originalLoc,loc,win) {   // e1s3 e3s3 etc... = user canceled at login screen   closeWindow = user canceled at screen where payment is authorized.
        if (typeof loc == "object") {
            loc = Utils.toString(loc);
        }
        // BASE_URL does NOT mean we are done, it is initial call to paypal.php - redirect on valid also goes back to paypal.php!  There the window is closed.
        // that redirect must contain success or cancel in the url.  But paytpal.php will close the window itself and then the close event will be called without checking this.
        // so no need to check for success or cancel in the url after a valid payment - but we do should check for cancel form paypal which does not redirect when it should back to paypal.php so window remains open.
        //if (!Utils.isEmpty(PayPal.appWindow) && ("document" in PayPal.appWindow) && PayPal.appWindow.document.getElementById("spotWiredCloseWindow") != undefined) {
        //    return true;
        //}
        if (Utils.isEmpty(loc)) {  // a last resortt!  if winodw closed at payapl.php() hopefully this sets the loc to empty
            return false;
        }
        if (loc.indexOf(BASE_URL_RELATIVE+"empty.htm") > -1) {
            return true;
        }
        // alert(loc+" "+redirect);
        if (loc.indexOf(originalLoc) != -1) {
            return false;
        }
        return true;
        //if (!Utils.isEmpty(win) && typeof win == "object" && "document" in win) {
            // alert(PayPal.appWindow.document.body.innerHTML);
            //if (win.document.body.innerHTML.toLowerCase().indexOf("window will close") > -1 || win.document.body.innerHTML.toLowerCase().indexOf("thank you for using paypal") > -1) {
            //  return true;
            // }
        //}
        //else {
           // alert(Utils.toString(PayPal.appWindow));
        //}
        //return ((loc.toLowerCase().indexOf("closewindow") != -1 ));           // loc.indexOf(BASE_URL) != 0 &&      // || loc.toLowerCase().indexOf("s3") == (loc.length-2)
    }

// @return false if still waiting for loc to changewindow to close or true or locationChangeActionId if closed window
// @param closeIt  if still open and window is of a type that will not close itself when user is finished - closeIt upon the url change
Utils.locChangedCheck = function(win,originalUrl,newUrl,closeIt) {
        if (!Utils.isLocFinished(originalUrl,newUrl,win)) {
          return false;
        }
        if (closeIt != null && closeIt) {
            return setTimeout(function() {if (typeof win == "object" && "close" in win) {win.close();} },500);
        }
        return true;
}



// Android App.  this._isMobile= 2
// mobile web  this._isMobile= 1 or true
//    mobile web for Android  some other variable yet to be named like Android = 1
// iPhone App.  this._isMobile= 3
Utils.isMobileWebAndroid = function() {  // not exactly accurate may be any mobile web.
    return this._isMobile&& !Utils.isMobileView() && (isNaN(this.isMobile) || this._isMobile== 1);
}

Utils.isAndroid = function() {
    return this._isMobile== 2 || this._isAndroid == 1 || this._isAndroid == "1"; //   (this._isMobile&& !Utils.this.isMobileView() && !Utils.isIos());
}

Utils.isMobileWeb = function() {
    return this._isMobile&& !Utils.isMobileView() && (isNaN(this.isMobile) || this._isMobile== 1); // this needs to be here: && !Utils.this.isMobileView()   but backward compatability test first!
}

// desktop mobile view testing - NOT android or ios or any mobileWeb - no way to orientate the screen which implies mobile device
// fucking BULLSHIT  isMObile=="0" returns TRUE!!!!! FUCK OFF JAVASCRIPT!  this._isMobileshould be NUMERICAL zero
Utils.isMobileView = function() {
    if ( this._isMobile&& ((("mobileTest" in window) && this._mobileTest) || !("orientation" in window))) {
        return true;
    }
    return false;
}

Utils.isWinPhone = function() {
    return false;
}

Utils.isTouchScreenOnly = function() {
   return ("orientation" in window) && (Utils.isApp() || Utils.this.isMobileWeb());
}

// the TRUE definition of this._isMobile- which is also isTouch - unlike the global this._isMobilevar which if true (ie 1,2,3,4) =1 means desktop (or mobile web) mobile view mode  which is not a mobile device - just the mobile view mode.
Utils.isMobile= function() {
    return (this._isMobile|| this._isPad) && !Utils.this.isMobileView();
}

Utils.isDeskTop = function() {
   return Utils.this.isMobileView();
}

//  if http_user_agent contains mobile in the string for ipad then ismobeilw ould be tru for ipad as well as ispad.  Currently this i not known but assumed that isMObile is false when ispad is true.
// this shoudl be correct ed for so that any variations fro isPad should work WITH ismobile = true as ipad ismobile as well.  but then desktop ismobile view is MNOT mobile but the view is mobile!  but we still have this.isMobile=1 in that case.
//Utils.isRoomView() = function() {
//   return !this.isMobile; // isPad should still return this._isMobiletrue if in mobile view mode - but currently it does not.  isPad is without this.isMobile.  so roomView should be based ONLY on global roomView variable
//}

Utils.isApp = function() {  // 2=android 3=iPhone
    return this._isMobile&& (!isNaN(this._isMobile) && this._isMobile> 1);
}

Utils.isIos = function() {
   return this._isIphone == 1 || this._isIphone == "1" || this._isIpad == 1 || this._isIpad == "1" || this._isIphone === true || this._isIpad === true;
}
Utils.isIphone = function() {
   return this._isIphone == 1 || this._isIphone == "1" || this._isIphone === true;
}
Utils.isIpad = function() {
   return this._isIpad == 1 || this._isIpad == "1" || this._isIpad === true;
}
Utils.isPad = function() {
   return this._isPad== 1 ||this._isPad== "1" ||this._isPad === true;
}

// uiwebview embedded will not allow popups so facebook redirect will become main window and no check for window close should be done and index.php should refresh and not try to close the window.
// if App., this will always return false unless you explicity pass includeApps=true and we are embedded in a facebook app - ie user clicked spotwired link within mobile facebook app.
Utils.isUIWebView = function(includeApps) {
    if (Utils.isApp() && (includeApps == undefined || !includeApps)) {
        return false; // this is an app - and apps are NOT included in the uiWebView sense, so return false
    }
    if (navigator.userAgent.toLowerCase().indexOf("facebook") > -1) {
      alert("Utils.isUIWebView true");
        return true;
    }
    /**
    if ((isIphone || isPad)) { //  && (navigator.userAgent.match(/Safari/i) == null) && (navigator.userAgent.match(/Chrome/i) == null) && (navigator.userAgent.match(/Firefox/i) == null)) {
        return true;
    }
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1 && (navigator.userAgent.match(/Chrome/i) == null) && (navigator.userAgent.match(/Firefox/i) == null)) {
        return true;
    }   */
    return false;
}


Utils.getHTML = function(elem) {
    if (elem == null) {
        return "";
    }
    if ("outerHTML" in elem) {
        return elem.outerHTML;
    }
    var wrap = document.createElement('div');
    wrap.appendChild(elem.cloneNode(true));
    return wrap.innerHTML;
}

//get all child and sub-child elements in order from first to last.  getChild is NOT enough buching sub-children into the same element returned!!!
Utils.getAllElements = function(elem,e) {
    if (e == null) {
        e = new Array();
    }
    var children = elem.childNodes;
    for (var i = 0; i < children.length; i++) {
       if (children.item(i).hasChildNodes()) {
           Utils.getAllElements(children.item(i),e);
       }
       e[e.length] = children.item(i);
    }
    return e;
}


// convert all html and reserved characters that we use for parsing serializables into their "&" entity equivalents so they are not rendered as html or found  our proprietary parser
// but browser will still convert them to text when displayed.
Utils.encodeText = function (m) {
     // TRIM text
      m = m.replace(/^\s+|\s+$/g,"");
     // substiutute user-typed  special characters that we use for parsing seriliazation (tilthe and | reserved for parsing for now) with html encoded form
     m = m.replace(/~/g,"&#152;"); //
     m = m.replace(/\|/g,"&#124;");  // (| is escaped here because it is also a regExp reserved character!)
     // substiutute user-typed HTML tag reserved characters with encoded version so they are not interpreted as HTML
     m = m.replace(/</g,"&#139;");
     // do NOT allow line feeds for now :  future perhaps allow a maximum of 3 or 4 and convert them to <br> html to be the only allowable html in a text black
     // must do this LAST, AFTER converting user-typed reserved html characters to encoded form, so as not to lose the html tags we are adding here.
     m = m.replace(/\r\n/g," ");
     m = m.replace(/\r/g," ");
     m = m.replace(/\n/g," ");
     //m = m.replace(/\r\n/g,"\n"); // replace line feeds with <br> in future, line feed may be r, n or rn together
     //m = m.replace(/\n\r/g,"\n");
     //m = m.replace(/\r/g,"\n");
     //m = m.replace(/\n/g,"<br/>");
     // To DO: possibly GET rid of whitespace between words to free up database even though html wont show them, they will clutter database
     // TO DO:  get rid of whitespace at end of each line when we decide to allow up to 3 or 4 linebreaks again - why allow?  well, maybe user wants a text doodle for his message.
     return m;
}

// in a dialog CORE as parentElem - return the max size possible from start of elem to bottom of parent
Utils.getOffsetFrom = function(parentElem,elem) {
      var distance = 0;
      var totalParents = 0;
      while (elem == undefined || ((elem != parentElem) && (elem != document.body) && (totalParents < 12))) {
         if (elem == undefined) {
            return distance;
         }
         totalParents++;
         distance += elem.offsetTop; // the distance between cureleemnt and first offsetParent (nearest parent that is positioned)
         elem = elem.offsetParent;
      }
      return distance;
}

Utils.getScreenPosition = function(element,bottomRight,offScreen) {
    var xPosition = 0;
    var yPosition = 0;
    var orig = element;
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    if (bottomRight != undefined && bottomRight) {
        xPosition += (offScreen !=undefined && offScreen  ? orig.scrollWidth : orig.offsetWidth);
        yPosition += (offScreen !=undefined && offScreen  ? orig.scrollHeight : orig.offsetHeight);
    }
    return { x: xPosition, y: yPosition };
}

Utils.dynamicStatus = function(status,elemId) {
    if (document.getElementById(elemId) == undefined) {
        return;
    }
    document.getElementById(elemId).innerHTML = "<table><tr><td>"+status+"</td><td>...</td></tr></table>";
}


Utils.highlightLight = function(elemId) {
    if (Utils.this.isMobileView()) {  // mobile view on desktop
         document.getElementById(elemId).onmouseover = function(e) {this.style.backgroundColor = "#eeeeee";};
         document.getElementById(elemId).onmousemove = function(e) {this.style.backgroundColor = "#eeeeee"; return true;};
         document.getElementById(elemId).onmouseout = function(e)  {this.style.backgroundColor = "transparent";};
    }
    else if (this.isMobile) {
        document.getElementById(elemId).ontouchend = function(e)  {this.style.backgroundColor = "transparent";};
        document.getElementById(elemId).ontouchstart = function(e) {this.style.backgroundColor = "#eeeeee";};
        document.getElementById(elemId).ontouchmove = function(e) {this.style.backgroundColor = "transparent"; return true;};
    }
    else {
        document.getElementById(elemId).onmouseover = function(e) {this.style.backgroundColor = "#eeeeee";};
        document.getElementById(elemId).onmousemove = function(e) {this.style.backgroundColor = "#eeeeee"; return true;};
        document.getElementById(elemId).onmouseout = function(e)  {this.style.backgroundColor = "transparent";};
    }
}
Utils.highlight = function(elemId) {
    if (Utils.this.isMobileView()) {  // mobile view on desktop   highlight color was 111111
        document.getElementById(elemId).onmouseover = function(e) {this.style.backgroundColor = "#222222";};
        document.getElementById(elemId).onmousemove = function(e) {this.style.backgroundColor = "#222222"; return true;};
        document.getElementById(elemId).onmouseout = function(e)  {this.style.backgroundColor = "transparent";};
    }
    else if (this.isMobile) {
        document.getElementById(elemId).ontouchend = function(e)  {this.style.backgroundColor = "transparent";};
        document.getElementById(elemId).ontouchstart = function(e) {this.style.backgroundColor = "#222222";};
        document.getElementById(elemId).ontouchmove = function(e) {this.style.backgroundColor = "transparent"; return true;};
    }
    else {
        document.getElementById(elemId).onmouseover = function(e) {this.style.backgroundColor = "#222222";};
        document.getElementById(elemId).onmousemove = function(e) {this.style.backgroundColor = "#222222"; return true;};
        document.getElementById(elemId).onmouseout = function(e)  {this.style.backgroundColor = "transparent";};
    }
}
Utils.highlightMobileButton = function(elemId) {
    if (Utils.this.isMobileView()) {  // mobile view on desktop   highlight color was 111111
        document.getElementById(elemId).onmouseover = function(e) {this.style.backgroundImage = "url('images/mobileButtonBaseHighlight.png')";};
        document.getElementById(elemId).onmousemove = function(e) {this.style.backgroundImage = "url('images/mobileButtonBaseHighlight.png')"; return true;};
        document.getElementById(elemId).onmouseout = function(e)  {this.style.backgroundImage = "url('images/mobileButtonBase.png')";};
    }
    else if (this.isMobile) {
        document.getElementById(elemId).ontouchend = function(e)  {this.style.backgroundImage = "url('images/mobileButtonBase.png')";};
        document.getElementById(elemId).ontouchstart = function(e) {this.style.backgroundImage = "url('images/mobileButtonBaseHighlight.png')";};
        document.getElementById(elemId).ontouchmove = function(e) {this.style.backgroundImage = "url('images/mobileButtonBase.png')"; return true;};
    }
    else {
        document.getElementById(elemId).onmouseover = function(e) {this.style.backgroundImage = "url('images/mobileButtonBaseHighlight.png')";};
        document.getElementById(elemId).onmousemove = function(e) {this.style.backgroundImage = "url('images/mobileButtonBaseHighlight.png')"; return true;};
        document.getElementById(elemId).onmouseout = function(e)  {this.style.backgroundImage = "url('images/mobileButtonBase.png')";};
    }
}


Utils.highlightHTML = function() {
    return "onmouseover='this.style.backgroundColor = \"#EEEEEE\"'; onmousemove='this.style.backgroundColor = \"#EEEEEE\"; return true;'; onmouseout='this.style.backgroundColor = \"transparent\"'";
}
// make uniform mouse, touch, over, out and clickable HTML where element is highlighted and made darker on click just for a couple seconds in case click effect is not realized, click highlight disappears automatically
Utils.clickableHTML = function(objectId,methodName,arg1,elemId) {
    var t = "onmouseover='this.style.backgroundColor = \"#EEEEEE\"'; onmousemove='this.style.backgroundColor = \"#EEEEEE\"; return true;'; onmouseout='this.style.backgroundColor = \"transparent\"'; onclick='Stateable.callMethod("+objectId+",\"" + methodName +"\",\""+arg1+"\")' ";
    return t;
}
Utils.clickableHTML1 = function(objectId,methodName,arg1,elemId) {
    var t = "onmouseover='this.style.backgroundColor = \"#EEEEEE\"'; onmousemove='this.style.backgroundColor = \"#EEEEEE\"; return true;'; onmouseout='this.style.backgroundColor = \"transparent\"'; onclick='Stateable.callMethod("+objectId+",\"" + methodName +"\",\""+arg1+"\",event)' ";
    return t;
}
Utils.clickableHTML2 = function(objectId,methodName,arg1,arg2,elemId) {
    var t = "onmouseover='this.style.backgroundColor = \"#EEEEEE\"'; onmousemove='this.style.backgroundColor = \"#EEEEEE\"; return true;'; onmouseout='this.style.backgroundColor = \"transparent\"'; onclick='Stateable.callMethod("+objectId+",\"" + methodName +"\",\""+arg1+"\",\""+arg2+"\")' ";
    return t;
}

Utils.onChangeHTML = function(objectId,methodName,elemId) {
    var t = "onchange='Stateable.callMethod("+objectId+",\"" + methodName +"\",this.value); return true;' ";
    return t;
}

Utils.zoomPhoto = function(src) {
    src = makeUrlFromPath(src);
    var d=  new Dialog();
    d.showMessage("Photo Viewer","<div style='width: 390px; font-size : 20px;margin : 5px;'><img style='min-width : 150px; min-height : 150px; max-width : 370px; max-height : 500px;' src='"+src+"' /></div>","done");
}

Utils.takePhoto = function(callback) {
     if (Utils.isApp()) {
         var cameraOptions1 =  { quality : 75, destinationType : Camera.DestinationType.FILE_URI, sourceType : Camera.PictureSourceType.CAMERA,
             allowEdit : true, encodingType: Camera.EncodingType.JPEG, targetWidth: 300, targetHeight: 300, popoverOptions: CameraPopoverOptions, saveToPhotoAlbum: false };
         navigator.camera.getPicture(callback, callback, cameraOptions1);
     }
     else {
        var cam = CameraManager.getCam(0,callback);
        cam.show("Take a photo","Video Feed (may not show)");

     }
}

//8-bit to 6-bit ensures each character is textually transportable via a non=-graphic asc value including only letters and numbers in total 64 possiblities, each 3 8-bit chars convert to 4 6-bit chars.
// no longer needed - use below with resizing
Utils.arrBufferToBase64Str = function(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[ i ]);
    }
    return window.btoa(binary);
}

Utils.scaleRatio = function(maxPixels, curW, curH){
    var curPixels = curW * curH;

    var scale = maxPixels/curPixels;
    var ratio = curH/curW;
    var h = Math.round(Math.sqrt(maxPixels*ratio));
    var w = Math.round(Math.sqrt(maxPixels/ratio));
    // nh * nw = maxPixels
    // nh/nw = ratio = curH/curW
    // ratio * nw2 = maxPixels
    // nh2/ratio = maxPixels   nh =  sqrt|maxPixels*ratio
    // cw * ch = curPixels     nw =  sqrt|maxPixels/ratio
    //
    return {width: w, height: h};
    // var ratio = curH/curW;
    //if ( curW >= maxW && ratio <= 1 ){
    //    curW = maxW;
    //    curH = maxW * ratio;
    //}
    //else if(curH >= maxH) {
    //    curH = maxH;
    //    curW = maxH/ratio;
    //}
    //return {width: curW, height: curH};
}

//this function is instant, intended to be the onLoad of an image sourced with a local dataUrl
// dataUrl is used for type sensing only
Utils.resizeLoadedImage = function(img,dataUrl,maxPixels,callback,d) {
    if (maxPixels == null) {
        maxPixels = 110000;  //about 50k for jpg
    }
    if (this._isMobile== 2 || dataUrl.indexOf("data:image/png;") == 0) { // Android only handles png in canvas toDataUrl for some reason, and png at 180 will be a 60k image.
         maxPixels = Math.floor(maxPixels*.25);
    }
    else if (dataUrl.indexOf("data:image/gif;") == 0) { // Android only handles png in canvas toDataUrl for some reason, and png at 180 will be a 60k image.
         maxPixels = Math.floor(maxPixels*.5);
    }
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var dims = Utils.scaleRatio(maxPixels,img.width,img.height);
    canvas.width  = dims.width;
    canvas.height = dims.height;
    // context.drawImage(img,startx,starty,widthOfFinalClipImage,HeightOfFinalClipImage,xStartPosOnCanvas,yStartPosOnCanvas,widthStretchImage,heightStretchImage);
    // stretch/shrink dims  default to whatever clip wtdth/height are.
    // so if clip height is equal to shrink/stretch height - then clipHeight alone will also shrink/stretch - ie there will be no clipping.
    ctx.drawImage(img,0,0,img.width,img.height,0,0,dims.width,dims.height);
    // can NOT change canvas size after drawing on ctx -  will delete theimage
    // preserve fileType of original file dataUrl is derived from
    if (this._isMobile!=2 && dataUrl.indexOf("data:image/jpg;") == 0 || dataUrl.indexOf("data:image/jpeg;") == 0) {
        dataUrl = canvas.toDataURL('image/jpeg', 70);
    }
    else if (this._isMobile!=2 && dataUrl.indexOf("data:image/gif;") == 0) {
        dataUrl = canvas.toDataURL('image/gif')
    }
    else if (dataUrl.indexOf("data:image/png;") == 0) {
        dataUrl = canvas.toDataURL('image/png')
    }
    else {
        dataUrl = canvas.toDataURL();  // android only supports png option
    }
    if (d != null) {
        d.erase();
    }
    callback(dataUrl);
}

Utils.resizeDataUrl = function(dataUrl,callback,maxPixels) {
    if (maxPixels == null) {
        maxPixels = 120000;  //for jpg only (png will be reduced to 25% of passed number)
    }
    var img = document.createElement('img');
    var d = new Dialog();
    d.showMessage("Resizing Image","SIZING Please wait ...","done");
    img.onload = function(event) {Utils.resizeLoadedImage(this,dataUrl,maxPixels,callback,d);};   // TO DO  add an img.onError dialog
    img.src = dataUrl;
}



// reads as arraybuffer  @file is jsut private path to the file returned as an array element from browser/user select files
Utils.getFileData = function(file,callback,callbackError,alertProgress,asArrayBuffer) {
     var reader = new FileReader();
     callbackError == null ? callback : callbackError;
     if (alertProgress == null || !alertProgress) {
         reader.onerror = callbackError;
         reader.onload = callback;
     }
     else {
        var d = new Dialog();
        d.showMessage("Reading File","READING Please wait ...",".");
        reader.onerror = function(event) {d.erase(); callbackError(event);};
        reader.onload  = function(event) {d.erase(); callback(event);};
     }
     if (asArrayBuffer != null && asArrayBuffer) {
         reader.readAsArrayBuffer(file);
     }
     else {
         reader.readAsDataURL(file);
     }
}

// @return files object whereby a URL.createObjectURL can be made
Utils.getLocalFiles = function(callback,type) {
    if (typeof callback != "function") {
        return;
    }
    var d = new Dialog();
    var html = '<div style="width : 390px;height : 400px;font-size : 18px;"><input id="inputFileName" type="file" /></div>';
    d.setConfirm(function() {d.setErase(false); var files = document.getElementById("inputFileName").files; d.erase(); callback(files); return false;});
    d.setConfirm1(function() {d.setErase(false); var files = document.getElementById("inputFileName").files; d.erase(); callback(files); return false;});
    d.showMessage("Select Image",html,"done","ok");
}

Utils.makeButton = function(c,text,img,bold,marginTop,marginEnds,marginBottom,textTop,fontSize,singleColumn,id) {
      marginTop = (marginTop != null ? " margin-top : "+marginTop+"px;" : "");
      marginBottom = (marginBottom != null ? " margin-bottom : "+marginBottom+"px;" : " margin-bottom : 10px;");
      fontSize = (fontSize == undefined ? (Utils.this.isMobile() ? "14px" : "12px") : fontSize);
      var endBold = (bold != null && bold) ? "</b>" : "";
      bold = (bold != null && bold) ? "<b>" : "";
      var ids = id;
      if (id == null || typeof id == "string") {
          ids = new Array(); ids[0] = id;
      }

      // inline elements keeps width/height to child contents and margin auto centers width but keeps top margin at 0 by default, block element sets width to parent.
       var preFixed = " style='font-size : "+fontSize+";  display : inline-block; text-align : center; cursor : pointer; border-radius : 5px; border : solid #336699 1px; padding : 10px; margin : auto;"+ marginBottom + marginTop +"' onclick='";
       var pre1Fixed = " style='font-size : "+fontSize+";  display : inline-block; text-align : center; cursor : pointer; border-radius : 5px; border : solid #336699 1px; padding : 10px; margin : 22px;"+ marginBottom + marginTop +"' onclick='";
       var backgroundDiv = ""; var labelDiv = "";  var labelTopDiv = "";
       if (typeof text == "string") {
            return "<div style='margin : 22px; margin-top : 4px; margin-bottom : 4px; overflow : hidden; text-align : center;'>" + pre+c+"'>"+text+"</div></div>";
       }
       var s = "<table style='font-size :16px; margin : auto; text-align : center;'><tr>";
       var m = "";
       var pre = "";
       var pre1 = "";
       var height = (labelTopDiv == null ? "55px" : "70px");
       for (var key in text) {
           if (key == 3) {
                s += "</tr><tr>";
           }
           id = (!(key in ids) || ids[key] == null ? "" : (" id='"+ids[key]+"' "));
           pre  = "<div "+id+ preFixed;
           pre1 = "<div "+id+ pre1Fixed;
           if (!Utils.isEmpty(img) && img[key] != null) {
               marginEnds = (marginEnds == null ? "auto;" : marginEnds + "px;");
               m = (key == 0 && Utils.count(text) == 1 ? ("margin-left : "+marginEnds+" margin-right : "+marginEnds)  : ((key % 3) == 0  ? ("margin-left : "+marginEnds) : ( ((key+1) % 3) == 0 || key == Utils.count(text)-1 ? ("margin-right : "+marginEnds) : "")));
               pre1 = "<div style='"  +  "cursor : pointer; text-align : center; min-width : 55px; height : " + height + " cursor : pointer; border-radius : 5px; border : solid #336699 1px; padding : 9px; margin : 20px;"+m+marginBottom+marginTop+"' onclick='";
               backgroundDiv = "<div style='text-align : center;'><img style='"  +  "min-width : 30px; max-width : 60px; height : 40px;' src='"+img[key]+"' /></div>";
               labelDiv = "<div style='text-align : center;'>"+bold+text[key]+endBold+"</div>";
               if (textTop != null && textTop[key] != null) {
                   labelTopDiv = "<div style='text-align : center;'>"+bold+textTop[key]+endBold+"</div>";
               }
               c[key]= "" + c[key];   // NO LONGER erase the locator - leave it in background as HOME screen "setDialog(emptyHTML,false,false,6);" + c[key];
               s += "<td>" + pre1 +c[key]+"'>"+labelTopDiv+backgroundDiv+labelDiv+"</div></td>";
           }
           else {
               s += "<td>" + pre+c[key]+"'>"+bold+text[key]+endBold+"</div></td>";
           }
           if (singleColumn != null && singleColumn) {
                s += "</tr><tr>";
           }
       }
       if (s.lastIndexOf("</tr><tr>") == s.length - 8) {
           s = s.substr(0,(s.length - 8));
       }
       return s + "</tr></table>";
  }


// array key order 0-n,  val=object, where val[0] = label val[1] = id
// @clickMethod is function to call when select option is selected MUST accept at least one argument - the id of the clicked select
Utils.showCustomSelect = function(selArray,clickMethod,eraseOnClick,objectId,isSettings) { // objectIf is required ONLY if clickMethod is a string
         if (objectId == null) {
             objectId = 0;
         }
         var w = "width : 440px;";
         var roller = BASE_URL_IMAGES+"roller6.png";
         var s = " <div id='customSelectOuter' style='background-size: 100% 500px; background-image : url(\""+roller+"\"); position :relative; top:0px; left:0px; height : 500px; width : 100%; min-width : 300px; margin : auto; overflow-y : hidden;'>";  // center VERTICALLY by using table-cell but table-cell LOSES width 100% of block elements FUCK THIS!!!!  you need width 100% to horiz. center next div
         s += "<div style='position : absolute; top : 60px; left : 0px; text-align : center; width : 100%'>";
         s += "  <div style='display : inline-block; margin : auto;'>";
         s +=       "<img src='" + ARROW_UP_URL + "' alt='/\' height='13px' />";
         s += "  </div>";
         s += "</div>";
         s += "<div style='position : absolute; bottom : 60px; left : 0px; text-align : center; width : 100%'>";
         s += "  <div style='display : inline-block; margin : auto;'>";
         s +=     "<img src='" + ARROW_DOWN_URL + "' alt='\/' height='13px' />";
         s += "  </div>"
         s += "</div>";
         //s += "<div style='position : absolute; top : 80px; right : 140px;'>";
         //s +=     "<img src='" + ARROW_UP_URL + "' alt='/\' height='13px' />";
         //s += "</div>";
         //s += "<div style= 'position : absolute; bottom : 80px; right : 140px;'>";
         //s +=     "<img src='" + ARROW_DOWN_URL + "' alt='\/' height='13px' />";
         //s += "</div>";
        // s +=   "      <div style='z-index : 3; position :absolute; top : 0px; left : 0px; margin : 0px;'>";       // this inner div will be set to table width and CENTERED HORIZONTALLY ONLY after js sets this width
        // s +=   "            <img style='height : 450px; width : 100%' src='images/roller6.png' />";
        // s +=   "      </div>";
         s +=   "      <div id='uSelectInner' style='z-index : 2; position :relative; top:0px; left:0px; height : 285px; margin : auto; margin-top: 105px; overflow-y : auto; overflow-x : hidden;'>"; // margin auto does NOT center vertically - there are 5 different CSS paradigm errors in this alone FUCK HUMANS
         s +=   "          <table id='uSelectTable' style=' text-align : left; margin : 8px; margin-right : 15px;  font-size : 18px; font-weight : bold; white-space : nowrap;'>";
         var cur;
         var evts;
         var erase = (eraseOnClick != null && eraseOnClick ? "setDialog(emptyHTML,null,false,3);" : "");
         for (var i in selArray) {
            cur = selArray[i];                                                                       // function(objectId,methodName,arg1,arg2,elemId) {
            evts = Utils.highlightHTML();
            if (clickMethod != null && typeof clickMethod == "string") {
               evts += " onclick='"+erase+" Stateable.callMethod("+objectId+",\"" + clickMethod +"\",\""+cur[1]+"\")' ";
            }
            s += "<tr><td "+evts+" style='padding : 13px; cursor : pointer;' id='"+cur[1]+"'>"+cur[0]+"</td></tr>";
         }
         var d = new Dialog(3);
         if (isSettings != null && isSettings) {
             d.setIsSettings();
         }
         s += "</table></div></div>";
         s = "<div id='customSelectWrapper' style='display : table-cell; vertical-align : middle;'>"+s+"</div>";
         d.showMessage("Select",s,"done");
         // ADD function to each seleect now that it is displayed
         var elem;
         if (clickMethod != null && typeof clickMethod == "function") {
             for (var i in selArray) {
                cur = selArray[i];
                elem = document.getElementById(cur[1]);   // warning cur will not be evaluated until onClick is called so ALL functions will get the LAST value of cur[1]  so just use this.id instead!
                if (elem != undefined) {
                    elem.onclick = function(e) {clickMethod(this.id); setDialog(emptyHTML,null,false,3);};
                }
             }
         }
         // FUCKING MANKIND! margin centering ignored unless width is set and will collapse to parent margin so centering wont happen on child div unless style overflow auto in parent div
         document.getElementById("uSelectInner").style.width =  (document.getElementById("uSelectTable").offsetWidth + 15) + "px";
         document.getElementById("customSelectOuter").style.width = (document.getElementById("uSelectTable").offsetWidth + 70) + "px";
         document.getElementById("customSelectWrapper").style.height = (document.getElementById("selDialog3CoreWrapper").offsetHeight - 17) + "px";
         document.getElementById("uSelectInner").scrollTop = 10;
    }



Utils.makeSelectHTML = function(cssClass,id,min,max,selected,format,inc) {
     var t = "<select id='"+id+"'>";
     for (var i = min; i <= max; i++) {
          t += (i==selected ? "<option selected='selected'>" : "<option>") +i+"</option>";
     }
     t += "</select>";
     return t;
}

// warning! yMax or xMax must be greater than zero
// ar MUST be an array indexed numerically starting at zero with value of html text for each item
Utils.makeTableHTML = function(arr,xMax,yMax) {
    var html = "<table style='background-color : #ffffff'>";
    var i;
    if (yMax == 0 || !yMax) {
       for (i in arr) {
           if ( (i % xMax) == 0) {
               html += "<tr>";
           }
           html += "<td>"+arr[i]+"</td>";
           if ( ((i+1) % xMax) == 0) {
               html += "</tr>";
           }
       }
       if ( ((i+1) % xMax) != 0) {
          html += "<td colspan='" + (xMax - ((i+1) % xMax))+"'></td></tr>";
       }
       return html+"</table>";
    }
    if (xMax == 0 || !xMax) { // maxY means we need to divide right now to find out how many xs there are
        xMax = Math.ceil(Utils.count(arr)/yMax);
        // alert(xMax+" "+Utils.count(arr)+" "+yMax);
    }
    for (i in arr) {
        if ( (i % xMax) == 0) {
            html += "<tr>";
        }
        html += "<td>"+arr[i]+"</td>";
        if ( ((i+1) % xMax) == 0) {
            html += "</tr>";
        }
    }
    if ( ((i+1) % xMax) != 0) {
       html += "<td colspan='" + (xMax - ((i+1) % xMax))+"'></td></tr>";
    }
    return html+"</table>";
}

// @return false (and ayncronously delete last character pressed) on bad price, return price on good formatted price
Utils.priceChanged = function(elem,evt,onEnterCallback,allowNegative) {
             var characterCode;
             if (evt && ("which" in evt)) {           //if which property of event object is supported (NN4)
                 characterCode = evt.which;  //character code is contained in NN4s which property;
             }
             else {
                 characterCode = evt.keyCode; //character code is contained in IEs keyCode property
             }
             // if F5 - remove unOnload event so page can refresh without setting status to closed - and user is DEFINITELY still in location so user goes right back in
             if (characterCode == 116) {
                  document.body.onunload = "";
             }
             // if you BLUR before returning from keyPress event, the last character pressed (ie return) will NOT be included!!! fucking BULLSHIT JAVASCRIPT!!!!
             // Amazing!!! even though evt.keyCode shows this as 13 - it is actually 10 (linefeed) or it is BOTH two charactes an LF AND a CR also known as \n\r FUCK THIS FUCKING STUPID WORLD!!!!
             // also even returning false STILL puts the fucking character into the elem.value - so you HAVE to check it in a timeout in order to REMOVE it!
             if (characterCode == 13 || characterCode == 10) {
                 // puts the char 13 in AFTER the keyPress returns so take it out again IN the timeout and call productSelected
                 setTimeout(function() {if (elem.value.length > 0 && elem.value.charCodeAt(elem.value.length-1) == 13 || elem.value.charCodeAt(elem.value.length-1) == 10) {elem.value = elem.value.substr(0,elem.value.length-1);}onEnterCallback();},300);
                 return false;
             }
             if ( (characterCode < 48 || characterCode > 57) && characterCode != 46 && (allowNegative == undefined || !allowNegative || (allowNegative && characterCode != 45))) {  //46 is . 45 is -
                 setTimeout(function() {elem.value = (elem.value.length > 0 ? elem.value.substr(0,elem.value.length-1) : "");}, 100);
                 return false;
             }
             if (characterCode == 46 && elem.value.indexOf(".") > -1) {
                 setTimeout(function() {elem.value = elem.value.substr(0,elem.value.length-1);}, 100);
                 return false;
             }
             var s = elem.value + String.fromCharCode(characterCode); // ensures value is string before calling parseFloat
             var n = parseFloat(s); // parseFloat does NOT work, it adds random digit after a decimal place
             if ((isNaN(n) && (allowNegative == undefined || !allowNegative || (allowNegative && s != "-"))) || n > 10000) {
                 setTimeout(function() {elem.value = elem.value.substr(0,elem.value.length-1);}, 100);
                 return false;
             }
             var a = s.toString().split(".");
             if (a.length > 1 && a[1].length > 2) {
                 // alert("*"+n+"*"+a[1]+"*");
                 setTimeout(function() {elem.value = elem.value.substr(0,elem.value.length-1);}, 100);
                 return false;
             }
             // alert(products["-1"]["price"]+" "+Utils.toString(products));
             return n;
     }

Utils.verifyInput = function(existing,elem) {
      if (elem == undefined) {
          return false;
      }
      if (elem.value == "") {
          return false;
      }
      return (elem.value != existing);
}

Utils.verifyChange = function(existing,elem) {
      if (elem == undefined) {
          return false;
      }
      return (elem.value != existing);
}

Utils.validateFirstName = function(val,setGlobal) {
      var messageDialog = new Dialog();
      val = val.replace(/ /gi,"");
      if (val.length > 0) {
          if (val != "Guest" && val != "Entervalidfirstname") {
              if (val.length < 3) {
                  messageDialog.showMessage("Really?","First Name is incorrect.  Please try again.","ok");
                  return false;
              }
          }
          else {
              messageDialog.showMessage("Really?","First Name is incorrect.  Please type in your first name correctly.","ok");
              return false;
          }
      }
      else {
         messageDialog.showMessage("Really?","Please include your first name.","ok");
         return false;
      }
      if (setGlobal != undefined && setGlobal) {
          firstName = val;
      }
      return true;
}

Utils.validateUserName = function(val,setGlobal) {
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

Utils.validatePassword = function(val,setGlobal) {
      var messageDialog = new Dialog();
      val = val.replace(/ /gi,"");
      if (val.length > 0) {
          if (val != "Guest" && val != "Entervalidfirstname") {
              if (val.length < 3) {
                  messageDialog.showMessage("Really?","Password needs more letters. Please try again.","ok");
                  return false;
              }
          }
          else {
              messageDialog.showMessage("Really?","Password is empty. Please try again.","ok");
              return false;
          }
      }
      else {
         messageDialog.showMessage("Really?","Password is empty. Please try again.","ok");
         return false;
      }
      if (setGlobal != undefined && setGlobal) {
          // password = val;
      }
      return true;
}

  Utils.clone = function(oldObject) {
      if (typeof oldObject == "object")  {
          var tempClone = {};
          for (prop in oldObject)  {
              // for array use private method getCloneOfArray
              if (Utils.isArray(oldObject[prop])) {
                  tempClone[prop] = Utils.cloneArray(oldObject[prop]);
              }
              else if (typeof oldObject[prop] == "object") {
                  tempClone[prop] = Utils.clone(oldObject[prop]);
              }
              else {
                  tempClone[prop] = oldObject[prop];
              }
          }
          return tempClone;
      }
      return oldObject;
  }

  Utils.GET = function(key) {
      s = window.location.search;
      //var re = new RegExp('&'+q+'(?:=([^&]*))?(?=&|$)','i');
      //return (s=s.replace(/^?/,'&').match(re)) ? (typeof s[1] == 'undefined' ? '' : decodeURIComponent(s[1])) : undefined;
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
          var pair = vars[i].split("=");
          if (pair[0] == key) {
              return pair[1];
          }
      }
      return null;
  }



  //private method (to copy array of objects) - clone uses this internally
  Utils.cloneArray = function(oldArray) {
      var tempClone = new Array();
      for (var arrIndex = 0; arrIndex <= oldArray.length; arrIndex++) {
          tempClone.push(Utils.clone(oldArray[arrIndex]));
      }
      return tempClone;
  }


Utils.isArray = function(obj) {
      if (obj == undefined || ((typeof obj) != "object") && ((typeof obj) != "array") ) {
          return false;
      }
      if (obj.constructor.toString().toLowerCase().indexOf("function array()") == -1) {
          return false;
      }
      else if ( !("join" in obj)) {
          return false;
      }
      else {
         // alert(obj.join()+" "+obj.length);
         return true;
      }
}

Utils.getAssocArrayLength = function(obj) {
   if (typeof obj != "object") {
        return 0;
   }
   var res = 0;
   for (key in obj) {
       res++;
   }
   return res;
}

Utils.objectToArray = function(obj,max) {
   if (typeof obj != "object") {
        return obj;
   }
   var arr = new Array();
   var c = 0;
   for (key in obj) {
       arr[c] = obj[key];
       c++;
       if (c == max) {
           break;
       }
   }
   return arr;
}

Utils.assocArrayToString = function(obj,youString) {
   if (typeof obj != "object") {
        return obj;
   }
   var str = "";
   var comma = "";
   for (key in obj) {
       if (youString != undefined && key == uid) {
           str += comma + "You";
       }
       else {
           str += comma + obj[key];
       }
       if (comma == "") {
           comma = ", ";
       }
   }
   return str;
}

Utils.focusWindow = function(win) {
      if (Utils.isEmpty(win) || typeof win != "object") {
          return;  // do nothing and go back to pub
      }
      if (!Utils.isEmpty(win.getWindow())) {
          win.getWindow().focus();
      }
      else {
          return; // do nothing and go back to pub
      }
}

Utils.setStatus = function(elemId,text,time) {
       if (document.getElementById(elemId) != undefined && document.getElementById(elemId) != "") {
           if (text == undefined || ((typeof text == 'object') && !("status" in text)) ) {
               document.getElementById(elemId).innerHTML = "";
               return true;
           }
           document.getElementById(elemId).innerHTML = ((typeof text == 'object') ? text["status"] : text);
           setTimeout(function() {Utils.setStatus(elemId);},time);
           return true;
       }
       else {
          return false;
       }
}

// becaseu IE deso not allow direct setting of inner HTML in elements in tables unless removed and repace in to the Dom
Utils.setInnerHTML = function(el, html) {
        //if (browser == "Explorer") {
        //  el.innerHTML = "";
        //  var t = document.createElement('div');
        //  t.innerHTML = html;
        //  el.appendChild(t);
        //}
        //else{
        //   el.innerHTML = html;
        //}
	if(browser == "Explorer") {
                var oldEl = (typeof el === "string" ? document.getElementById(el) : el);
                var newEl = document.createElement(oldEl.nodeName);

                // Preserve any properties we care about (id and class in this example)
                newEl.id = oldEl.id;
                newEl.className = oldEl.className;
                newEl.onclick = oldEl.onclick;

                //set the new HTML and insert back into the DOM
                newEl.innerHTML = html;
                if(oldEl.parentNode)
        	        oldEl.parentNode.replaceChild(newEl, oldEl);
                else
		        oldEl.innerHTML = html;

                //return a reference to the new element in case we need it
                return newEl;
	}
	else {
           el.innerHTML = html;
        }
};

//Utils.isEmpty = function(str) {
//      return str == undefined || ((typeof str == 'string' || !isNaN(str)) && (str == "" || str == false || str == 0 || (str+"").toLowerCase() == emptyHTML.toLowerCase() || str == " " || str.toLowerCase() == "null")); // str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == "";
//};

Utils.isEmpty2 = function(str) {
      return Utils.isEmpty(str) || (typeof str == 'string'  && (str == " " || str == "  " || str == "\n" || str == "\r" || str == "\n\r" || str == "\r\n")); // str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == "";
};

// TO DO: any object with 0 elements is also empty
Utils.isEmptyImage = function(str) {
      return str == undefined || ( (typeof str != "object" && (typeof str == 'string' || !isNaN(str)) ) && (str == "" || str == false || str == 0 || (str+"").toLowerCase() == emptyHTML.toLowerCase() || str == " " || (str.indexOf("noface")!=-1) || (str.indexOf("clear.png")!=-1) || (str.indexOf("clear.gif")!=-1) )); // str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == "";
};

Utils.isEmpty = function(str) {  // objects will cause error on isNaN()  fucking javascript never ceases to amaze me.
      return str == undefined || ( (typeof str != "object" && (typeof str == 'string' || !isNaN(str)) ) && (str == "" || str == false || str == 0 || (str+"").toLowerCase() == emptyHTML.toLowerCase() || str == " " || (typeof str == "string" && str.toLowerCase() == "null") )); // str.replace(/^\s\s*/, '').replace(/\s\s*$/, '') == "";
};

Utils.toString = function(obj,recursion) {
   if (recursion == null) {
      recursion = 0;
   }
   recursion++;
   if (obj == undefined || obj == null) {
      return "undefined";
   }
   if (typeof obj == "string" || typeof obj == "number") {
        return obj;
   }
   if (typeof obj != "object" && (typeof obj != "HTMLObjectElement") && (typeof obj != "function")) {
        return "TYPE: "+(typeof obj);
   }
   var str = "";
   var comma = "";
   for (key in obj) {
       if (obj[key] == undefined) {
           str += "KEY == " + key + comma + "VAL == undefined";
       }
       else {
           str += "KEY == " + key + comma + "VAL == " +  (recursion > 3 ? "recursion too deep": (obj == obj[key] ? "POINTS TO PARENT OBJECT!" : Utils.toString(obj[key],recursion)))  + "\n";   // Utils.innerString(obj,key)  + "\n";
       }
       if (comma == "") {
           comma = ", ";
       }
   }
   return "\n\n"+(recursion>1?recursion:"")+" TYPE: "+(typeof obj) + " " + str;
}

Utils.toObjectString = function(obj) {
  if (obj == undefined || obj == null) {
      return "{ }";
   }
   if (typeof obj == "string" || typeof obj == "number") {
        return obj;
   }
   if (typeof obj != "object" && (typeof obj != "HTMLObjectElement") && (typeof obj != "function")) {
        return "{ }";
   }
   var str = "{";
   var comma = "";
   for (key in obj) {
       str += comma;
       str += '"' + key + '"';
       if (obj[key] == undefined) {
           str += ":" + "null";
       }
       else if (typeof obj[key] == "string" ) {
           str += " : " +  '"' + obj[key] + '"';   // Utils.innerString(obj,key)  + "\n";
       }
       else if (typeof obj[key] == "number" ) {
           str += " : " + obj[key];   // Utils.innerString(obj,key)  + "\n";
       }
       else {
           str += " : " + Utils.toObjectString(obj[key]);   // Utils.innerString(obj,key)  + "\n";
       }
       if (comma == "") {
           comma = ",";
       }
   }
   return str + "}";
}

Utils.innerString = function(obj,key) {
        try {
          return obj[key].toString()
        }
        catch (e) {
          return e.toString()
        }
}


Utils.count = function(obj) {
    var c = 0;
    if (obj == null) {
        return 0;
    }
    if (Object.prototype.toString.call(obj) === '[object Array]' ) {
        return obj.length;
    }
    if (!(typeof obj == "object")) {
        return 0;
    }
    if ("length" in obj && (obj instanceof Array) ) {
        return obj.length;
    }
    for (k in obj) {
        if (obj.hasOwnProperty(k) && (typeof k != 'function')) {
            c++;
        }
    }
    return c;
}

Utils.getFirst = function(obj) {
    var c = 0;
    for (k in obj) {
        if (obj.hasOwnProperty(k) && (typeof k != 'function')) {
            return obj[k];
        }
    }
    return false;
}

Utils.getFirstKey = function(obj) {
    var c = 0;
    for (k in obj) {
        if (obj.hasOwnProperty(k) && (typeof k != 'function')) {
            return k;
        }
    }
    return false;
}

Utils.stringCompare = function(a,b) {
    if (a == undefined) {
        if (b == undefined) {
            return 0;
        }
        return 1;
    }
    else if (b == undefined) {
        return -1;
    }
    var asc1; var asc2; var state=0;
    for (var i = 0; i < a.length; i++) {
           if (i >= b.length) {
               return 1;
           }
           asc1 = a.charCodeAt(i);
           asc2 = b.charCodeAt(i);
           if (asc1 == asc2) {
               continue;
           }
           return (asc1 < asc2 ? -1 : 1);
    }
    if (a.length == b.length) {
        return 0;
    }
    return -1;
}

// @param label1 is left label, @param label2 is rightLabel, @param label is name of switch
// @param eventFunctionName after toggling switch, this is the name of the event function to be called after this newly created switch with id @param elemId) is touched or clicked.
// @param objectId of eventFunction so that function can be referenced in onClick - cant map function to onclick directly in javascript becasue html is not yet displayed!
// @param initialPos 0 = left 1 = right
Utils.makeToggleHTML = function(label1,label2,label,elemId,eventFunctionName,objectId,initialPos) {
       // apparently padding in any class td definition is INHERITED so make SURE the padding from any possible parent table calling this function is SQUELCHED now by setting padding in this table to
       // what we want it to be for EACH td element!
       // escape any single quotes in event function  so it can be passed in the onClick as function
       // eventFunction = eventFunction.replace("'","\\'");
       // put eventFunction in a timeout becasue android has bug where onclick will not show graphic results until it is completed - that means the toggle switch will show delayed until sort renders. making ef async. fixes that.
       var s = "<table style='display :inline-block; margin : auto;'><tr><td colspan='3' style='padding : 3px;'><div style='border : ridge #cccccc 1px; text-align : center; cursor : pointer; position : relative; bottom : 0px; left : 0px; font-size : 11px; margin : 0px; background:#dddddd; padding:4px 20px;border-radius:8px;' onclick='var pos = Utils.toggleSwitch(\""+elemId+"\"); setTimeout(function() {Stateable.callMethod("+objectId+",\""+eventFunctionName+"\",pos)},100)'  >"+label;
       s += "<div id='"+elemId+"Image' style='position : absolute; top : 0px; "+(initialPos===0 ? "left" : "right")+" : 0px; background:#eeeeee; width : 15px; height : 100%; border-radius:8px;'></div>";
       s += "</div></td></tr><tr><td style='padding : 3px; text-align : left;vertical-align : top;'>"+label1+"</td><td style='width : 9px'></td><td style='padding : 3px; text-align : right'>"+label2+"</td></table>";
       return s;
}

Utils.toggleSwitch = function(elemId,pos) {
     var e = document.getElementById(elemId+"Image");
     if (e == undefined) {
         return -1;
     }
     if ((pos == null || pos ==1) && ((pos != null && pos ==1) || !("right" in e.style) || Utils.isEmpty(e.style.right))) {  //switch has never been switched yet or has been switched to left, so right will be empty string
       e.style.left=null;
       e.style.right="0px"
       return 1;
     }
     else {
       e.style.right=null;
       e.style.left="0px";
       return 0;
     }
     return -1;
}

Utils.insertAsFirstElem = function(pa,html,id,ignoreOnExists) {
      if (document.getElementById(id) != undefined) {
          if (ignoreOnExists != undefined && ignoreOnExists) {
             return false;
          }
          pa.removeChild(document.getElementById(id));
      }
      var newElem = document.createElement('div');
      newElem.innerHTML = html;
      newElem = newElem.firstChild;
      if (pa != undefined) {
          if (pa.firstChild) {
              pa.insertBefore(newElem,pa.firstChild);
          }
          else {
              pa.appendChild(newElem);
          }
          return true;
      }
      return false;
}

Utils.messagerSendID = 0;

Utils.messagerKeyPressCheck = function(sourceObjId,elem,evt,messagerLabel) {
         // if enter detected - perform the reply method
         if (elem.style.color != "#000000") {
              elem.style.color="#000000";
         }
         var characterCode;
         if (evt && ("which" in evt)) {           //if which property of event object is supported (NN4)
             characterCode = evt.which;  //character code is contained in NN4s which property;
         }
         else {
             characterCode = evt.keyCode; //character code is contained in IEs keyCode property
         }
         // if F5 - remove unOnload event so page can refresh without setting status to closed - and user is DEFINITELY still in location so user goes right back in
         if (characterCode == 116) {
            document.body.onunload = "";
         }
         if (characterCode == 13) {
             // remove the enter key (it is the last character - and unescaped chr(13) causes errors in ajax json send as well)
             // puts the char 13 in AFTER the keyPress returns so take it out again IN the timeout
             Utils.messagerSendID = setTimeout(function() {elem.value = elem.value.substr(0,elem.value.length-1);Utils.messagerSendMessage(sourceObjId,elem,messagerLabel)},100);
             return true;
         }
         if (elem.value == "Write something...") {
             elem.value = "";
             elem.style.color="#000000";
         }
         updateStatus("typing");
         return true;
};

Utils.messagerFocusOrBlurInput = function(elem) {
       if (!this._isMobile&& !isPad) {  // so as not to bring up the keyboard
           elem.focus();
       }
       else {
           if (!isNaN(this.isMobile) && this._isMobile> 0) {
             elem.blur(); // this will take the focus out of the input box and thus HIDE the soft keyboard.
             // window.plugins.SoftKeyBoard.hide(function () {alert("success")}, function () {alert("failed")});
         }
         else {
             elem.blur();
         }
       }
}

// elem is input field elem or its ID
Utils.messagerSendMessage = function(sourceObjId,elem,messagerLabel) {
     clearTimeout(Utils.messagerSendID);  // to avoid keybounce
     if (typeof elem == "string") {
        if (document.getElementById(elem) == undefined) {
            return;
        }
        elem = document.getElementById(elem);
     }
     // STOP double bounce on enter button!!! by allowing only one click per second
     if (!Ajax.isClear(elem)) {
         return;
     }
     var message = elem.value;
     // ERASE the CONTENTS of the input field
     elem.value = "";
     if (Utils.isEmpty2(message)) {
         Utils.messagerFocusOrBlurInput(elem);
         return;
     }
     Stateable.callMethod(sourceObjId,"sendMessage",message);
     // 1) prepopulate field with "write something..."
     Utils.messagerInputBlurred(elem,messagerLabel);
     // 2) INTENTIONALLY FOCUS or BLUR the inputfield depending on if mobile or not to hide soft keyboard is most important, but desktop has no soft keyboard, so staying in input field is desirable for addinga nother message.
     Utils.messagerFocusOrBlurInput(elem);
}




Utils.messagerInputClick = function(elem,sendLabel) {
    updateStatus("typing");
    if (elem.value ==  "Write something...") {
        elem.value = "";
        document.getElementById(sendLabel).innerHTML = "Type message. Press Enter to Send";
    }
    else {
        document.getElementById(sendLabel).innerHTML = "Press Enter to Send";
    }
    if (elem.style.color != "#000000") {
        elem.style.color="#000000";
    }
}


Utils.messagerInputBlurred = function(elem,sendLabel) {
    if (elem.value == "") {
        elem.value = "Write something...";
        elem.style.color="#999999";
        document.getElementById(sendLabel).innerHTML = "Type message. Press Enter to Send";
    }
    else if (elem.value != "Write something...") {
        document.getElementById(sendLabel).innerHTML = "Press Enter to Send";
    }
}

// elemId is the wrapper for the WHOLE messager where this generated messager HTML will be stored.  It is NOT the name of the input field which will be @pre plus "messagerInput"
Utils.addMessager = function(elemId,objectId,pre,buttonSrc,messagerLabel) {
    var elem = document.getElementById(elemId);
    var textArea = "<textarea id='"+pre+"MessagerInput' class='"+pre+"MessagerInput' onkeypress='Utils.messagerKeyPressCheck("+objectId+",this,event,\""+messagerLabel+"\")' onclick='Utils.messagerInputClick(this,\""+pre+"MessagerSendText\")' onblur='Utils.messagerInputBlurred(this,\""+pre+"MessagerSendText\")'>Write something...</textarea>";
    var str = "<div class='"+pre+"MessagerWrapper'><div>" + textArea + "</div>";
    str += "<div id='"+pre+"MessagerSendText' class='"+pre+"MessagerSendText'>Type message then Press Enter key or Send</div><div class='"+pre+"MessagerSendButton' onclick='Utils.messagerSendMessage("+objectId+",\""+pre+"MessagerInput\",\""+messagerLabel+"\")'><img id='"+pre+"MessagerSendButtonImg' src='"+(buttonSrc != undefined ? buttonSrc : SEND_BUTTON_URL)+"' height='"+(this._isMobile? "40px" : "20px")+"' /></div></div>";
    elem.innerHTML = str;
}




function Serializable(arr) {

                                  var that = this;
                                  this.name = "Serializable";

                                   // the databaseID - not necesary here only as a formality because new version of it gets written to the subclass anyway in populate
                                   // if the server object has it   but for OO perfection we show it here to remind us that we WANT it to be in this base class!
                                   // while ideal, not supporting this in all cases,  evey object has its own named table field for key id and may comprise several tables every server side write and read
                                   // would require a call to setDid() on the server.  so better not to depend on getDid(), instead let you sbuclass check for its own that.id to test if already saved
                                  this.did = 0;

                                   // this method will always be called here (the did var must be public though for serialization even though it will be written
                                   // to the subclass when seen on the server and deserialized  here.
                                   // MUST use "this" instead of "that" here - I dont know why it works right here "that" will fail and return only LOCAL snapshot version - i.e. 0
                                   // I think what is happeneing is "this" is really the subclass version, ie the version of this being passed is from the subclass only populated if
                                   // deseriliazeAndPopulateFrom() method was called with an object i.e. meaning we got the object from the server
                                  this.getDid = function() {
                                      return this.did;
                                  }

                                  //if (arr != undefined && (arr instanceof Array)) {
                                      // does not work here no matter how you try to hand off a subclassed this - it does not work!!!
                                      //this.populateFrom.call(that,arr); // <== must be called from the sub class.  Fuck OFF JAVA sCRIPT!!!
                                  //}

                                  // array or similar object with SAME attributes.
                                  // There is no protection here - ensure your attributes are the same
                                  // used ONLY with call to make sure "this" is from the subclass - hence we dont use "that" here.
                                  // 1)  Caller is some Stateable subclass constuctor like Publishable - this means it is in the middle of being deserialized and so its objectId is retained, but likely not important
                                  //     as if the server created the first instance of the object
                                  // 2) Caller is deseriliazeAndPopulateFrom() in which case the returning Stateable objectId must ALREADY be set to the ORIGINAL objectId
                                  //     if not, the first symptom is that local variables will not be preserved. as a precaution it will call this function with conserverObjectId set to true
                                  //      Example is in a pub.get  the objectId of the returning pub while at the server MUST be set to the calling get  before returning it.
                                  //      same holds for embedded Stateables so conserveObjectId should be set true when calling from deserializeAndPopulateFrom() so it can recurse the protection
                                  //      for those cases where a retrieve may be retrieving old or bogus objectIds from the database when we already have set up state for them in shells here where objectIds are created
                                  //      and possibly stored them too which wuld create real trouble if we did not protect them - ie we would lose local vars and unnecessarily be storing replicas of the objects.
                                  //      CANNOT do this for embedded - server must responsbily retain the objectId of the CALLER in ALL cases otherwise we have no knowledge of the orginal ids of embedded objects.
                                  this.populateFrom = function(obj,conserveObjectId) {
                                       conserveObjectId = ((conserveObjectId == undefined || !conserveObjectId) ? false : conserveObjectId);
                                      //cName = Serializable.getCName(this); // FAILS unless populateFrom() is called DIRECTLY from a subclass
                                      //this.name = cName;
                                      if ( (obj == undefined) || !(Utils.isArray(obj) || obj instanceof Object)) {
                                           return obj;
                                      }
                                      var temp = "FUCKED";
                                      //var cName2 = Serializable.getClassName(obj);
                                      // MUST accept an array as deserialize uses array in the eval to pass to the constructor above that calls here!
                                      if ((Utils.isArray(obj)) || (obj instanceof Object)) {  // reconstruct any serializable object given array of ALL object field properties
                                          for (var i in obj) {
                                             if (!(obj[i] instanceof Function) && (i in this) ) {  //
                                                 if ( (obj[i] instanceof Stateable)) {
                                                     temp = Stateable.getById(obj[i].getObjectId());
                                                     if (temp) {
                                                         this[i] = temp;
                                                         temp.populateFrom.call(temp,obj[i],conserveObjectId);
                                                     }
                                                     else {
                                                         if (!conserveObjectId || i != "objectId") {
                                                             this[i] = obj[i];
                                                         }
                                                     }
                                                 }
                                                 else {
                                                     if (!conserveObjectId || i != "objectId") {
                                                         this[i] = obj[i];
                                                     }
                                                 }
                                             }
                                          }
                                      }
                                      else {
                                         throw "Ser.populateFrom(): passed object type not an array or object:"+cName;
                                      }
                                  }

                                  this.getName = function() {
                                     if (("getClassName" in this)) {
                                         return this.getClassName();
                                     }
                                     else {
                                         return "Serializable";
                                     }
                                  }

                                  // to reconstruct a Stateable for example from within the same stateable, but changes from the server
                                  // may necessitate this reconstruction of self
                                  this.deserializeAndPopulateFrom = function(ser) {
                                      if (ser == null || !(typeof ser == "string" || (typeof ser == "object" && ("serializedObject" in ser))) ) {
                                          return false;
                                      }
                                      var obj;
                                      try {
                                          obj =  Serializable.deserialize(ser);
                                          obj = obj[0];
                                      }
                                      catch (e) {
                                          //alert("Ser.deserAndMorph():"+ e.toString() + "*" + ser + " TYPE:"+typeof obj);
                                          throw "deserializeAndPopulateFrom() error in Serializable.deserialize(ser):"+ e.toString() + "*" + ser + " TYPE:"+typeof obj;
                                      }
                                      try {
                                          // safety make sure we keep the objectId of THIS object - in the cases of some gets like pub.get - the server may not have retained the objectId as it should
                                          this.populateFrom(obj,true);
                                      }
                                      catch (e) {
                                          throw "deserializeAndPopulateFrom() error in populateFrom:"+ e.toString() + "*" + ser +" deserialized object toString():"+Utils.toString(obj);
                                      }
                                      //var cName = Serializable.getClassName(this);
                                      //var cName2 = Serializable.getClassName(obj);
                                      //if (cName != cName2) {
                                      //    throw "Ser.morph(): passed object type:"+cName2+" not same as this:"+cName;
                                      //}
                                      return true;
                                  }
                                  // 1) get ALL the properties of this object and all subclasses in order of bottom subClass upward.
                                  // 2) create a string as "~objectsubClassName~paramName1,param1~....~paramNameN,paramN~"
                                  // 3) escape double quotes for Ajax send
                                  this.serialize =  function(arr) {
                                                    //var x = "";
                                                    //for (var name1 in this._super) {
                                                    //    x = x + "*"+name1 + "**"+this._super[name1];
                                                    //}
                                                    var cName;
                                                    var props;
                                                    var val;
                                                    if (arr == undefined) {
                                                        cName = Serializable.getCName(this);
                                                        // that.name = cName;
                                                        props = this;
                                                    }
                                                    else {
                                                        if (Utils.isArray(arr)) {
                                                            cName = "Array";
                                                        }
                                                        else {
                                                            cName = "Object";
                                                        }
                                                        props = arr;
                                                    }
                                                    var str = "~"+cName;
                                                    for (var i in props) {
                                                         if (typeof props[i] != "function" && i != "_super") {
                                                             val = props[i];
                                                             if ((val === 0 || val === "0" || val === false)) {
                                                                 val = "0";
                                                             }
                                                             else if (val === true) {
                                                                 val = "1";
                                                             }
                                                             if (val instanceof Serializable) {
                                                                 val = val.serialize();  // recurse to embed propertiers that are themselves serializable objects
                                                             }
                                                             else if (Utils.isArray(val)) {
                                                                 // alert(val.join());
                                                                 val = that.serialize(val);  // recurse to embed propertiers that are themselves serializable objects
                                                             }
                                                             else if (val instanceof Object) {
                                                                 val = that.serialize(val);  // recurse to embed propertiers that are themselves serializable objects
                                                             }
                                                             str += "|" +  i + "," + val;
                                                         }
                                                    }
                                                    str += "~";
                                                    return str; // params;
                                  };



                                  this.serverErrorCheck = function(data) {
                                     // if there was an error on the server, the default version of this method is
                                     //  to show it nicely and not allow the subclass action to happen
                                     // if you want different action, overwrite this method
                                     if (that.defaultServerErrorChecker(data)) {
                                         // return true;
                                     }
                                     // any auto calling action where sessionId was not foind in table - session aware so setCookie with a new sessionId is NOT set
                                     if ( ("result" in data) && data.result == "silentAbort") {
                                         return true;
                                     }
                                     if ("invalidSession" in data) {
                                        var d = new Dialog();
                                        setTimeout(function() {d.showMessage(Ajax.getSessionState(),"You've been logged out.  Please login again.","ok");},200);
                                        // Ajax.setSessionId(null,11);  Already set to 11 on server if invalid so client know that user *was* logged in and so preference is login over register.
                                        if (document.getElementById("loginLogoutButton") != null) {
                                            document.getElementById("loginLogoutButton").style.backgroundImage = "url(img/login.png)";
                                        }
                                        return false; // Let things run even with this message displayed.
                                     }
                                     else if ( ("error" in data) || ("exception" in data) || "softError" in data) {
                                         if ( !("action" in data) || data.action.indexOf("refresh") == -1) { // suppress error message on auto refresh ajax actions
                                             var d = new Dialog();
                                             var cName = this.constructor.toString().match(/function\s*(\w+)/);
                                             cName = cName[1]; // name of the subClass
                                             // Ajax.lock(true); // lock silent - no shield
                                             var err = ("error" in data ? data.error : ("softError" in data ? data.softError : ""));
                                             if ("errorCode" in data) {
                                                 err = err + " errorCode= " + data.errorCode;
                                             }
                                             d.setConfirm(function() {});       //  clearSessionNow();sleepMode("loggedOut");
                                             Ajax.unlock(); // make sure ajax is not locked so user can click ok to restart!
                                             d.showMessage("class.js Serializable.serverErrorCheck()","Serializable.serverErrorCheck(): ** session may have expired. ** An object of class " + cName+" received an ajax callback but cannot act() due to an error, please click ok and try again or logout and login.  Error: "+err,"ok");
                                             // d = null;
                                             cName = null;
                                         }
                                         return true;
                                     }
                                     return false;
                                  };

                                  this.defaultServerErrorChecker = function(data,callback) {
                                      /** if (userAutoDeleted(data)) {
                                          return true; // set exception at server in this case
                                      }
                                      if (fbSessionExpired(data)) {
                                         return true;
                                      }
                                      if (noUidReceived(data)) {
                                         return true;
                                      }
                                      if (invalidPassword(data)) {
                                         return true;
                                      }      */
                                      if (data.exception != undefined) {
                                           var d = new Dialog();
                                           // d.setConfirm(function() {introSelectorEvent(-1)});
                                           var dText = "ajaxServerErrorChecker() Error from server:"+ data.error;
                                           alert("Server Error "+callback.toString()+" "+dText);
                                           dText = null;
                                           d = null;
                                           return true;
                                      }
                                      return false;
                                  }


                                  // "~objectsubClassName~paramName1,param1~....~paramNameN,paramN~"
                                  //this.deserialize = function(str) {
                                  //
                                  //};
                     };

Serializable.getCName = function(obj) {
     if (obj == undefined) {
        throw "getCName(): object is undefined";
     }
     else if (!(obj instanceof Object)) {
        throw "getCName(): object is not an object"+typeof obj;
     }
     var cName;
     try {
         cName = obj.constructor.toString().match(/function\s*(\w+)/);
     }
     catch (e) {
        alert( "getCName(): " + e.toString());
        return "BULLSHIT";
     }
     if ((cName instanceof Array) && cName.length > 1) {
       cName = cName[1]; // name of the subClass
     }
     else {
       alert( "getCName(): cName is empty for passed object of type:"+typeof obj);
        return "BULLSHIT";
     }
     return cName;
};


// return an object of the type found in the passed str using all the passed properties in the str for the constructor
// if multiple objects are found at the same level, return an array of the various objects.
// "~objectsubClassName~paramName1,param1~....~paramNameN,paramN~"
Serializable.deserialize = function(data) {
     var ser = (typeof data == "string" ? data : data["serializedObject"]);
     if (ser == undefined) {
         // populate error and return array with error message
         throw "Serializable.deserialize: no ser passed";
     }
     var curStart = 0;
     var ser1;
     var objects = new Array();
     var total = 0;
     var objLen;
     var totalLen = ser.length;
     while (1 == 1) {
         try {
             objects[total] = Serializable.deserializeObject(ser);
             //if (objects[total] instanceof Stateable) {   DONE IN INSTANTIATION!!!!! (a = new object)
             //   objects[total].store();  // ideally would override deserizlieObject() in Stateable to include this
             //}
         }
         catch (e) {
             throw ("Ser.deserialize had inner exception:" + e.toString() + "received ser:" + ser);
         }
         curStart = Serializable.getEndPosThisObject(ser,0) + 1;
         if (curStart >= totalLen - 1) {
             break;
         }
         ser = ser.substr(curStart);
         totalLen = ser.length;
         total++;
     }
     return objects;
}

Serializable.deserializeObject = function(ser) {
    var className  = Serializable.getClassName1(ser);
    if (className == undefined || className == "") {
        // populate error and return array with error message
        throw "Serializable.deserialize: no className in ser";
    }
    var properties = new Object();
    try {
       properties = Serializable.getProperties(ser);
    }
    catch (e) {
       throw "Ser.desObject():"+ e.toString() + " props:" + properties.toString() + "*";
    }
    var obj;
    var i;
    try {
        if ((className == "Array") || (className == "Object")) {
           obj = properties;
           //for (i in obj) {
               // alert(i+" "+obj[i]["message"] +" "+ typeof obj[i]);
           //}
        }
        else {
            obj = eval("new "+className+"(properties)");
        }
    }
    catch (e) {
       throw "Ser.desObject(): eval new object:"+e.toString()+" cName:"+className+" props:"+Utils.toString(properties);
    }
    if (obj == undefined || !(obj instanceof Object)) {
        throw "Serializable.deserialize: no class found for className"+className;
    }
    return obj;
}

 // $ser is formatted as: "~objectsubClassName|paramName1,param1|paramName2,param2~p3innerClassName|p3ParamName1,p3ParamValue1~paramName4,....|paramNameN,paramN~"
 Serializable.getClassName1 = function(ser) {
      var len = ser.indexOf("|");
      if (len == -1 || ser.substr(len-1,1) == "~") {
          // className has no parameters, so either a ~ follows  in place of the "|" or BEFORE it as the "|" already pertains to the outer class next property
          len = ser.indexOf("~",1);  // do NOT use the first ~ that the object starts with - ie make offset 1!
      }
      if (len == -1) {
             throw "No className end found"+ser;
      }
      len--;    // the end position of the className (first occurence of the |)
      return ser.substr(1,len);     // className is the string between the first tilthe and the |
 }

  // get the ending position of the class at the level of the starting position
  Serializable.getEndPosThisObject = function(ser,start) {
         var depth = 1;
         var curPos = start;
         var len = ser.length - 1;
         var fut;
         while (depth > 0) {
             // get next ~
             curPos = ser.indexOf("~",curPos+1);
             if (curPos == -1) {
                 throw ("getEndPosThisObject() no end token found start="+start+" serLen=" + ser.length +" ser=" + ser);
             }
             // is it followed by a | or ~
             fut = ser.substr(curPos+1,1);
             if (fut == "~" || fut == "|") {
                  depth--;
             }
             else {
                 depth++;
             }
             if (depth <=0 || curPos >= len) {
                 return curPos;
             }
         }
         throw "getEndPosThisObject() Should not be here";
         return curPos;
 }

 Serializable.getProperties = function(ser) {
          var curStartPos = 1;
          var totalLen = ser.length;
          var properties = new Object();
          if (curStartPos >= totalLen) {
              return properties;
          }
          var safety = 0;
          var tempStartPos = 0;
          var fut;
          var name1;
          var nameLen;
          var curMidPos;
          curStartPos = ser.indexOf("|",curStartPos);
          var endLevel = Serializable.getEndPosThisObject(ser,0);
          if (curStartPos == -1 || curStartPos > endLevel) { // if | does not exist or is AFTER endof level we are done with this object - there are no properties
              return properties;
          }
          curStartPos++;  // the start position of the first property name
          while (curStartPos < totalLen-1 && !(curStartPos == -1)) {
              safety++;
              if (safety > 200) {
                  return properties;
              }
              curMidPos = ser.indexOf(",",curStartPos);  // the end position of the current property name + 1 (the position of the comma)
              nameLen = curMidPos - curStartPos; // the length of the curent property name
              name1 = ser.substr(curStartPos,nameLen);
              curMidPos += 1; // the startPosition of the current value
              // is curMidPos a ~?  This means (if not end of file) it is the start of a new inner object - recurse to get the value as an object
              if (ser.substr(curMidPos,1) == "~") {
                  // a) end of this inner sub-class?  return properties
                  if (curMidPos == totalLen-1) {
                      properties[name1] = "";
                      return properties;
                  }
                  fut = ser.substr(curMidPos+1,1);
                  // ",~~" means we have ended an inner class
                  // ",~|" means ending an inner-class with blank value for final property, outer class resumes
                  if (fut == "~" || fut == "|") {
                       properties[name1] = "";
                       return properties;
                  }
                  curStartPos = Serializable.getEndPosThisObject(ser,curMidPos) + 1; // skip the inner object to be parsed and populated
                  // ok if we are here, next character is ordinary, so we are starting a new inner class - send new ser from cur to end and recurse
                  properties[name1] = Serializable.deserializeObject(ser.substr(curMidPos,curStartPos-curMidPos));
                  // if the current position is not a "|" then there are no more properties at this level, return else advance 1
                  if (ser.substr(curStartPos,1) != "|") {
                      return properties;
                  }
                  else {
                      curStartPos++;  // now we are at the start position of the next property name
                  }
                  continue;
              }
              if (curStartPos >= totalLen) {
                  return properties; // maybe can happen if last property value was a serializable?  not sure, would lkikely end up with ~~ at the end.
              }
              tempStartPos = ser.indexOf("|",curStartPos); // the end position of the current value + 1 (the position of the next |)
              // if there is no at this level we are at the last value
              if (tempStartPos == -1 || tempStartPos > endLevel) {
                  properties[name1] = ser.substr(curMidPos,endLevel - curMidPos);
                  return properties;
              }
              else {
                  curStartPos = tempStartPos;
              }
              properties[name1] = ser.substr(curMidPos,curStartPos - curMidPos);
              curStartPos++;  // the start position of the next property name
          }
          return properties;
    }


 Stateable.inheritsFrom(Serializable);

 // when an object is removed, it is NOT really removed, just set to null, so the max Id is ALWAYS increasing
 // so new IDs are always equal to the current count + 1
 Stateable.storedObjects = new Object();
 Stateable.refreshableObjects = new Object();
 // the total number of stored stateable object.  Objects are stored (and re-stored in case of unknown corruption) before sending.
 Stateable.storedObjectsTotal = 1;

 // alias transcendable -> transcends server and client, javascript and php, ajax act()s on it when done, html can refer to it via callMethod()
 function Stateable(arr,realThis) {
     var that = realThis != undefined ? realThis : this;
     this.objectId = -1; // necessary to receive html events - stored when object displays received html (on act) - also re-stored again on re-creation when deserializing an already stored object.
     // if parent is declared it is also a registered listener of html events after the child event method is called  - see Stateable.callMethod()
     this.parentObjectId = -1;
     this.did = 0;
     this.selectorStatus = ""; // a text status if some user error and we dont need to refresh entire slector html - just the error message
     this.embeddedHTML = "";        // stored on deserialization, some objects are embedded and will therefore never get their act called.
     this.wrapperId = "";    // embeddedHTML elem(a Stateable object embedded inside another Stateable object has a placeHolder - so to show the child it is just a matter of setting the innerHTML - no ajax send - or playing with dialogs)
     this.dialogType = 1; // should be moved to a class called Selector   All selectors should have an associated dialog object or type so when their dialog is created, setDialog knows what type to use.

     var html = "";   // stored on act()

     this.getDialogType = function() {
         return that.dialogType;
     }

     this.setDialogType = function(t) {
         that.dialogType = t;
     }

     this.getSelectorStatus = function() {
         // MUST use "this" instead of "that" here - I dont know why it works right here "that" will fail and return only LOCAL snapshot version - i.e. 0
         // I think what is happeneing is "this" is really the subclass version, ie the version of this being passed is from the subclass only populated if
         // deseriliazeAndPopulateFrom() method was called with an object i.e. meaning we got the object from the server
         return that.selectorStatus;
     };
     this.setSelectorStatus = function(s) {
         this.selectorStatus = s;
     };
     this.showStatus = function(s) {  // warning!  clears existing status variable so it will not be displayed again unless set by server again
         if (document.getElementById("selectorStatus") == undefined) {
             if (that.selectorStatus != "") {
                 var d = new Dialog();
                 d.showMessage("Error",that.selectorStatus,"ok");
             }
             return;
         }
         if (s) {
            document.getElementById("selectorStatus").innerHTML = s;
         }
         else if (that.getSelectorStatus() != "") {  // put this in super
            document.getElementById("selectorStatus").innerHTML = that.getSelectorStatus();
         }
         else {
            document.getElementById("selectorStatus").innerHTML = "";
         }
         this.setSelectorStatus("");
     }


     Stateable.prototype.act = function(data) {

     };

     /**
     Stateable.prototype.getName = function() {
         if (this.className != undefined) {
             return this.className;
         }
         if (this.name != undefined) {
             return this.name;
         }
         return "";
     };  */

     // only serializables that can receive the ajax can be aborted, therefore this is here and not in Serializable
     Stateable.prototype.aborted = function() { // an ajax return was aborted due to global server error handler or local handler flagged.
          // do screen cleanup any button re-enabling here - no resend.  That should be decided in a timeout method
          var d = new Dialog();
          d.showMessage("Request Timed Out","Please try your request again. Internet traffic is high.","Ok");
          return;
     };


     this.store = function(refresh) {        // when new version of the SAME object (e same object ID) is deserialized we do not want the NEW version stored here - rather we merge new into old, see populateFrom().
                                       // certin stateales A that contain  Stateable B may have B initialized at the server so when B acts and wants to store itself
                                       // it will store itself with the empty string as it will not have an objectId!!!! The way we stop that automatically is
                                       // by sensing here in THIS function.  If object does not have an object ID and it is being stored, then we know it was created at the server
                                       // so, let's give it its client-side unique objectId NOW - then we can store it!   (objectId could not be set at the server)
                                       that.setObjectId(); // Does NOT set if it is already set!
                                       if (!(("A"+that.objectId) in Stateable.storedObjects) || Stateable.storedObjects["A"+that.objectId] == null) {
                                           Stateable.storedObjects["A"+that.getObjectId()] = that;
                                       }
                                       // alert("CLASS.store(): A"+that.getObjectId());
                                       if (refresh != undefined) {
                                           that.setRefresh(refresh);
                                       }
     };

     this.unstore = function() {  // garbage collect - used when Stateables contain Stateables, upon closing the parent, parent should call unstore on all its child stateables
         if (("A"+that.objectId) in Stateable.storedObjects) {
             delete(Stateable.storedObjects["A"+that.getObjectId()]);
         }
         that.setRefresh(false);
     }

     this.setRefresh = function(refreshable) {
                                       if (refreshable != undefined && refreshable) {
                                           if (!(("A"+that.objectId) in Stateable.refreshableObjects) || Stateable.refreshableObjects["A"+that.objectId] == null) {
                                               Stateable.refreshableObjects["A"+that.getObjectId()] = that;
                                           }
                                       }
                                       else if ( ("A"+that.getObjectId()) in Stateable.refreshableObjects) {
                                           delete(Stateable.refreshableObjects["A"+that.getObjectId()]);
                                       }
     };


     // by setting parent ID  it is like registering a listener
     // as any html event that calls the parent via Stateable.callMethod() (the only way)  will trigger that same event to be passed
     // to childEvent(methodName,arg1,arg2,arg3...) on the parent.
     this.setParentObjectId = function(id) {
         this.parentObjectId = id;
     }
     this.getParentObjectId = function() {
         return that.parentObjectId;
     }
     this.isEmbedded = function() {
         return (this.parentObjectId  > 0 && !Utils.isEmpty(that.wrapperId) );
     }

     this.clearParent = function() {
         this.parentObjectId = -1;
     }
     this.getParent = function() {
         return Stateable.getById(that.parentObjectId);
     }

     this.setObjectId = function() {
          if (that.objectId != undefined && !isNaN(that.objectId) && that.objectId > 0) { // safety, should only be set once
              return that.objectId;
          }
          that.objectId = Stateable.storedObjectsTotal;
          Stateable.storedObjectsTotal++;
          return that.objectId;
     };

     this.getObjectId = function() {
        // MUST use "this" instead of "that" here - I dont know why it works right here "that" will fail and return only LOCAL snapshot version - i.e. 0
        // I think what is happeneing is "this" is really the subclass version, ie the version of this being passed is from the subclass only populated if
        // deseriliazeAndPopulateFrom() method was called with an object i.e. meaning we got the object from the server
        return that.setObjectId();
     };

     this.superAct = function(data) {
         if ("html" in data) {
             html = data.html;
         }
     };

     this.setLastHTML = function(h) {
         html = h;
     }
     this.getLastHTML = function() {
        return html;
     }

     this.superShow = function(type,noIScroll) {
         if (!Utils.isEmpty(html)) {
             if (type != undefined) {
                 setDialog(html,null,null,type,noIScroll);    // noIscroll as some dialogs like search have its own iscrolls on the search result and selected result columns  g(dialogHTML,dialog,silent,type,noIScroll)
             }
             else {
                 setDialog(html);
             }
             return true;
         }
         return false;
     };

     this.getEmbeddedHTML = function() {
        return that.embeddedHTML;
     }

     this.setEmbeddedHTML = function() {
         if (Utils.isEmpty(that.wrapperId)) {
             return;
         }
         that.embeddedHTML = document.getElementById(that.wrapperId).innerHTML;
     }
     this.setWrapperId = function(id) {
         that.wrapperId = id;
     }
     this.showEmbedded = function() {
         if (("task" in that) && ("html" in that.task) && ("getClassName" in that) && (document.getElementById(that.getClassName()) != undefined)) {
            document.getElementById(that.getClassName()).innerHTML = that.task["html"];
            // alert("class.js.showEmbedded() this option should not be used");  // admin add products still uses this it may be ok...
            return;
         }
         if (Utils.isEmpty(that.wrapperId) || document.getElementById(that.wrapperId) == undefined) {
             return;
         }
         document.getElementById(that.wrapperId).innerHTML = that.getEmbeddedHTML();
     }
     this.hideEmbedded = function() {
         that.setEmbeddedHTML();
         if (Utils.isEmpty(that.wrapperId) || document.getElementById(that.wrapperId) == undefined) {
             return;
         }
         if (Utils.isEmpty(h)) {
             return;
         }
         Utils.setInnerHTML(document.getElementById(that.wrapperId),emptyHTML);
     }
     this.isShowingEmbedded = function() {
         return  !Utils.isEmpty(that.wrapperId) && document.getElementById(that.wrapperId) != undefined && !Utils.isEmpty(document.getElementById(that.wrapperId).innerHTML);
     }



     // if the object was not found we create it and STORE it too as it was clearly needed to be stored if this method was called
     Stateable.getCreateStore = function(type) {
          for (var i in Stateable.storedObjects) {
              if (Stateable.storedObjects[i] instanceof eval(type)) {
                  //alert("OLD:"+type+" objectId:"+Stateable.storedObjects[i].objectId);
                  return  Stateable.storedObjects[i];
              }
          }
          var newObj = eval("new "+type+"()");
          newObj.store();
          //alert("NEW:"+type+" objectId:"+newObj.objectId);
          return newObj;
     };

     Stateable.getById = function(id) {
         if (id != -1 && Stateable.storedObjects["A"+id] != undefined && Stateable.storedObjects["A"+id] != "") {
             return Stateable.storedObjects["A"+id];
         }
         else {
            return false;
         }
     };

       // RENAME TO: showOrCreateSendAct() get it it if here - perform send if not or if no show method in subclass
       // warning this WILL use the stored object of passed type if here and if no show method exists, a send will be performed.
      Stateable.getAndShow = function(type,arg) {
          for (var i in Stateable.storedObjects) {
              if (Stateable.storedObjects[i] instanceof eval(type)) {
                  // is there a show method?
                  if ("show" in Stateable.storedObjects[i]) {
                      if (arg == undefined) {
                         Stateable.storedObjects[i].show();
                      }
                      else {
                         Stateable.storedObjects[i].show(arg);
                      }
                  }
                  else if (arg != undefined) {
                      Stateable.storedObjects[i].send(arg);
                  }
                  else {
                      Stateable.storedObjects[i].send();
                  }
                  return;
              }
          }
          var newObj = eval("new "+type+"()");
          if (arg != undefined) {
              newObj.send(arg);
          }
          else {
              newObj.send();
          }
      }

     // 1)  gets or creates an object of the passed subclass type
     // 2)  calls the subclass send() method - assumes subclass HAS a send method!  If not, some defualt send here should be performed
      Stateable.send = function(type,arg) {
          for (var i in Stateable.storedObjects) {
              if (Stateable.storedObjects[i] instanceof eval(type)) {
                  //alert("OLD:"+type+" objectId:"+Stateable.storedObjects[i].objectId);
                  if (arg != undefined) {
                      Stateable.storedObjects[i].send(arg);
                  }
                  else {
                      Stateable.storedObjects[i].send();
                  }
                  return;
              }
          }
          var newObj = eval("new "+type+"()");
          if (arg != undefined) {
              newObj.send(arg);
          }
          else {
              newObj.send();
          }
     };

     // 1)  gets or creates an object of the passed subclass type
     // 2)  calls the subclass send() method - assumes subclass HAS a send method!  If not, some defualt send here should be performed
      Stateable.refresh = function(type,args) {
          for (var i in Stateable.refreshableObjects) {
              // setTimeout(function() {Stateable.send("RegionHistorySelector");},200); // REFRESH regionHistorySelector in case publishable privacy state has changed
              if (type == undefined || !(type) || Stateable.refreshableObjects[i] instanceof eval(type)) {
                  // setTimeout("Stateable.refreshableObjects['"+i+"'].refresh("+(args == undefined ? "" : args)+")",200);
                  Stateable.refreshableObjects[i].refresh(args);
              }
          }
      };

     // RESTORING all vars in arr to what they were - is performed in Serializable via populateFrom - and takes care of this subclass - however after that is done, there may be some
     // post processing needed - but since javascript sucks for being able to overload methods like a postProcess() which would trickle up to all super classes - instead, for now, we sense for some items in arr and do this processing now
     // VERY IMPORTANT!!!!!!  deserializing creates a NEW object so if the former version of this object was previously stored - (ie same objectId)
     //    while we want to retain the original and do a populateFrom() adding the new,
     //      we CAN'T store this NEW object with the SAME objectId that it had here and now  because
     //      the FIRST object in the chain is deserialized - like all the objects under it - however,
     //      when complete the act() of the top object via deserializeAdnPopulateFrom()  will next call populateFrom USING the EXISTING top object which referenced deserialize in the first place!!!!
     //      so the top object is exempt from checking to see if it already exists - as it was the top object that already existsed that called deserialize
     //      hence the problem remains with only the embedded STateables being deserialized - but are also stored herein.
     //      The solution is now in populateFrom(newlyDeserializedObject) whereby if any of the newly deserilaized embedded objects exist,
     //      the existing will be embedded and will get IT'S populateFrom called using the newly deserialized same type object as the argument
     //    The alternative is for all subclasses to retore themselves but what a drag for the same for loop to appear in each subclass - and you could not depend on "this" variables  to limit the scope to the class so you would need
     //    a bunch of conditionals for each variable to restore!
     // Setting store herein using the NEW would fail as new object would not have the local vars that old object had - even more when the old object is the base
     // all old "that" vars are lost upon next get - so getAndShow() will get a bad version of the object
     // anyway we redesigned store so it will not store if the object is already there.
     // so now we have the best solution for when embedding stateable objects inside other stateables - when they are deserialized, we get their contents via sensing in Serializable.populateFrom()
     // objectId is the ONLY var that can't be started on a server,  so if server-side object is first constructed there then when arriving here it will have an objectIf of 0 or -1
     // In that case, a new objectId should be created here or on store().

     // this should not make a difference because caller is in the middle of a deseriliazation so we have noi access to the ORIGINAL objectId - "this" is just a NEW object about to get the contents of arr
     //  so no need to set itsobjetId to that orf thsi which has an objectId that will never be used by anyone!!!
     if (arr != undefined && (typeof arr == 'array' || typeof arr == 'object') && ("objectId" in arr)) {
         if (parseInt(arr["objectId"]) < 1) {
              arr["objectId"] = this.setObjectId();   // the objectId in arr will be used to set this.objectId when populateFrom is called in the next line of the sub classes constructor - so make SURE we set the arr.objectId now too!!!
         }                                            // however, setting this.objectID now at all is really unnecessary as store could do it - with the premise that we only need an objectId once store is called.
         else {
             this.setObjectId();
         }
     }
     else {
         this.setObjectId();  // fucking javascript - only vars from sublcasses are included in "this", functions are not - functions of a subclass are not accessible from the superclass.  Bravo javascript - NOT
     }

     // NOW that all properties and methods are defined, call super
     Serializable.call(that,arr);
     //this.superConstructor.call(that,arr); <== "this" is the subclass as we called Stateable using the subclass "this" via "call" so the code on the left will call stateable in infinite recursion!!!!

     // NOW perform any additional actions you want to perform in subclass that depend on supercalss being complete
     //if (realThis != undefined) {
     //    Stateable.getById(realThis.getObjectId()).test();
     //}
 }

 // for piggy backing ajax calls on top of refresh - the callback depends on the id - and passed back is the data string that pertains to the caller only
 // if the object is no longer stored,  the call is ignored
 // called by ajax, deprecates the whole refresh paradigm
Stateable.piggyAct = function(id,data) {
      obj = Stateable.getById(id);
      if (obj != false) {
          obj.piggyAct(data);
      }
}


 // Call the function with passed functionName on the stored object with the passed ID
 // if there is none - return null-
 // this is needed to provide continuity with an html event where the desired code for the event is stored
 // not statically, but in a particular object.
 // The html onclick="..." cannot possibly have or even sytactically describe direct reference to that object.
 // Instead the html shall be: onclick="Serializable.getRecentObject(className,arg1,arg2,.....);
 // the selector objects create HTML on the fly when created with a unique ID so they can be referenced from the HTML!
 Stateable.callMethod = function(id,functionName,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8) {
      var obj;
      // rare if server needs to define an html event that is a method in a client Stateable that may not yet be instantiatied -
      // in any even the server defining the html mapping to callMethod did not have access to the object ID as it was not serilized - i.e. the method is a static method and so we must search for or create a Stateable now on the fly.
      if (isNaN(id) && typeof id == "string") { // a string that is also a number like "15" will show typeof as string - so then not to be stupid - check isNan() on it first! sometimes we receive the number id as a string
          //var d = new Dialog();
          //d.showChoice("Stateable.callMethod() ID type not valid","functionName: "+functionName+" ID:"+id,"ok");
          //return;
          obj = Stateable.getCreateStore(id);
          if (obj == "") {
              // make a new blank object of passed string type (like a new HistorySelector)  this is called with a string ONLY when first instance of object
              // is desired here at the client based on html produced at the server - like the refresh code still is.
              obj = eval("new "+id+"()");
              obj.store();
          }
      }
      else if (id == undefined || isNaN(id) || id < 1) {
             var d = new Dialog();
             d.showChoice("Stateable.callMethod() ID not valid","functionName: "+functionName+" ID:"+id,"ok");
             return;
         }
      else {
          obj = Stateable.getById(id);
      }
      if (obj != undefined && obj != false && obj instanceof Stateable) {
         if (!(functionName in obj)) {
             var d = new Dialog();
             d.setTimer(2000);
             d.setConfirm(function() {return true;});
             d.showChoice("Stateable.callMethod()","functionName: "+functionName+" is undefined  ID:"+id+ "OBJECT toString():"+Utils.toString(obj).substring(0,50),"ok");
             return;
         }
         if (arg8 != undefined) {
            obj[functionName].call(obj,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8);
         }
         else if (arg7 != undefined) {
            obj[functionName].call(obj,arg1,arg2,arg3,arg4,arg5,arg6,arg7);
         }
         else if (arg6 != undefined) {
            obj[functionName].call(obj,arg1,arg2,arg3,arg4,arg5,arg6);
         }
         else if (arg5 != undefined) {
            obj[functionName].call(obj,arg1,arg2,arg3,arg4,arg5);
         }
         else if (arg4 != undefined) {
            obj[functionName].call(obj,arg1,arg2,arg3,arg4);
         }
         else if (arg3 != undefined) {
            obj[functionName].call(obj,arg1,arg2,arg3);
         }
         else if (arg2 != undefined) {
            obj[functionName].call(obj,arg1,arg2);
         }
         else if (arg1 != undefined) {
            obj[functionName].call(obj,arg1);
         }
         else {
            obj[functionName].call(obj);
         }
         if (("parentObjectId" in obj) && obj["parentObjectId"] != -1) {
             obj = Stateable.getById(obj["parentObjectId"]);
             if (!obj || !("childEvent" in obj)) {
                 return;
             }
             if (arg8 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2,arg3,arg4,arg5,arg6,arg7,arg8);
             }
             else if (arg7 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2,arg3,arg4,arg5,arg6,arg7);
             }
             else if (arg6 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2,arg3,arg4,arg5,arg6);
             }
             else if (arg5 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2,arg3,arg4,arg5);
             }
             else if (arg4 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2,arg3,arg4);
             }
             else if (arg3 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2,arg3);
             }
             else if (arg2 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1,arg2);
             }
             else if (arg1 != undefined) {
                obj["childEvent"].call(obj,functionName,arg1);
             }
             else {
                obj["childEvent"].call(obj,functionName);
             }
         }
      }
 }


module.exports = {
    Utils,
    Serializable,
    Stateable
 }
