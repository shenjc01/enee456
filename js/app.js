let originalImage = null;

function processImage() {
    const fileInput = document.getElementById('upload');
    const mode = document.getElementById('mode').value;
    if (!fileInput.files[0]) {
        alert('Please upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            originalImage = img;
            if (mode === 'bw') {
                generateBW(img);
            } else {
                generateColor(img);
            }
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(fileInput.files[0]);
}

function generateBW(img) {
    const w = img.width;
    const h = img.height;
    
    const scale = 2; // pixel expansion for B/W
    const share1Canvas = document.getElementById('share1');
    const share2Canvas = document.getElementById('share2');
    const reconCanvas = document.getElementById('reconstructed');
    [share1Canvas, share2Canvas, reconCanvas].forEach(c => {
        c.width = w * scale;
        c.height = h * scale;
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0, w, h);
    const imgData = tempCtx.getImageData(0, 0, w, h);

    const s1Ctx = share1Canvas.getContext('2d');
    const s2Ctx = share2Canvas.getContext('2d');
    const reconCtx = reconCanvas.getContext('2d');

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const i = (y * w + x) * 4;
            const brightness = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2]) / 3;
            const isWhite = brightness > 128;

            const pattern = Math.random() < 0.5 ? [[1,0],[0,1]] : [[0,1],[1,0]];
            let p1 = pattern;
            let p2 = isWhite ? pattern : [[1-p1[0][0],1-p1[0][1]],[1-p1[1][0],1-p1[1][1]]];

            drawBlock(s1Ctx, x, y, p1, scale);
            drawBlock(s2Ctx, x, y, p2, scale);
        }
    }

    const share1Data = s1Ctx.getImageData(0, 0, w*scale, h*scale);
    const share2Data = s2Ctx.getImageData(0, 0, w*scale, h*scale);
    const reconData = reconCtx.createImageData(w*scale, h*scale);

    for (let i = 0; i < reconData.data.length; i+=4) {
        reconData.data[i] = Math.min(share1Data.data[i], share2Data.data[i]);
        reconData.data[i+1] = Math.min(share1Data.data[i+1], share2Data.data[i+1]);
        reconData.data[i+2] = Math.min(share1Data.data[i+2], share2Data.data[i+2]);
        reconData.data[i+3] = 255;
    }
    reconCtx.putImageData(reconData, 0, 0);
}

function drawBlock(ctx, x, y, pattern, scale) {
    for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
            ctx.fillStyle = pattern[dy][dx] === 1 ? 'black' : 'white';
            ctx.fillRect((x*2+dx)*scale/2, (y*2+dy)*scale/2, scale/2, scale/2);
        }
    }
}

function generateColor(img) {
    const w = img.width;
    const h = img.height;
    const share1Canvas = document.getElementById('share1');
    const share2Canvas = document.getElementById('share2');
    const reconCanvas = document.getElementById('reconstructed');
    [share1Canvas, share2Canvas, reconCanvas].forEach(c => {
        c.width = w;
        c.height = h;
    });

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = w;
    tempCanvas.height = h;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0, w, h);
    const imgData = tempCtx.getImageData(0, 0, w, h);

    const s1Ctx = share1Canvas.getContext('2d');
    const s2Ctx = share2Canvas.getContext('2d');
    const reconCtx = reconCanvas.getContext('2d');

    const share1Data = s1Ctx.createImageData(w, h);
    const share2Data = s2Ctx.createImageData(w, h);
    const reconData = reconCtx.createImageData(w, h);

    for (let i = 0; i < imgData.data.length; i+=4) {
        for (let j=0; j<3; j++) { // R, G, B channels
            const pixel = imgData.data[i+j];
            const randVal = Math.floor(Math.random() * 256);
            share1Data.data[i+j] = randVal;
            share2Data.data[i+j] = (pixel - randVal + 256) % 256;
        }
        share1Data.data[i+3] = share2Data.data[i+3] = 255;
    }

    s1Ctx.putImageData(share1Data, 0, 0);
    s2Ctx.putImageData(share2Data, 0, 0);

    for (let i = 0; i < reconData.data.length; i+=4) {
        for (let j=0; j<3; j++) {
            reconData.data[i+j] = (share1Data.data[i+j] + share2Data.data[i+j]) % 256;
        }
        reconData.data[i+3] = 255;
    }
    reconCtx.putImageData(reconData, 0, 0);
}

function downloadCanvas(id, filename) {
    const canvas = document.getElementById(id);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
}