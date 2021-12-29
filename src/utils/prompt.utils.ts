import { AbortException } from '../core/error';

export function onAboart(): never {
  throw new AbortException(`bye bye 👋`);
}
