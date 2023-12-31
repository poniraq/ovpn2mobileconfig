import { filterCertificateLines } from './parse-certificates.js';
import { filterMetaDirectiveLines } from './parse-meta-directives.js';
import type { CertificateLines } from './parse-certificates.js';

export default function tokenize(rawText: string) {
  let certificateLines: CertificateLines = {};
  let directiveLines: string[] = [];
  let optionLines: string[] = [];

  let lines: string[] = rawText.split('\n').filter((l) => l.trim().length > 0);
  [certificateLines, lines] = filterCertificateLines(lines);
  [directiveLines, lines] = filterMetaDirectiveLines(lines);
  optionLines = lines;

  return {
    certificates: certificateLines,
    directives: directiveLines,
    options: optionLines
  };
}
