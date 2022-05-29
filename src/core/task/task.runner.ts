import { TaskNotAvailableError } from '../error';
import { Task } from './task';

export class TaskRunner {
  private readonly tasks: Task[] = [];
  private readonly onErrorHandlers: Array<() => Promise<void>> = [];

  register(task: Task): TaskRunner {
    this.tasks.push(task);
    return this;
  }

  async run(): Promise<void> {
    for (const task of this.tasks) {
      if (typeof task.canExecute === 'function') {
        const { available, reason } = await task.canExecute();
        if (!available) {
          throw new TaskNotAvailableError(task.name, reason);
        }
      }
    }

    try {
      for (const task of this.tasks) {
        this.onErrorHandlers.push(() => task.onErrorBefore());
        await task.execute();
        this.onErrorHandlers.pop();
        this.onErrorHandlers.push(() => task.onErrorAfter());
      }
    } catch (e) {
      await this.onError();
      throw e;
    }
  }

  private async onError() {
    for (const onError of this.onErrorHandlers.reverse()) {
      await onError();
    }
  }
}
