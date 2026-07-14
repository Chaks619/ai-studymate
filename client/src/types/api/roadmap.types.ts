export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  resources?: string[];
  completed: boolean;
  duration?: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description?: string;
  steps: RoadmapStep[];
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
}
