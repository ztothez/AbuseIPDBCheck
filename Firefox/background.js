const MENU_ID = "abuseipdb-check-selection";

function buildLookupUrl(raw) {
  const text = (raw || "").trim();
  if (!text) return null;

  // If the user highlights a URL, try to extract hostname/IP.
  // If it’s already an IP/hostname, this still works fine.
  let candidate = text;

  try {
    // Add scheme if missing so URL parsing works
    const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(candidate);
    const url = new URL(hasScheme ? candidate : `http://${candidate}`);
    candidate = url.hostname || candidate;
  } catch (_) {
    // Not a URL; keep as-is (could be IP/hostname)
  }

  return `https://www.abuseipdb.com/check/${encodeURIComponent(candidate)}`;
}

browser.runtime.onInstalled.addListener(() => {
  // (Re)create menu on install/update
  browser.contextMenus.removeAll().catch(() => {}).finally(() => {
    browser.contextMenus.create({
      id: MENU_ID,
      title: "Check on AbuseIPDB",
      contexts: ["selection"]
    });
  });
});

browser.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) return;

  const url = buildLookupUrl(info.selectionText);
  if (!url) return;

  browser.tabs.create({ url });
});
