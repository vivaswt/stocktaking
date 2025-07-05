import { Collapse, Fab, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, Backdrop, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditStockDialog from "./EditStockDialog";
import { useEffect, useRef, useState } from "react";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AppMenu from "./AppMenu";
import QrScanForm from "./QrScanForm";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import 'moment/locale/ja';
import axios from 'axios'
import { loadConfig } from "./config";
import { loadMaterials } from "./material";
import { MessageBar } from "./MessageBar";
import { slideAnimationDuration } from "@mui/x-date-pickers/CalendarPicker/PickersSlideTransition";

function StockForm({ stockType, onMenuChange }) {
    const [stocks, setStocks] = useState(stockType.load());
    const insertedStockId = useRef();

    useEffect(() => {
        const stocksToSave = stocks.filter(s => !s.deleted);
        stockType.save(stocksToSave);
    }, [stocks, stockType]);

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
            ...stock,
            id: crypto.randomUUID()
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

    const [scanOpen, setScanOpen] = useState(false);
    const handleScanClose = () => {
        setScanOpen(false);
    };

    const [importDatePickerOpen, setImportDatePickerOpen] = useState(false);
    const handleImportDatePickerClose = () => {
        setImportDatePickerOpen(false);
    };

    const handleImportClick = () => {
        setImportDatePickerOpen(true);
    };

    const importFromProductRecord = date => {
        const token = loadConfig().notionToken ?? '';
        
        setImportDatePickerOpen(false);
        setOnProcessing(true);

        axios.post(
            '/api/product-records-by-date',
            {
                responseType: 'json',
                token: token,
                date: date
            })
            .then(res => res.data.filter(stockType.importFilter))
            .then(mapProductRecordToStock)
            .then(mergeStocks)
            .then(importedCount => {
                if (importedCount === 0) {
                    setMessageText(`該当する仕上記録がありません`);
                } else {
                    setMessageText(`${importedCount}件の仕上記録をインポートしました`);
                }
                setOnProcessing(false);
                setMessageOpen(true);
            }).catch(e => {
                setOnProcessing(false);
                setMessageText(e.message);
                setMessageOpen(true);
                console.error(e.message);
            });
    };

    const mapProductRecordToStock = records => {
        const materials = loadMaterials();
        const lookupCode = material => {
            const m = materials.find(m => m.material === material);
            return !m ? '' : m.code;
        };

        return records.map(r => {
            return {
                id: crypto.randomUUID(),
                material: r.material,
                width: r.width,
                lot: r.lot,
                length: r.length,
                code: lookupCode(r.material)
            };
        });
    };

    const mergeStocks = stocksToMerge => {
        const duplicateStocks = stocks => stocks.map(s => { return { ...s } });

        stocksToMerge.forEach(stock => {
            insertedStockId.current = stock.id;
            setStocks(prevStocks => [...(duplicateStocks(prevStocks)), stock]);
        });

        return stocksToMerge.length;
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

    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState('');
    const handleMassageClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessageOpen(false);
    };

    const [onProcessing, setOnProcessing] = useState(false);

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

    const countOfStocks = stocks.filter(s => !s.deleted).length;

    return (
        <div>
            <AppMenu
                title={`${stockType.title} - ${countOfStocks}件`}
                onMenuChange={onMenuChange}
            >
                <IconButton onClick={handleInsertClick} color="inherit">
                    <AddCircleIcon />
                </IconButton>
                <IconButton onClick={handleImportClick} color="inherit">
                    <CloudDownloadIcon />
                </IconButton>
                <IconButton onClick={handlePDFClick} color="inherit">
                    <PictureAsPdfIcon />
                </IconButton>
                <MoreMenu deleteAllItem={deleteAllItem} />
            </AppMenu>

            <Fab
                color="primary"
                style={{ position: 'fixed', right: '2em', bottom: '2em' }}
                onClick={() => setScanOpen(true)}
            >
                <AddAPhotoIcon />
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

            {scanOpen && (
                <QrScanForm
                    open={scanOpen}
                    handleInsert={handleInsert}
                    handleClose={handleScanClose}
                />
            )}

            <ImportDatePicker
                open={importDatePickerOpen}
                handleImport={importFromProductRecord}
                handleClose={handleImportDatePickerClose}
            />

            <MessageBar
                open={messageOpen}
                message={messageText}
                onClose={handleMassageClose}
            />

            <Backdrop
                open={onProcessing}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <List sx={{ marginTop: 8 }}>
                {listItems}
            </List>

            <DataForm
                formRef={dataForm}
                stocks={stocksToJSON(stocks)}
                reportYM={JSON.stringify(getReportYM())}
                pdfApi={stockType.pdfApi}
            />
        </div>
    );
}

function getReportYM() {
    const now = new Date();
    if (now.getDate() <= 20) {
        if (now.getMonth() === 0) {
            return { year: now.getFullYear() - 1, month: 12 };
        } else {
            return { year: now.getFullYear(), month: now.getMonth() };
        }
    } else {
        return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
}

function StockItem({ stock }) {
    const materialStyle = {
        display: 'inline-block', width: '20em'
    };
    const widthStyle = {
        display: 'inline-block', width: '5em', textAlign: 'right', marginLeft: '1em'
    };
    const lotStyle = {
        display: 'inline-block', width: '8em', marginLeft: '1em'
    };
    const lengthStyle = {
        display: 'inline-block', width: '6em', textAlign: 'right', marginLeft: '1em'
    };
    const codeStyle = {
        marginLeft: '1em'
    };

    return (
        <span>
            <span style={materialStyle}>
                {stock.material}
            </span>
            <span style={widthStyle}>
                {`${stock.width}巾`}
            </span>
            <span style={lotStyle}>
                {stock.lot}
            </span>
            <span style={lengthStyle}>
                {`${stock.length.toLocaleString()}m`}
            </span>
            <span style={codeStyle}>
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

function DataForm({ formRef, stocks, reportYM, pdfApi }) {
    return (
        <form
            ref={formRef}
            action={pdfApi}
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

function ImportDatePicker({ open, handleImport, handleClose }) {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        if (open) {
            setDate(new Date());
        }
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>仕上記録インポート</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    インポートする仕上記録の作業日を選択してください。
                </DialogContentText>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        value={date}
                        onChange={setDate}
                        inputFormat="YYYY年MM月DD日(dd)"
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">キャンセル</Button>
                <Button onClick={() => handleImport(date)} color="primary">インポート</Button>
            </DialogActions>
        </Dialog>
    );
}
export default StockForm;