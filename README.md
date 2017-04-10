## air-community

Air Community

### 目录
```

air-community
..src/
....robots.txt
....index.html * 入口
....app/ * 内容
......common/ * 公共组件
......components/ * 模块
......app.config.js * 配置
......app.constants.js * 常量
......app.module.js * module
......app.less * 样式
......app.js *
....assets/ * 资源
......locales/ * 国际化文件
......images/ * 图片


```


###安装
```
 npm install
 bower install

```

###运行
```
gulp run:dev

```
###发布

```
gulp dist

```

#### 提示

>需要手动修改bower_components/framework7/bower.json

```
{
  "name": "framework7",
  "repository": {
    "type": "git",
    "url": "https://github.com/nolimits4web/Framework7.git"
  },
  "description": "Full featured mobile HTML framework for building iOS & Android apps",
  "version": "1.5.4",
  "author": "Vladimir Kharlampidi",
  "homepage": "http://framework7.io",
  "keywords": ["mobile", "framework", "ios 7", "ios7", "ios8", "ios 8", "iphone", "ipad", "apple", "phonegap", "native", "touch", "appstore", "app", "f7", "material", "android", "google", "googleplay"],
  "scripts": [
    "dist/js/framework7.js"
  ],
  "main": [
    "dist/js/framework7.min.js",
    "dist/css/framework7.ios.colors.css",
    "dist/css/framework7.ios.css"
  ],
  "styles": [
    "dist/css/framework7.css"
  ],
  "license": ["MIT"],
  "ignore": [
    ".*",
    "build",
    "custom",
    "kitchen-sink-ios/",
    "kitchen-sink-material/",
    "gulpfile.js",
    "node_modules",
    "package.json"
  ]
}

```