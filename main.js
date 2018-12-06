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

init();