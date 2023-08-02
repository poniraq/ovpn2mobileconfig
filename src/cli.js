#!/usr/bin/env node
const fs = require('fs');
const Config = require('./config');

const args = process.argv.slice(2);
const [ input, NAME, ORGANIZATION, output ] = args;

const config = Config.from_ovpn(input);
const xml = config.to_xml({
    NAME, ORGANIZATION,
    pretty: true
});

if (output) {
    fs.writeFileSync(output, xml);
} else {
    console.log(xml);
}