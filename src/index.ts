import { readFile, writeFile } from 'node:fs/promises';
import parseConfig from './config-parser/index.js';
import buildProfile from './profile-builder/index.js';

export type ConvertOptions = {
  inputPath: string;
  outputPath: string;
  profileName: string;
  profileOrg: string;
};

export default async function convert(options: ConvertOptions) {
  const { inputPath, outputPath, profileName, profileOrg } = options;
  const rawConfig = (await readFile(inputPath)).toString();
  const parsedConfig = await parseConfig(rawConfig);
  const profile = await buildProfile(parsedConfig, {
    name: profileName,
    organization: profileOrg
  });

  await writeFile(outputPath, profile);
}
