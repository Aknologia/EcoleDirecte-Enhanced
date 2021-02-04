setTimeout(() => {
    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('type', 'text/css');
    style.setAttribute(
        'href',
        'chrome-extension://{{EXT_ID}}/dist/css/darktheme.css'
    );
    document.getElementsByTagName('head')[0].append(style);
    console.log('[EcoleDirecte Enhanced] Loaded DarkTheme');
}, 500);
