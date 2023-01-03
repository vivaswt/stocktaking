const { Client } = require('@notionhq/client');

function downloadMaterials(token) {
    const getTitlePropertyValue = (page, name) => {
        if (!page.properties[name]) return '';
        if (!page.properties[name].title[0]) return '';
        return page.properties[name].title[0].plain_text;
    };

    const getRichTextPropertyValue = (page, name) => {
        if (!page.properties[name]) return '';
        if (!page.properties[name].rich_text[0]) return '';
        return page.properties[name].rich_text[0].plain_text;
    };

    const notion = new Client({
        auth: token
    });

    const databaseId = '43561683c2d846f09c1b71ea13e5b1db';

    return new Promise((resolve, reject) => {
        notion.databases.query({ database_id: databaseId })
            .then(response =>
                Promise.all(response.results.map(
                    page => notion.pages.retrieve({ page_id: page.id }))))
            .then(pageResponses =>
                pageResponses.map(pr => ({
                    material: getTitlePropertyValue(pr, '品名'),
                    code: getRichTextPropertyValue(pr, '製品コード')
                }))
            ).then(materials => {
                resolve(materials.sort((a, b) => a.material.localeCompare(b.material)));
            }).catch(e => {
                reject(e);
            });
    });
}

module.exports = downloadMaterials;