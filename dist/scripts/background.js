chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        ecoledirecte_settings: {
            active: true,
            autorefresh: true,
            average: true,
        },
    });
});
