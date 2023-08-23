import logger from '@root/logger.js';

export enum CertificateType {
  CA = 'ca',
  CERT = 'cert',
  KEY = 'key',
  TLS_AUTH = 'tls-auth',
  TLS_CRYPT = 'tls-crypt',
  CRL_VERIFY = 'crl-verify'
}

export const certificateTypes = [
  CertificateType.CA,
  CertificateType.CERT,
  CertificateType.KEY,
  CertificateType.TLS_AUTH,
  CertificateType.TLS_CRYPT,
  CertificateType.CRL_VERIFY
];

export type ParsedCertificates = Partial<Record<CertificateType, string>>;
export type CertificateLines = Partial<Record<CertificateType, string[]>>;

function isStartTag(line: string): CertificateType | false {
  for (const type of certificateTypes) {
    const isTag = line.trim() === `<${type}>`;
    if (isTag) {
      return type;
    }
  }

  return false;
}

function isEndTag(line: string): CertificateType | false {
  for (const type of certificateTypes) {
    const isTag = line.trim() === `</${type}>`;
    if (isTag) {
      return type;
    }
  }

  return false;
}

export function filterCertificateLines(
  lines: string[]
): [CertificateLines, string[]] {
  const certificateLines: CertificateLines = {};
  const leftoverLines: string[] = [];
  let currentTag: CertificateType | false = false;

  for (const line of lines) {
    const startTag = isStartTag(line);
    const endTag = isEndTag(line);

    if (currentTag && startTag) {
      throw new Error(
        `Malformed profile: expected closing tag "${currentTag}", but found opening tag "${startTag}" instead`
      );
    }

    if (currentTag && endTag && currentTag !== endTag) {
      throw new Error(
        `Malformed profile: expected closing tag "${currentTag}", but found closing tag "${endTag}" instead`
      );
    }

    if (!currentTag && endTag) {
      throw new Error(
        `Malformed profile: expected opening tag, but found closing tag "${endTag}" instead`
      );
    }

    if (!currentTag && !startTag && !endTag) {
      leftoverLines.push(line);
      continue;
    }

    currentTag = startTag || endTag || currentTag;
    if (!currentTag) {
      throw new Error('DEBUG: should never happen');
    }

    const currentCertificateLines = certificateLines[currentTag] || [];

    if (startTag) {
      logger.info(`Found opening tag "${startTag}"`);
      currentCertificateLines.push(line);
    } else if (endTag) {
      logger.info(`Found closing tag "${endTag}"`);
      currentTag = false;
      currentCertificateLines.push(line);
    } else if (currentTag) {
      currentCertificateLines.push(line);
    }

    const tag = startTag || endTag || currentTag;
    if (tag) {
      certificateLines[tag] = currentCertificateLines;
    }
  }

  return [certificateLines, leftoverLines];
}

export default function parseCertificates(
  certificateLines: CertificateLines
): ParsedCertificates {
  logger.info('Parsing certificates...');

  const certs: ParsedCertificates = {};
  for (const type of certificateTypes) {
    const lines = certificateLines[type];
    if (!lines) continue;

    certs[type] = lines
      .map((l) => l.trim())
      .slice(1, -1) // remove tags
      .join('\\n'); // escaped intentionally
  }

  logger.debug('Parsed certificates:', certs);
  return certs;
}
