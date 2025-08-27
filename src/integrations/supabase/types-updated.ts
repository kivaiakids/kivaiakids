// Types mis à jour pour inclure les objectifs d'apprentissage
export interface CourseRow {
  id: string;
  title: string;
  description: string | null;
  category: string;
  is_premium: boolean;
  file_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  thumbnail_url: string | null;
  duration_minutes: number | null;
  created_by: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  content: string | null;
  learning_objective_1: string | null;
  learning_objective_2: string | null;
  learning_objective_3: string | null;
}

export interface CourseInsert {
  id?: string;
  title: string;
  description?: string | null;
  category: string;
  is_premium?: boolean;
  file_url?: string | null;
  video_url?: string | null;
  audio_url?: string | null;
  thumbnail_url?: string | null;
  duration_minutes?: number | null;
  created_by?: string | null;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
  content?: string | null;
  learning_objective_1?: string | null;
  learning_objective_2?: string | null;
  learning_objective_3?: string | null;
}

export interface CourseUpdate {
  id?: string;
  title?: string;
  description?: string | null;
  category?: string;
  is_premium?: boolean;
  file_url?: string | null;
  video_url?: string | null;
  audio_url?: string | null;
  thumbnail_url?: string | null;
  duration_minutes?: number | null;
  created_by?: string | null;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
  content?: string | null;
  learning_objective_1?: string | null;
  learning_objective_2?: string | null;
  learning_objective_3?: string | null;
}
