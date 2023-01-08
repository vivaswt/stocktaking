const storageKey = 'productStocks';

function saveProductStocks(stocks) {
    localStorage.setItem(storageKey, JSON.stringify(stocks));
}
function loadProductStocks() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
        return [];
    }
    return JSON.parse(item);
}

export {
    saveProductStocks,
    loadProductStocks
};