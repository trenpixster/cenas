(function (endpoint, nfaKey) {
    'use strict';

    var nfaId;

    function createCORSRequest (method, url) {
        var xhr = new XMLHttpRequest();
        if ('withCredentials' in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest !== 'undefined') {
            xhr = new XDomainRequest();
            xhr.open(method, url);
        } else {
            xhr = null;
        }

        return xhr;
    }

    function makeRequest (data) {
        var xhr = createCORSRequest('POST', endpoint, true);

        if (!xhr) {
            return;
        }

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined);
        xhr = null;
    }

    function sendOrStore (click, data) {
        makeRequest(data); // yaay, them storing
    }

    function checkStorage () {
        var stored = localStorage.getItem(nfaKey);
        if (stored !== null) {
            makeRequest(stored);
            localStorage.removeItem(nfaKey);
        }
    }

    function writeCookie (cname, cvalue, exminutes) {
        var expires, d;
        if (exminutes === null) {
            expires = '';
        } else {
            d = new Date();
            d.setTime(d.getTime() + (exminutes * 60 * 1000));
            expires = 'expires=' + d.toUTCString();
        }

        document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
    }

    function readCookie (cname) {
        var key     = cname + '=',
            cookies = document.cookie.split('; '),
            cookie, i;

        for (i = cookies.length - 1; i >= 0; i--) {
            cookie = cookies[i];
            if (cookie.indexOf(key) === 0) {
                return cookie.substring(key.length, cookie.length);
            }
        }

        return false;
    }

    function s4 () {
        return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
    }

    function guid () {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    function getAttributes (attrs) {
        var i = attrs.length, result = {}, attr;
        while (i--) {
            attr = attrs[i];
            result[attr.name] = attr.value;
        }

        return result;
    }

    function getStyles (el) {
        var css = window.getComputedStyle(el), result = {}, i;
        for (i = 0; i < css.length; i++) {
            result[css[i]] = css.getPropertyValue(css[i]);
        }

        return result;
    }

    function getClickableElement (target) {
        if (target === null || target.id === 'no__fuss__tracker' || target.nodeName === 'BODY') {
            return false;
        }

        if (!target.onclick && target.nodeName !== 'A' && target.nodeName !== 'BUTTON') {
            return getClickableElement(target.parentElement);
        }

        return target;
    }

    function track (target, cid, clickable) {
        sendOrStore(clickable, {
            cid:     cid,
            nfa_id:  nfaId,
            url:     location.href,
            bookmarklet: true,
            payload: {
                target:          target.outerHTML,
                clickableTarget: clickable.outerHTML,
                clickableLink:   clickable.href,
                attrs:           getAttributes(target.attributes),
                styles:          getStyles(target)
            }
        });
        alert("Element tracked, please visit No Fuss Analytics");
    }

    function removeFussBox(){
        var noFussBox = document.getElementById("no__fuss__tracker");
        if(noFussBox) {
            cleanBackground();
            noFussBox.parentNode.removeChild(noFussBox);
        }
    }

    function cleanBackground () {
      var noFussBox = document.getElementById("no__fuss__tracker");
      if(noFussBox && noFussBox.no__fuss__target){
          noFussBox.no__fuss__target.style.backgroundColor = noFussBox.no__fuss__target.oldBg;
      }
    }

    function hover() {
      return function(ev) {
        var target = ev.target,
            clickable = getClickableElement(target);
        if (!clickable) return;
        cleanBackground();
        target.oldBg = target.style.backgroundColor;
        target.style.backgroundColor = "#EEDD00";
        renderBox(target, clickable);
        target.onmouseleave = function() {
            removeFussBox();
        }
      }
    }

    function renderBox(target, clickable) {
      if (document.getElementById("no__fuss__tracker")) {
          return;
      }
      var box = document.createElement("div")
      box.id="no__fuss__tracker"
      box.style.fontFamily="Arial"
      box.style.fontSize="8pt"
      box.style.fontWeight="100"
      box.style.textAlign="center"
      box.style.width="150px"
      box.style.backgroundColor="#004d40"
      box.style.color="#eee"
      box.style.padding="2px"
      box.style.zIndex="9999"
      box.style.cursor="pointer"
      box.no__fuss__target = target;
      var ch1 = document.createElement("div");
      ch1.appendChild(document.createTextNode("Track clicks on this element"));
      var ch2 = document.createElement("div");
      ch2.appendChild(document.createTextNode("via No Fuss Analytics"));
      box.appendChild(ch1);
      box.appendChild(ch2);
      box.onclick = function(ev) {
          var cid = readCookie('nfa') || guid();
          removeFussBox();
          track(target, cid, clickable);
          ev.preventDefault();
      };
      target.appendChild(box);
    }

    window.NFA = {
        init: function (userId) {
            var uuid = readCookie('nfa') || guid();
            writeCookie('nfa', uuid);
            nfaId = userId;
            checkStorage();
            document.onmouseover = hover();
        }
    };
}('//169.45.108.53:8000/click', 'nfa')); window.NFA.init("{{id}}");
