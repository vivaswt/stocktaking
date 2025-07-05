import { Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import { loadMaterials } from "./material";

function QrScanForm({ open, handleInsert, handleClose }) {
    const videoElement = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!open) return;
        setErrorMsg(""); // ダイアログを開くたびにエラーをリセット
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: { ideal: 'environment' }
                }
            }).then(stream => {
                videoElement.current.srcObject = stream;
                videoElement.current.onloadedmetadata = () => {
                    videoElement.current.play();
                    findQR(videoElement.current, handleResult);
                };
            }).catch(e => {
                setErrorMsg('カメラの起動に失敗しました: ' + e.message);
            });
        // クリーンアップ
        return () => {
            if (videoElement.current && videoElement.current.srcObject) {
                videoElement.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleResult = result => {
        if (result.isSuccess) {
            handleInsert(result.stock);
            handleClose();
        } else {
            setErrorMsg(result.message);
            // エラー時は再度QR読み取りを再開
            setTimeout(() => {
                if (videoElement.current && open) {
                    findQR(videoElement.current, handleResult);
                }
            }, 500);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth={true}
            maxWidth="sm"
        >
            <DialogTitle>QRコード読込み</DialogTitle>
            <DialogContent>
                <video
                    autoPlay
                    playsInline
                    ref={videoElement}
                    style={{ width: "100%" }}
                />
                {errorMsg && (
                    <DialogContentText color="error" sx={{ mt: 2 }}>
                        {errorMsg}
                    </DialogContentText>
                )}
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
    if (!('BarcodeDetector' in window)) {
        setResult({
            isSuccess: false,
            message: "このブラウザはBarcodeDetector APIに対応していません。"
        });
        return;
    }
    const detector = new window.BarcodeDetector({ formats: ['qr_code'] }); // QRコードのみ検出
    detector
        .detect(video)
        .then(barcodes => {
            if (barcodes.length === 0) {
                setTimeout(() => findQR(video, setResult), 200);
            } else if (barcodes.length > 1) {
                setResult({
                    isSuccess: false,
                    message: "複数のQRコードが検出されました。1つだけ映してください。"
                });
            } else {
                const code = barcodes[0].rawValue;
                setResult(checkQrCode(code));
            }
        }).catch(e => {
            setResult({
                isSuccess: false,
                message: "QRコード検出エラー: " + e.toString()
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