//open database
//create objectstore
//make transactions
let db;

const openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success", () => {
    console.log("DB success");
    db = openRequest.result;
});

openRequest.addEventListener("error", () => {
    console.log("DB error");
});

openRequest.addEventListener("upgradeneeded", () => {
    console.log("DB upgraded");
    db = openRequest.result;

    db.createObjectStore("video", { keyPath: "id"});
    db.createObjectStore("image", { keyPath: "id"});
});

