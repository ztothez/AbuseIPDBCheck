// Function to extract the domain from URL (removes protocol, "www.", and paths)
function getDomainFromURL(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
    return url.split('/')[0];  // Extracts domain before any path
}

// Validate if the selection is a valid IP address or domain
function isValidIPorDomain(selection) {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;  // Matches standard domain format
    return ipPattern.test(selection) || domainPattern.test(selection);
}

// Create context menu when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    createContextMenu();
});

// Create context menu
function createContextMenu() {
    chrome.contextMenus.removeAll(() => {
        chrome.contextMenus.create({
            id: "AbuseIPDB",
            title: "Check on AbuseIPDB",
            contexts: ["selection", "link"]
        });
    });
}

// Listen to context menu click and perform AbuseIPDB lookup
chrome.contextMenus.onClicked.addListener((info) => {
    let selection = String(info.selectionText || info.linkUrl).trim();
    
    // Extract domain if selection is a URL
    if (selection.startsWith("http")) {
        selection = getDomainFromURL(selection);
    }

    // Validate and check selection on AbuseIPDB if valid
    if (selection && isValidIPorDomain(selection)) {
        const url = `https://www.abuseipdb.com/check/${selection}`;
        chrome.tabs.create({ url });
    } else {
        // Notify user if the selection is invalid
        chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icon48.png",
            title: "Invalid Selection",
            message: "Please select a valid IP address or domain to check on AbuseIPDB."
        });
    }
});
