const {Client} = require('@notionhq/client');

class NotionApi {
    #notion;
    #relationValueCache;

    constructor(token) {
        this.#notion = new Client({
            auth: token
        });

        this.#relationValueCache = new Map();
    }

    queryDatabase(params, map) {
        return this.#queryPages(params)
            .then(records => {
                return this.#parsePropertiesOfRecords(records, map);
            });
    }

    #queryPages(params) {
        return this.#notion.databases.query(params)
            .then(pages => {
                const records = pages.results.map(p => p.properties);

                if (!pages.has_more) return records;

                return this.#queryPages(
                    { ...params, start_cursor: pages.next_cursor })
                    .then(moreRecords => {
                        return [...records, ...moreRecords];
                    });
            });
    }

    #parsePropertiesOfRecords(records, map) {
        const parsePropertiesOfRecord = (record) => {
            const result = [];  // [Promise<propName:value>]

            map.forEach((to, from) => {
                result.push(propToKeyValue(to, record[from]));
            });

            return Promise.all(result)
                .then(pairs => pairs.reduce(toAssosiative));
        };

        const propToKeyValue = (key, property) =>
            this.#propertyToJsValue(property)
                .then(value => keyValue(key, value));
        const keyValue = (key, value) => { return { [key]: value } };
        const toAssosiative = (prev, current) => {
            const result = { ...prev, ...current };
            return result;
        };

        return Promise.all(records.map(parsePropertiesOfRecord));
    }

    /**
     * Notion Property Valueをjsの値に変換する
     * @param {*} property notion property object
     * @returns {Promise} jsでのプロパティの値
     *  【注意1】Notionに値が設定されていない場合の挙動は以下の通り
     *  number -> 0
     *  select -> ''
     *  date -> null
     *  text, title -> ''
     *  relation -> '' (参照先のタイトルは文字列という想定)
     * 【注意2】
     *  relationは最初の１件しか取得対象としない
     */
    #propertyToJsValue(property) {
        switch (property.type) {
            case 'number':
                return Promise.resolve(property.number ?? 0);
            case 'select':
                return Promise.resolve(property.select ? property.select.name : '');
            case 'checkbox':
                return Promise.resolve(property.checkbox);
            case 'date':
                return Promise.resolve(property.date ? new Date(property.date.start) : null);
            case 'rich_text':
                return Promise.resolve(property.rich_text.reduce((prev, current) => prev + current.plain_text, ''));
            case 'title':
                return Promise.resolve(property.title.reduce((prev, current) => prev + current.plain_text, ''));
            //return Promise.resolve(property.title.plain_text);
            case 'relation':
                if (property.relation.length === 0) return Promise.resolve('');

                return this.#lookupRelationTitle(property.relation[0]);
            default:
                return Promise.reject('unknown property type in Notion page');
        }
    }

    #lookupRelationTitle(relation) {
        if (this.#relationValueCache.has(relation.id)) {
            return Promise.resolve(this.#relationValueCache.get(relation.id));
        }

        return this.#notion.pages.properties
            .retrieve({ page_id: relation.id, property_id: 'title' })
            .then(({ results, ...others }) => {
                const text = results[0].title.plain_text;
                this.#relationValueCache.set(relation.id, text);
                return text;
            });
    }
}

module.exports.NotionApi = NotionApi;