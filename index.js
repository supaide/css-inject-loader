const path = require('path')
const fs = require('fs')
const loaderUtils = require("loader-utils")

module.exports = function (source) {
  this.cacheable()
  const options = loaderUtils.getOptions(this)
  if (!options || !options.lang || !options.file) {
    return source
  }
  if (!path.isAbsolute(options.file)) {
    options.file = path.join(process.cwd(), options.file)
  }
  let styleTagReg = new RegExp('<style[ |\\t]+[^>]*lang=[\'|"]'+options.lang+'[\'|"][^>]*>', 'i')
  let matchs = source.match(styleTagReg)
  if (!matchs) {
    return source
  }
  let styleTag = matchs[0]
  let styleStartPos = source.indexOf(styleTag)
  let styleCode = source.substr(styleStartPos + styleTag.length)
  let styleEndPos = styleCode.indexOf('</style>')
  if (styleEndPos < 0) {
    return source
  }
  styleCode = styleCode.substr(0, styleEndPos)
  let importReg = new RegExp('@import[ |\\t]+[\'|"][^"|^\']+[\'|"];', 'ig')
  let importMatches = styleCode.match(importReg)
  if (!importMatches) {
    return source
  }
  for (let i=0; i<importMatches.length; i++) {
    let oneImport = importMatches[i].substr(7).trim()
    let filePath = path.join(this.context, oneImport.substr(1, oneImport.length-3))
    if (filePath == options.file) {
      // file exist
      return source
    }
  }
  let source0 = source.substr(0, styleStartPos+styleTag.length)
  let source1 = source.substr(styleStartPos+styleTag.length)
  return source0 + "\n" + '@import "'+options.file+'";' + "\n" + source1 
}
