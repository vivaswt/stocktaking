const storageKey = 'wipStocks';

function saveWipStocks(stocks) {
    localStorage.setItem(storageKey, JSON.stringify(stocks));
}
function loadWipStocks() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
        return [];
    }
    return JSON.parse(item);
}

export {
    saveWipStocks,
    loadWipStocks
};