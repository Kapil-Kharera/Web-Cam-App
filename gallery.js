setTimeout(() => {
    if (db) {
        //get video from db
        const dbTransactionVideo = db.transaction("video", "readonly");
        const videoStore = dbTransactionVideo.objectStore("video");

        const videoReauest = videoStore.getAll(); //event driven
        videoReauest.onsuccess = (e) => {
            const videoResult = videoReauest.result;
            const galleryContainerElement = document.querySelector(".gallery-container");

            videoResult.forEach((videoObj) => {
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class", "media-container");
                mediaElement.setAttribute("id", videoObj.id);

                const url = URL.createObjectURL(videoObj.blobData);

                mediaElement.innerHTML = `
                <div class="media">
                    <video src="${url}" autoplay loop></video>
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `;

                galleryContainerElement.appendChild(mediaElement);

                //listeners
                const deleteBtnElement = mediaElement.querySelector(".delete");

                deleteBtnElement.addEventListener("click", handleDeleteData);

                const downloadBtnElement = mediaElement.querySelector(".download");

                downloadBtnElement.addEventListener("click", handleDownloadData);

            });

        }


        //get images from db
        const dbTransactionImage = db.transaction("image", "readonly");
        const imageStore = dbTransactionImage.objectStore("image");

        const imageReauest = imageStore.getAll(); //event driven
        imageReauest.onsuccess = (e) => {
            const imageResult = imageReauest.result;
            const galleryContainerElement = document.querySelector(".gallery-container");

            imageResult.forEach((imageObj) => {
                let mediaElement = document.createElement("div");
                mediaElement.setAttribute("class", "media-container");
                mediaElement.setAttribute("id", imageObj.id);

                // const url = URL.createObjectURL(imageObj.blobData);
                console.log(imageObj);

                mediaElement.innerHTML = `
                <div class="media">
                    <img src="${imageObj.url}" />
                </div>
                <div class="delete action-btn">Delete</div>
                <div class="download action-btn">Download</div>
                `;

                galleryContainerElement.appendChild(mediaElement);

                //listeners
                const deleteBtnElement = mediaElement.querySelector(".delete");

                deleteBtnElement.addEventListener("click", handleDeleteData);

                const downloadBtnElement = mediaElement.querySelector(".download");

                downloadBtnElement.addEventListener("click", handleDownloadData);
            });

        }
    }
}, 100);


function handleDeleteData(e) {
    const id = e.target.parentElement.getAttribute("id");
    const type = id.slice(0, 3);

    if (type === "vid") {
        const dbTransactionVideo = db.transaction("video", "readwrite");
        const videoStore = dbTransactionVideo.objectStore("video");
        videoStore.delete(id);
    } else if (type === "img") {
        const dbTransactionImage = db.transaction("image", "readwrite");
        const imageStore = dbTransactionImage.objectStore("image");
        imageStore.delete(id);
    }

    //UI removal
    e.target.parentElement.remove();
}


function handleDownloadData(e) {
    const id = e.target.parentElement.getAttribute("id");
    const type = id.slice(0, 3);

    if (type === "vid") {
        const dbTransactionVideo = db.transaction("video", "readwrite");
        const videoStore = dbTransactionVideo.objectStore("video");

        const videoReauest = videoStore.get(id);
        videoReauest.onsuccess = (e) => {
            const videoResult = videoReauest.result;

            const videoURL = URL.createObjectURL(videoResult.blobData);

            const a = document.createElement("a");
            a.href = videoURL;
            a.download = "stream.mp4";
            a.click();
        }
    } else if (type === "img") {
        const dbTransactionImage = db.transaction("image", "readwrite");
        const imageStore = dbTransactionImage.objectStore("image");

        const imageReauest = imageStore.get(id);
        imageReauest.onsuccess = (e) => {
            const imageResult = imageReauest.result;

            // const videoURL = URL.createObjectURL(videoResult.blobData);

            const a = document.createElement("a");
            a.href = imageResult.url;
            a.download = "image.jpeg";
            a.click();
        }
    }
}
