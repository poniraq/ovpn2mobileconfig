import loglevel from 'loglevel';

const DEBUG_LEVEL = 'debug';
const PROD_LEVEL = 'error';

export function configureLogger(debug: boolean) {
  loglevel.setLevel(debug ? DEBUG_LEVEL : PROD_LEVEL);
}

export default loglevel;
