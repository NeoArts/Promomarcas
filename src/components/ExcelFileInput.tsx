import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import { uploadFile } from '../requests/File/upload.js';
import DocumentPreview from './DocumentPreview.tsx';

function ExcelFileInput() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [products, setProducts] : any = useState([]);
  const [data, setData] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [showImagesTable, setShowImagesTable] = useState(false);
  const [uploadedFile, setUploadedFile] : any = useState(null);

  const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    
    debugger;
    uploadFile(file).then((products) => {
      if(products){
        setProducts(products);
        setShowImagesTable(true);
      }
    });
    
  };

  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date().toISOString().substr(0, 10));
  }, []);

  function imageIsJPEG(src) {
    const fileExtension = src.split('.').pop(); // Extracts the file extension
    return (fileExtension.toLowerCase() === 'jpeg');
  }
  

  function handleSubmit(e) {
    e.preventDefault();

    let tableImages = document.querySelectorAll('.imageTable img')

    Array.from(tableImages).forEach((image : any, index) => {
      debugger;
      if(!imageIsJPEG(image.src)){
        const img = new Image();
  
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const size = img.src.length;
          debugger;
          if(size > 60){
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL();
        
            products[index].imagen = dataUrl;
            completePdfCreation(e); 
          }
          else{
            products[index].imagen = image.src;
            completePdfCreation(e); 
          }
        };
  
        img.src = image.src;
      }
      else{
        products[index].imagen = image.src;
        completePdfCreation(e); 
      }
    });
    
    
  }

  const completePdfCreation = (e : any) =>{
    let data = {
      fecha: e.target[0].value,
      cliente: e.target[1].value,
      representante: e.target[2].value,
      ref: e.target[3].value,
      products: products
    }
    
    setData(data);
    setShowPreview(true);
  }

  document.onpaste = (evt) => {
    const dT = evt.clipboardData || evt.clipboardData;
    const file = dT?.files[ 0 ];
    
    setTimeout(() => {
      let images = document.querySelectorAll('.imageTable img');

      Array.from(images).forEach((image : any) => {
        image.style.width = "100px";
      });
    }, 100);
    
  };

  return (
    <>
      <input style={{display: 'none'}}
        type="file"
        accept=".xlsx"
        ref={fileInput}
        onChange={handleFileChange}
      />
      <button onClick={() => fileInput.current?.click()}>
        Select Excel File
      </button>
      {showImagesTable && 
        <table style={{width: "100%", fontSize: "1.1rem"}}>
        <thead>
          <tr>
            <th style={{border: "solid 1px black", width: "120px", height: "20px", color: "white", background: "#404040"}}>ARTICULO</th>
            <th style={{border: "solid 1px black", width: "80px", height: "20px", color: "white", background: "#404040"}}>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {(products.length > 0) ? Array.from(products).map((product : any, index : number) => 
            <tr>
              <td style={{border: "solid 1px black"}}>{product.articulo}</td>
              <td className='imageTable' style={{border: "solid 1px black", textAlign: "center", maxWidth: "100px"}} contentEditable></td>
            </tr>
          ) : <tr></tr>}  
        </tbody> 
      </table>
      }

      <form onSubmit={handleSubmit} id='form'>
        <label htmlFor="fecha">Fecha</label>
        <input type="date" id='fecha' name='fecha' value={date}/><br/>
        <label htmlFor="cliente">Cliente</label>
        <input type="text" name='cliente'/><br/>
        <label htmlFor="representante">Representante</label>
        <input type="text" name='representante'/><br/>
        <label htmlFor="ref">Referencia</label>
        <input type="number" name='ref'/><br/>
        <input type="submit" value={"Generar PDF"}/>
      </form>
      {showPreview && <DocumentPreview data={data}/>}
    </>
  );
}

export default ExcelFileInput;