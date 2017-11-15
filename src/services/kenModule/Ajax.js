// COPYRIGHT  Ken Silverman,  917 741 3377 all rights reserved 2009, 2010, 2011
// Patent(s) pending

// specify endpoints like this:   ajaxDialog.params["type"] = "silentLogin";  ajaxDialog.send(dialogsUrl);

Ajax.AJAX_WAITING_IMAGE_URL="./images/ajax_waiting_spinner.gif";
Ajax.AJAX_MASK_IMAGE_URL="./images/shield40.png";
Ajax.CLEAR_IMAGE_URL="./images/clear.gif";



// **********   set AJAX DEFAULT HANDLERS - ie for ajax RETURNING WITH ERRORS OR NO DATA  *****************/
Ajax.globalServerErrorHandler = ajaxServerErrorChecker;

Ajax.defaultAbortHandler = function(request,targetUrl,params,paramObject,dontUseParamObjectAsCallback) {
     if (!request.getSilent()) {
         var d = new Dialog();
         d.setConfirm(function()  {setDialog(emptyHTML,d);});
         d.setConfirm1(function() {setDialog(emptyHTML,d); request.send(targetUrl,params,paramObject,dontUseParamObjectAsCallback);});
         d.showMessage("Request Timed Out - Internet traffic","Try again? Choose yes, only if you are sure request has not gone through on the server.  In the case of sending a message, check to see if the message was delivered, so it is not sent twice, or choose no, and start again.","No","Yes");
     }
     else { // silent requests can always be resent unless a superceded one was ALREADY sent, ajax.send should confirm that already - ie sense if this is an attempted resend based on sendTime...
         request.send(targetUrl,params,paramObject,dontUseParamObjectAsCallback);
     }
}

// server errors that are not thrown - ie causing data contain an "Error" flag are now considered soft exceptions and we return false.
// for example a move failing due to space takenm is a "warning" or "softError" only.
// if you want your own hardError checker, make your callback not just a function,
// but a Stateable or Actable object and populate it with the method serverErrorCheck()
function ajaxServerErrorChecker(data,callback) {
    if (userAutoDeleted(data)) {
        return true; // set exception at server in this case
    }
    if (fbSessionExpired(data)) {
       return true;
    }
    if (invalidPassword(data)) {
       return true;
    }
    if ("exception" in data) {
         var d = new Dialog();
         d.setConfirm(function() {clearSession("secure");});
         var dText = "ajaxServerErrorChecker() Error from server:"+ Utils.toString(data.error);
         alert("Server Error callback.toString():"+callback.toString()+"   Utils.toString(data.error):"+dText);
         dText = null;
         d = null;
         return true;
    }
    return false;
}

function isRefresh(data) {
      if ( ("type" in data) && data["type"] == "refresh") {
          return true;
      }
      if ( ("action" in data) && data["action"].indexOf("refresh") > -1) {
          return true;
      }
      return false;
}


function invalidPassword(data) {
     if (data.errorCode == undefined || data.errorCode != "invalidPassword") {
             return false;
     }
     if (isRefresh(data)) { // ignore, user is just changing passwords most likely and we dont want to turn off and then on refreshes alone as an old refresh might still squeak through
         return false;
     }
     clearSession();
     var d = new Dialog();
     // d.setConfirm(function() {introSelectorEvent(-1);});
     d.showMessage("Invalid Password received","Please login again. Type="+data.type,"ok");
     return true;
}

function noUidReceived(data) {  // user is not logged in and should be according to the server rules
     if (data.errorCode == undefined || data.errorCode != "noUid") {
             return false;
     }
     if (isRefresh(data)) { // ignore, user is just changing passwords most likely and we dont want to turn off and then on refreshes alone as an old refresh might still squeak through
         return false;
     }
     clearSession("secure");
     return true;
}

function fbSessionExpired(data) {
      if (data.errorCode == undefined || data.errorCode != "requestExchangeFailed") {
          return false;
      }
      Ajax.lock(); // logout will unlockl to do the update and the relock
      var d = new Dialog();
      // d.setConfirm(function() {loginOrAuthorizeFacebook();});
      d.setConfirm(function() {logout();}); //introSelectorEvent(-1) // clearSession("secure");
      d.showMessage("Facebook Session Expired","Please login again.", "ok");
      return true;
}
// checks to see if user was deleted upon return of an ajax.  If so, presents a dialog, clears session and brings up intorSelector upon OK
// @return true if user was deleted and dialog is presented
function userAutoDeleted(data) {
     if (data.errorCode == undefined || (data.errorCode != "userDeleted" && data.errorCode != "userNotFound")) {
         return false;
     }
     if (isRefresh(data)) { // ignore, user is just changing passwords most likely and we dont want to turn off and then on refreshes alone as an old refresh might still squeak through
         return false;
     }
     var d = new Dialog();
     d.setConfirm(function() {clearSession("secure");}); // introSelectorEvent(-1)
     var dText = "You were logged out automatically if you did not upload a face photo or your password= "+passKey+" sent passKey="+data.passKey+" was not verified correctly. error="+data.error+" errorCode= "+data.errorCode+" Type="+data.type+" subtype="+data.subtype+" Press OK to start over - if account was deleted, enter new and upload at least one face photo.";
     d.showMessage("Logged Out Automatically",dText, "Start Over");
     clearSession();
     dText = null;
     d = null;
     return true;
}

// ********************  END default handlers

Ajax.locked = false;

Ajax.isLocked = function() {
    return Ajax.locked;
}

Ajax.lock = function(silent) {
    Ajax.locked = true;
    if (silent == undefined || !silent) {
        this.setMask(true,false,true,true); //on,auto,infinite,noSpinner
    }
}

Ajax.unlock = function() {
    Ajax.locked = false;
    Ajax.setMask(false,false,false,false); //on,auto,infinite
}

 // WARNING!  It's antiquated to lock screen while waiting for an Ajax to return ... users expect website open as normal.
 // therefore make sure you use setSilent to true so this will not be called unless your Ajax is controlling something that cannot be requested twice - like send money
 // then, user absolutley needs entire web page locked until confirmation - and if no confirmation, then a check must be performed by that Ajax packetId before sending again.
 // It gets very complicated, and therefore, best bet is state based - where bevfore any very critical ajax is sent, a server-side read is performed to confirm that no prior Ajaxes are waiting.
Ajax.setMask = function(on,auto,infinite,noSpinner) {
    if (document.getElementById("maskSpinnerImage") != -1) {
        if (on) {
            if (noSpinner == undefined || !noSpinner) {
                document.getElementById("maskSpinnerImage").src=Ajax.AJAX_WAITING_IMAGE_URL;
            }
            // android bug: turn off overflow : auto (scrolling) on any showing dialog otherwise mask will not show over overflow element
            if (Utils.isAndroid()) {
                setActiveDialogOverflow(false);
            }
            document.getElementById("ajaxMaskImage").src=Ajax.AJAX_MASK_IMAGE_URL;
            document.getElementById("ajaxMaskImage").width = "100%" + "";
            document.getElementById("ajaxMaskImage").height = "100%" + "";
            document.getElementById("maskSpinnerImage").width = "40";
            document.getElementById("maskSpinnerImage").height = "40";
            // turn off in 20 seconds if nothing else turns it off  (with alert message)
            clearTimeout(Ajax.setMaskId);
            if (infinite == undefined || !infinite) {
                Ajax.setMaskId = setTimeout(function() {Ajax.setMask(false,true);},20000);
            }
        }
        else {
            document.getElementById("maskSpinnerImage").src=Ajax.CLEAR_IMAGE_URL;
            document.getElementById("ajaxMaskImage").width="0";
            document.getElementById("ajaxMaskImage").height="0";
            document.getElementById("maskSpinnerImage").width = "0";
            document.getElementById("maskSpinnerImage").height = "0";
            // android bug: turn back on overflow : auto (scrolling) on any showing dialog otherwise mask will not show over overflow element
            if (Utils.isAndroid()) {
                setActiveDialogOverflow(true);
            }
            clearTimeout(Ajax.setMaskId);
            if (auto != undefined && auto) {
               //var d = new Dialog();
               //d.showMessage("Offline","Request was not acknowledged.  Please use WiFi or wait for a better connection before trying again.","ok");
               var wifiD = new Dialog();
               //if (!Utils.isEmpty(uid)) {
               //    wifiD.setConfirm1(function() {Ajax.unlock(); wifiD.setAutoErase(false); initSession();return false});
               //}
               //else {
                   wifiD.setConfirm1(function() {Ajax.unlock(); sleepMode("secure");});
                   // if dialogs are empty then call sleepMode secure on dismiss   MAYBE NOT DO THIS? no need if dismissing the bad call, home buttons should still be accessible
                   if (getLastShowingDialogType() == 0) {
                        wifiD.setConfirm(function() {Ajax.unlock(); sleepMode("secure");});
                   }
               //}
               wifiD.showMessage("Offline","Request not received. Please try again or restart app.",placeId ? 'dismiss' : "",'restart app');
            }
        }
    }
}

// any global JS variable can be included as a post paramter using the name of the variable as the POST name and the variable contents at send time
// as the POST value.
Ajax.autoIncludeGlobalPostParameter = function(varName) {

                                      };

// any global JS string can be registered to be sent as the full GET string in the send URL
// using the value of the variable at send time.
Ajax.autoIncludeGlobalGetString = function(varName) {

};

Ajax.lastAttemptedManualSendTime = 0;

Ajax.MIN_INTERVAL_BETWEEN_MANUAL_SENDS = 3500;


Ajax.isClear = function(elem,time,show) {
     if (time == undefined || !time || time < 1) {
         time = Ajax.MIN_INTERVAL_BETWEEN_MANUAL_SENDS;
     }
     if (elem != undefined && elem) {
         elem.style.cursor = "default";
         setTimeout(function() {
                      if ( ((new Date()).getTime() - Ajax.lastAttemptedManualSendTime) >= (time-100)) {
                         elem.style.cursor = "pointer";
                      }
                      else {

                      }
                     } , time);
     }
     var now = (new Date()).getTime();
     if ( (now - Ajax.lastAttemptedManualSendTime) < time) {
         setBeep("ajaxBlocked");
         if (show != undefined && show) {
             var d = new Dialog();
             d.setTimer(2000);
             d.showMessage("Please wait","Wait a few seconds between repeat requests please.","ok");
         }
         return false;
     }
     Ajax.lastAttemptedManualSendTime = (new Date()).getTime();
     return true;
}

Ajax.packetIds = new Object();

Ajax.timers = new Object();

Ajax.packetTimeOutCheck = function(packetId) {
   if (packetId in Ajax.packetIds) {
       // yes, packet is timed out as the response has not come back yet!  alert if not silent - offer to send again - dangerous - and must snapshot params in cache too - later
       Ajax.clearPacketFromCache(packetId);
   }
};

Ajax.lastPacketId = 0;

Ajax.MAX_REQUESTS = 5; // maximum requests already out there that have not returned yet

Ajax.pending = function(packetId) {
    return (packetId in Ajax.timers);
}

Ajax.cacheTimer = function(connection) {
      var uniqueId = (new Date()).getTime() + "*" + Math.floor(Math.random()*1000);
      var timerId = setTimeout(function() {Ajax.clearTimer(connection,uniqueId);},Ajax.TIME_TO_ABORT);
      Ajax.timers[uniqueId] = timerId;
      return uniqueId; // is used as packetId
}

Ajax.clearTimer = function(connection,packetId) {
    if (!(packetId in Ajax.timers)) {
        return false;
    }
    clearTimeout(Ajax.timers[packetId]);
    connection.totalRequests--;
    delete Ajax.timers[packetId];
    return true;
}

// not used
Ajax.cachePacket = function(request) {
     // that.params are overwritten when supercede true and another request is attempted automatically - in that case we dont want it anyway
     Ajax.lastPacketId = (new Date()).getTime() + "*" + Math.floor(Math.random()*1000);
     Ajax.packetIds[Ajax.lastPacketId] = request;
     return Ajax.lastPacketId; // <== lastPacketId is not a local var just to save Garbage collecting it here, ie set to null
};

// not used
Ajax.clearPacketFromCache = function(packetId) {
     if ( (typeof packetId == "object") && ("packetId" in packetId) ) {
         delete Ajax.packetIds[packetId.packetId];
     }
     else if (typeof packetId == "string") {
         delete Ajax.packetIds[packetId];
     }
};

// not used
Ajax.getPacket = function(packetId) {
    if (packetId in Ajax.packetIds) {
        return Ajax.packetIds[packetId];
    }
    return false;
};



Ajax.disabled = false;

Ajax.disable = function() {Ajax.disabled = true;};
Ajax.enable  = function() {Ajax.disabled = false;};

Ajax.TIME_TO_ABORT = 9000;  // abort if no callback in 9 seconds;

// register a global server error handler JS function to deal with any program or data errors that return a hard error on the server
// according to yor own format
Ajax.globalServerErrorHandler = function(data,callback) {return false};  // no global handler defined,

Ajax.defaultAbortHandler = function(request,targetUrl,params,paramObject,defaultCallbackObject) {
    return;
}; // called only when there is no data returned and no cb handler is explicitly defined

Ajax.dummyCallback = function(data) {};

// if you have your own AjaxCallback (like a Stateable) this is not used
// this class is a callback wrapper for null or static fuction based callbacks
var AjaxCallback = Class.extend( { init : function(callback){
                                              if (callback != undefined && typeof callback == "function") {
                                                  this.name = callback.toString().substr(0,callback.toString().indexOf("("));
                                              }
                                              else {
                                                  this.name = "no callback";
                                              }
                                              this.callback = (callback != undefined ? callback : false);
                                              this.isSilent = false;
                                   },
                                   act  : function(data) {
                                              if (this.callback) {
                                                  this.callback(data);
                                              }
                                   },
                                   getName  : function() {
                                              return this.name;
                                   },
                                   aborted : function(request,targetUrl,params,paramObject,defaultCallbackObject) {  // make sure this function is overridable test the javascript
                                       // cleanup screen, disables etc... if global server error caused abort or other
                                       // default is to call global abort
                                       Ajax.defaultAbortHandler(request,targetUrl,params,paramObject,defaultCallbackObject);
                                   },
                                   setSilent : function(s) {
                                      this.isSilent = s;
                                   },
                                   serverErrorCheck : function(data) { // <== if callback is just a function, server errors cannot be processed, function must handle its own errors
                                                          return false;
                                                      }
                                   } );


//Ajax.piggies = ""; // format for send is "objectId,action,arg,objectId,action,arg" ....
Ajax.piggiesArr = new Object();
Ajax.piggiesLocked = false;

// action can be 'pub' for example and arg can be a 'pid' so return can be anything using the objectId as key in the data string
// ALAYS erased if objectId not found in stored objects BEFORE send to clear cluttering of piggies on forgetting to unregister them
// for the most part use this with refresh ajax ony - if type is not "refresh" we will ignore piggies for now as our app needs piggies only for the purpose of constant checking when a pub is open or inbox
// some pigggies will be agglomerated for a single select via intelligence on the server - ased on their 'action' for efficiency but kept separate with the JSON results so client treats each as distinct
// some piggies will not warrant a return action - like if a pid has nothing new added, then it will not be included in the return data from server
Ajax.registerPiggy = function(objectId,action,arg,force)  {
      if (Ajax.piggiesLocked && (force == undefined || force == false)) {
          setTimeout(Ajax.registerPiggy(objectId,action,arg),500);
          return;
      }
      Ajax.piggiesArr[objectId] = action + ',' + arg;
      //Ajax.piggies += (Ajax.piggies == "" ? "" : ',');
      //Ajax.piggies += objectId +','+ action + ',' + arg;
}

Ajax.unregisterPiggy = function(objectId) {
     delete(Ajax.piggiesArr[objectId]);
}


Ajax.getSessionId = function() {
    var sessionId = localStorage.getItem("sessionId");
    if (sessionId == null || sessionId.length < 2 || sessionId == "") {
         return 0;
    }
    return sessionId;
}


// 0 non-existant, 10 anonymous (not obligated to allow anon users),
// 11 *was* logged in and now logged out i.e. expired sessipon etc .., 20 unverified email, 30 verified email.
// 40 verified via some social login but email is still mandatory stored in database.
// 50 and higher, different more advanced forms of verification
// store this state in the first digit of your session.
Ajax.getSessionState = function() {
    var sessionId = localStorage.getItem("sessionId");
    if (sessionId == null) {
         return 0;
    }
    var s = sessionId.substr(0,2);
    if (s == null || s == "" || isNaN(s)) {
        return 0;
    }
    return parseInt(s);
}

Ajax.setSessionId = function(data,id) {
    if (data != null && (typeof data == "object") && "sessionId" in data) {
        window.localStorage.setItem("sessionId", data.sessionId);
        document.cookie = ("sessionId="+data.sessionId);

    }
    else if (typeof data == "string") {
        window.localStorage.setItem("sessionId", data); // client can set the sessionId just to erase it to a logged-out state ie "11"
        document.cookie = ("sessionId="+data);
    }
    else if (id != undefined) {
        window.localStorage.setItem("sessionId", id);
        document.cookie = ("sessionId="+id);
    }
}

    /*  set all cookies coming back from server  via data.setCookie and data.deleteCookie strings   Multuiple cookies are separated by the "|" string
        @param str - the setCookies name/value pairs
        Note:  call setCookie on each and let that method deal with it.  It could use localStorage or defer
        to the  webview java, however, if the WEbview were doing its job then this method would not be needed
        as the cookie would already be set!
        // example format of set-cookie header:  vl_sessionId=deleted; expires=Thu,01-Jan-1970 00:00:01 GMT
        // DONT FORGET - THIS METHOD MUST DELETE THE SETCOOKIE COOKIE AFTER SETTING THE COOKIE (ie setting local storage)
    */
    Ajax.setCookiesFromServerResponse = function(data) {
        var cookies;
        if (typeof data == "object") {
            if (!("setCookie" in data)) {
                return;
            }
            cookies = data.setCookie.split("|");
        }
        else if (typeof data == "string") {
            if (Utils.isEmpty(data)) {
                return;
            }
            cookies = data.split("|");
        }
        //alert("ajax.setCookiesFromServerResponse() setCookie"+data.setCookie);
        //scan through all set-cookies posted from server
        var curCookie;
        var i;
        // alert(Utils.toString(cookies));
        for (i in cookies) {
            curCookie = cookies[i];
            if (Utils.isEmpty(curCookie)) {
                continue;
            }
            // alert("ajax.setCookiesFromServerResponse() curCookie"+curCookie);
            var arr = curCookie.split(";");
            var key;
            var pos;
            var name;
            for (key in arr) {
                str = arr[key];
                pos = str.indexOf("=");
                if (pos == -1) {
                    continue;
                }
                name =  str.substr(0,pos);  name = name.trim();
                val = str.substr(pos+1); val = val.trim();
                if (val == "deleted" || val == "delete") {
                    deleteCookieActual(name);
                }
                else if (name == "vlvlclientCookies") {
                    deleteCookieActual(name);
                }
                 else if (val == "expires") {
                    // ignore value for now
                }
                else {
                  // alert("ajax.setCookiesFromServerResponse()  printCookies:"+printCookies()+" name:"+name+" val:"+val);
                  setCookieActual(name,val);
                }
                //var res =  window.plugins.childBrowser.getCookie("vl_sessionId");
                //alert("setCookiesFromServerResponse() vl_sessionId from webview: "+res);
            }
        }
        // deleteCookieActual("setCookie");
    };

function Ajax(callback) {


    var that = this;
    var abortTimerId = 0;
    var silent = false;
    var isOpen = false;
    var persistent = false;
     // let another request get sent while one is pending,  the ready state can change on several pending requests, no problem
     // as we ignore all callback except valid anyway!  We will handle packetId caching ourselves to determine what to process
    var supercede = true;
    // If ignoreOldResponse is true, ONLY responses later than the last received response are handled. aborted response packets may stil need procesing
    // as the action may still have ben executed at the server,  now we got it back, subclass must decide if it will process it using
    // processAbortedResponse()
    var ignoreOldResponse = false;

    this.totalRequests = 0;
    this.ajaxWrapper = new Array();
    this.params = new Object();
    this.callbackObject = "";
    this.callbackData = null;
    if (callback == undefined) {
        this.callbackObject = new AjaxCallback(); // a local wrapper only
    }
    else if (callback instanceof Stateable) {
        this.callbackObject = callback;
        // for state-based object on callback html events like onClick() uses as in:
        // Stateable.callMethod($objectId,\"actionSelectorEvent\",2,this)
    }
    else {
        this.callbackObject = new AjaxCallback(callback);   // just a function call, no state
    }
    var cb = this.callbackObject; // the callback we actually use, may change during a send with some other priority specified callback
    this.resetParams = function() {this.params = new Array();};
    this.setSilent = function(s) {
        silent = s;
    };
    this.setSupercede = function(a) {
        supercede = a;
    };
    this.setPersistent = function(p) {
        persistent = p;
    };
    this.getSilent = function() {
        return silent;
    };

    if (window.XMLHttpRequest != undefined) {
        this.ajaxWrapper["ajaxObject"] = new XMLHttpRequest();
        try {
            this.ajaxWrapper["ajaxObject"].overrideMimeType("application/json");
        }
        catch (e) {
            // alert(e.description);
        }
    }
    else {
        try {
            this.ajaxWrapper["ajaxObject"] = new ActiveXObject("MSXML2.XMLHTTP.3.0");
        }
        catch (e) {
            try {
                this.ajaxWrapper["ajaxObject"] = new ActiveXObject("Microsoft.XMLHTTP");
             }
             catch (ex) {
                 return;
             }
        }
    }
    //if (callbackFunctionName == undefined) {
    //     // leave it undefined
    //}
    //else {
    //   this.ajaxWrapper["callbackFunctionName"] = callbackFunctionName;
    //}



    // fill that.params["piggies"] with an objectId array as objectId*action*arg,objectId*action*arg etc...
    this.refreshPiggies = function() { // remove piggies not found in stored and get the piggies into params
           that.params["piggies"] = "";
           Ajax.piggiesLocked = true;
           //alert(that.params["piggies"]+Utils.toString(Ajax.piggiesArr));
           for (var objectId in Ajax.piggiesArr) {
                  if (!Stateable.getById(objectId)) {
                      delete(Ajax.piggiesArr[objectId]);
                  }
                  else {
                      that.params["piggies"] += ( (("piggies" in that.params) && !Utils.isEmpty(that.params["piggies"])) ? "*" : "");
                      that.params["piggies"] += objectId +','+ Ajax.piggiesArr[objectId];
                  }
           }
           Ajax.piggiesLocked = false;
    }

    this.ajaxWrapper["ajaxObject"].onreadystatechange = function() {that.callback();};

    // if params is null, then that.params (that you set before this call) is preserved.  otherwise, if params are passed - that.params is erased and only what is passed this time is used
    // plus internal params sessionId and packetId. param Object must be a serializable or it is ignored.
    this.send = function(targetUrl,paramObject,params,defaultCallbackObject) {
           if (Ajax.locked) {
               return;
           }
           // WARNING! ALWAYS reset the params object manually if you reuse an Ajax object!  (multi refresh with heavy params ajax provides the luxury and danger of stored params!)
           // still it is a security risk not to ensure it is clear if reusing.  In fact, one shoudl not have to resue and Ajax ever.  If one is outstadning and it is reused to send
           // packetid would be changed and old Ajax coming back might be ignored - which may  or may not be a good thing - decide carefully.
           if (params != undefined && (params instanceof Object) ) {
               that.params = new Object();
           }
           else {
              params = new Object();
           }

          // the registered auto post global parameters

          // most of these should not be used at server for security reasons, but it saves a lot of time on lookups to use these global client-passed values so we use them except in critical writes
          // for example a product order will not happen unless server confirms that place is public -
          // Similarly, any admin changes use passed placeId but confirming that session user is an administrator of the place first
          // params["sessionId"] = sessionId;
          params["version"] = "KenGen210";
          // params["uid"] = uid;  // <== necessary so sessions.php can call changeUid if uid is different than what facebook presents in additional post data
          params["sessionId"] = Ajax.getSessionId();  // in case clearSession() is called just before async. send, we still have it here. That can happen on logout()
          params["domain"] = document.domain; // whatever the user typed in.  Ony needed when doing an FB login request so new token so redirect URL is the sameas what user typed in.
          // alert("ajax.send() uid:"+uid+" fbid:"+fbid+"   COOKIES:"+getCookie("sessionId")+getCookie("uid")+getCookie("fbid"));
          setTimeout(function() {that.sendAsync(targetUrl,params,paramObject,defaultCallbackObject);},100);
    }

    this.addParams = function(params) {
         for (var i in params) {
            that.params[i] = params[i];
         }
    }

    this.sendAsync = function(targetUrl,params,paramObject,defaultCallbackObject) {
                  // ignore this request if former requests > MAX_REQUESTS (a request times out and decreases totalRequests after MAX_REQUEST_TIME
                  if (that.totalRequests > Ajax.MAX_REQUESTS) { //  || (that.params["packetId"] != undefined && Ajax.pending(that.params["packetId"]))) {
                       return;
                  }
                  if (Ajax.disabled) {
                      return;
                  }

                  // ajaxObject["responseType"] = "JSON";
                  that.addParams(params);

                  var ser = "";
                  if (paramObject != undefined && (paramObject instanceof Serializable)) {
                      //paramObject.addToParams(that.params);
                      ser = paramObject.serialize();
                      that.params["serializedObject"] = ser;
                      // alert(ser.substr(0,200) + "\n" + ser.substr(200,200) + "\n" + ser.substr(400,200) + "\n" + ser.substr(600,200) + "\n" + ser.substr(800,200) + "\n" + ser.substr(1000,200) + "\n");
                      if (paramObject instanceof Stateable && (defaultCallbackObject == undefined || !defaultCallbackObject)) {
                          cb = paramObject;
                      }
                      else if (defaultCallbackObject == undefined || !(defaultCallbackObject instanceof Stateable) ){
                          cb = that.callbackObject;
                      }
                      else {
                          cb = defaultCallbackObject;
                      }
                  }
                  else if (paramObject != undefined && (paramObject instanceof AjaxCallback || (paramObject instanceof Object && "act" in paramObject))) {
                      cb = paramObject;   // some object with an act() method
                  }
                  else {
                      cb = that.callbackObject; // as defined upon creation of this ajaxObject
                  }



                  that.params["timeID"] = (new Date()).getTime();
                  if (that.params["type"] == "refresh") {
                      that.refreshPiggies(); // fill that.params["piggies"] with an objectId array as objectId*action*arg,objectId*action*arg etc...
                  }

                  targetUrl = targetUrl; //  + GET; // + "?"+paramString;   // session vars will only be in GET if sesion exists and hence we will not pass with requireLogin = 1

                  if (that.params["type"] != undefined && that.params["type"] != "refresh") {
                      that.params["lastType"] = that.params["type"];
                  }
                  // Is there still a pending request?  (silent mode can send requests multiple times while one is still pending - like refresh may do - or postMessage
                  //if (Ajax.getPacket(that.params["packetId"])) {
                      //if (!supercede) {
                          //var d = new Dialog();
                          //d.showMessage("Request Pending","Please wait. A request is pending.","Ok");
                          //return;
                      //}
                      //else if (supercede) { // if this is VITAL to have the most current update - overide the old request
                          // all are supercede now, let subclass decide if it wants to process response on an old request for example
                      //}
                      //else {
                          // return;
                      //}
                  //}

                  that.params["packetId"] = Ajax.cacheTimer(that) // Ajax.cachePacket(that);  decreases totalRequests after ABORT_TIME seconds

                  // convert params to string of "key1=value1&key2=value2"
                  var paramString = "";
                  for (var key in that.params) {
                      if (paramString == "") {
                          paramString += key + "=" + that.params[key];
                      }
                      else {
                          paramString += "&" + key + "=" + escape(that.params[key]);
                      }
                  }

                  // set isOpen to false if server closed the connection due to idle time or other reasons
                  if (!isOpen) {
                      that.ajaxWrapper["ajaxObject"].open("POST",targetUrl,true);
                      that.ajaxWrapper["ajaxObject"].setRequestHeader("Content-type","application/x-www-form-urlencoded");
                      //that.ajaxWrapper["ajaxObject"].setRequestHeader("Content-length",paramString.length);
                      if (!persistent) {
                          //that.ajaxWrapper["ajaxObject"].setRequestHeader("Connection","close");
                      }
                      else {
                          isOpen = true;
                          that.ajaxWrapper["ajaxObject"].setRequestHeader("Keep-Alive","300");
                          that.ajaxWrapper["ajaxObject"].setRequestHeader("Connection","Keep-Alive");
                      }
                  }
                  else {
                      that.ajaxWrapper["ajaxObject"].open("POST",targetUrl,true);
                      that.ajaxWrapper["ajaxObject"].setRequestHeader("Content-type","application/x-www-form-urlencoded");
                      that.ajaxWrapper["ajaxObject"].setRequestHeader("Content-length",paramString.length);
                      that.ajaxWrapper["ajaxObject"].setRequestHeader("Keep-Alive","300");
                      that.ajaxWrapper["ajaxObject"].setRequestHeader("Connection","Keep-Alive");
                  }
                  //setTimeout("Ajax.packetTimeOutCheck("+that.params["packetId"]+")",Ajax.TIME_TO_ABORT);
                  //alert("uid:"+uid+" fbid:"+fbid+" Cookies before AJAX SEND  UID:"+getCookie("uid")+ " SID:"+getCookie("sessionId")+" FBID:"+getCookie("fbid"));
                  // add cookies (localStorage object) to params
                  //that.setParamsFromLocalStorage();
                  that.ajaxWrapper["ajaxObject"].send(paramString);
                  if (!silent) {
                      that.setMask(true);
                  }
    };

    Ajax.setMaskId = 0;

    // we dont show mask for auto ajax updates except intial ones.  for refresh ajax and ajax with auto in task or without return of such the system will still operate for the user, masks are not shown
    // while action has been deprecated in favor of task["a"] - it still exists in PlaceHistorySelector, so check for it.
    // type should be the type of selector and not denote the task, but certain selectorless ajax origins have only type and for which then the type is the task, generally an auto one.
    this.isAjaxAuto = function() {
         if (typeof cb == "object"  && ("task" in cb)) {
             if (("auto" in cb.task) || (("a" in cb.task) && cb.task.a.toLowerCase().indexOf("auto") != -1) ) {
                 return true;
             }
         }
         if ("action" in that.params && that.params["action"].toLowerCase().indexOf("refresh") != -1) {
             return true;
         }
         if (that.params["type"] == undefined) {
             return false;
         }
         if (that.params["type"] == "initFriends"  || that.params["type"] == "init" || that.params["type"] == "update") {  //  || that.params["type"] == "teleport"
             return true;
         }
         if (that.params["type"] == "status" || that.params["type"] == "refresh" || that.params["type"].toLowerCase().indexOf("auto") != -1) {
             return true;
         }
         return false;
    }

    // later match up to packetId in case old one comes back after timeout and user tried again before old one comes back and old one comes back before new one does - may still want to keep shield on in that case.
    this.setMask = function(on,auto,infinite) {
          // for now no mask ever
          return;
          if (that.isAjaxAuto()) {
              return;
          }
          Ajax.setMask(on,auto,infinite);
    };

    this.callback = function() {
                        // set isOpen to false if server closed the connection due to idle time or other reasons
                        if (that.ajaxWrapper["ajaxObject"].readyState == 4 && that.ajaxWrapper["ajaxObject"].status == 200) {
                            //if  (lastTimeSessionCleared > that.params["timeID"]) {
                            //     clearSession("ajax");    // if session was cleared AFTER this ajax was sent - then the session should REMAIN cleared - do NOT accept any cookies from this ajax
                            // }
                            //alert("2 " + that.params["type"]);

                            try {
                                if ( !("responseText" in that.ajaxWrapper["ajaxObject"])  || (that.ajaxWrapper["ajaxObject"].responseText == "") ) {
                                    that.callbackData = null;
                                }
                                else {
                                    // if  (lastTimeSessionCleared <= that.params["timeID"]) {
                                        // that.setCookiesFromServerResponse(that.ajaxWrapper["ajaxObject"].getResponseHeader("Set-Cookie"));
                                    // }
                                    that.callbackData = new Function("return " + that.ajaxWrapper["ajaxObject"].responseText + ";")();
                                    if ( (typeof that.callbackData == "object") && ("packetId" in that.callbackData) ) {
                                        Ajax.clearTimer(that,that.callbackData.packetId);  // also decrements totalRequests
                                    }
                                }
                                //if (that.callbackData.ignore != undefined && that.callbackData.ignore == 1) {
                                //     return;
                                //}

                                if (that.callbackData != null && (typeof that.callbackData == "object")) {
                                     // COOKIES first - check that sessionId is valid before set cookies although delete cookies can happen anytime
                                     //Ajax.setCookiesFromServerResponse(that.callbackData);
                                     // no more cookies,  all user state is defined in a window stored session variable.
                                     Ajax.setSessionId(that.callbackData);
                                     if ("redirect" in that.callbackData) {
                                         that.setMask(false);
                                         document.body.unonload = "";
                                         window.location = that.callbackData.redirect;
                                         that.callbackData = null;
                                         return;
                                     }
                                }
                                // ERROR HANDLING FIRST did we get an error in the response that we need to supercede any action here
                                // if so, reset ALL navs and bring up appropriate dialog to the user
                                //if (!ajaxServerErrorCheck(that.callbackData,(that.ajaxWrapper["callbackFunctionName"] != undefined ? that.ajaxWrapper["callbackFunctionName"] : ""))) { // if true, clears session and presents dialog to redirect to introSelector upon OK
                                //    if (that.ajaxWrapper["callbackFunctionName"] != undefined && that.ajaxWrapper["callbackFunctionName"] != "") {
                                //        window[that.ajaxWrapper["callbackFunctionName"]](that.callbackData);
                                //    }
                                //}
                                if (Ajax.globalServerErrorHandler(that.callbackData,cb)) { // <-- in most cases you should NOT overwrite local handlers ability to handle its own errors.
                                    that.callbackData  = null;
                                    that.setMask(false);
                                    return;
                                }
                                if (!cb.serverErrorCheck(that.callbackData)) { // if true, clears session and presents dialog to redirect to introSelector upon OK

                                    // cb.getName() DO THE ACT in a timeout because any error that happens now is no longer part of the ajax - so should NOT be caught here!
                                    setTimeout(function() {that.act()},100);  // act then clear the data

                                }
                                else {
                                    // any hard errors found, reset navBar so all navItems are accessible again
                                    that.setMask(false);
                                }
                            }
                            catch (err) {
                                that.setMask(false);
                                // cb.aborted(); let timeout handle the error as we cannot know which request this was for the moment as we reuse the xmlObject
                                var len = that.ajaxWrapper["ajaxObject"].responseText.length > 2000 ? 2000 : that.ajaxWrapper["ajaxObject"].responseText.length;
                                var str = that.ajaxWrapper["ajaxObject"].responseText;
                                if (!that.isRefresh() && !that.isAjaxAuto()) {
                                   // reset navbar so all buttons work
                                    // navBarReset();
                                    // unlock Ajax
                                    Ajax.unlock();
                                    var d = new Dialog();
                                    // d.setConfirm(function(){ if (Utils.isEmpty(uid)) {sleepMode("loggedOut");} });
                                    d.showMessage("Ajax callback error", "There was an error processing your request.  Please try again later.  cbName:" + cb.getName() + "  error:"+err.toString() + " Rcvd. data:" + str.substr(0,len),"ok");
                                    // alert("callback() Error: cbName:" + cb.getName() + "  error:"+err.toString() + " Rcvd. data:" + str.substr(0,len));
                                }
                                // setStatusArea("callbck Err: callbackfunctionName:" + ajaxWrapper["callbackFunctionName"] + err.toString());
                            }
                            // that.ajaxWrapper["ajaxObject"].responseText = null;  // clear the repsonse
                            // callBack object can now be released, and GCd if not used elsewhere - not sure though
                            // as paradigm may allow reuse of this ajax WITH the callback in the future
                            // for now the cb object or function must be included in the send - if there is one.
                            // ok check the id of what is returned successfully and clear the ajaxAngel list item corresponding to this unique AJAX ID and
                            //callbackData = eval("(" + ajaxObject.responseText + ")");   // <== WARNING!  TO DO change to a json string to array parser
                        }
                    };


                     // DO THE ACT
                    this.act = function() {
                         that.setMask(false);
                         if (("cbCodeAjaxINTRPT" in that.params) && !Utils.isEmpty(that.params["cbCodeAjaxINTRPT"])) {   // a server-added callback code snippet in this request at level of Ajax
                             try {
                               eval(that.params["cbCodeAjaxINTRPT"]);
                             }
                             catch (e) {
                               alert(e.toString());
                             }
                             // alert(that.params["cbCodeAjaxINTRPT"]);
                             that.params["cbCodeAjaxINTRPT"] = null;
                             delete that.params["cbCodeAjaxINTRPT"];
                         }
                         else {
                             cb.act(that.callbackData);
                         }
                         that.actPiggies(that.callbackData);
                         that.callbackData = null;
                    };

                    this.isRefresh = function() {
                        if ( ("type" in that.params) && that.params["type"] == "refresh") {
                            return true;
                        }
                        if ( ("action" in that.params) && that.params["action"].indexOf("refresh") > -1) {
                            return true;
                        }
                        return false;
                    }

                    this.actPiggies = function(data) {
                           var id;
                           if ("piggies" in data) {
                               var piggies = data.piggies;
                               for (var i in piggies) {  // key is "A"+objectId
                                    if (i.indexOf("A") == 0) {
                                       id = i.substr(1);
                                       //alert(id);
                                       Stateable.piggyAct(id,piggies[i]);
                                    }
                               }
                           }
                    };






                  /*
                      set all cookies coming back from server with the set-cookie command
                      @param str - the setCookies name/value pairs
                      Note:  call setCookie on each and let that method deal with it.  It could use localStorage or defer
                      to the  webview java, however, if the WEbview were doing its job then this method would not be needed
                      as the cookie would already be set!
                      // example format of set-cookie header:  vl_sessionId=deleted; expires=Thu,01-Jan-1970 00:00:01 GMT
                  */
                  /**
                  this.oldSetCookiesFromServerResponse = function(str) {
                      if (str == undefined || !str || str=="" || Utils.isEmpty(str)) {
                          return;
                      }
                      alert("ajax.setCookiesFromServerResponse() "+str);
                      //scan through all set-cookies posted from server
                      var cookies = str.split(",");
                      var curCookie;
                      var i;
                      for (i in cookies) {
                          curCookie = cookies[i];
                          alert("ajax.setCookiesFromServerResponse() curCookie"+curCookie);
                          var arr = curCookie.split(";");
                          var key;
                          var pos;
                          var name;
                          for (key in arr) {
                              str = arr[key];
                              pos = str.indexOf("=");
                              if (pos == -1) {
                                  continue;
                              }
                              name =  str.substr(0,pos);  name = name.trim();
                              val = str.substr(pos+1); val = val.trim();
                              if (val == "deleted" || val == "delete") {
                                  deleteCookieActual(name);
                              }
                              else if (val == "expires") {
                                  // ignore value for now
                              }
                              else {
                                // alert("ajax.setCookiesFromServerResponse()  printCookies:"+printCookies()+" name:"+name+" val:"+val);
                                setCookieActual(name,val);
                              }
                              //var res =  window.plugins.childBrowser.getCookie("vl_sessionId");
                              //alert("setCookiesFromServerResponse() vl_sessionId from webview: "+res);
                          }
                      }
                  };    */

                  // phoneGap does not allow control of cookies, (adding to and removal of) directly in javascript. While we could link to the webView java method
                  // cookieManager - a move to localStorage may be better so the cookie is sent in the params.
                  // CURRENTLY not used in favor of setCookie and getCookie using plugin
                  this.setParamsFromLocalStorage = function() {

                  }


}; // END Ajax class


 function ajaxGet(ajaxObject,targetUrl) {  // for iframe
    // convert params to string of "key1=value1&key2=value2"
    // targetUrl = targetUrl + GET;// + "?"+paramString;   // session vars will only be in GET if sesion exists and hence we will not pass with requireLogin = 1
    ajaxObject.open("GET",targetUrl,true);
    ajaxObject.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    ajaxObject.setRequestHeader("Connection","close");
    //alert(paramString + " " + GET);
    ajaxObject.send(null);
    //ajaxObject.send(paramString);
}


// TO DO: an ajaxAngel is a method that corresponds to a sent Ajax that is assumed dead - ie did not return from the call in x seconds.
// The method is like the callbackFunction for "dead" ajax requests.
// The function must receive parameters sufficient to allow it to:
// a)  clear any radar/waiting icons associated with the ajax angelType and reset any navIds associated with the type and
//     to allow the user to initiate another request by performing part a).
// b)  assume that the "dead" ajax still may return but have the senses to decide whether to ignore it - i
//     For example, kill it for real if another of the same type has been initiated. - or let it continue anyway, as the use case may warrant.
// c)  To do this,  all objects, like icons and navbar elements should be able to implement an interface called ajaxAngelListener
//
//  The master ajaxAngelScanner should be called every 2 seconds or so to check the list for "dead" ajax requests.
//  The dialogWaiting flag should be deprecated as we move to this system, as many ajax requests can be initiated asyncronously.
//  Rather, desired hold mechanisms should be by disabling the initiating button until either the angel is called or the ajax returns normally.
// To do this the angel mechnism is designed to give the angelMethod the ajaxRequest
// the method decides whether to retry or let the user decide whether to retry in a popup message that may bery well get overwritten by a dialog representing
// the late returning ajax as it mnay not have truly been dead.
//   a) any late returning IDs with type corresponding to from being allowed to execute
//1)  scan the list of:
//       AJAX ID     ajaxAngelFunctionName
// This mechanism will allow for updating the Internet Status checker to use this mechanism instead to update the status of the auto refresh Ajax's sent every few seconds.
// The list could grow from refreshes when none return, but "dead" and successful refreshes will delete from the list.
// the ajaxAngelScanner should pass to the child ajaxAngel, information on EVERY "dead" or "alive" ajax of the same type as te=he "dead" ajax.
// so the ajaxAngel() has the ability to remove or act based on the receiveTime of the last *received* ajax of the same angelType.
function ajaxAngel() {

}

Ajax.ajaxDialog = new Ajax(); // use this when passing your own callback object many times and you dont want the params inside to change - or create your own.

module.exports = Ajax
