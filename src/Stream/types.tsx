
export interface Datum {
  id: string;
  title: string;
  description: string;
  created: number;
  edited: number | null;
  parentId: string| null;
} 

export interface StreamStore {
  data: Record<string, Datum>;
  rootIds: string[];
}
