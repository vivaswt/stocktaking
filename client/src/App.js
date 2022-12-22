import React from 'react';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);

  const videoElement = React.useRef(null);
  const [videoMsg, setVideoMsg] = React.useState('nope');

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          facingMode: {exact: 'environment'}
        }
      }).then(stream => {
        videoElement.current.srcObject = stream;
        videoElement.current.onLoadedMetadata = () => {
          videoElement.current.play();
        };
      }).catch(e => {
        setVideoMsg(e.message);
      });
  }, []);

  const msg = "BarcodeDetector" in window ? 'supportted' : 'not supported';

  return (
    <div className="App">
      <header className="App-header">
        <p>{!data ? "Loading..." : data}</p>
        <p>{msg}</p>
      </header>
      <video
        id="js-video"
        class="reader-video"
        autoplay
        playsinline
        ref={videoElement}
      ></video>
      <p>video message: {videoMsg}</p>
    </div>
  );
}

export default App;
