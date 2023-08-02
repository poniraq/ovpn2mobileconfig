import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  clean: true,
  declaration: true,
  externals: ['esbuild'],
  rollup: {
    emitCJS: false
  },
  outDir: 'lib'
});
