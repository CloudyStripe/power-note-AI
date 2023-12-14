
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ panelOpen: false });
});