import { useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'
import './index.css'




function FrontUploader() {
    const [image, setImage] = useState(null)
    const [filename, setFileName] = useState("No file Selected")

     const handleUpload =(e)=>{
        
        console.log(e.target.files[0])

        if(e.target.files[0]){
            setImage(URL.createObjectURL(e.target.files[0]))
        }
     }



    return (
        <main>
            <uploadForm
                onClick={() => document.querySelector(".input-field").click()}
            >
                <input type="file" accept='image/*' className='input-field' hidden
                    onChange={handleUpload} />
                {image ?
                    <img src={image} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} alt={filename} />
                    :
                    <>
                        <MdCloudUpload color='#1475cf' size={60} />
                        <p>Tải lên ảnh mặt trước CMND/CCCD</p>                       
                    </>



                }


            </uploadForm>
            <section className='uploaded-row'> 
                <AiFillFileImage color='#1475cf'/>
                <span className='upload-content'>
                    {filename} -
                    <MdDelete
                    onClick={() => {
                        setFileName("No selected File")
                        setImage(null)
                    }}
                    />
                </span>
            </section>


        </main>
    )
}



export default FrontUploader