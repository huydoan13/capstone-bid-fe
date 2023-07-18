
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
// import ReactDOM from 'react-dom';
import React from "react";

const { useState, useEffect } = React

// ---------------------------
// Configure react-uploader...
// ---------------------------

// import { Uploader } from "uploader"
const uploader = Uploader({ apiKey: "free" });
const uploaderOptions = {
    multi: true,

    // Comment out this line & use 'onUpdate' instead of 
    // 'onComplete' to have the dropzone close after upload.
    showFinishButton: true,

    styles: {
        colors: {
            primary: "#377dff"
        }
    }
}

// --------------------
// Create a dropzone...
// --------------------

const MyDropzone = ({ setFiles }) =>
    <UploadDropzone uploader={uploader}
        options={uploaderOptions}
        onUpdate={files =>
            console.log(`Files: ${files
                .map(x => x.fileUrl)
                .join("\n")}`)
        }
        onComplete={setFiles}
        width="600px"
        height="375px" />

// -----------------------------
// Display the uploaded files...
// -----------------------------

const MyUploadedFiles = ({ files }) => files.map(file => {
    // Tip: save 'filePath' to your DB (not 'fileUrl').
    const filePath = file.filePath
    // "raw" for un-transformed file.
    const backfileUrl = uploader.url(filePath, "thumbnail")
    return (
        <p key={backfileUrl}>
            <a href={backfileUrl} >{backfileUrl}</a>
        </p>
    );
})

// ----------------------
// Run the application...
// ----------------------

const BackCccd = () => {
    const [files, setFiles] = useState([])
    return (
        <>
            {files.length
                ? <MyUploadedFiles files={files} />
                : <MyDropzone setFiles={setFiles} />
            }
        </>
    );
}
export default BackCccd;

// ReactDOM.render(
//     <BackCccd />,
//     document.getElementById('root')
// );