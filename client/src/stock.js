const storageKey = 'stocks';

function saveStocks(stocks) {
    localStorage.setItem(storageKey, JSON.stringify(stocks));
}
function loadStocks() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
        return [];
    }
    return JSON.parse(item);
}

export {
    saveStocks,
    loadStocks
};