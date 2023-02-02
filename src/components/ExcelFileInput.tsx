import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import DocumentPreview from './DocumentPreview.tsx';
import '../styles/styles.css'
import FileInput from './FileInput/FileInput.tsx';
import FileData from './FileData/FileData.tsx';

function ExcelFileInput() {
  
  const [products, setProducts] : any = React.useState([]);
  const [data, setData] = useState({});
  const [imageSrcs, setImageSrcs] = useState(Array(products.length).fill(null));
  
  useEffect(() => {

    const handlePaste = (e, index) => {
      const clipboardData = e.clipboardData || e.clipboardData;
      const file = clipboardData.files[0];

      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const src = reader.result;
        setImageSrcs(prev => {
          const newImageSrcs = [...prev];
          newImageSrcs[index] = src;
          return newImageSrcs;
        });
      };
    };

    // Attach event listeners to each image cell
    const imageCells = document.querySelectorAll('.imageTable');
    imageCells.forEach((cell, index) => {
      cell.addEventListener('paste', e => handlePaste(e, index));
    });
  }, [products.length]);

  return (
    <>
      {(Object.keys(data).length === 0) && <div>  
        {(products.length === 0) && <FileInput setProducts={setProducts} />}
        {(products.length > 0) && 
          <div>
            <FileData setData={setData} products={products} imageSrcs={imageSrcs}/>
          </div>}
      </div>}
      {(Object.keys(data).length !== 0) && <DocumentPreview data={data}/>}
    </>
  );
}

export default ExcelFileInput;