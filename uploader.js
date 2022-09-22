'use strict';
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
import {read, write, destroy} from './localStorage.js';

function uploadFile(file) {
    return new Promise((resolve, reject) => {
        window.requestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
            fs.root.getFile(`${file.name}${new Date()}`, { create: true, exclusive: true }, function(fileEntry) {
                fileEntry.createWriter(function(fileWriter) {
                    fileWriter.write(file);
                    resolve(fileEntry);
                }, e => console.log(e));
            }, e => console.log(e));
        })
    });
}

export default  async function uploader (submitSelector, imagesListSelector) {
        
    const submit = document.querySelector(submitSelector);
    const imagesList = document.querySelector(imagesListSelector);
    let faceMatcher;
    const imageDescriptors =[]

    const processFace = async (image, imageContainer, id) => {
        const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()
        if (typeof detection === 'undefined') {
            imageContainer.querySelector('.status').innerText = 'No tiene rostro';
            return
        };

        imageDescriptors.push({
            id: id,
            detection
        });
        imageContainer.querySelector('.status').innerText = 'Procesado';

        faceMatcher = new faceapi.FaceMatcher(imageDescriptors.map(faceDescriptor => (
            new faceapi.LabeledFaceDescriptors(
                (faceDescriptor.id).toString(), [faceDescriptor.detection.descriptor]
            )
        )))

    }
    
    const syncImages = () => {
        while (imagesList.firstChild) {
            imagesList.removeChild(imagesList.firstChild);
        }
        const store = read();
        store.forEach(async image => {
            const imgContainer = document.createElement('div');
            const label = document.createElement('label');
            const img = document.createElement('img');
            
            const status = document.createElement('div');
            status.classList.add('status');

            const deleteLink = document.createElement('a');
            imgContainer.classList.add('image-container');
            deleteLink.classList.add('cerrar');
            img.classList.add('card-img-top');
            imgContainer.id = image.id;
            deleteLink.href = '#';
            deleteLink.innerText = 'X';
            //status ClassList 
             
            img.src = image.path;
            label.value = image.name;
            
            deleteLink.addEventListener('click', e => {
                e.preventDefault();
                destroy(image.id);
                syncImages();
            })
            imgContainer.appendChild(deleteLink);
            imgContainer.appendChild(status);
            imgContainer.appendChild(img);
            imgContainer.appendChild(label);
            imagesList.appendChild(imgContainer);
            processFace(img, imgContainer, image.id);
        })
    }
    
    submit.addEventListener('change', async e  =>{
        console.log('holaw');
        const fileEntry = await uploadFile(e.target.files[0]);
        write([
            ...read(),
            {
                id: Date.now(),
                path: fileEntry.toURL(),
                name: fileEntry.name
            }
        ])
        syncImages()
    })
    syncImages()    

    return descriptor => {
        if (!faceMatcher || !descriptor) return;
        const match = faceMatcher.findBestMatch(descriptor);
        [...imagesList.children].forEach(image => {
            if (match.label === image.id) {
                image.classList.add('selected');
                return
            }
            return image.classList.remove('selected')
        })

        return match
    }
    
}