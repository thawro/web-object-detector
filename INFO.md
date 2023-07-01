# **About**
[React](https://react.dev/) web application for serverless object detection. The inference pipeline is done with [ONNX](https://onnx.ai/) models only and it consists of 4 steps: image preprocessing, object detection, non maximum supression and postprocessing (described in [pipeline](#pipeline) section). By default digits detection model and 0-9 labels are loaded.

# **Pipeline**
Each pipeline step is done with ONNX models. The complete pipeline during inference is the following:
1. Image preprocessing - resize and pad to match model input size ([preprocessing](models/preprocessing.onnx))
2. Object detection - Detect objects with YOLOv8 model ([yolo](models/yolo.onnx))
3. Non Maximum Supression - Apply NMS to YOLO output ([nms](models/nms.onnx))
4. Postprocessing - Apply postprocessing to filtered boxes ([postprocessing](models/postprocessing.onnx))

# **Tech stack**
* [React](https://react.dev/) - Web application used to test object detection models for real world examples
* [ONNX](https://onnx.ai/) - All processing steps used in [pipeline](#pipeline)
* [ONNX Runtime](https://onnxruntime.ai/) - Pipeline inference
* [OpenCV](https://opencv.org/) - Image processing for the preprocessing without ONNX
