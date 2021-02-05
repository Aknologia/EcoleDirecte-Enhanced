chrome.storage.sync.get('ecoledirecte_active', function (data) {
    if (data.ecoledirecte_active)
        document.addEventListener('DOMContentLoaded', load());
});

let features = {
    average: {},
    darktheme: {},
};

function load() {
    addEnv();
    Object.keys(features).forEach((feature) => {
        chrome.storage.sync.get(`ecoledirecte_settings`, function (data) {
            if (data[`ecoledirecte_settings`][feature]) addScript(feature);
        });
    });
    console.log('[EcoleDirecte Enhanced] Loaded Modules');
}

function addScript(name) {
    const script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute(
        'src',
        chrome.extension.getURL(`dist/scripts/features/${name}.js`)
    );
    const head =
        document.head ||
        document.getElementsByTagName('head')[0] ||
        document.documentElement;
    head.insertBefore(script, head.lastChild);
}

function addEnv() {
    let extID = document.createElement('meta');
    extID.name = 'extID';
    extID.content = chrome.runtime.id;
    const head =
        document.head ||
        document.getElementsByTagName('head')[0] ||
        document.documentElement;
    head.appendChild(extID);
    console.log('[EcoleDirecte Enhanced] Loaded .env Variables');
}
