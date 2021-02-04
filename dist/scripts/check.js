document.addEventListener('DOMContentLoaded', onInit, false);
const FEATURES = ['average', 'darktheme'];

function onInit() {
    loadBasic();
    let container = document.getElementById('container');
    let elem = document.getElementById('features');
    FEATURES.forEach((feature) => {
        let label = document.createElement('label');
        let input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.id = feature;
        label.append(input);
        label.append(' ' + chrome.i18n.getMessage(feature));
        container.insertBefore(label, elem.nextSibling);
        elem = label;
        input.addEventListener('click', (e) => handleCheckbox(e.target));
        chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
            if (data[`ecoledirecte_settings`][feature]) input.checked = true;
        });
    });
}

function check(v) {
    if (v.checked) return true;
    else return false;
}

function handleCheckbox(cb) {
    chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
        let obj = data.ecoledirecte_settings;
        obj[cb.id] = check(cb);
        console.log(obj);
        chrome.storage.sync.set({ ecoledirecte_settings: obj });
        reloadTab();
    });
}

function reloadTab() {
    chrome.storage.sync.get(['ecoledirecte_autorefresh'], function (data) {
        if (data.ecoledirecte_autorefresh) {
            chrome.tabs.query(
                { active: true, lastFocusedWindow: true },
                (tabs) => {
                    var tab = tabs[0];
                    if (
                        tab &&
                        tab.url.startsWith('https://www.ecoledirecte.com/')
                    ) {
                        if (data)
                            chrome.tabs.executeScript(tab.id, {
                                code: 'window.location.reload();',
                            });
                    }
                }
            );
        }
    });
}

function loadBasic() {
    document.getElementById(
        'container'
    ).firstElementChild.textContent = chrome.i18n.getMessage('popupTitle');

    let active = document.getElementById('active');
    active.parentElement.append(chrome.i18n.getMessage('active'));
    chrome.storage.sync.get([`ecoledirecte_active`], function (data) {
        if (data[`ecoledirecte_active`]) active.checked = true;
    });
    let autorefresh = document.getElementById('autorefresh');
    autorefresh.parentElement.append(chrome.i18n.getMessage('autorefresh'));
    chrome.storage.sync.get([`ecoledirecte_autorefresh`], function (data) {
        if (data[`ecoledirecte_autorefresh`]) autorefresh.checked = true;
    });
}

function getURL(path) {
    return chrome.extension.getURL(path);
}
