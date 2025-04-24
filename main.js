const canvasEl = document.getElementById("canvas")
const resulEl = document.getElementById("result")
const videoEl = document.getElementById("video")
const context = canvasEl.getContext('2d')
const copyEl = document.getElementById("copy")

const PIXEL_RATIO = 150

context.translate(PIXEL_RATIO, 0)
context.scale(-1, 1)

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
    let timeElapsed = 0
    let startFrame = Date.now()
    let endFrame = Date.now()
    let fpsEl = document.getElementById('fps')

    while(true) {
        startFrame = Date.now()
        context.drawImage(videoEl, 0, 0, PIXEL_RATIO, PIXEL_RATIO)
        const text = transformInText()
        resulEl.innerHTML = text
        await delay(10)
        endFrame = Date.now()
        timeElapsed += endFrame - startFrame
        let fps = "FPS: " + (1000 / (endFrame - startFrame)).toFixed(0)
        if(fpsEl.innerHTML != fps) {
            fpsEl.innerHTML = fps;
        }
    }
}

function transformInText() {
    let text = ""
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

        col++

        text += digit
        if (i % (4 * PIXEL_RATIO) === (PIXEL_RATIO * 4) - 4) {
            text += "\n"
            line++
            col = 0
        }
    }
    return text
}

copyEl.addEventListener("click", () => {
    navigator.clipboard.writeText(`\`\`\`\n${resulEl.innerHTML}\n\`\`\``)
})

