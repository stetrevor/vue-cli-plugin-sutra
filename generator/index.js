module.exports = (api, options) => {
  api.extendPackage({
    devDependencies: {
      "markdown-loader": "^5.1.0",
      "html-loader": "^0.5.5"
    }
  })

  api.render('./template')

  if (options.dataFile) {
    api.render('./data')
  }
  console.log('dataFile', options.dataFile);

  if (api.invoking && api.hasPlugin('eslint')) {
    const { hooks: lint } = require('@vue/cli-plugin-eslint/generator');
    lint(api);
  }
}