import { IconButton, Snackbar } from "@mui/material";
import { Fragment } from "react";
import CloseIcon from '@mui/icons-material/Close';

function MessageBar({ open, message, onClose }) {
    const action = (
        <Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={onClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </Fragment>
    );

    return (
        <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={onClose}
            message={message}
            action={action}
        />
    );
}

export {
    MessageBar
};