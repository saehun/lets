import { TaskNotAvailableError } from '../error';
import { Task } from './task';

export class TaskRunner {
  private readonly tasks: Task[] = [];

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

    const onErrorStack: Array<() => Promise<void>> = [];

    try {
      for (const task of this.tasks) {
        onErrorStack.push(task.onError.bind(task));
        await task.execute();
      }
    } catch (e) {
      for (const onError of onErrorStack.reverse()) {
        await onError();
      }
      throw e;
    }
  }
}
