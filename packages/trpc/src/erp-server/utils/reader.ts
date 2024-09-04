import xlsx from 'xlsx';

export function readExcel(data: Uint8Array, sheetName: string) {
  const workbook = xlsx.read(data, { type: 'array' });

  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return;

  return xlsx.utils.sheet_to_json(sheet);
}
