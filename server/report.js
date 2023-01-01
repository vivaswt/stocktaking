const {PDFDocument} = require("pdf-lib");
const { readFile } = require('node:fs/promises');
const  fontkit = require('@pdf-lib/fontkit');
const path = require('path');

async function createPDF(stocks) {
    const formPdfBytes = await readFile(path.resolve(__dirname, 'wip.pdf'));
    const pdfDoc = await PDFDocument.create();
    const [form] = await pdfDoc.embedPdf(formPdfBytes);
    const page = await pdfDoc.addPage();
    page.drawPage(form);
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await readFile(path.resolve(__dirname, 'GenShinGothic-Monospace-Normal.ttf'));
    const font = await pdfDoc.embedFont(fontBytes, {subset: true});
    
    stocks.forEach((stock, index) => {
        page.drawText(stock.material, {
            x: 58,
            y: 663 - 20.4 * index,
            size: 12,
            font: font
        });
        page.drawText(stock.width.toString().padStart(4, ' '), {
            x: 259,
            y: 663 - 20.4 * index,
            size: 12,
            font: font
        });            
        page.drawText(stock.lot, {
            x: 333.2,
            y: 663 - 20.4 * index,
            size: 12,
            font: font
        });
        page.drawText(stock.length.toLocaleString().padStart(6), {
            x: 442,
            y: 663 - 20.4 * index,
            size: 12,
            font: font
        });
        page.drawText(stock.code, {
            x: 507,
            y: 663 - 20.4 * index,
            size: 12,
            font: font
        });
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;    
}

module.exports = createPDF;