import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import convert2Mobileconfig from './index.js';
import logger, { configureLogger } from './logger.js';

const parser = yargs(hideBin(process.argv))
  .option('config', {
    alias: 'c',
    type: 'string',
    description: 'path to .ovpn config file',
    requiresArg: true
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    description: 'profile name',
    requiresArg: true
  })
  .option('org', {
    alias: 'O',
    type: 'string',
    description: 'organization name',
    requiresArg: true
  })
  .option('output', {
    alias: 'o',
    type: 'string',
    description: 'path to .mobileconfig output file',
    requiresArg: true
  })
  .option('debug', {
    alias: 'd',
    type: 'boolean',
    default: false
  })
  .demandOption(['config', 'name', 'org', 'output']);

async function runCLI() {
  const { config, output, name, org, debug } = await parser.parseAsync();
  configureLogger(debug);

  try {
    await convert2Mobileconfig({
      inputPath: config,
      outputPath: output,
      profileName: name,
      profileOrg: org
    });
  } catch (e) {
    if (e instanceof Error) {
      logger.error(e.message);
    } else {
      logger.error(e);
    }

    if (debug) {
      throw e;
    }
  }
}

runCLI();
