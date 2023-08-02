import uuid from 'uuid4';
import { pd as pdata } from 'pretty-data';

import getTemplate from './template/index.js';
import configToXML from './config-to-xml.js';
import replaceVariables from './replace-variables.js';

import type { ParsedConfig } from '@root/config-parser/index.js';
import type { VariableOptions } from './replace-variables.js';

export type ProfileOptions = Omit<VariableOptions, 'xmlConfig'> & {
  pretty: boolean;
};

const defaultOptions: ProfileOptions = {
  uuid: uuid(),
  name: 'dummy-name',
  appID: 'net.openvpn.connect.app',
  payloadID: uuid(),
  payloadUUID: uuid(),
  organization: 'dummy-organization',
  pretty: true
};

export default async function buildProfile(
  config: ParsedConfig,
  userOptions: Partial<ProfileOptions> = {}
): Promise<string> {
  const xmlConfig = configToXML(config);
  const options: ProfileOptions = { ...defaultOptions, ...userOptions };

  const template = await getTemplate();
  const profile = replaceVariables(template, { ...options, xmlConfig });

  return options.pretty ? pdata.xml(profile) : profile;
}
