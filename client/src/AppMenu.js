import { AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import SideMenu from "./SideMenu";

function AppMenu({ title, children, onMenuChange }) {
    const [sideMenuOpen, setSideMenuOpen] = useState(false);

    return (
        <div position="sticky">
            <AppBar>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={() => setSideMenuOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <span style={{ flexGrow: 1 }}>{title}</span>
                    {children}
                </Toolbar>
            </AppBar>
            <SideMenu
                open={sideMenuOpen}
                changeOpenState={setSideMenuOpen}
                onMenuChange={onMenuChange}
            />
        </div>
    );
}

export default AppMenu;