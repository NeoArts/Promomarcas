import React from 'react'

function ProductsTable( {products, imageSrcs} ) {

  const [activeRow, setActiveRow] = React.useState(-1);

  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: "3%"}}>
      <h2>Copia y pega las imagenes en las celdas correspondientes a cada producto: </h2><br/>
      <table className='products-preview' style={{width: "100%", fontSize: "1.1rem", borderCollapse: "collapse", marginBottom: "40px"}}>
        <thead>
          <tr>
            <th style={{border: "solid 1px black", width: "120px", height: "20px", color: "white", background: "#404040"}}>ARTICULO</th>
            <th style={{border: "solid 1px black", width: "80px", height: "20px", color: "white", background: "#404040"}}>Imagen</th>
          </tr>
        </thead>
        <tbody>
          {(products.length > 0) ? Array.from(products).map((product : any, index : any) => 
            <tr onClick={() => setActiveRow(index)}>
              <td style={{border: "solid 1px black"}}>{product.articulo}</td>
              <td className='imageTable' style={{border: "solid 1px black", textAlign: "center", maxWidth: "100px"}}>
                <img src={imageSrcs[index]} style={{width: "100px"}}/>
              </td>
            </tr>
          ) : <tr></tr>}  
        </tbody> 
      </table>
    </div>
  )
}

export default ProductsTable