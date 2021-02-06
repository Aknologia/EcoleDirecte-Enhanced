let features = JSON.parse(getMeta('requestFeatures'));
let settings = JSON.parse(getMeta('EDE_Settings'));

function getMeta(metaName) {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }

    return '';
}

var foo = window.XMLHttpRequest.prototype.open,
    bar = window.XMLHttpRequest.prototype.send;
/**
 * Replace XMLHttp request open method
 * @param {string} method - HTTP Method
 * @param {string} url - HTTP Request URL
 * @param {bool} async - is aSync
 * @param {string} user - Username
 * @param {string} password - Password
 */
function XMLOpenReplacement(method, url, async, user, password) {
    this._url = url;
    return foo.apply(this, arguments);
}

/**
 * Replace XMLHttp request send method
 * @param {*} data - Data sent
 */
function XMLSendReplacement(data) {
    if (this.onreadystatechange) {
        this._onreadystatechange = this.onreadystatechange;
    }

    this.onreadystatechange = e_onReadyStateChange;
    return bar.apply(this, arguments);
}

/** Replacing default onReadyStateChange hooked event */
function e_onReadyStateChange() {
    if (this.readyState == 4 && this._url.includes('notes.awp')) {
        let jsonRes = JSON.parse(this.response);
        try {
            Object.keys(features).forEach((feature) => {
                if (settings[feature]) {
                    features[feature].path.forEach(
                        (path) => (jsonRes.data.parametrage[path] = true)
                    );
                    if (features[feature].unset)
                        features[feature].unset.forEach(
                            (path) => (jsonRes.data.parametrage[path] = false)
                        );
                }
            });
        } catch (err) {}
        Object.defineProperty(this, 'response', {
            value: JSON.stringify(jsonRes),
            writable: false,
        });
        console.log('[EcoleDirecte Enhanced] Loaded Parameters');
    }

    if (this._onreadystatechange) {
        return this._onreadystatechange.apply(this, arguments);
    }
}

window.XMLHttpRequest.prototype.open = XMLOpenReplacement;
window.XMLHttpRequest.prototype.send = XMLSendReplacement;
