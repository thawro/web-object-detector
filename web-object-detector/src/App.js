import React, { useState, useRef } from "react";
import { Loader, Header, SketchObjectDetector, Footer, CustomSlider } from "./components";
import "./style/App.css";
import { loadOnnxSession } from "./utils/loadOnnxSession";
import { Tensor, InferenceSession } from "onnxruntime-web";
import ReactJson from 'react-json-view'

const ModelConfigMenu = ({ scoreThreshold, setScoreThreshold, iouThreshold, setIouThreshold, session, setSession }) => {
  const uploadModelRef = useRef(null)
  const uploadLabelsRef = useRef(null)
  const [showInfo, setShowInfo] = useState(false)
  const [showSessionInfo, setShowSessionInfo] = useState(false)

  const [info, setInfo] = useState("")

  const uploadModel = async (file) => {
    const src = URL.createObjectURL(file)
    const newSession = session
    const detectionModel = await InferenceSession.create(src);
    newSession.detectionModel = detectionModel
    newSession.files.detectionModel = file.name
    setInfo(file.name + " model uploaded")
    setShowInfo(true)
    setTimeout(() => {
      setShowInfo(false)
    }, 1000)
    setSession(newSession)
  }

  const uploadLabels = async (file) => {
    const newSession = session
    var reader = new FileReader();

    reader.onload = function (e) {
      var contents = e.target.result;
      var labels = contents.split('\n'); // Split contents into an array of lines
      newSession.labels = labels
      newSession.files.labels = file.name
    };
    reader.readAsText(file); // Read the file as text
    setInfo(file.name + " labels uploaded")
    setShowInfo(true)
    setTimeout(() => {
      setShowInfo(false)
    }, 1000)
    setSession(newSession)
  }

  const handleSessionInfoClick = (e) => {
    setShowSessionInfo(!showSessionInfo)
  }

  return <div>
    <div className="modelConfigMenu">
      <div className="configMenu">
        <h3 className="configTitle" title={"Non Maximum Supression"}>
          Model configuration
        </h3>
        <div>
          <input
            type="file" ref={uploadModelRef}
            accept=".onnx" style={{ display: "none" }}
            onChange={(e) => uploadModel(e.target.files[0])} />

          <input
            type="file" ref={uploadLabelsRef}
            accept=".txt" style={{ display: "none" }}
            onChange={(e) => uploadLabels(e.target.files[0])} />

          <button onClick={() => { uploadModelRef.current.click(); }}>
            Upload model
          </button>
          <button onClick={() => { uploadLabelsRef.current.click(); }}>
            Upload labels
          </button>
        </div>
        <p className={`uploadInfo ${showInfo ? "show" : ""}`}>{info}</p>
        <h3 className="configTitle" title={"Non Maximum Supression"}>
          NMS configuration
        </h3>
        <div className="configInputs">
          <div className="menuItem">
            <label htmlFor="scoreThreshold">Confidence threshold: </label>
            <CustomSlider value={scoreThreshold} setValue={(e) => setScoreThreshold(e.target.value)} min={0} max={1} step={0.01} />
          </div>
          <div className="menuItem">
            <label htmlFor="iouThreshold">IoU threshold: </label>
            <CustomSlider value={iouThreshold} setValue={(e) => setIouThreshold(e.target.value)} min={0} max={1} step={0.01} />
          </div>
        </div>
      </div>
      <button onClick={handleSessionInfoClick}>{showSessionInfo ? "Hide" : "Show"} current session info</button>
    </div>
    {showSessionInfo &&
      <ReactJson
        src={session}
        theme="monokai"
        collapseStringsAfterLength={100}
        displayDataTypes={false}
      />
    }
  </div>
}

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState({ text: "Loading OpenCV.js", progress: null });
  const modelInputShape = [1, 3, 256, 256];
  const [iouThreshold, setIouThreshold] = useState(0.7)
  const [scoreThreshold, setScoreThreshold] = useState(0.25)

  loadOnnxSession(setLoading, setSession, modelInputShape)

  const detectorProps = {
    session: session,
    modelInputShape: modelInputShape,
    iouThreshold: iouThreshold,
    scoreThreshold: scoreThreshold,
    maxOutputBoxesPerClass: 100
  }

  const modelConfigMenuProps = {
    scoreThreshold: scoreThreshold,
    setScoreThreshold: setScoreThreshold,
    iouThreshold: iouThreshold,
    setIouThreshold: setIouThreshold,
    session: session,
    setSession: setSession,
  }

  return (
    <div className="App" style={{ height: loading ? "100vh" : "100%" }}>

      {loading ?
        <Loader>
          {loading.progress ? `${loading.text} - ${loading.progress}%` : loading.text}
        </Loader>
        :
        <>
          <Header />
          <ModelConfigMenu {...modelConfigMenuProps} />
          <div className="detector">
            <SketchObjectDetector {...detectorProps} />
          </div>
          <Footer />
        </>
      }

    </div>
  );
};

export default App;