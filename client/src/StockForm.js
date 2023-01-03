import { Collapse, Fab, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, ListItemIcon } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditStockDialog from "./EditStockDialog";
import { useEffect, useRef, useState } from "react";
import { loadStocks, saveStocks } from "./stock";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppMenu from "./AppMenu";

function StockForm({onMenuChange}) {
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
    };

    const stocksToJSON = (stocks) => {
        return JSON.stringify(stocks.filter(s => !s.deleted));
    };

    const deleteAllItem = () => {
        stocks.forEach(s => {
            setStocks(prev => {
                const newStocks = prev.map(prevStock => {
                    if (s.id === prevStock.id) {
                        return { ...prevStock, deleted: true };
                    } else {
                        return { ...prevStock };
                    }
                });
                return newStocks;
            });
        });
    };

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
            <AppMenu
                title="在庫証明書(仕掛品)"
                onMenuChange={onMenuChange}
            >
                <IconButton onClick={handlePDFClick} color="inherit">
                    <PictureAsPdfIcon />
                </IconButton>
                <MoreMenu deleteAllItem={deleteAllItem} />
            </AppMenu>

            <Fab
                color="primary"
                style={{ position: 'fixed', right: '2em', bottom: '2em' }}
                onClick={handleInsertClick}
            >
                <AddIcon />
            </Fab>

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

            <List sx={{marginTop: 8}}>
                {listItems}
            </List>

            <DataForm
                formRef={dataForm}
                stocks={stocksToJSON(stocks)}
                reportYM={JSON.stringify(getReportYM())}
            />
        </div>
    );
}

function getReportYM() {
    const now = new Date();
    if (now.getDate() <= 20) {
        if (now.getMonth() === 0) {
            return {year: now.getFullYear() - 1, month: 12};
        } else {
            return {year: now.getFullYear(), month: now.getMonth()};
        }
    } else {
        return {year: now.getFullYear(), month: now.getMonth + 1};
    }
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

function DataForm({ formRef, stocks, reportYM }) {
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
                value={stocks}
            />
            <input
                name="reportYM"
                type="hidden"
                value={reportYM}
            />
        </form>
    );
}

function MoreMenu({ deleteAllItem }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                color="inherit"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => { handleClose(); deleteAllItem() }}>
                    <ListItemIcon>
                        <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText>
                        全明細削除
                    </ListItemText>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default StockForm;