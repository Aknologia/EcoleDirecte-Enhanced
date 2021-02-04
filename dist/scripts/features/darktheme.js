'use strict';

let style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('type', 'text/css');
style.setAttribute(
    'href',
    `chrome-extension://${getMeta('extID')}/dist/css/darktheme.css`
);
document.getElementsByTagName('head')[0].append(style);
console.log('[EcoleDirecte Enhanced] Loaded DarkTheme');

function getMeta(metaName) {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === metaName) {
            return metas[i].getAttribute('content');
        }
    }

    return '';
}
