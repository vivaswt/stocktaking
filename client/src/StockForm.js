import { Collapse, Fab, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditStockDialog from "./EditStockDialog";
import { useEffect, useRef, useState } from "react";

function StockForm({ stocks, onAppendStock, onUpdateStock, onDeleteStock, shouldScrollId }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState('insert');
    const [selectedStock, setSelectedStock] =
        useState({ id: stocks.length + 1, material: '', width: '', lot: '', length: '', code: '', deleted: false });

    const handleAddClicked = () => {
        setEditMode('insert');
        setSelectedStock({ id: stocks.length + 1, material: '', width: '', lot: '', length: '', code: '', deleted: false });
        setDialogOpen(true);
    };

    const handleEditClicked = (id) => {
        const stock = stocks.filter(s => s.id === id)[0];

        setSelectedStock({ ...stock });
        setEditMode('update');
        setDialogOpen(true);
    };

    const handleDeleteClicked = (id) => {
        const stock = stocks.filter(s => s.id === id)[0];

        onDeleteStock({ ...stock });
    };

    const handleRegist = (stock) => {
        onAppendStock(stock);
        setDialogOpen(false);
    };

    const handleUpdate = (stock) => {
        onUpdateStock(stock);
        setDialogOpen(false);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const listItems = stocks.map(s => (
        <Collapse in={!s.deleted} key={s.id}>
            <StockListItem
                stock={s}
                handleDeleteClicked={handleDeleteClicked}
                handleEditClicked={handleEditClicked}
                shouldScrollTo={shouldScrollId === s.id}
            />
        </Collapse>
    ));

    return (
        <div>
            <Fab
                color="primary"
                style={{ position: 'fixed', right: '2em', bottom: '2em' }}
                onClick={handleAddClicked}
            >
                <AddIcon />
            </Fab>
            {dialogOpen ? (
                <EditStockDialog
                    stock={selectedStock}
                    open={dialogOpen}
                    mode={editMode}
                    handleRegist={handleRegist}
                    handleUpdate={handleUpdate}
                    handleClose={handleDialogClose}
                />
            ) : ''}
            <List>
                {listItems}
            </List>
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

function StockListItem({ stock, handleDeleteClicked, handleEditClicked, shouldScrollTo }) {
    const ref = useRef();

    useEffect(() => {
        shouldScrollTo && ref.current.scrollIntoView(false);
    }, []);
    
    return (
        <ListItem
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => handleDeleteClicked(stock.id)}
                >
                    <DeleteIcon />
                </IconButton>
            }
            disablePadding
            ref={ref}
        >
            <ListItemButton
                onClick={() => handleEditClicked(stock.id)}
            >
                <ListItemText>
                    <StockItem stock={stock} />
                </ListItemText>
            </ListItemButton>
        </ListItem>
    );
}

export default StockForm;