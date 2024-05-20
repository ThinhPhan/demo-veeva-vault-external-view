/**
* Veeva Vault Javascript Library Generic Approved Viewer
* http://developer.veevavault.com
*
* Copyright 2015, Veeva Systems Inc.
*
* Date: Mon Feb 23 2015 15:34:26
*/
var VV = {
  Viewer: function(divId, params) {
      var container = document.getElementById(divId);
      if (container) {
        var iframe = document.createElement("iframe");
        iframe.frameBorder = 0;
        if (!VV.QS.token) {
          throw "VeevaException: token query string parameter is required";
        }
        if (!params.width || parseInt(params.width) < 320) {
          throw "VeevaException: width parameter is required and has be at least 320";
        }
        iframe.width = params.width + "px";
        if (!params.height) {
          throw "VeevaException: height parameter is required";
        }
        iframe.height = params.height + "px";
        if (!VV.QS.dns) {
          throw "VeevaException: dns query string parameter is required";
        }
        iframe.style.overflow = "hidden";
        iframe.setAttribute("scrolling", "no");
        var src = "https://" + VV.QS.dns + "/ui/approved_viewer?api=true&token=" + VV.QS.token + "&email=" + VV.QS.email + "&orgid=" + VV.QS.orgid + "&height=" + params.height;
        if (VV.QS.metadata === "true") {
          src += "&metadata=true";
        }
            if (params.fit === "height" || params.fit === "width") {
                src += "&fit=" + params.fit;
            }
        if (params.error) {
          src += "&error=" + encodeURIComponent(params.error);
        }
        iframe.setAttribute("src", src);
        container.appendChild(iframe);

        //only applies for mobile Safari
            var handleMessage = function (message) {
                var data = JSON.parse(message.data);
                if (data.type === "veevaDownload") {
                    location.href = data.url;
                }
            };
            if(window.addEventListener){
                window.addEventListener("message", handleMessage);
            }else{
                window.attachEvent("onmessage",handleMessage);
            }
      } else {
          throw "VeevaException: no element with id " + divId + " found";
      }
  },

  QS: function () {
    // This function is anonymous, is executed immediately
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
      // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    }
    return query_string;
  } ()
}

onVeevaVaultIframeAPIReady();
