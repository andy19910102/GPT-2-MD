chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.download) {
        chrome.downloads.download(request.download);
    }
});
