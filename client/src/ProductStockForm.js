import StockForm from "./StockForm";
import { saveProductStocks, loadProductStocks } from './productStock';

const stockType = {
    title: '在庫証明書(製品)',
    save: saveProductStocks,
    load: loadProductStocks,
    pdfApi: '/api/pdf/product'
};

function ProductStockForm({ onMenuChange }) {
    return (
        <StockForm
            stockType={stockType}
            onMenuChange={onMenuChange}
        />
    );
}

export default ProductStockForm;