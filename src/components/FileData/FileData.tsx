import React from 'react'
import ProductsTable from '../ProductsTable/ProductsTable.tsx';

function FileData( {setData, products, imageSrcs} ) {

  const [date, setDate] = React.useState("");
  const [errorMessage, showErrorMessage] = React.useState(false);

  React.useEffect(() => {
    setDate(new Date().toISOString().substr(0, 10));
  }, []);

  const handleImageChange = (src, resolution) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        const size = img.src.length;

        if (size > 6000) {
          const canvas = document.createElement('canvas');
          canvas.width = width * resolution;
          canvas.height = height * resolution;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width * resolution, height * resolution);
          const dataUrl = canvas.toDataURL();
          resolve(dataUrl);
        }
        else{
          resolve(src);
        }
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    let tableImages = document.querySelectorAll('.imageTable img')

    let blankImage = Array.from(tableImages).find((image : any) => image?.src === "");

    if(blankImage){
      showErrorMessage(true);
      return;
    }

    Array.from(tableImages).forEach((image : any, index) => {
      const imageSrc = image.src;
      const resolution = 0.4;

      handleImageChange(imageSrc, resolution)
      .then((dataUrl) => {
        products[index].imagen = dataUrl;
        completePdfCreation(e);
      })
      .catch((error) => {
        console.error(error);
      });

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
  }

  return (
    <div className='form'>
      <form onSubmit={handleSubmit} id='form'>
        <div style={{border: "solid 1px black", width: "310px", padding: "20px"}}>
          <label htmlFor="fecha">Fecha</label>
          <input type="date" id='fecha' name='fecha' value={date} required/><br/>
          <label htmlFor="cliente">Cliente</label>
          <input type="text" name='cliente' required/><br/>
          <label htmlFor="representante">Representante</label>
          <input type="text" name='representante' required/><br/>
          <label htmlFor="ref">Referencia</label>
          <input type="number" name='ref' required/><br/>
        </div>
        <ProductsTable products={products} imageSrcs={imageSrcs}/>
        {(errorMessage) && <p style={{color: "red", fontWeight: "bold", textAlign: "center"}}>Por favor ingresa todas las imagenes</p>}
        <input className='primary-button' type="submit" value={"Generar PDF"}/>
      </form>
    </div>
  )
}

export default FileData