export interface Task {
  name: string;
  execute: () => Promise<void>;
  onErrorBefore: () => Promise<void>;
  onErrorAfter: () => Promise<void>;
  canExecute?: () => Promise<{ available: boolean; reason: string }>;
}
