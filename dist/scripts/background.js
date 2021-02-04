chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({ ecoledirecte_active: true });
    chrome.storage.sync.set({ ecoledirecte_autorefresh: false });
    chrome.storage.sync.set({ ecoledirecte_settings: { darktheme: true } });
});
