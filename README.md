npm install
bower install


###animore平台 动效demo 开发者规范：

- demo的目录结构：所有动效demo都放在 animore/demos/tmpls 中，并配上相应的png预览图，
			    目录结构：sz/hd-1.html(即思竹、辉达-1.html), sz/em-1.html。
                所有的设计gif动态图都放在 animore/demos/gifs 中，不需要png预览图，
                设计师的gif图片，用 名字-xxxx.gif 的方式去标明设计师。

- demo的html、style必须放在一个class为container的div内(只load了container内的内容)。
- demo的js/css：请直接写在页面里，链接的文件不支持及时修改运行。

- demo必须有个id为container的元素。并在该元素上写上设计师、开发师、兼容性，用行内样式写上width、height。 
  如：style="width:220px;height:250px;" designer="辉达" developer="思竹" browser="Chrome、Firefox、Safari"
- 每一个demo的css必须在唯一的命名空间内书写（防止影响其他demo），
  命名规则为：目录名-html文件名 css名, 如：.sz-hd-1 .title {}。
  keyframes也应命名唯一，目录名-文件名-动画名，如@keyframes "mz-mz-circle-half-rotate" {}，
  请优先使用animate里的动效。
- 每一个demo的js必须不能影响其他demo，请使用闭包。