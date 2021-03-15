# 线路专线大屏

生产的时候可能会失败，这个原因是 vue3 可能会对 一些 vue2 的写法做出提示，开发的时候也是，重新运行一下命令即可可以解决。（这个是关了，不过偶尔还会跑出来，不知道是不是关错了，还是漏了什么）


生产后，删掉 itmss  /resDashboardLine 下的所有文件
 
将 dist 下的所有文件（除了 index.html）都丢到 /resDashboardLine 目录下，这个是 vue.config.js 的 publicPath 值

将 index.html 移入到 resCenter/resDashboardLine/index.html 覆盖掉即可。

