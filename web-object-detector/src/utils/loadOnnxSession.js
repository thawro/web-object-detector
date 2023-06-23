import cv from "@techstark/opencv-js";
import { Tensor, InferenceSession } from "onnxruntime-web";
import { download } from "../utils/download";
import { preprocessing_onnx, yolo_onnx, nms_onnx, postprocessing_onnx, digits_labels } from "../assets";


export const loadOnnxSession = async (setLoading, setSession, modelInputShape) => {
    cv["onRuntimeInitialized"] = async () => {
        const preprocessingBuffer = await download(preprocessing_onnx, ["Loading Preprocessing", setLoading]);
        const preprocessing = await InferenceSession.create(preprocessingBuffer);

        const detectionModelBuffer = await download(yolo_onnx, ["Loading YOLOv8 model", setLoading]);
        const detectionModel = await InferenceSession.create(detectionModelBuffer, { executionProviders: ['wasm'] });

        const nmsBuffer = await download(nms_onnx, ["Loading NMS model", setLoading]);
        const nms = await InferenceSession.create(nmsBuffer);

        const postprocessingBuffer = await download(postprocessing_onnx, ["Loading Postprocessing model", setLoading]);
        const postprocessing = await InferenceSession.create(postprocessingBuffer);

        // warmup main model
        setLoading({ text: "Warming up YOLOv8...", progress: null });
        const tensor = new Tensor("float32", new Float32Array(modelInputShape.reduce((a, b) => a * b)), modelInputShape);
        await detectionModel.run({ images: tensor });

        var session = {
            preprocessing: preprocessing,
            detectionModel: detectionModel,
            nms: nms,
            postprocessing: postprocessing,
            files: {
                preprocessing: preprocessing_onnx,
                detectionModel: yolo_onnx,
                nms: nms_onnx,
                postprocessing: postprocessing_onnx,
                labels: digits_labels
            }
        }
        fetch(digits_labels)
            .then((res) => res.text())
            .then((text) => {
                var labels = text.split('\n'); // Split contents into an array of lines
                session.labels = labels
            })
            .catch((e) => console.error(e));

        setSession(session);
        setLoading(null);
    };
}