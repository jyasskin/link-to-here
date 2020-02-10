var contextMenuId = "link-to-here";

chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.removeAll(function() {
        chrome.contextMenus.create({
            id: contextMenuId,
            title: "Link to Here",
            contexts: [ "page", "frame", "selection", ],
        });
    });
});

function onClickedListener(info, tab) {
    if (info.menuItemId == contextMenuId) {
        chrome.tabs.executeScript(tab.id, {
            file: "findlink.js",
            allFrames: true,
        }, function() {
            chrome.tabs.sendMessage(tab.id, {
                messageId: "contextDetails",
                pageUrl: info.pageUrl,
                frameUrl: info.frameUrl,
            }, function(response) {
                chrome.tabs.update(tab.id, {url: response})

                // Overly complex way to copy the URL to the clipboard:
                var urlTextArea = document.createElement('textarea');
                urlTextArea.value = response;
                document.body.appendChild(urlTextArea);
                urlTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(urlTextArea);
            });
        });
    } else {
        console.log("Unexpected context menu click:", info);
    }
};

chrome.contextMenus.onClicked.addListener(onClickedListener);
