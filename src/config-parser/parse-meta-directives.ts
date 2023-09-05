import logger from '@root/logger.js';

const knownMetaDirectivePrefixes = ['OVPN_ACCESS_SERVER'] as const;

export type ParsedMetaDirectives = Record<string, string>;

function isMultilineMetaDirective(line: string): boolean {
  for (const metaPrefix of knownMetaDirectivePrefixes) {
    if (
      line.startsWith(metaPrefix) &&
      (line.endsWith('_START') || line.endsWith('_END'))
    ) {
      return true;
    }
  }

  return false;
}

function _isIgnoredMetaDirective(line: string): boolean {
  const ignoredMetaDirectives = [
    'OVPN_ACCESS_SERVER_CLI_PREF_ALLOW_WEB_IMPORT',
    'OVPN_ACCESS_SERVER_CLI_PREF_BASIC_CLIENT',
    'OVPN_ACCESS_SERVER_CLI_PREF_ENABLE_CONNECT',
    'OVPN_ACCESS_SERVER_CLI_PREF_ENABLE_XD_PROXY',
    'OVPN_ACCESS_SERVER_IS_OPENVPN_WEB_CA',
    'OVPN_ACCESS_SERVER_OVPN_ACCESS_SERVER_NO_WEB'
  ];

  for (const ignoredMetaDirective of ignoredMetaDirectives) {
    const regex = new RegExp(`^\\s*#\\s+${ignoredMetaDirective}`);
    const match = line.match(regex);
    if (match) return true;
  }

  return false;
}

export function filterMetaDirectiveLines(
  lines: string[]
): [string[], string[]] {
  const leftoverLines: string[] = [];
  const metaDirectiveLines: string[] = [];

  for (const line of lines) {
    const isMetaDirective = line.trimStart().startsWith('#');

    if (isMetaDirective) {
      metaDirectiveLines.push(line);
      continue;
    }

    leftoverLines.push(line);
  }

  return [metaDirectiveLines, leftoverLines];
}

export default function parseMetaDirectives(
  lines: string[]
): ParsedMetaDirectives {
  logger.info('Parsing directives...');
  logger.debug('directive lines:', lines);

  const metaDirectives: ParsedMetaDirectives = {};
  const filteredLines = lines.filter((l) => !isMultilineMetaDirective(l));

  for (const metaDirectivePrefix of knownMetaDirectivePrefixes) {
    logger.info(`Looking for "${metaDirectivePrefix}" directives`);
    const regex = new RegExp(`^\\s*#\\s+(${metaDirectivePrefix}_.+)=(.+)`);

    for (const line of filteredLines) {
      const match = line.match(regex);
      if (!match || !match[1] || !match[2]) continue;

      logger.info(
        `Found "${metaDirectivePrefix}" directive: ${match[1]}=${match[2]}`
      );
      metaDirectives[match[1]] = match[2];
    }
  }

  return metaDirectives;
}
