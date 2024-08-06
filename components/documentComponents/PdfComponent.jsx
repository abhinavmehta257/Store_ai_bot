import React, { useRef } from 'react';
import { renderToString } from 'react-dom/server';
import htmlToPdfmake from 'html-to-pdfmake';
import { pdfMake } from 'pdfmake/build/vfs_fonts';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Document } from '../Document';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PdfComponent = () => {
  const pdfRef = useRef();

  const generatePdf = () => {
    const htmlString = renderToString(<Document/>);
    const pdfDoc = htmlToPdfmake(htmlString);
    console.log(htmlString);
    
    const documentDefinition = { content: pdfDoc };
    pdfMake.createPdf(documentDefinition).open();
  };

  return (
    <div>
      <Document/>
      <button onClick={generatePdf} className="mt-4 p-2 bg-green-500 text-white">Generate PDF</button>
    </div>
  );
};

export default PdfComponent;
