import logger from '@root/logger.js';
import tokenize from './tokenize.js';
import parseCertificates from './parse-certificates.js';
import parseDirectives from './parse-directives.js';
import parseOptions from './parse-options.js';
import type { ParsedCertificates } from './parse-certificates.js';
import type { ParsedDirectives } from './parse-directives.js';
import type { ParsedOptions } from './parse-options.js';

export type ParsedConfig = {
  certificates: ParsedCertificates;
  directives: ParsedDirectives;
  options: ParsedOptions;
};

export default async function parseConfig(rawText: string) {
  const tokens = tokenize(rawText);

  const certificates = parseCertificates(tokens.certificates);
  const directives = parseDirectives(tokens.directives);
  const options = parseOptions(tokens.options);

  const config: ParsedConfig = { certificates, directives, options };

  logger.debug('Parsed config:', config);
  return config;
}
