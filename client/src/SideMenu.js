import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import AdjustIcon from '@mui/icons-material/Adjust';

function SideMenu({ open, onMenuChange, changeOpenState }) {
    const handleMenuClick = menuNumber => () => {
        changeOpenState(false);
        onMenuChange(menuNumber);
    };

    return (
        <Drawer
            open={open}
            onClose={() => changeOpenState(false)}
        >
            <List>
                <MenuItem
                    icon={<NoteAltIcon />}
                    text="仕掛品"
                    onClick={handleMenuClick(1)}
                />
                <MenuItem
                    icon={<NoteAltIcon />}
                    text="製品"
                    onClick={handleMenuClick(2)}
                />
                <MenuItem
                    icon={<AdjustIcon />}
                    text="品名"
                    onClick={handleMenuClick(3)}
                />
                <MenuItem
                    icon={<SettingsIcon />}
                    text="設定"
                    onClick={handleMenuClick(4)}
                />
            </List>
        </Drawer>
    );
}

function MenuItem({ onClick, icon, text }) {
    return (
        <ListItem key={text}>
            <ListItemButton
                onClick={onClick}
            >
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
}
export default SideMenu;