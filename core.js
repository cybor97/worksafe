function updateState() {
    chrome.tabs.query({}, tabs => tabs.forEach(doWork));
}

function doWork(tab) {
    let tabOrigin = null;
    if (tab && tab.url && (tabOrigin = getOrigin(tab.url))) {
        if (!/^chrome:\/\//.exec(tab.url) && !/chrome\.google\.com/.exec(tab.url)) {
            let hiding = !!localStorage.getItem(tabOrigin);
            chrome.tabs.executeScript(tab.id, {
                code: `(${hiding => {
                    document.body.classList.toggle('worksafe-hidden', hiding);
                }})(${hiding});`
            });
        }
    }
}

function getOrigin(hRef) {
    //FIXME: should be language-independed
    return new URL(hRef).origin.toLowerCase().match(/([a-zа-я0-9]*\.[a-zа-я0-9]*)$/)[1];
}