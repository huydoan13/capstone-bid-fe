import { useState } from 'react'
import { MdCloudUpload, MdDelete } from 'react-icons/md'
import { AiFillFileImage } from 'react-icons/ai'
import './index.css'




function BackUploader() {
    const [backimage, setbackImage] = useState(null)
    const [backfilename, setbackFileName] = useState("No file Selected")

     const handleUpload =(x)=>{
        
        console.log(x.target.files[0])

        if(x.target.files[0]){
            setbackImage(URL.createObjectURL(x.target.files[0]))
        }
     }



    return (
        <main>
            <uploadForm
                onClick={() => document.querySelector(".back-input-field").click()}
            >
                <input type="file" accept='image/*' className='back-input-field' hidden
                    onChange={handleUpload} />
                {backimage ?
                    <img src={backimage} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} alt={backfilename} />
                    :
                    <>
                        <MdCloudUpload color='#1475cf' size={60} />
                        <p>Tải lên ảnh mặt sau CMND/CCCD</p>                       
                    </>



                }


            </uploadForm>
            <section className='uploaded-row'> 
                <AiFillFileImage color='#1475cf'/>
                <span className='upload-content'>
                    {backfilename} -
                    <MdDelete
                    onClick={() => {
                        setbackFileName("No selected File")
                        setbackImage(null)
                    }}
                    />
                </span>
            </section>


        </main>
    )
}



export default BackUploader