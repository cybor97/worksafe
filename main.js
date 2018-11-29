function init() {
    setTimeout(() => {
        document.getElementById('bigRedButton').onclick = onBigRedButtonClick;
    }, 1);
}

function onBigRedButtonClick(e) {
    chrome.tabs.getSelected(null, function (tab) {
        if (!/^chrome:\/\//.exec(tab.url)) {
            chrome.tabs.executeScript({
                code: `(${() => document.body.classList.add('worksafe-hidden')})();`
            });
        }
    });
}

init();