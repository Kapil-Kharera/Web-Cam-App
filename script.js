const videoElement = document.querySelector("video");
const recordBtnContainerElement = document.querySelector(".record-btn-container");
const recordBtnElement = document.querySelector(".record-btn");
const captureBtnContainerElement = document.querySelector(".capture-btn-container");
const captureBtnElement = document.querySelector(".capture-btn");

let recorder;

let chunks = []; //media data in chunks

let recordFlag = false;

let transparentColor = "transparent";

const constraints = {
    video: true,
    audio: true
}

//navigator -> global obj, which contain browser info
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    videoElement.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start", (e) => {
        chunks = [];
    })

    //pushing data into array
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
    });

    recorder.addEventListener("stop", (e) => {
        //conversion media chunks to video
        const blob = new Blob(chunks, { type: "video/mp4"});
        const videoUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = videoUrl;
        a.download = "stream.mp4";
        
        a.click();
    });
});


recordBtnContainerElement.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) {
        recorder.start();
        recordBtnElement.classList.add("scale-record");
        startTimer();
    }else {
        recorder.stop();
        recordBtnElement.classList.remove("scale-record");
        stopTimer();
    }
});

captureBtnContainerElement.addEventListener("click", (e) => {
   console.log("Clicked");

    let canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    let tool = canvas.getContext("2d");
    tool.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    //filters
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    const imageURL = canvas.toDataURL("image/jpeg");
    let a = document.createElement("a");
    a.href = imageURL;
    a.download = "image.jpeg";

    a.click();
});

let timerID;

let counter = 0; //refer total seconds

const timerElement = document.querySelector(".timer");

function startTimer() {
    timerElement.style.display = "block";

    function displayTimer() {
        let hours = Number.parseInt(counter/3600);
        counter = counter % 3600; //remainer value

        let minutes = Number.parseInt(counter/60);
        counter = counter % 60;

        let seconds = counter; //just for naming

        
        console.log(hours, minutes, seconds);

        hours = (hours < 10) ? `0${hours}`: hours;
        minutes = (minutes < 10) ? `0${minutes}`: minutes;
        seconds = (seconds < 10) ? `0${seconds}`: seconds;

        timerElement.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
   
   timerID = setInterval(displayTimer, 1000);
}

function stopTimer() {
    timerElement.style.display = "none";
    clearInterval(timerID);
    timerElement.innerText = "00:00:00";
}

//filtering logic
const allFilters = document.querySelectorAll(".filter");
const filterLayerElement = document.querySelector(".filter-layer");

allFilters.forEach((filterItem) => {
    filterItem.addEventListener("click", () =>{
        console.log("clicked")
        //set
        // transparentColor = filterItem.style.backgroundColor;
        //get
        transparentColor = getComputedStyle(filterItem).getPropertyValue("background-color");

        //set
        filterLayerElement.style.backgroundColor = transparentColor;
    });
});


