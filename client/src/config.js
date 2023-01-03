const storageKey = 'config';

function saveConfig(config) {
    localStorage.setItem(storageKey, JSON.stringify(config));
}
function loadConfig() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
        return {
            notionToken: ''
        };
    }
    return JSON.parse(item);
}

export {
    saveConfig,
    loadConfig
};