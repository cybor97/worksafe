function init() {
    chrome.tabs.onCreated.addListener(updateState);
    chrome.tabs.onActivated.addListener(updateState);
    chrome.tabs.onUpdated.addListener(updateState);
    updateState();
}

//Just a C-style coding. I CANNOT JUST PUT CODE IN FILE WITHOUT A FUNCTION!!!
init();