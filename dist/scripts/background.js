chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({ecoledirecte_active: true})
  chrome.storage.sync.set({ecoledirecte_moy: true})
  chrome.storage.sync.set({ecoledirecte_moycls: false})
});
let cooldown = false;
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(tab.url.startsWith('https://www.ecoledirecte.com/Eleves/') && tab.url.endsWith('/Notes') && !cooldown){
    chrome.tabs.executeScript(tabId, {code: 'window.location.reload();'});
    cooldown = true;
    setTimeout(() => {cooldown = false}, 2000);
  }
})