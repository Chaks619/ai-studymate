import type { Types } from 'mongoose';
import { DocumentModel, type DocumentDocument } from './document.model.js';

import type { CreateDocumentInput, UpdateDocumentInput } from './document.types.js';

export class DocumentRepository {
  async create(data: CreateDocumentInput): Promise<DocumentDocument> {
    return await DocumentModel.create(data);
  }

  async findByIdAndOwner(documentId: string, ownerId: string): Promise<DocumentDocument | null> {
    return await DocumentModel.findOne({
      _id: documentId,
      owner: ownerId,
      isArchived: false,
    });
  }

  async findByIdAndWorkspace(
    documentId: string,
    workspaceId: string
  ): Promise<DocumentDocument | null> {
    return await DocumentModel.findOne({
      _id: documentId,
      workspace: workspaceId,
      isArchived: false,
    });
  }

  async findByOwner(ownerId: string): Promise<DocumentDocument[]> {
    return await DocumentModel.find({
      owner: ownerId,
      isArchived: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findByWorkspace(workspace: Types.ObjectId, owner: Types.ObjectId) {
    return DocumentModel.find({
      workspace,
      owner,
      isArchived: false,
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  async updateById(id: string, data: UpdateDocumentInput): Promise<DocumentDocument | null> {
    return await DocumentModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async archive(id: string): Promise<DocumentDocument | null> {
    return await DocumentModel.findByIdAndUpdate(
      id,
      {
        isArchived: true,
      },
      {
        new: true,
      }
    );
  }

  async findById(id: Types.ObjectId, owner: Types.ObjectId) {
    return DocumentModel.findOne({
      _id: id,
      owner,
      isArchived: false,
    }).lean();
  }
}

export const documentRepository = new DocumentRepository();
