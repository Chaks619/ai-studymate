import axios from "axios";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface ProcessedDocument {
  text: string;
  pageCount: number;
}

export class DocumentProcessor {
  async extractText(pdfUrl: string): Promise<ProcessedDocument> {
    const response = await axios.get<ArrayBuffer>(pdfUrl, {
      responseType: "arraybuffer",
    });

    const pdfData = new Uint8Array(response.data);

    const pdf = await getDocument({
      data: pdfData,
    }).promise;

    let extractedText = "";

    for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
      const page = await pdf.getPage(pageNo);

      const textContent = await page.getTextContent();

      extractedText +=
        textContent.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ") + "\n";
    }

    return {
      text: extractedText.trim(),
      pageCount: pdf.numPages,
    };
  }
}

export const documentProcessor = new DocumentProcessor();