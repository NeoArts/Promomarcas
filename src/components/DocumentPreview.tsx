import React from 'react'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PdfPage from './pdfPages/PdfPage.tsx';

function DocumentPreview( { data } : any) {

  const [pages, setPages] : any = React.useState([]);
  
  React.useEffect(() => { 
    if(data.products.length <= 6){

      let chunkSize = 3;
      let lastsetted = false;

      for (let i = 0; i < data.products.length; i += chunkSize) {
         
        const chunk = data.products.slice(i, i + chunkSize);
        let pdfData : any = {};
        
        pdfData.products = chunk;
        if(i === 0){
          pdfData.fecha = data.fecha;
          pdfData.cliente = data.cliente;
          pdfData.representante = data.representante;
          pdfData.ref = data.ref;
        }
  
        if(((i) === (data.products.length - 1) || (i+chunkSize > (data.products.length - 1))) && (pdfData.products.length <= 1)){
            pdfData.last = true;
            lastsetted = true
        }
        
        setPages(oldArray => [...oldArray, <PdfPage data={pdfData} />]);
      }
  
      if(!lastsetted){
        setPages(oldArray => [...oldArray, <PdfPage data={{last: true}} />]);
      }
    } 
    else{
      const chunk = data.products.slice(0, 3);
      let chunkSize = 4;
      let lastsetted = false;

      let pdfData : any = {
        products: chunk,
        fecha: data.fecha,
        cliente: data.cliente,
        representante: data.representante,
        ref: data.ref
      };
        
      setPages(oldArray => [...oldArray, <PdfPage data={pdfData} />]);

      for (let i = 3; i < data.products.length; i += chunkSize) {
         
        const chunk = data.products.slice(i, i + chunkSize);
        let pdfData : any = {};
        
        pdfData.products = chunk;
        if(i === 0){
          pdfData.fecha = data.fecha;
          pdfData.cliente = data.cliente;
          pdfData.representante = data.representante;
          pdfData.ref = data.ref;
        }
  
        if(((i) === (data.products.length - 1) || (i+chunkSize > (data.products.length - 1))) && (pdfData.products.length <= 1)){
            pdfData.last = true;
            lastsetted = true
        }
        
        setPages(oldArray => [...oldArray, <PdfPage data={pdfData} />]);
      }

      if(!lastsetted){
        setPages(oldArray => [...oldArray, <PdfPage data={{last: true}} />]);
      }
    }
  }, []);

  const addPageToPDF = async (pdf : jsPDF, element) => {
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL();
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);

    return pdf;
  }

  const downloadPdf = async () => {
    let pdf = new jsPDF();
    const elements = document.querySelectorAll('.pdf-page');
    
    if(elements.length > 0){
      for(var i = 0; i < elements.length; i++){
        pdf = await addPageToPDF(pdf, elements[i]);
        
        if(i !== elements.length - 1){
          pdf.addPage();
        }
      }
    }
      
    pdf.save('cotizacion.pdf');
  }

  return (
    <div>
      <button className='primary-button absolute-button' onClick={downloadPdf}>Download pdf</button>
      <div style={{
        width: "100%", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#9e9e9e", 
        paddingTop: "40px",
        paddingBottom: "40px",
        fontFamily: "Helvetica",
        fontSize: "9px"
      }}>
        {pages}
    </div>
    </div>
    
  )
}

export default DocumentPreview