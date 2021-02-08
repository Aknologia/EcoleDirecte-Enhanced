document.addEventListener('DOMContentLoaded', onInit, false);

function onInit() {
    loadBasic();
    let container = document.getElementById('features');
    Object.keys(features).forEach((feature) => {
        let obj = features[feature];

        let li = document.createElement('li');
        let label = document.createElement('label');
        let input = document.createElement('input');

        input.setAttribute('type', 'checkbox');
        input.id = feature;

        label.append(input);
        label.append(' ' + chrome.i18n.getMessage(feature));
        li.append(label);

        if (obj.beta) label.setAttribute('data-beta', true);

        container.append(li);
        input.addEventListener('click', (e) => handleCheckbox(e.target));

        chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
            if (data[`ecoledirecte_settings`][feature]) input.checked = true;
        });
    });

    setTimeout(checkSelectAll, 200);
}

function check(v) {
    if (v.checked) return true;
    else return false;
}

function handleCheckbox(cb) {
    console.log(check(cb));
    chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
        let obj = data.ecoledirecte_settings;
        obj[cb.id] = check(cb);
        chrome.storage.sync.set({ ecoledirecte_settings: obj });
        reloadTab();
        checkSelectAll();
    });
}

function reloadTab() {
    chrome.storage.sync.get(['ecoledirecte_settings'], function (data) {
        if (data.ecoledirecte_settings.autorefresh) {
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
    active.addEventListener('click', (e) => handleCheckbox(e.target));
    chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
        if (data.ecoledirecte_settings.active) active.checked = true;
    });

    let autorefresh = document.getElementById('autorefresh');
    autorefresh.parentElement.append(chrome.i18n.getMessage('autorefresh'));
    autorefresh.addEventListener('click', (e) => handleCheckbox(e.target));
    chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
        if (data.ecoledirecte_settings.autorefresh) autorefresh.checked = true;
    });

    let selectall = document.getElementById('selectall');
    selectall.parentElement.append(chrome.i18n.getMessage('selectall'));
    selectall.addEventListener('click', (e) => handleSelectAll(e.target));
}

let features = {
    darktheme: {},
    average: {},
    ranks: { beta: true },
    appreciation: {},
    graphiques: {},
    notes: { beta: true },
    competences: {},
    coefficients: {},
    devoirs: {},
};

function checkSelectAll() {
    let fEl = document.getElementById('features');
    let childs = Array.from(fEl.childNodes);
    let count = 0;
    childs.forEach((child) => {
        let input = child.firstElementChild.firstElementChild;
        console.log(input.checked);
        if (input.checked) count++;
    });
    console.log(count, childs.length);

    let selectEl = document.getElementById('selectall');
    if (count == childs.length) selectEl.checked = true;
    else selectEl.checked = false;
}

function handleSelectAll(selectEl) {
    let checked = !selectEl.checked;
    let fEl = document.getElementById('features');
    let set = true;
    if (checked) set = false;
    let timeout = 0;
    chrome.storage.sync.get([`ecoledirecte_settings`], function (data) {
        Array.from(fEl.childNodes).forEach((child) => {
            let input = child.firstElementChild.firstElementChild;
            input.checked = set;
            setTimeout(() => {
                console.log(data.ecoledirecte_settings);
                let obj = data.ecoledirecte_settings;
                obj[input.id] = check(input);
                chrome.storage.sync.set({ ecoledirecte_settings: obj });
                if ((timeout = (fEl.childNodes.length - 1) * 50)) reloadTab();
            }, timeout);
            timeout += 50;
        });
    });
}
