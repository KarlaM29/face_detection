'use strict';
const video  = document.getElementById('video');

function startCamara() {
    navigator.getUserMedia = (
        navigator.getUserMedia || 
        navigator.webkitGetUserMedia ||
        navigator.mozGetUser ||
        navigator.msGetUser
    );
    navigator.getUserMedia(
        {video:{ width: {
            min: 1280,
          },
          height: {
            min: 720,
          }}},
        stream => video.srcObject = stream,
        err => console.log(err)
    );
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
]).then(startCamara());


video.addEventListener('play',()=>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = {width:video.width, height:video.height}
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            video,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks()
        .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0,0,canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 500);
});