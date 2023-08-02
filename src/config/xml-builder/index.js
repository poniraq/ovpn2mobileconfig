const fs = require('fs');
const { join } = require('path');
const uuid = require('uuid4');
const pd = require('pretty-data').pd;

const tpl = fs.readFileSync(join(__dirname, 'tpl.xml')).toString();
const build = (options, config) => {
    options = options || {};

    let config_xml = [];
    for (const key in config) {
        if (config.hasOwnProperty(key)) {
            const values = config[key] || ['NOARGS'];

            if (values.length > 1) {
                values.forEach((value, index) => {
                    config_xml.push(`<key>${key}.${index + 1}</key>`);
                    config_xml.push(`<string>${value}</string>`);
                });
            } else {
                config_xml.push(`<key>${key}</key>`);
                config_xml.push(`<string>${values[0]}</string>`);
            }

        }
    }
    config_xml = config_xml.join('\n');

    const variables = {
        __UUID__: options.UUID || uuid(),
        __NAME__: options.NAME || config.PROFILE && config.PROFILE[0],
        __APP_IDENTIFIER__: options.APP_IDENTIFIER || 'net.openvpn.connect.app',
        __CONFIG__: config_xml,
        __PAYLOAD_IDENTIFIER__: options.PAYLOAD_IDENTIFIER || uuid(),
        __PAYLOAD_UUID__: options.PAYLOAD_UUID || uuid(),
        __ORGANIZATION__: options.ORGANIZATION || config.ORGANIZATION && config.ORGANIZATION[0]
    };

    let mobileconfig = tpl;
    for (const variable in variables) {
        if (variables.hasOwnProperty(variable)) {
            const value = variables[variable];
            mobileconfig = mobileconfig.replace(new RegExp(`{{${variable}}}`, 'g'), value);
        }
    }

    if (options.pretty) {
        mobileconfig = pd.xml(mobileconfig);
    }

    return mobileconfig;
};

module.exports = {
    build
};
