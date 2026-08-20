import * as XLSX from "xlsx"
export const parseExcelStockSheet = (file) => {
    return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Target the absolute first worksheet tab in the workbook
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse into a row-by-row matrix object array
        const rawJsonRows = XLSX.utils.sheet_to_json(worksheet);
        
        // Normalize object keys to match your frontend input fields cleanly
        const normalizedRows = rawJsonRows.map((row, index) => ({
          id: `UPLOADED-${index + 1}-${Date.now()}`,
          product_name: row['PRODUCT NAME'] || row['Product Name'] || '',
          selling_price: Number(row['SELLING PRICE']) || Number(row['Selling Price']) || 0,
          quantity: Number(row['QUANTITY']) || Number(row['Quantity']) || 0
        }));

        resolve(normalizedRows);
      } catch (err) {
        reject(new Error("Parsing Failed: Make sure your spreadsheet columns match the base blueprint template."));
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}