import StockForm from "./StockForm";
import { saveWipStocks, loadWipStocks } from './wipStock';

const stockType = {
    title: '在庫証明書(仕掛品)',
    save: saveWipStocks,
    load: loadWipStocks,
    pdfApi: '/api/pdf/wip'
};

function WipStockForm({ onMenuChange }) {
    return (
        <StockForm
            stockType={stockType}
            onMenuChange={onMenuChange}
        />
    );
}

export default WipStockForm;