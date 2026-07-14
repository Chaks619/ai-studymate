import {
  Schema,
  model,
  Types,
  type HydratedDocument,
} from "mongoose";

import { QUIZ_STATUS } from "./quiz.constants.js";
import type { Quiz } from "./quiz.types.js";

const quizSchema = new Schema(
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

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        options: [
          {
            type: String,
            required: true,
          },
        ],

        correctAnswer: {
          type: Number,
          required: true,
        },

        explanation: {
          type: String,
          default: "",
        },

        difficulty: {
          type: String,
          enum: [
            "easy",
            "medium",
            "hard",
          ],
          default: "medium",
        },
      },
    ],

    status: {
      type: String,
      enum: Object.values(QUIZ_STATUS),
      default: QUIZ_STATUS.GENERATING,
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

export type QuizDocument =
  HydratedDocument<Quiz>;

export const QuizModel = model<Quiz>(
  "Quiz",
  quizSchema
);