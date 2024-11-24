// background.js for AbuseIPDB Firefox Extension

// Create the context menu when the extension is installed or updated
browser.runtime.onInstalled.addListener(() => {
    createContextMenu();
    console.log("Extension installed or updated. Context menu created.");
});

// Handle re-creating the context menu if needed
browser.runtime.onStartup.addListener(() => {
    createContextMenu();
    console.log("Extension started. Context menu created.");
});

// Function to create context menu
function createContextMenu() {
    browser.contextMenus.removeAll(() => {
        browser.contextMenus.create({
            "id": "AbuseIPDB",
            "title": "Check on AbuseIPDB",
            "contexts": ["selection", "link"]
        });
    });
}

// Listen to click, create URL from selection
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "AbuseIPDB") {
        var selection = String(info.selectionText).trim();
        if (selection) {
            var url = "https://www.abuseipdb.com/check/" + selection;

            // Query current tab index, create new tab at current index + 1
            browser.tabs.query({
                active: true, currentWindow: true
            }, tabs => {
                let index = tabs[0].index;
                browser.tabs.create({ index: index + 1, url: url });
                console.log("New tab created with URL:", url);
            });
        } else {
            console.log("No valid selection to check.");
        }
    }
});
