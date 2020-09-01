HbaseM
===========================
Hbase Monitoring 主要通过获取JMX监控信息，对数据进行可视化。

## 快速上手：
1. 安装nodejs
2. config.js 配置启动的端口、hbase信息、mysql信息
3. npm install //安装包
4. npm start //启动


## 设计说明：

* 系统使用Nodejs-koa2开发；
- 使用nunjucks作为模板引擎；
* axios执行request请求；
- node-schedule执行定时任务。
* 前端使用bootstrap 4.3.1, highcharts 8.1.2, vue 2.4.2。页面数据全部通过vue请求获得，并填充更新页面数据。

```
系统后台定期请求hbase JMX （http://aaaaaaa.club:16010/jmx）获取数据，数据按请求时间设置递增的ID，并进行数据持久化。
再次查询时，可以根据ID轮询即可。

jmx 支持qry带参查询。
部分qry参数说明：
java.lang:type=OperatingSystem 用于获取系统RAM、CPU数据；
Hadoop:service=HBase,name=RegionServer,sub=Server 用于获取整个节点的数据；
Hadoop:service=HBase,name=RegionServer,sub=Tables 用于获取不同的表的数据；
```

### 前端数据获取流程如下：
* 实时显示：
前端发起请求，获取到最新的ID，使用ID获取到数据库中对应的数据，并定时递增ID获取。
* 历史复现（snapshot）：
前端发送请求，并包含一个起始时间，后台返回此时刻最近的ID，前端使用ID定时递增获取数据，复现历史情况。


### MYSQL数据库存储结构
数据库初始化文件为db_hbase.sql 包括1个表t_jmx:

| 字段  | 说明 |
| ---------- | -----------|
| id | 唯一索引，前端数据也是依据此索引获取 |
| timestamp | 时间戳 |
| sys | 系统信息 |
| server | 主节点服务信息 |
| table | 表信息（进行过二次处理）|


### 目录结构：
```
|── controller
    |── mainController.js
|── middlewares
    └── response.js //中间件
├── node_modules
|── routers 
    └── routes.js //路由
|── service
    |── mysqlPool.js //连接池配置
    |── mysqlService.js //数据库读写
    └── scheduleService.js //定时任务
|── utils
    └── util.js //工具类
|── views //视图
    |── index.html //主页
    |── snapshot.html //快照
    └── table.html //表页
|── app.js //启动
|── config.js //配置文件
|── db_hbase.sql //数据库初始化文件
|── package.json //包配置文件
|── readme
└── templating.js //模板设置
```

### Centos 设置

```
启动 Hbase 和 rest 
cd /home/hbase-2.3.0/bin
./start-hbase.sh
./hbase rest start &
```
```
启动 Hbase Monitoring
cd ~/HbaseM
npm install
npm start &
```