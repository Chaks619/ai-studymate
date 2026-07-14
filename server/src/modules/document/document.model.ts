import { Schema, model, type InferSchemaType, type HydratedDocument, Types } from 'mongoose';

import { DOCUMENT_LANGUAGE, DOCUMENT_STATUS } from './document.constants.js';

const documentSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    workspace: {
      type: Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      default: '',
      maxlength: 1000,
    },

    file: {
      originalName: {
        type: String,
        required: true,
      },

      mimeType: {
        type: String,
        required: true,
      },

      extension: {
        type: String,
        default: 'pdf',
      },

      size: {
        type: Number,
        required: true,
      },

      url: {
        type: String,
        required: true,
      },

      publicId: {
        type: String,
        required: true,
      },
    },

    processing: {
      status: {
        type: String,
        enum: Object.values(DOCUMENT_STATUS),
        default: DOCUMENT_STATUS.UPLOADING,
      },

      pageCount: {
        type: Number,
        default: 0,
      },

      language: {
        type: String,
        default: DOCUMENT_LANGUAGE.UNKNOWN,
      },
    },

    ai: {
      summaryGenerated: {
        type: Boolean,
        default: false,
      },

      flashcardsGenerated: {
        type: Boolean,
        default: false,
      },

      quizGenerated: {
        type: Boolean,
        default: false,
      },

      roadmapGenerated: {
        type: Boolean,
        default: false,
      },

      chatEnabled: {
        type: Boolean,
        default: false,
      },
    },

    extractedText: {
      type: String,
      default: '',
    },

    tags: [
      {
        type: String,
      },
    ],

    lastOpenedAt: {
      type: Date,
      default: null,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

documentSchema.index({ owner: 1, createdAt: -1 });

export type Document = InferSchemaType<typeof documentSchema>;
export type DocumentDocument = HydratedDocument<Document>;

export const DocumentModel = model<Document>(
  "Document",
  documentSchema
);
