chrome.storage.sync.get('ecoledirecte_active', function (data) {
    if (data.ecoledirecte_active)
        document.addEventListener('DOMContentLoaded', load());
});

const FEATURES = ['average', 'darktheme'];

function load() {
    FEATURES.forEach((feature) => {
        chrome.storage.sync.get(`ecoledirecte_settings`, function (data) {
            if (data[`ecoledirecte_settings`][feature]) addScript(feature);
        });
    });
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
