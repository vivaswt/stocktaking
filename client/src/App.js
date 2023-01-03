import { useState } from 'react';
import ConfigForm from './ConfigForm';
import StockForm from './StockForm';
import MaterialForm from './MaterialForm';

function App() {
  const [menu, setMenu] = useState(1);
  
  return (
    <div>
      {menu === 1 && <StockForm onMenuChange={setMenu} />}
      {menu === 2 && <MaterialForm onMenuChange={setMenu} />}
      {menu === 3 && <ConfigForm onMenuChange={setMenu} />}
    </div>
  );
}

export default App;
