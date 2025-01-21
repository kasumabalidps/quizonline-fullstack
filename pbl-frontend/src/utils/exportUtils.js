import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
