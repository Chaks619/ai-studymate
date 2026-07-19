import axios from "axios";
import mammoth from "mammoth";
import * as XLSX from "xlsx";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

import { DOCUMENT_TYPE, type DocumentType } from "./document.file-types.js";

export interface ProcessedDocument {
  text: string;
  pageCount: number;
}

async function extractPdf(
  buffer: Buffer
): Promise<ProcessedDocument> {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = "";

  for (let pageNo = 1; pageNo <= pdf.numPages; pageNo++) {
    const page = await pdf.getPage(pageNo);
    const content = await page.getTextContent();

    text +=
      content.items
        .map((item: any) => ("str" in item ? item.str : ""))
        .join(" ") + "\n";
  }

  return { text: text.trim(), pageCount: pdf.numPages };
}

async function extractDocx(
  buffer: Buffer
): Promise<ProcessedDocument> {
  const { value } = await mammoth.extractRawText({ buffer });

  return { text: value.trim(), pageCount: 0 };
}

function extractXlsx(buffer: Buffer): ProcessedDocument {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // Each sheet becomes a titled CSV block — enough structure for the model to
  // reason about rows and columns without a spreadsheet renderer.
  const text = workbook.SheetNames.map((name) => {
    const sheet = workbook.Sheets[name];
    const csv = sheet ? XLSX.utils.sheet_to_csv(sheet) : "";
    return `## ${name}\n${csv}`;
  })
    .join("\n\n")
    .trim();

  return { text, pageCount: workbook.SheetNames.length };
}

function extractPlainText(buffer: Buffer): ProcessedDocument {
  return { text: buffer.toString("utf-8").trim(), pageCount: 0 };
}

export class DocumentProcessor {
  /**
   * Download the uploaded file and turn it into plain text. The type decides
   * which extractor runs; everything downstream only sees the text.
   */
  async extractText(
    fileUrl: string,
    type: DocumentType
  ): Promise<ProcessedDocument> {
    const response = await axios.get<ArrayBuffer>(fileUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(response.data);

    switch (type) {
      case DOCUMENT_TYPE.PDF:
        return extractPdf(buffer);

      case DOCUMENT_TYPE.DOCX:
        return extractDocx(buffer);

      case DOCUMENT_TYPE.XLSX:
        return extractXlsx(buffer);

      case DOCUMENT_TYPE.TXT:
      case DOCUMENT_TYPE.MD:
        return extractPlainText(buffer);

      default:
        throw new Error(`Unsupported document type: ${type}`);
    }
  }
}

export const documentProcessor = new DocumentProcessor();
