import * as ExcelJS from "exceljs";

export type TJsonData = Array<{
  [key: string]: ExcelJS.ValueType;
}>;

export type TDataset = {
  columns?: ({ title: any } & IExcelJSColumn)[] | [];
  data: ({ value: any; style?: IExcelJSStyle }[] | [])[];
}[];

export interface IExcelJSColumn {
  key?: any;
  width?: number;
  style?: IExcelJSStyle;
  header?: string;
  outlineLevel?: number;
  hidden?: boolean;
  border?: Partial<ExcelJS.Borders>;
  fill?: ExcelJS.Fill;
  numFmt?: string;
  font?: Partial<ExcelJS.Font>;
  alignment?: Partial<ExcelJS.Alignment>;
  protection?: Partial<ExcelJS.Protection>;
}

export interface IExcelJSStyle {
  numFmt?: string;
  font?: Partial<ExcelJS.Font>;
  alignment?: Partial<ExcelJS.Alignment>;
  protection?: Partial<ExcelJS.Protection>;
  border?: Partial<ExcelJS.Borders>;
  fill?: ExcelJS.Fill;
}

export interface IJsonToExcel {
  filename: string;
  data: {
    [sheetName: string]: {
      json: TJsonData;
      headerRowStart?: number;
      headerCells?: IExcelJSStyle;
      dataCells?: IExcelJSStyle;
      cells?: IExcelJSStyle;
    };
  };
  cb?: (wb: ExcelJS.Workbook, ws: ExcelJS.Worksheet, data: TJsonData) => void;
}

export interface IDatasetToExcel {
  filename: string;
  data: {
    [sheetName: string]: TDataset;
  };
  cb?: (wb: ExcelJS.Workbook, ws: ExcelJS.Worksheet, data: TDataset) => void;
}

export interface IExcelRow {
  [key: string]: any;
}

export const jsonToExcel = ({ filename, data, cb }: IJsonToExcel) => {
  const workbook = new ExcelJS.Workbook();

  Object.keys(data).forEach((sheetName) => {
    const worksheet = workbook.addWorksheet(sheetName);

    const jsonData = data[sheetName].json;

    const headerCells: any | undefined = data[sheetName].headerCells;
    const headerRowStart: number | undefined = data[sheetName].headerRowStart;
    const dataCells: any | undefined = data[sheetName].dataCells;
    const cells: any | undefined = data[sheetName].cells;

    const headers = Object.keys(jsonData[0]);

    jsonData.forEach((obj, index) => {
      // Add header row
      if (headerRowStart) {
        if (index + 1 === headerRowStart) worksheet.addRow(headers);
      } else {
        if (index === 0) worksheet.addRow(headers);
      }

      // Add data rows
      const values = Object.values(obj);
      worksheet.addRow(values);
    });

    // Apply styling to header row if any
    if (headerCells) {
      worksheet
        .getRow(headerRowStart ? headerRowStart : 1)
        .eachCell((cell: any) => {
          Object.keys(headerCells).forEach((headerCell) => {
            cell[headerCell] = headerCells[headerCell];
          });
        });
    }

    // Apply styling to data rows
    if (dataCells) {
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber !== 1) {
          row.eachCell((cell: any) => {
            Object.keys(dataCells).forEach((dataCell) => {
              cell[dataCell] = dataCells[dataCell];
            });
          });
        }
      });
    }

    // Apply styling to all rows
    if (cells) {
      worksheet.eachRow((row) => {
        row.eachCell((cell: any) => {
          Object.keys(cells).forEach((cellItem) => {
            cell[cellItem] = cells[cellItem];
          });
        });
      });
    }

    // Auto-fit column widths
    headers.forEach((header, index) => {
      const column = worksheet.getColumn(index + 1); // Columns are 1-indexed
      let maxLength = header.length;
      worksheet.eachRow({ includeEmpty: true }, (row) => {
        const cell = row.getCell(
          headerRowStart ? headerRowStart + index : index + 1 // If headerRowStart is setted header will start from row headerRowStart
        );
        if (cell.value) {
          const cellLength = cell.value.toString().length;
          if (cellLength > maxLength) {
            maxLength = cellLength;
          }
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2; // Set a minimum width of 10
    });

    if (cb) cb(workbook, worksheet, jsonData);
  });

  // Convert workbook to XLSX file format
  const workbookBlob = workbook.xlsx.writeBuffer().then((buffer) => {
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  });

  // Create object URL for the Blob
  workbookBlob.then((blob) => {
    const url = window.URL.createObjectURL(blob);

    // Create anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();

    // Clean up object URL
    window.URL.revokeObjectURL(url);
  });
};

export const datasetToExcel = ({ filename, data, cb }: IDatasetToExcel) => {
  const workbook = new ExcelJS.Workbook();

  Object.keys(data).forEach((sheetName) => {
    const worksheet = workbook.addWorksheet(sheetName);

    const dataSetData = data[sheetName];

    dataSetData.forEach((sheetData) => {
      if (sheetData.columns) {
        const excelRow = worksheet.addRow(
          sheetData.columns.map((column) => column.title)
        );

        sheetData.columns.forEach((column, columnIndex) => {
          const col = worksheet.getColumn(columnIndex + 1);
          const cell = excelRow.getCell(columnIndex + 1);

          col.width = column.width || String(column.title).length;
          if (column.header) col.header = column.header;
          if (column.hidden) col.hidden = column.hidden;
          if (column.key) col.key = column.key;
          if (column.outlineLevel) col.outlineLevel = column.outlineLevel;
          if (column.alignment) col.alignment = column.alignment;
          if (column.border) col.border = column.border;
          if (column.fill) col.fill = column.fill;
          if (column.font) col.font = column.font;
          if (column.numFmt) col.numFmt = column.numFmt;
          if (column.protection) col.protection = column.protection;
          if (column.style) {
            if (column.style.alignment) cell.alignment = column.style.alignment;
            if (column.style.border) cell.border = column.style.border;
            if (column.style.fill) cell.fill = column.style.fill;
            if (column.style.font) cell.font = column.style.font;
            if (column.style.numFmt) cell.numFmt = column.style.numFmt;
            if (column.style.protection)
              cell.protection = column.style.protection;
          }
        });
      }

      sheetData.data.forEach((row) => {
        const excelRow = worksheet.addRow(row.map((cell) => cell.value)); // Adding each row to the worksheet
        row.forEach((cell, columnIndex) => {
          const excelCell = excelRow.getCell(columnIndex + 1);
          if (cell.style) {
            if (cell.style.alignment)
              excelCell.alignment = cell.style.alignment;
            if (cell.style.border) excelCell.border = cell.style.border;
            if (cell.style.fill) excelCell.fill = cell.style.fill;
            if (cell.style.font) excelCell.font = cell.style.font;
            if (cell.style.numFmt) excelCell.numFmt = cell.style.numFmt;
            if (cell.style.protection)
              excelCell.protection = cell.style.protection;
          }
        });
      });
    });

    if (cb) cb(workbook, worksheet, dataSetData);
  });

  // Convert workbook to XLSX file format
  const workbookBlob = workbook.xlsx.writeBuffer().then((buffer) => {
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  });

  // Create object URL for the Blob
  workbookBlob.then((blob) => {
    const url = window.URL.createObjectURL(blob);

    // Create anchor element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xlsx`;
    link.click();

    // Clean up object URL
    window.URL.revokeObjectURL(url);
  });
};

export const excelToJson = (
  file: File | null,
  headerRowStart?: number
): Promise<IExcelRow[]> => {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(data as any);

          const sheet = workbook.worksheets[0]; // Get the first worksheet
          const jsonData: IExcelRow[] = [];

          sheet.eachRow((row, rowNum) => {
            if (rowNum !== 1) {
              // Skip header row
              const rowData: IExcelRow = {};
              row.eachCell((cell, colNum) => {
                const headerCell = sheet
                  .getRow(headerRowStart ? headerRowStart : 1)
                  .getCell(colNum);
                const headerKey = headerCell?.value?.toString() ?? ""; // Use empty string as default key
                const cellValue = cell.value;
                rowData[headerKey] = cellValue;
              });
              jsonData.push(rowData);
            }
          });

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("No file provided"));
    }
  });
};
