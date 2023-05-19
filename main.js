const canvasEl = document.getElementById("canvas")
const resulEl = document.getElementById("result")
const videoEl = document.getElementById("video")
const context = canvasEl.getContext('2d')

const PIXEL_RATIO = 100

context.translate(PIXEL_RATIO, 0)
context.scale(-1, 1)
const pixels = []

const delay = (time) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

navigator.mediaDevices.getUserMedia({
    video: {
        width: PIXEL_RATIO,
        height: PIXEL_RATIO,
    }
}).then(mediaStream => {
    videoEl.srcObject = mediaStream
    videoEl.onloadedmetadata = () => {
        videoEl.play();
    };
    start()
})

const start = async () => {
    for(let y = 0; y < PIXEL_RATIO; y++) {
        const trEl = document.createElement('tr')
        const pixelLine = []
        for(let x = 0; x < PIXEL_RATIO; x++) {
            const tdEl = document.createElement('td')
            tdEl.id = "col-" + y + "-" + x
            trEl.append(tdEl)
            pixelLine.push(tdEl)
        }
        resulEl.append(trEl)
        pixels.push(pixelLine)
    }

    let timeElapsed = 0
    let startFrame = Date.now()
    let endFrame = Date.now()
    let fpsEl = document.getElementById('fps')

    while(true) {
        startFrame = Date.now()
        context.drawImage(videoEl, 0, 0, PIXEL_RATIO, PIXEL_RATIO)
        transformInText()
        await delay(10)
        endFrame = Date.now()
        timeElapsed += endFrame - startFrame
        let time = (1000 / (endFrame - startFrame)).toFixed(0)
        if(fpsEl.innerHTML != time) {
            fpsEl.innerHTML = time;
        }
    }
}

function transformInText() {
    const imageData = context.getImageData(0, 0, PIXEL_RATIO, PIXEL_RATIO)

    let line = 0
    let col = 0
    for (let i = 0; i < imageData.data.length; i += 4) {
        if(line >= PIXEL_RATIO || col >= PIXEL_RATIO) {
            break
        }
        const count = imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]
        let digit = '#'
        if (count > 500) {
            digit = ' '
        }
        else if (count > 300) {
            digit = '.'
        }
        else if (count > 200) {
            digit = '*'
        }


        if(pixels[line][col].innerHTML != digit) {
            pixels[line][col].innerHTML = digit
        }
        col++
        if (i % (4 * PIXEL_RATIO) === PIXEL_RATIO - 4) {
            line++
            col = 0
        }
    }
}