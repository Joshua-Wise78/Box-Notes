export type SidebarTab = 'files' | 'search' | 'plugins' | 'settings';

export interface FileMetadata {
  id: string;
  name: string;
  isDirty: boolean;
}
