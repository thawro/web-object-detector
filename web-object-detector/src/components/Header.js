import React, { useState } from "react";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";

const Header = () => {
    const [instructionOpen, setInstructionOpen] = useState(true)

    const handleInstructionClick = () => {
        setInstructionOpen(!instructionOpen);
    };


    return <div className="header">
        <h1>Digits Detection App</h1>
        <p>
            Object detection pipeline powered by &nbsp; <code className="code">onnxruntime-web</code>
        </p>
        <br />
        <div className="instruction">
            <h2
                className="instructionHeader"
                onClick={handleInstructionClick}
            >
                Instruction &nbsp;{instructionOpen ? <SlArrowUp /> : <SlArrowDown />}
            </h2>
            {instructionOpen &&
                <>
                    <h3>Possible options:</h3>
                    <ul>
                        <li>Draw on the white canvas below. The model detects digits after each line drawn.</li>
                        <li>Pick one of the example images (model runs after clicking on the example) and draw some extra objects</li>
                        <li>Pick one of the example videos - model runs at 15 fps</li>
                        <li>Upload your image or a video with "Upload" button</li>
                        <li>Save snapshot of the canvas with "Save snapshot" button</li>
                        <li>Record everything what happens on canvas with "Record" button. You can pause/resume the recording and save it or quit it</li>
                    </ul>
                    <br />
                    <h3>Configuration:</h3>
                    <ul>
                        <li>Upload your own ONNX model with "Upload model" (inputs and outputs must be same as in YOLOv8)</li>
                        <li>Upload your own labels with "Upload labels"</li>
                        <li>Constrol NMS (Non Maximum Supression) with two sliders - one for confidence threshold and one for IoU threshold.</li>
                        <li>Control canvas width/height, line width and/or line color</li>
                    </ul>
                </>
            }
        </div>
    </div>
}

export default Header