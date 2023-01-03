import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import AppMenu from "./AppMenu";
import { loadConfig, saveConfig } from "./config";

function ConfigForm({ onMenuChange }) {
    const [config, setConfig] = useState(loadConfig());

    useEffect(() => {
        saveConfig(config);
    }, [config]);

    return (
        <div>
            <AppMenu
                title="設定"
                onMenuChange={onMenuChange}
            />

            <TextField
                label="Notion接続トークン"
                sx={{ marginTop: 10 }}
                value={config.notionToken}
                onChange={e => { setConfig(prev => { return { ...prev, notionToken: e.target.value }; }) }}
            />
        </div>
    );
}

export default ConfigForm;