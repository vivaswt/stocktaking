import { Backdrop, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";
import AppMenu from "./AppMenu";
import { downloadMaterials, loadMaterials } from './material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CircularProgress from '@mui/material/CircularProgress';
import { MessageBar } from "./MessageBar";

function MaterialForm({ onMenuChange }) {
    const [materials, setMaterials] = useState([]);
    const [downloading, setDownloading] = useState(false);
    const [messageOpen, setMessageOpen] = useState(false);
    const [messageText, setMessageText] = useState('');

    useEffect(() => {
        setMaterials(loadMaterials());
    }, []);

    const handleDownloadClick = () => {
        setDownloading(true);
        downloadMaterials()
            .then(newMaterials => {
                setMaterials(newMaterials);
                setDownloading(false);
                setMessageText('品名を更新しました');
                setMessageOpen(true);
            }).catch(e => {
                setDownloading(false);
                setMessageText(e.message);
                setMessageOpen(true);
                console.error(e.message);
            });
    };

    const handleMassageClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessageOpen(false);
    };

    return (
        <div>
            <AppMenu
                title="品名"
                onMenuChange={onMenuChange}
            >
                <IconButton onClick={handleDownloadClick} color="inherit">
                    <CloudDownloadIcon />
                </IconButton>

            </AppMenu>

            <List sx={{ marginTop: 8 }}>
                <ListItems data={materials} />
            </List>

            <Backdrop
                open={downloading}
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <MessageBar
                open={messageOpen}
                message={messageText}
                onClose={handleMassageClose}
            />
        </div>
    );
}

function ListItems({ data }) {
    const items = data.map(d => {
        return (
            <ListItem key={d.material}>
                <ListItemText>
                    <span style={{ display: 'inline-block', width: '20em' }}>{d.material}</span>
                    <span style={{ display: 'inline-block', width: '6em' }}>{d.code}</span>
                </ListItemText>
            </ListItem>
        );
    });

    return (
        <div>
            {items}
        </div>
    );
}
export default MaterialForm;