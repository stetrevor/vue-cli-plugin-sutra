module.exports = api => {
  api.extendPackage({
    devDependencies: {
      "markdown-loader": "^5.1.0",
      "html-loader": "^0.5.5"
    }
  })

  api.render('./template')
}