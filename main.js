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


        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);

        let importDomainsButton = document.getElementById('importDomainsButton') || document.createElement('button');
        importDomainsButton.id = 'importDomainsButton';
        importDomainsButton.innerText = 'Import domains list';
        importDomainsButton.onclick = () => fileInput.click();
        importDomainsButton.style.margin = '5px 0px 5px 0px';
        document.body.appendChild(importDomainsButton);

        fileInput.addEventListener('change', e => {
            if (e.target.files && e.target.files.length) {
                const reader = new FileReader();
                reader.onload = event => {
                    let domains = JSON.parse(event.target.result);
                    for (let domain of domains) {
                        localStorage.setItem(domain, true);
                        updateDomainsList();
                        updateState();
                        chrome.tabs.getSelected(null, tab => updateBigRedButton(getOrigin(tab.url)));
                        fileInput.value = '';
                    }
                };
                reader.onerror = error => reject(error);
                reader.readAsText(e.target.files[0]);
            }
        });
    });
}

function updateBigRedButton(tabOrigin) {
    bigRedButton.classList.toggle('active', !!localStorage.getItem(tabOrigin));
}

function updateDomainsList() {
    domainsUL.innerHTML = '';
    let domains = getDomains();
    domains.forEach(c => {
        let domainLI = document.createElement('li');
        let domainTextInput = document.createElement('input');
        let domainRemoveButton = document.createElement('a');
        domainTextInput.value = c;
        domainTextInput.setAttribute('old-value', c);
        domainTextInput.addEventListener('change', e => {
            localStorage.removeItem(e.target.getAttribute('old-value'));
            localStorage.setItem(e.target.value, true);
            updateDomainsList();
            updateState();
            chrome.tabs.getSelected(null, tab => updateBigRedButton(getOrigin(tab.url)));
        });

        domainRemoveButton.setAttribute('data-domain', c);
        domainRemoveButton.textContent = '-';
        domainRemoveButton.classList.add('remove-button');
        domainRemoveButton.addEventListener('click', e => {
            localStorage.removeItem(e.target.getAttribute('data-domain'));
            updateDomainsList();
            updateState();
            chrome.tabs.getSelected(null, tab => updateBigRedButton(getOrigin(tab.url)));
        });

        domainLI.appendChild(domainTextInput);
        domainLI.appendChild(domainRemoveButton);
        domainsUL.appendChild(domainLI);
    });
    if (domains.length) {
        let downloadDomainsButton = document.getElementById('downloadDomainsButton') || document.createElement('button');
        downloadDomainsButton.id = 'downloadDomainsButton';
        downloadDomainsButton.innerText = 'Download domains list';
        downloadDomainsButton.onclick = () => {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/text;charset=utf-8,' + encodeURI(JSON.stringify(domains)));
            element.setAttribute('download', 'domains.json');
            element.click();
            element.remove();
        };
        document.body.appendChild(downloadDomainsButton);
    }
    else {
        let downloadDomainsButton = document.getElementById('downloadDomainsButton');
        if (downloadDomainsButton) {
            downloadDomainsButton.remove();
        }
    }
}

init();