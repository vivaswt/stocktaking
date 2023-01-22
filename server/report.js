const { PDFDocument } = require("pdf-lib");
const { readFile } = require('node:fs/promises');
const fontkit = require('@pdf-lib/fontkit');
const path = require('path');

async function createPDF(stockType, stocks, reportYM) {
    const formPdfBytes = await readFile(
        path.resolve(__dirname, stockType === 'wip' ? 'wip.pdf' : 'product.pdf'));
    const pdfDoc = await PDFDocument.create();
    const [form] = await pdfDoc.embedPdf(formPdfBytes);
    let page;
    pdfDoc.registerFontkit(fontkit);
    const fontBytes = await readFile(path.resolve(__dirname, 'GenShinGothic-Monospace-Normal.ttf'));
    const font = await pdfDoc.embedFont(fontBytes, { subset: true });

    stocks.forEach((stock, index) => {
        const maxLine = 27;
        const indexInPage = index % maxLine;
        const pageNumber = Math.floor(index / maxLine) + 1;
        const maxPage = Math.floor((stocks.length - 1) / maxLine) + 1;

        // At new page
        if (indexInPage === 0) {
            page = pdfDoc.addPage();
            page.drawPage(form);

            page.drawText(reportYM.month.toString().padStart(2), {
                x: stockType === 'wip' ? 148 : 158,
                y: 713,
                size: 20,
                font: font
            });

            page.drawText(`${pageNumber}/${maxPage}`, {
                x: 483,
                y: 759,
                size: 12,
                font: font
            });

            const reportDate = new Date(reportYM.year, reportYM.month, 0);

            page.drawText(reportDate.getFullYear().toString(), {
                x: 408,
                y: 745,
                size: 12,
                font: font
            });
            page.drawText((reportDate.getMonth() + 1).toString().padStart(2), {
                x: 447,
                y: 745,
                size: 12,
                font: font
            });
            page.drawText(reportDate.getDate().toString().padStart(2), {
                x: 476,
                y: 745,
                size: 12,
                font: font
            });

        }

        page.drawText(stock.material, {
            x: 58,
            y: 663 - 20.4 * indexInPage,
            size: 12,
            font: font
        });
        page.drawText(stock.width.toString().padStart(4, ' '), {
            x: 259,
            y: 663 - 20.4 * indexInPage,
            size: 12,
            font: font
        });
        page.drawText(stock.lot, {
            x: 333.2,
            y: 663 - 20.4 * indexInPage,
            size: 12,
            font: font
        });
        page.drawText(stock.length.toLocaleString().padStart(6), {
            x: 442,
            y: 663 - 20.4 * indexInPage,
            size: 12,
            font: font
        });
        if (stockType === 'wip') {
            page.drawText(stock.code, {
                x: 507,
                y: 663 - 20.4 * indexInPage,
                size: 12,
                font: font
            });
        }
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}

module.exports = createPDF;