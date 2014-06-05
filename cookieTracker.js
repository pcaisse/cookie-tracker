(function() {
    var cookieHistory = [];
    var COOKIE_DIFF_VALUES = {
        added: '+',
        removed: '-',
        modified: '*'
    };
    function getCookieObj(cookieStr) {
        var cookieObj = {};
        var cookies = cookieStr.split(/; /);
        var cookieParts, key, val;
        for (var i = 0, l = cookies.length; i < l; i++) {
            cookieParts = cookies[i].split('=');
            key = cookieParts[0];
            val = cookieParts[1];
            cookieObj[key] = val;
        }
        return cookieObj;
    }
    function getObjDiff(obj1, obj2) {
        var diff = {};
        var added;
        var removed;
        var modified;
        for (var p in obj1) {
            if (obj1.hasOwnProperty(p)) {
                for (var pp in obj2) {
                    if (obj2.hasOwnProperty(pp)) {
                        if (obj1.hasOwnProperty(pp) && obj2.hasOwnProperty(p)) {
                            // Property exists in both.
                            // Compare value.
                            if (obj1[p] !== obj2[p]) {
                                // Value has changed.
                                modified = modified || {};
                                modified[p] = obj2[p];
                            }
                        } else if (!obj1.hasOwnProperty(pp)) {
                            // Property added.
                            added = added || {};
                            added[pp] = obj2[pp];
                        }
                    }
                }
                if (!obj2.hasOwnProperty(p)) {
                    // Property removed.
                    removed = removed || {};
                    removed[p] = obj1[p];
                }
            }
        }
        if (!added && !removed && !modified) {
            return null;
        }
        if (added) {
            diff[COOKIE_DIFF_VALUES.added] = added;
        }
        if (removed) {
            diff[COOKIE_DIFF_VALUES.removed] = removed;
        }
        if (modified) {
            diff[COOKIE_DIFF_VALUES.modified] = modified;
        }
        return diff;
    }
    function listenCookieChange(callback) {
        var latestDiff;
        setInterval(function() {
            cookieHistory.push(getCookieObj(document.cookie));
            if (cookieHistory.length > 1) {
                // We enough cookie objects to do a diff.
                latestDiff = getObjDiff(cookieHistory[cookieHistory.length - 2], cookieHistory[cookieHistory.length - 1]);
                if (latestDiff) {
                    callback(latestDiff);
                }
            }
        }, 100);
    }
    listenCookieChange(function(diff) {
        console.log('*** COOKIE CHANGE ***');
        console.log(diff);
    });
})();
