const Config = require('./config');

const DIRECTIVE_PREFIX = 'OVPN_ACCESS_SERVER_';
const DIRECTIVE_REGEX = new RegExp(`^\\s*#\\s*${DIRECTIVE_PREFIX}`);
const OPTION_REGEX = new RegExp('^[a-zA-Z_-]+');

const parse_config = (raw_text) => {
  const config = new Config();
  const no_certs_text = parse_certs(raw_text, config);

  const lines = no_certs_text.split('\n');
  const directive_lines = [];
  const options_lines = [];

  for (const line of lines) {
    if (DIRECTIVE_REGEX.test(line)) {
      directive_lines.push(line);
      continue;
    }

    if (OPTION_REGEX.test(line)) {
      options_lines.push(line);
      continue;
    }
  }

  parse_options(options_lines, config);
  parse_directives(directive_lines, config);
  config.add('vpn-on-demand', '0');

  return config;
};

const parse_options = (lines, config) => {
  for (const line of lines) {
    const novalue = !line.includes(' ');

    if (novalue) {
      config.add(line, 'NOARGS');
    } else {
      const match = line.match(/^\s*([^\s]+)\s+(.*)/);
      const key = match[1];
      const value = match[2];

      config.add(key, value);
    }
  }
};

const parse_directives = (lines, config) => {
  for (const line of lines) {
    const match = line.match(
      new RegExp(`^\\s*#\\s*${DIRECTIVE_PREFIX}(.+)=(.+)`)
    );

    if (match && match[1] && match[2]) {
      config.add(match[1], match[2]);
    }
  }
};

parse_certs = (raw_text, config) => {
  const certs = {};
  const regexes = [
    {
      type: 'ca',
      regex: /<ca>([\s\S]+)<\/ca>/
    },
    {
      type: 'cert',
      regex: /<cert>([\s\S]+)<\/cert>/
    },
    {
      type: 'key',
      regex: /<key>([\s\S]+)<\/key>/
    },
    {
      type: 'tls-auth',
      regex: /<tls-auth>([\s\S]+)<\/tls-auth>/
    },
    {
      type: 'crl-verify',
      regex: /<crl-verify>([\s\S]+)<\/crl-verify>/
    }
  ];

  regexes.forEach(({ type, regex }) => {
    const match = raw_text.match(regex);

    if (match && match[1]) {
      const cert = match[1]
        .replace(/(^\s+)|((\s+$))/, '')
        .replace(/\n/g, '\\n');
      config.add(type, cert);
    }

    raw_text = raw_text.replace(regex, '');
  });

  return raw_text;
};

module.exports = {
  parse_config
};
