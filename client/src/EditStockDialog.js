import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { loadMaterials } from "./material";

export default function EditStockDialog({ stock, open, mode, handleInsert, handleUpdate, handleClose }) {
    const [data, setData] = useState({ ...stock });
    const materialItems = loadMaterials().map(m => (
        <MenuItem key={m.material} value={m.material}>{m.material}</MenuItem>
    ));

    const handleMaterialChange = newMaterial => {
        const newCode = loadMaterials().filter(m => m.material === newMaterial)[0].code;
        setData({ ...data, material: newMaterial, code: newCode });
    }

    const toInt = value => isNaN(parseInt(value)) ? '' : parseInt(value);
    const handleRegistClick = () => {
        if (mode === 'insert') {
            handleInsert({ ...data, width: toInt(data.width), length: toInt(data.length) })
        } else {
            handleUpdate({ ...data, width: toInt(data.width), length: toInt(data.length)})
        }
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>{mode === 'insert' ? '明細追加' : '明細変更'}</DialogTitle>
            <DialogContent>
                <Stack spacing={1.5}>
                    <TextField
                        label="品目"
                        select
                        value={data.material}
                        onChange={e => handleMaterialChange(e.target.value)}
                        sx={{ width: '18em', marginTop: 1 }}
                    >
                        {materialItems}
                    </TextField>
                    <TextField
                        label="巾"
                        type="number"
                        value={data.width}
                        onChange={e => setData({ ...data, width: e.target.value })}
                        sx={{ width: '5em' }}
                    />
                    <TextField
                        label="ロット№"
                        value={data.lot}
                        onChange={e => setData({ ...data, lot: e.target.value })}
                        sx={{ width: '9em' }}
                    />
                    <TextField
                        label="巻数"
                        type="number"
                        value={data.length}
                        onChange={e => setData({ ...data, length: e.target.value })}
                        sx={{ width: '6em' }}
                    />
                    <TextField
                        label="製品コード"
                        value={data.code}
                        onChange={e => setData({ ...data, code: e.target.value })}
                        sx={{ width: '5em' }}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    キャンセル
                </Button>
                <Button onClick={handleRegistClick} color="primary">
                    {mode === 'insert' ? '追加' : '変更'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}