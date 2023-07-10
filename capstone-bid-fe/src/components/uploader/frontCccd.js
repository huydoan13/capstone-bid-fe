
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
    const frontfileUrl = uploader.url(filePath, "thumbnail")
    console.log(frontfileUrl)
    return (
        <p key={frontfileUrl}>
            <a href={frontfileUrl} >{frontfileUrl}</a>
        </p>
    );
})

// ----------------------
// Run the application...
// ----------------------

const FrontCccd = () => {
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
export default FrontCccd;

// ReactDOM.render(
//     <FrontCccd />,
//     document.getElementById('root')
// );