function init() {
    chrome.tabs.onCreated.addListener(updateState);
    chrome.tabs.onActivated.addListener(updateState);
    chrome.tabs.onUpdated.addListener(updateState);
    updateState();
}

function updateState() {
    chrome.tabs.query({}, tabs => tabs.forEach(doWork));
}

function doWork(tab) {
    if (tab && tab.url) {
        let tabOrigin = getOrigin(tab.url);

        if (!/^chrome:\/\//.exec(tab.url)) {
            let hiding = !!localStorage.getItem(tabOrigin);
            chrome.tabs.executeScript(tab.id, {
                code: `(${hiding => {
                    document.body.classList.toggle('worksafe-hidden', hiding);
                }})(${hiding});`
            });
        }
    }
    else {
        console.error('Tab was null or undefined!');
    }
}

function getOrigin(hRef) {
    console.log(hRef);
    return new URL(hRef).origin.match(/(\w*\.\w*)$/)[1];
}

//Just a C-style coding. I CANNOT JUST PUT CODE IN FILE WITHOUT A FUNCTION!!!
init();