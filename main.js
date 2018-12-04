let bigRedButton = null;

function init() {
    setTimeout(() => {
        bigRedButton = document.getElementById('bigRedButton');
        updateBigRedButtonState();
        bigRedButton.onclick = updateState;

        chrome.tabs.onCreated.addListener(updateState);
        chrome.tabs.onActivated.addListener(updateState);
    }, 1);
}

function updateState() {
    if (!!localStorage.getItem('hiding'))
        localStorage.removeItem('hiding');
    else localStorage.setItem('hiding', true);

    updateBigRedButtonState();
    chrome.tabs.query({ active: true }, tabs => tabs.forEach(doWork));
}

function updateBigRedButtonState() {
    bigRedButton.classList.toggle('active', !!localStorage.getItem('hiding'));
}

function doWork(tab) {
    if (tab) {
        console.log(tab.url);
        if (!/^chrome:\/\//.exec(tab.url)) {
            let hiding = !!localStorage.getItem('hiding');
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

init();