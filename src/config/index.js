const fs = require('fs');
const ovpn = require('./ovpn-parser');

const from_ovpn = (filepath) => {
  const content = fs.readFileSync(filepath).toString();
  return ovpn.parse_config(content);
};

module.exports = {
  from_ovpn
};
