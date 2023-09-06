import logger from '@root/logger.js';

export type ParsedOptions = Record<string, string[]>;

export default function parseOptions(lines: string[]): ParsedOptions {
  logger.info('Parsing options...');
  const options: ParsedOptions = {};

  for (const line of lines) {
    const segments = line
      .split(' ')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (segments.length === 1) {
      options[segments[0]] = ['NOARGS'];
      continue;
    }

    const key = segments[0];
    const value = segments.slice(1).join(' ');
    const container = options[key] || [];

    container.push(value);
    options[key] = container;
  }

  logger.debug('Parsed options:', options);
  return options;
}
