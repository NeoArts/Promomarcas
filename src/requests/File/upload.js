import * as XLSX from 'xlsx';

export const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
      const products = [];

      const productIsValid = (sheet, row) => {
          return sheet[XLSX.utils.encode_cell({ r: row, c: 4 })]
      }

      const reader = new FileReader();

      reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          /* do something with the workbook */
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const range = XLSX.utils.decode_range(sheet['!ref']);
          
          for (let row = (range.s.r + 1); row <= 50; row++) {
              if (productIsValid(sheet, row)) {
                  let product = {
                      articulo: sheet[XLSX.utils.encode_cell({ r: row, c: 4 })].v,
                      marca: sheet[XLSX.utils.encode_cell({ r: row, c: 3 })].v,
                      unidades: sheet[XLSX.utils.encode_cell({ r: row, c: 6 })].v,
                      valor: parseInt(sheet[XLSX.utils.encode_cell({ r: row, c: 11 })].v),
                      imagen: ""
                  }

                  products.push(product);
              }
          }
          resolve(products);
      };

      reader.readAsArrayBuffer(file);
  });
};

