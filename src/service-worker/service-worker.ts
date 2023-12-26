
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.set({ panelOpen: false });
});

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.windows.create({
        url: './src/pop-up/popup.html',
        type: 'popup',
        width: 400,
        height: 200
      });
    }
  });