import { generateMessageFile } from '../../lib/messages.js';
import type { ProjectInput } from '../../types.js';

export const path = 'messages/it.json';

export function generate(input: ProjectInput) {
  return generateMessageFile('it', input);
}
