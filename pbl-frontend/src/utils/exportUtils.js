import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportToCSV = (data, fileName, kuisInfo) => {
  const csvContent = [
    ['Laporan Nilai Mahasiswa - Kuis Online PNB'],
    [''],
    ['Kuis:', kuisInfo.judul],
    ['Kelas:', kuisInfo.kelas],
    ['Mata Kuliah:', kuisInfo.matkul],
    ['Dosen Pengajar:', kuisInfo.dosen],
    [''],
    ['NIM', 'Nama', 'Nilai'],
    ...data.map(item => [item.nim, item.nama, item.nilai])
  ].map(row => row.join(',')).join('\n');

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
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Laporan Nilai Mahasiswa - Kuis Online PNB", 14, 15);
  
  doc.setFontSize(11);
  doc.text(`Kuis: ${kuisInfo.judul}`, 14, 25);
  doc.text(`Kelas: ${kuisInfo.kelas}`, 14, 32);
  doc.text(`Mata Kuliah: ${kuisInfo.matkul}`, 14, 39);
  doc.text(`Dosen Pengajar: ${kuisInfo.dosen}`, 14, 46);
  
  doc.autoTable({
    startY: 52,
    head: [['NIM', 'Nama', 'Nilai']],
    body: data.map(item => [item.nim, item.nama, item.nilai]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [66, 139, 202] }
  });

  doc.save(`${fileName}.pdf`);
};
