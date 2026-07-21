export class CreateRoadmapDto {
  topic!: string;
  level!: 'beginner' | 'intermediate' | 'advanced';
}

export class UpdateRoadmapProgressDto {
  stepIndex!: number;
  completed!: boolean;
}
