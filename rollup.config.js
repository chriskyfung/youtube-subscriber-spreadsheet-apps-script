const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { readFileSync } = require('node:fs');

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const extensions = ['.ts', '.js'];

const preventThreeShakingPlugin = () => {
  return {
    name: 'no-threeshaking',
    resolveId(id, importer) {
      if (!importer) {
        // let's not theeshake entry points, as we're not exporting anything in App Scripts
        return { id, moduleSideEffects: 'no-treeshake' };
      }

      return null;
    },
  };
};

module.exports = {
  input: './src/index.js',
  output: [
    {
      dir: 'build',
      format: 'cjs',
      banner: `/*!
  ${packageJson.name} v${packageJson.version}
  ${packageJson.description}
  (c) ${new Date().getFullYear()} ${packageJson.author}
  License: ${packageJson.license}
  Source: ${packageJson.repository && packageJson.repository.url ? packageJson.repository.url.replace('git+', '') : packageJson.homepage ? packageJson.homepage.split('#')[0] : ''}
*/`,
    },
  ],
  plugins: [
    preventThreeShakingPlugin(),
    nodeResolve({
      extensions,
      mainFields: ['jsnext:main', 'main'],
    }),
    babel({
      extensions,
      babelHelpers: 'runtime',
      comments: false,
    }),
  ],
};
