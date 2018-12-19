let bigRedButton = null;
let domainsUL = null;

function init() {
    document.addEventListener('DOMContentLoaded', () => {
        bigRedButton = document.getElementById('bigRedButton');

        chrome.tabs.getSelected(null, tab => updateBigRedButton(getOrigin(tab.url)));

        bigRedButton.onclick = () => {
            chrome.tabs.getSelected(null, tab => {
                let tabOrigin = getOrigin(tab.url);

                if (!!localStorage.getItem(tabOrigin))
                    localStorage.removeItem(tabOrigin);
                else localStorage.setItem(tabOrigin, true);

                updateBigRedButton(tabOrigin);
                updateState();
                updateDomainsList();
            });
        };
        updateState();

        domainsUL = document.getElementById('domainsUL');

        updateDomainsList();
    });
}

function updateBigRedButton(tabOrigin) {
    bigRedButton.classList.toggle('active', !!localStorage.getItem(tabOrigin));
}

function updateDomainsList() {
    domainsUL.innerHTML = '';
    getDomains().forEach(c => {
        let domainLI = document.createElement('li');
        let domainText = document.createElement('a');
        let domainRemoveButton = document.createElement('a');
        domainText.textContent = `*.${c}/*`;
        domainRemoveButton.setAttribute('data-domain', c);
        domainRemoveButton.textContent = '-';
        domainRemoveButton.classList.add('remove-button');
        domainRemoveButton.addEventListener('click', e => {
            localStorage.removeItem(e.target.getAttribute('data-domain'));
            updateDomainsList();
            updateState();
            chrome.tabs.getSelected(null, tab => updateBigRedButton(getOrigin(tab.url)));
        });

        domainLI.appendChild(domainText);
        domainLI.appendChild(domainRemoveButton);
        domainsUL.appendChild(domainLI);
    });
}

init();