export interface Task {
  name: string;
  execute: () => Promise<void>;
  onError: () => Promise<void>;
  canExecute?: () => Promise<{ available: boolean; reason: string }>;
}
