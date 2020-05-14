module.exports = api => {
  api.extendPackage({
    devDependencies: {
      "markdown-loader": "^5.1.0"
    }
  })

  api.render('./template')
}