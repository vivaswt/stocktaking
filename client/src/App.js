import { useState } from 'react';
import ConfigForm from './ConfigForm';
import MaterialForm from './MaterialForm';
import WipStockForm from './WipStockForm';
import ProductStockForm from "./ProductStockForm";

function App() {
  const [menu, setMenu] = useState(1);
  
  return (
    <div>
      {menu === 1 && <WipStockForm onMenuChange={setMenu} />}
      {menu === 2 && <ProductStockForm onMenuChange={setMenu} />}
      {menu === 3 && <MaterialForm onMenuChange={setMenu} />}
      {menu === 4 && <ConfigForm onMenuChange={setMenu} />}
    </div>
  );
}

export default App;
