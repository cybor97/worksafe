let bigRedButton = null;

function init() {
    setTimeout(() => {
        bigRedButton = document.getElementById('bigRedButton');

        chrome.tabs.getSelected(null, tab => {
            bigRedButton.classList.toggle('active', !!localStorage.getItem(getOrigin(tab.url)));
        });

        bigRedButton.onclick = () => {
            chrome.tabs.getSelected(null, tab => {
                let tabOrigin = getOrigin(tab.url);

                if (!!localStorage.getItem(tabOrigin))
                    localStorage.removeItem(tabOrigin);
                else localStorage.setItem(tabOrigin, true);

                bigRedButton.classList.toggle('active', !!localStorage.getItem(tabOrigin));

                updateState();
            });
        };
        updateState();
    }, 1);
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

init();