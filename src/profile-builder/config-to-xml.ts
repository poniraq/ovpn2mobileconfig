import type { ParsedConfig } from '@root/config-parser/index.js';
import { certificateTypes } from '@root/config-parser/parse-certificates.js';

function addSingleValue(xmlConfig: string[], key: string, value: string) {
  xmlConfig.push(`<key>${key}</key>`);
  xmlConfig.push(`<string>${value}</string>`);
}

function addMultipleValues(xmlConfig: string[], key: string, values: string[]) {
  values.forEach((value, index) => {
    xmlConfig.push(`<key>${key}.${index + 1}</key>`);
    xmlConfig.push(`<string>${value}</string>`);
  });
}

export default function configToXML(config: ParsedConfig): string {
  const xmlConfig: string[] = [];

  for (const directive in config.directives) {
    if (!Object.prototype.hasOwnProperty.call(config.directives, directive)) {
      continue;
    }

    const value = config.directives[directive];
    addSingleValue(xmlConfig, directive, value);
  }

  for (const option in config.options) {
    if (!Object.prototype.hasOwnProperty.call(config.options, option)) {
      continue;
    }

    const values = config.options[option];
    if (values.length === 1) {
      const value = values[0];
      addSingleValue(xmlConfig, option, value);
    }

    if (values.length > 1) {
      addMultipleValues(xmlConfig, option, values);
    }
  }

  for (const certType of certificateTypes) {
    const certificate = config.certificates[certType];
    if (!certificate) continue;

    addSingleValue(xmlConfig, certType, certificate);
  }

  return xmlConfig.join('\n');
}
