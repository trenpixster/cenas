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
        if (click.href === '#' || click.href === '' || click.target === '_blank') {
            makeRequest(data);
        } else {
            localStorage.setItem(nfaKey, JSON.stringify(data));
        }
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

    function track (cid) {
        return function (ev) {
            if (ev.clientX) { // non-human click
                var target = ev.target,
                    clickableTarget = getClickableElement(target);
                if (clickableTarget !== false) {
                    sendOrStore(clickableTarget, {
                        cid:     cid,
                        nfa_id:  nfaId,
                        url:     location.href,
                        bookmarklet: false,
                        payload: {
                            target:          target.outerHTML,
                            clickableTarget: clickableTarget.outerHTML,
                            clickableLink:   clickableTarget.href,
                            attrs:           getAttributes(target.attributes),
                            styles:          getStyles(target)
                        }
                    });
                }
            }
        }
    }

    window.NFA = {
        init: function (userId) {
            var uuid = readCookie('nfa') || guid();
            writeCookie('nfa', uuid);

            nfaId = userId;
            checkStorage();
            document.onclick = track(uuid);
        }
    };
}('//localhost:4000/click', 'nfa'));
