'use strict';
import uploader from './uploader.js';
const video  = document.getElementById('video');
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startCamara());


  
async function startCamara() {
    const videoContainer = document.querySelector('.js-video')
    const canvas = document.querySelector('.js-canvas')
    const context = canvas.getContext('2d')
    const video = await navigator.mediaDevices.getUserMedia({ video: true })
    
    const match =await  uploader('.input-submit', '.images-list');
    videoContainer.srcObject = video

    const reDraw = async() => {
        context.drawImage(videoContainer, 0, 0, 640, 480)

        requestAnimationFrame(reDraw)
    }

    const processFace = async() => {
        const detection = await faceapi.detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor()
        if (typeof detection === 'undefined') return;
        let descriptor = detection.descriptor;
        match(descriptor);
    }

    setInterval(processFace, 1000)


    requestAnimationFrame(reDraw)
}


/*videoContainer.addEventListener('play',()=>{
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
   // const displaySize = {width:640, height:480}
   // faceapi.matchDimensions(canvas, displaySize);
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
*/
