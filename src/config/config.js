const fs = require('fs');
const xml = require('./xml-builder');

class OVPNConfig {
  constructor(parsed_config) {
    this.fields = parsed_config || {};
  }

  values(key) {
    return this.fields[key];
  }
  to_xml(options) {
    return xml.build(options, this.fields);
  }

  add(key, value) {
    const values = this.fields[key];

    if (values) {
      values.push(value);
    } else {
      this.fields[key] = [value];
    }
  }

  remove(key, value) {
    if (typeof 'key' === string) {
      const values = this.fields[key];

      if (value === undefined) {
        delete this.fields[key];
        return values;
      }

      if (values) {
        this.fields[key] = values.filter((v) => v !== value);
        return value;
      }

      return undefined;
    }
  }
}

module.exports = OVPNConfig;
