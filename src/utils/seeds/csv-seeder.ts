import * as fs from 'fs';
import csv from 'csv-parser';

export interface CSVColumnsType {
  sigle: string;
  ap_name: string;
  status: string;
  funder: string;
  name: string;
  debut: string;
  end: string;
  amount: string;
  currency: string;
}

export async function parseCsvFile(
  filePath: string,
): Promise<CSVColumnsType[]> {
  const rows: CSVColumnsType[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => rows.push(data))
      .on('end', () => resolve(rows))
      .on('error', (error) => reject(error));
  });
}
