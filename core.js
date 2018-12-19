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
    let originMatch = new URL(hRef).origin.toLowerCase().match(/([a-zа-я0-9]*\.[a-zа-я0-9]*)$/);
    return originMatch ? originMatch[1] : null;
}

function getDomains() {
    let domains = [];
    for (let i = 0; i < localStorage.length; i++)
        domains.push(localStorage.key(i));
    return domains;
}