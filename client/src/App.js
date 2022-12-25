import React from 'react';

function App() {
  const [windowState, setWindowState] = React.useState('result');
  const [rawCode, setRawCode] = React.useState('no code');

  const beginScanning = () => {
    setWindowState('scan');
  };

  if (windowState === 'result') {
    return (
      <ResultWindw rawCode={rawCode} beginScanning={beginScanning} />
    );
  }

  const setResult = code => {
    setRawCode(code);
    setWindowState('result');
  };

  return (
    <ScanWindow setResult={setResult} />
  );
}

function ResultWindw({ rawCode, beginScanning }) {
  return (
    <div>
      <div>raw code = {rawCode}</div>
      <input type="button" value="scan code" onClick={beginScanning} />
    </div>
  );
}

function ScanWindow({ setResult }) {
  const videoElement = React.useRef(null);
  const [videoMsg, setVideoMsg] = React.useState('nope');

  const findQR = (video, setResult) => {
    const detector = new window.BarcodeDetector();
    detector
      .detect(video)
      .then(barcodes => {
        if (barcodes.length > 0) {
          setResult(barcodes[0].rawValue);
        } else {
          setTimeout(() => findQR(video, setResult), 200);
        }
      }).catch(e => {
        setResult(e.toString());
      });
  }

  React.useEffect(() => {
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
        console.log(e);
        setVideoMsg(e.message);
      });
  }, []);

  return (
    <div className="App">
      <video
        id="js-video"
        className="reader-video"
        autoPlay
        playsInline
        ref={videoElement}
      />
      <div>
        <input type="button" value="Cancel" onClick={() => setResult('Canceled')} />
      </div>
      <p>video message: {videoMsg}</p>
    </div>
  );
}

export default App;
