
import React from 'react'
import { uploadFile } from '../../requests/File/upload.js'

function FileInput( {setProducts} ) {

  const fileInput = React.useRef<HTMLInputElement>(null);
  
  const fileInputDropArea = React.createRef<HTMLInputElement>();

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file : any = event.dataTransfer?.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement> | File) => {
    let file;
    if (event instanceof File) {
      file = event;
    } else {
      file = event.target.files?.[0];
    }
    
    if (!file) {
      return;
    }
    
    uploadFile(file).then((products) => {
      if(products){
        setProducts(products);
      }
    });
    
  };

  return (
    <div style={{height: "100vh", display: "flex", flexDirection: "column"}}>
      <input style={{display: 'none'}}
        type="file"
        accept=".xlsx"
        ref={fileInput}
        onChange={handleFileChange}
      />
      <div style={{padding: "100px", height: "80%"}}>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            width: "100%", 
            height: "100%",
            border: "2px dashed gray",
            textAlign: "center",
            lineHeight: "400px",
            display: "flex", 
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          Drop files here
        </div>
      </div>
      <div style={{display: "flex", justifyContent: "center", height: "20%"}}>
        <button onClick={() => fileInput.current?.click()} className={"primary-button"}>
          Select Excel File
        </button>
      </div>
    </div>
  )
}

export default FileInput