import logger from '@root/logger.js';

const knownDirectivePrefixes = ['OVPN_ACCESS_SERVER'] as const;

export type ParsedDirectives = Record<string, string>;

function isIgnoredDirective(line: string): boolean {
  const ignoredDirectives = [
    'OVPN_ACCESS_SERVER_CLI_PREF_ALLOW_WEB_IMPORT',
    'OVPN_ACCESS_SERVER_CLI_PREF_BASIC_CLIENT',
    'OVPN_ACCESS_SERVER_CLI_PREF_ENABLE_CONNECT',
    'OVPN_ACCESS_SERVER_CLI_PREF_ENABLE_XD_PROXY',
    'OVPN_ACCESS_SERVER_WEB_CA_BUNDLE_START',
    'OVPN_ACCESS_SERVER_WEB_CA_BUNDLE_END',
    'OVPN_ACCESS_SERVER_IS_OPENVPN_WEB_CA',
    'OVPN_ACCESS_SERVER_OVPN_ACCESS_SERVER_NO_WEB'
  ];

  for (const ignoredDirective of ignoredDirectives) {
    const regex = new RegExp(`^\\s*#\\s+${ignoredDirective}`);
    const match = line.match(regex);
    if (match) return true;
  }

  return false;
}

export function filterDirectiveLines(lines: string[]): [string[], string[]] {
  const leftoverLines: string[] = [];
  const directiveLines: string[] = [];

  for (const line of lines) {
    const isDirective = line.trimStart().startsWith('#');

    if (isDirective) {
      directiveLines.push(line);
      continue;
    }

    leftoverLines.push(line);
  }

  return [directiveLines, leftoverLines];
}

export default function parseDirectives(lines: string[]): ParsedDirectives {
  logger.info('Parsing directives...');
  logger.debug('directive lines:', lines);

  const directives: ParsedDirectives = {};
  const filteredLines = lines.filter((l) => !isIgnoredDirective(l));

  for (const directivePrefix of knownDirectivePrefixes) {
    logger.info(`Looking for "${directivePrefix}" directives`);
    const regex = new RegExp(`^\\s*#\\s+${directivePrefix}_(.+)=(.+)`);

    for (const line of filteredLines) {
      const match = line.match(regex);
      if (!match || !match[1] || !match[2]) continue;

      logger.info(
        `Found "${directivePrefix}" directive: ${match[1]}=${match[2]}`
      );
      directives[match[1]] = match[2];
    }
  }

  return directives;
}
