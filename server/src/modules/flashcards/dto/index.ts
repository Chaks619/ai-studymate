export class CreateFlashcardDto {
  front: string;
  back: string;
}

export class UpdateFlashcardDto {
  front?: string;
  back?: string;
}

export class CreateFlashcardSetDto {
  name: string;
  description?: string;
}
