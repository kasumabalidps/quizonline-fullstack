import * as XLSX from 'xlsx';

export const exportToExcel = (data, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Nilai");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

export const exportToCSV = (data, fileName) => {
  // Convert data to CSV format
  const csvContent = [
    // Header
    ['NIM', 'Nama', 'Nilai'],
    // Data rows
    ...data.map(item => [
      item.nim,
      item.nama,
      item.nilai
    ])
  ].map(row => row.join(',')).join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (data, fileName, kuisInfo) => {
  // Create HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .header { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
      </style>
    </head>
    <body>
      <div class="header">
        <h2>Laporan Nilai Mahasiswa</h2>
        <p>Kuis: ${kuisInfo.judul}</p>
        <p>Kelas: ${kuisInfo.kelas}</p>
        <p>Mata Kuliah: ${kuisInfo.matkul}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>NIM</th>
            <th>Nama</th>
            <th>Nilai</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr>
              <td>${item.nim}</td>
              <td>${item.nama}</td>
              <td>${item.nilai}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Open in new window for printing
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();

  // Add filename to the print dialog
  const style = printWindow.document.createElement('style');
  style.textContent = '@page { size: auto; margin: 20mm; }';
  printWindow.document.head.appendChild(style);
  
  // Print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};
