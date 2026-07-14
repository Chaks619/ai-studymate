import {
  Schema,
  model,
  Types,
  type HydratedDocument,
} from "mongoose";

import { FLASHCARD_STATUS } from "./flashcard.constants.js";
import type { Flashcard } from "./flashcard.types.js";

const flashcardSchema = new Schema(
  {
    document: {
      type: Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true,
      index: true,
    },

    title: {
      type: String,
      default: "",
    },

    cards: [
      {
        question: {
          type: String,
          required: true,
        },

        answer: {
          type: String,
          required: true,
        },

        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium",
        },
      },
    ],

    status: {
      type: String,
      enum: Object.values(FLASHCARD_STATUS),
      default: FLASHCARD_STATUS.GENERATING,
    },

    model: {
      type: String,
      required: true,
    },

    generationTimeMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export type FlashcardDocument =
  HydratedDocument<Flashcard>;

export const FlashcardModel =
  model<Flashcard>(
    "Flashcard",
    flashcardSchema
  );