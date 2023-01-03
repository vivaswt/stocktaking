import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRef, useEffect } from "react";
import { loadMaterials } from "./material";

function QrScanForm({ open, handleInsert, handleClose }) {
    const videoElement = useRef(null);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: { exact: 'environment' }
                }
            }).then(stream => {
                videoElement.current.srcObject = stream;
                videoElement.current.onloadedmetadata = () => {
                    videoElement.current.play();
                    findQR(videoElement.current, setResult);
                };
            }).catch(e => {
                console.log('camera error');
                console.error(e);
                //setVideoMsg(e.message);
            });
    }, []);

    const setResult = result => {
        console.log(result);
        if (result.isSuccess) {
            handleInsert(result.stock);
        }
        handleClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth="true"
            maxWidth="100%"
        >
            <DialogTitle>QRコード読込み</DialogTitle>
            <DialogContent>
                <video
                    autoPlay
                    playsInline
                    ref={videoElement}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    キャンセル
                </Button>
            </DialogActions>
        </Dialog>
    );
}

function findQR(video, setResult) {
    const detector = new window.BarcodeDetector();
    detector
        .detect(video)
        .then(barcodes => {
            if (barcodes.length > 0) {
                const code = barcodes[0].rawValue;
                setResult(checkQrCode(code));
            } else {
                setTimeout(() => findQR(video, setResult), 200);
            }
        }).catch(e => {
            setResult({
                isSuccess: false,
                message: e.toString()
            });
        });
}

function checkQrCode(qrCode) {
    const result = {
        isSuccess: false,
        message: ''
    };

    if (qrCode.length !== 200) {
        result.message = 'コード長さ不一致';
        return result;
    }

    if (!qrCode.startsWith('LTC')) {
        result.message = '識別コード不一致';
        return result;
    }

    const stock = {};
    stock.code = qrCode.slice(17, 22);
    stock.width = parseInt(qrCode.slice(40, 44));
    stock.length = parseInt(qrCode.slice(49, 54));
    stock.lot = qrCode.slice(70, 77) + '-' + qrCode.slice(77, 80);
    
    const materials = loadMaterials();
    const material = materials.find(m => m.code === stock.code);

    if (!material) {
        result.message = `製品コード ${stock.code} に対する品名が見つかりません`;
        return result;
    }
    stock.material = material.material;

    result.stock = stock;
    result.isSuccess = true;
    return result;
}

export default QrScanForm;