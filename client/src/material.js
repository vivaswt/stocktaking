import axios from 'axios'
import { loadConfig } from './config';

const storageKey = 'materials';

function saveMaterials(materials) {
    localStorage.setItem(storageKey, JSON.stringify(materials));
}
function loadMaterials() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
        return [];
    }
    return JSON.parse(item);
}

function downloadMaterials() {
    const token = loadConfig().notionToken;

    return new Promise((resolve, reject) => {
        axios.post('/api/materials', { responseType: 'json', token: token })
            .then(r => {
                saveMaterials(r.data);
                resolve(r.data);
            })
            .catch(e => reject(e));
    });
}

export {
    saveMaterials,
    loadMaterials,
    downloadMaterials
};