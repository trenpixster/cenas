(function () {
    'use strict';

    var nfaId;
    var counter = 0;

    function noop () {}

    function serializeParams (obj, prefix) {
        var str = [], p, k, v;
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                k = prefix ? prefix + '[' + p + ']' : p;
                v = obj[p];
                str.push(typeof v == 'object' ? serializeParams(v, k) :
                    encodeURIComponent(k) + '=' + encodeURIComponent(v));
            }
        }
        return str.join('&');
    }

    function getUrl (url, params) {
        var serialized = serializeParams(params);
        return serialized === '' ? url : url + '?' + serialized;
    }

    function request (options) {
        var method  = options.method,
            url     = options.url,
            params  = options.params,
            body    = options.body,
            success = options.success || noop,
            fail    = options.fail || noop,
            xhr     = new XMLHttpRequest();

        xhr.open(method, getUrl(url, params), true);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                var message = JSON.parse(this.responseText);
                if (this.status >= 200 && this.status < 400) {
                    success(message);
                } else {
                    fail(message);
                }
            }
        };

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(body ? JSON.stringify(body) : undefined);
        xhr = null;
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

        if (!target.onclick && target.nodeName !== 'A') {
            return getClickableElement(target.parentElement);
        }

        return target;
    }

    function track (target, cid, clickable) {
        request({
            url:    '//trenpixster.ngrok.com/click',
            method: 'POST',
            body:   {
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
            }
        });
        alert("Element tracked, please visit No Fuss Analytics");
    }

    function removeFussBox(){
        console.log("leaving");
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
            document.onmouseover = hover();
        }
    };
}()); window.NFA.init("{{id}}");