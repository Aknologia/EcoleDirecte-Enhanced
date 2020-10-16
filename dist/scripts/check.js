document.addEventListener('DOMContentLoaded', onInit, false);
function onInit() {
    let cbs = ['active', 'moy'];
    for(var i = 0; i < cbs.length; i++){
        let cb = cbs[i];
        chrome.storage.sync.get([`ecoledirecte_${document.getElementById(cb).name}`], function(data){if(data[`ecoledirecte_${document.getElementById(cb).name}`]) document.getElementById(cb).checked = true;})
        document.getElementById(cb).addEventListener('click', function(cb){
            handleCheckbox(cb.target);
        })
    } 
}

function check(v){
    if(v.checked) return true;
    else return false;
}
function handleCheckbox(cb){
    switch(cb.name){
        case 'active':
            chrome.storage.sync.set({ecoledirecte_active: check(cb)});
            reloadTab();
            break;
        case 'moy':
            chrome.storage.sync.set({ecoledirecte_moy: check(cb)});
            reloadTab();
            break;
        case 'moycls':
            chrome.storage.sync.set({ecoledirecte_moycls: check(cb)});
            reloadTab();
            break;
    }
}
function reloadTab(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        var tab = tabs[0];
        if(tab.url.startsWith('https://www.ecoledirecte.com/Eleves/') && tab.url.endsWith('/Notes')){
            chrome.tabs.executeScript(tab.id, {code: 'window.location.reload();'});
        }
    })
}