# css-inject-loader
自动注入全局依赖文件，用于覆盖less/sass变量定义

# install
```
npm i css-inject-loader --save-dev
```

# Usage
```
module: {
  rules: [
    {
      test: /\.vue$/,
      use: [
          {
            loader: "css-inject-loader",
            options: {
              // lang=less|sass
              lang: 'less',
              // 需要注入的样式文件；如果是相对路径，绝对路径部分会去require.main.filename
              cssFile: path.join(__dirname, '../src/style/theme.less') 
            }
          }
        ]
    }
}
```
