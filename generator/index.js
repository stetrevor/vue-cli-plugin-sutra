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

  if (api.invoking && api.hasPlugin('eslint')) {
    const { hooks } = require('@vue/cli-plugin-eslint/generator');
    hooks(api);
  }
}