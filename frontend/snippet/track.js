(function () {
    'use strict';

    var nfaId;

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

    function track (cid) {
        return function (ev) {
            if (ev.clientX) { // non-human click
                var target = ev.target;
                console.log({
                    url:    'localhost:8080/click',
                    method: 'POST',
                    body:   {
                        cid:     cid,
                        nfa_id:  nfaId,
                        url:     location.href,
                        bookmarklet: false,
                        payload: {
                            target: target.outerHTML,
                            attrs:  getAttributes(target.attributes)
                        }
                    }
                });
                request({
                    url:    'http://localhost:4000/click',
                    method: 'POST',
                    body:   {
                        cid:     cid,
                        nfa_id:  nfaId,
                        url:     location.href,
                        bookmarklet: false,
                        payload: {
                            target: target.outerHTML,
                            attrs:  getAttributes(target.attributes)
                        }
                    }
                });
            }
        }
    }

    window.NFA = {
        init: function (userId) {
            var uuid = readCookie('nfa') || guid();
            writeCookie('nfa', uuid);

            nfaId = userId;
            document.onclick = track(uuid);
        }
    };
}());
