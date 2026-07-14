import { Types } from 'mongoose';
import type { JwtPayload } from 'jsonwebtoken';

import { uploadPdfToCloudinary } from '@/shared/utils/cloudinary-upload.js';

import { workspaceRepository } from '../workspace/workspace.repository.js';
import type { SafeUser } from '../user/user.mapper.js';

import { DOCUMENT_LANGUAGE, DOCUMENT_STATUS } from './document.constants.js';
import { documentProcessor } from './document.processor.js';
import { documentRepository } from './document.repository.js';
import { toDocumentResponse } from './document.mapper.js';

export class DocumentService {
  async uploadDocument(
    user: SafeUser,
    workspaceId: string,
    file: Express.Multer.File
  ) {
    const workspace = await workspaceRepository.findByIdAndOwner(
      workspaceId,
      user.id
    );

    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const uploadedFile = await uploadPdfToCloudinary(
      file.buffer,
      file.originalname
    );

    const document = await documentRepository.create({
      owner: new Types.ObjectId(user.id),

      workspace: new Types.ObjectId(workspaceId),

      title: file.originalname.replace(/\.pdf$/i, ''),

      description: '',

      file: {
        originalName: file.originalname,
        mimeType: file.mimetype,
        extension: 'pdf',
        size: file.size,
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
      },

      processing: {
        status: DOCUMENT_STATUS.PROCESSING,
        pageCount: 0,
        language: DOCUMENT_LANGUAGE.UNKNOWN,
      },

      extractedText: '',

      tags: [],

      lastOpenedAt: null,

      isArchived: false,
    });

    try {
      const fileUrl = document.file?.url;

      if (!fileUrl) {
        throw new Error('Document file URL is missing');
      }

      const processedDocument =
        await documentProcessor.extractText(fileUrl);

      const updatedDocument =
        await documentRepository.updateById(document.id, {
          extractedText: processedDocument.text,

          processing: {
            status: DOCUMENT_STATUS.READY,
            pageCount: processedDocument.pageCount,
            language: DOCUMENT_LANGUAGE.UNKNOWN,
          },
        });

      if (!updatedDocument) {
        throw new Error('Document not found');
      }

      return toDocumentResponse(updatedDocument);
    } catch (error) {
      console.error(error);

      await documentRepository.updateById(document.id, {
        processing: {
          status: DOCUMENT_STATUS.FAILED,
          pageCount: 0,
          language: DOCUMENT_LANGUAGE.UNKNOWN,
        },
      });

      throw new Error('Failed to process PDF');
    }
  }

  async getWorkspaceDocuments(
    user: JwtPayload,
    workspaceId: string
  ) {
    const documents =
      await documentRepository.findByWorkspace(
        new Types.ObjectId(workspaceId),
        new Types.ObjectId(user['id'])
      );

    return documents.map(toDocumentResponse);
  }

  async getById(
    user: JwtPayload,
    documentId: string
  ) {
    const document =
      await documentRepository.findById(
        new Types.ObjectId(documentId),
        new Types.ObjectId(user['id'])
      );

    if (!document) {
      return null;
    }

    return toDocumentResponse(document);
  }
}

export const documentService = new DocumentService();