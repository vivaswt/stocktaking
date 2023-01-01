import { Collapse, Fab, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditStockDialog from "./EditStockDialog";
import { useEffect, useRef, useState } from "react";
import { loadStocks, saveStocks } from "./stock";
import PictureAsPdf from '@mui/icons-material/PictureAsPdf';

function StockForm() {
    const [stocks, setStocks] = useState(loadStocks());
    const insertedStockId = useRef();

    useEffect(() => {
        const stocksToSave = stocks.filter(s => !s.deleted);
        saveStocks(stocksToSave);
    }, [stocks]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState('insert');
    const [inputStock, setInputStock] =
        useState({ id: crypto.randomUUID(), material: '', width: '', lot: '', length: '', code: '', deleted: false });

    const handleInsertClick = () => {
        setEditMode('insert');
        setInputStock({ id: crypto.randomUUID(), material: '', width: '', lot: '', length: '', code: '', deleted: false });
        setDialogOpen(true);
    };

    const handleUpdateClick = (id) => {
        const stock = stocks.filter(s => s.id === id)[0];

        setInputStock({ ...stock });
        setEditMode('update');
        setDialogOpen(true);
    };

    const handleDeleteClick = (id) => {
        const newStocks = stocks.map(s => {
            if (s.id === id) {
                return { ...s, deleted: true };
            } else {
                return { ...s };
            }
        });
        setStocks(newStocks);
    };

    const handleInsert = (stock) => {
        const newStock = {
            id: stocks.length + 1,
            ...stock
        };

        insertedStockId.current = newStock.id;
        setStocks([...(stocks.map(s => { return { ...s } })), newStock]);
        setDialogOpen(false);
    };

    const handleUpdate = (stock) => {
        const newStocks = stocks.map(s => {
            if (s.id === stock.id) {
                return { ...stock };
            } else {
                return { ...s };
            }
        });
        setStocks(newStocks);

        setDialogOpen(false);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const dataForm = useRef();

    const handlePDFClick = () => {
        dataForm.current.submit();
    }

    const stocksToJSON = (stocks) => {
        return JSON.stringify(stocks.filter(s => !s.deleted));
    }

    const listItems = stocks.map(s => (
        <Collapse in={!s.deleted} key={s.id}>
            <StockListItem
                stock={s}
                handleDeleteClick={handleDeleteClick}
                handleUpdateClick={handleUpdateClick}
                shouldScrollTo={insertedStockId.current === s.id}
            />
        </Collapse>
    ));

    return (
        <div>
            <Fab
                color="primary"
                style={{ position: 'fixed', right: '2em', bottom: '2em' }}
                onClick={handleInsertClick}
            >
                <AddIcon />
            </Fab>

            <IconButton onClick={handlePDFClick}>
                <PictureAsPdf />
            </IconButton>

            {dialogOpen ? (
                <EditStockDialog
                    stock={inputStock}
                    open={dialogOpen}
                    mode={editMode}
                    handleInsert={handleInsert}
                    handleUpdate={handleUpdate}
                    handleClose={handleDialogClose}
                />
            ) : ''}

            <List>
                {listItems}
            </List>
            <DataForm
                formRef={dataForm}
                value={stocksToJSON(stocks)}
            />
        </div>
    );
}

function StockItem({ stock }) {
    const materialStyle = {
        display: 'inline-block', width: '20em'
    };
    const widthStyle = {
        display: 'inline-block', width: '5em', textAlign: 'right'
    };
    const lotStyle = {
        display: 'inline-block', width: '8em'
    };
    const lengthStyle = {
        display: 'inline-block', width: '6em', textAlign: 'right'
    };

    return (
        <span>
            <span style={materialStyle}>
                {stock.material}
            </span>
            <span style={widthStyle}>
                {`${stock.width}巾　`}
            </span>
            <span style={lotStyle}>
                {stock.lot}
            </span>
            <span style={lengthStyle}>
                {`${stock.length.toLocaleString()}m　`}
            </span>
            <span>
                {stock.code}
            </span>
        </span>
    );
}

function StockListItem({ stock, handleDeleteClick, handleUpdateClick, shouldScrollTo }) {
    const ref = useRef();

    useEffect(() => {
        shouldScrollTo && ref.current.scrollIntoView(false);
    }, [shouldScrollTo]);

    return (
        <ListItem
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => handleDeleteClick(stock.id)}
                >
                    <DeleteIcon />
                </IconButton>
            }
            disablePadding
            ref={ref}
        >
            <ListItemButton
                onClick={() => handleUpdateClick(stock.id)}
            >
                <ListItemText>
                    <StockItem stock={stock} />
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
}

function DataForm({ formRef, value }) {
    return (
        <form
            ref={formRef}
            action="/api/pdf"
            method="post"
            target="_blank"
        >
            <input
                name="stocks"
                type="hidden"
                value={value}
            />
        </form>
    );
}
export default StockForm;