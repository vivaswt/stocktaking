import React, { useRef, useState } from 'react';
import StockForm from './StockForm';

function App() {
  const list = [
    { id: 1, material: 'SP-8LKアオ(HGN11A)', width: 1000, length: 8250, lot: 'XXXXXXX-005', code: 12345, delete: false },
    { id: 2, material: 'SP-8Kアオ(HGN7)KUFゲンシ', width: 1040, length: 12500, lot: 'XXXXXXX-006', code: 32345, delete: false },
    { id: 3, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 4, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 5, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 6, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 7, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 8, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 9, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 10, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false },
    { id: 11, material: 'SP-8Kアオ(HGN7)WT4(12.2R)', width: 1120, length: 7870, lot: 'XXXXXXX-007', code: 59211, delete: false }
  ];

  const [stocks, setStocks] = useState(list);
  const appendedStockId = useRef();

  const appendStock = stock => {
    const newStock = {
      id: stocks.length + 1,
      ...stock
    };

    appendedStockId.current = newStock.id;
    setStocks([...(stocks.map(s => { return { ...s } })), newStock]);
  }

  const updateStock = stock => {
    const newStocks = stocks.map(s => {
      if (s.id === stock.id) {
        return { ...stock };
      } else {
        return { ...s };
      }
    });
    setStocks(newStocks);
  }

  const deleteStock = stock => {
    const newStocks = stocks.map(s => {
      if (s.id === stock.id) {
        return { ...s, deleted: true };
      } else {
        return { ...s };
      }
    });
    setStocks(newStocks);
  }
  return (
    <StockForm
      stocks={stocks}
      onAppendStock={appendStock}
      onUpdateStock={updateStock}
      onDeleteStock={deleteStock}
      shouldScrollId={appendedStockId.current}
    />
  );
}


export default App;
