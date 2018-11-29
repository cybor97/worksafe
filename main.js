let bigRedButton = null;

function init() {
    setTimeout(() => {
        bigRedButton = document.getElementById('bigRedButton');
        updateBigRedButtonState();
        bigRedButton.onclick = () => {
            if (!!localStorage.getItem('hiding'))
                localStorage.removeItem('hiding');
            else localStorage.setItem('hiding', true);

            updateBigRedButtonState();

            chrome.tabs.query({}, tabs => tabs.forEach(doWork));
            chrome.tabs.onCreated = doWork;
        }
    }, 1);
}

function updateBigRedButtonState() {
    bigRedButton.classList.toggle('active', !!localStorage.getItem('hiding'));
}

function doWork(tab) {
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

init();