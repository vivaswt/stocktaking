function defaultMaterials() {
    const result = [
        {material: 'SP-8LKアオ(HGN11A)', code: 1},
        {material: 'SP-8Kアオ(HGN7)', code: 1},
        {material: 'SP-8Kアオ(HGN7)12R', code: 1},
        {material: 'SP-8Kアオ(HGN7)KUFゲンシ', code: 1},
        {material: 'SP-8Kアオ(HGN7)WT4(6.1R)', code: 1},
        {material: 'SP-8Kアオ(HGN7)WT4(12.2R)', code: 1},
        {material: 'KA-4GシロB', code: 1},
        {material: 'SP-8Eアオ(N6)', code: 1},
        {material: 'SP-ESFR78(N67)', code: 1},
        {material: 'SP-8Eアイボリー(N6)', code: 1},
        {material: 'SP-8Eアイボリー(N6)セマハバ', code: 1},
        {material: 'SP-8Eアイボリー(N6)9R', code: 1},
        {material: 'SP-4BCマルミズ', code: 1},
        {material: 'SP-4BCマルミズ(エージング)', code: 1},
        {material: 'SP-7Kアサギ(HGN7)(3%)', code: 1},
        {material: 'SP-7Kシロ(HGN7)(3%)', code: 1},
        {material: 'SP-7Kチャ', code: 1},
        {material: 'SP-8EAアイボリー', code: 1},
        {material: 'SP-8EBアイボリー', code: 1},
        {material: 'SP-8Eシロ', code: 1},
        {material: 'SP-8Eシロ(N6)', code: 1},
        {material: 'SP-8Eシロ(N6)セマハバ', code: 1},
        {material: 'SP-8KFアオ(L)ウチマキ', code: 1},
      ];

      let code = 1;
      for (const r of result) {
        r.code = code++;
      }

      return result.sort((a, b) => a.material.localeCompare(b.material));    
}

const storageKey = 'materials';

function saveMaterials(materials) {
    localStorage.setItem(storageKey, JSON.stringify(materials));
}
function loadMaterials() {
    const item = localStorage.getItem(storageKey);
    if (!item) {
        return defaultMaterials();
    }
    return JSON.parse(item);
}

export {
    saveMaterials,
    loadMaterials
};