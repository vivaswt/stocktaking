const { NotionApi } = require('./notionAPIBridge.js');

const databaseId = {
    productRecord: 'f0bb03319a66498a850655cac183d8be',
    material: '43561683c2d846f09c1b71ea13e5b1db'
};

function downloadProductRecordsByDate(token, date) {
    const filter = {
        property: '作業日',
        date: {
            'equals': dateToString(date)
        }
    };
    const sorts = [{
        property: '製品ロールNo.',
        direction: 'ascending'
    }];
    const params = {
        database_id: databaseId.productRecord,
        filter: filter,
        sorts: sorts
    };
    const map = propertyMapOfProductFinishRecord()
    const notion = new NotionApi(token);

    return notion.queryDatabase(params, map)
        .then(expandProductRecordsWithNumber);
}

function expandProductRecordsWithNumber(records) {
    const result = [];

    for (const record of records) {
        if (record.number <= 1) {
            result.push(record);
            continue;
        }

        const exp = /^(?<main>[A-Za-z0-9]{7}-)(?<seq>\d{3})/;
        const found = record.lot.match(exp);
        if (!found) {
            result.push(record);
            continue;
        }

        for (let i = 0; i < record.number; i++) {
            const newRecord = {
                ...record,
                lot: found.groups.main
                    + (parseInt(found.groups.seq) + i)
                        .toString().padStart(3, '0'),
                number: 1
            };
            result.push(newRecord);
        }
    }

    return result;
}

function propertyMapOfProductFinishRecord() {
    const map = new Map();
    map.set('作業日', 'workingDate');
    map.set('製品ロールNo.', 'lot');
    map.set('品名', 'material');
    map.set('巾', 'width');
    map.set('製品m', 'length');
    map.set('本数', 'number');
    map.set('仕上区分', 'finishClass');
    map.set('担当', 'person');
    map.set('仕掛品', 'wip');
    return map;
}

function downloadMaterials(token) {
    const sorts = [{
        property: '品名',
        direction: 'ascending'
    }];
    const params = {
        database_id: databaseId.material,
        sorts: sorts
    };
    const map = propertyMapOfMaterial()
    const notion = new NotionApi(token);
    return notion.queryDatabase(params, map);
}

function propertyMapOfMaterial() {
    const map = new Map();
    map.set('品名', 'material');
    map.set('製品コード', 'code');
    return map;
}

function dateToString(date) {
    return date.getFullYear().toString()
        + '-' + (date.getMonth() + 1).toString().padStart(2, '0')
        + '-' + date.getDate().toString().padStart(2, '0');

}

module.exports = {
    downloadMaterials,
    downloadProductRecordsByDate
};

