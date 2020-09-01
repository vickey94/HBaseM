const config = {
    port: '8000', //启动端口

    hbase: {
        second: 5, //每隔5秒扫描一次
        host: 'http://aaaaaaa.club', //hbase地址
        //host:'http://localhost',
        qry: {
            sys: 'java.lang:type=OperatingSystem',
            server: 'Hadoop:service=HBase,name=RegionServer,sub=Server',
            table: 'Hadoop:service=HBase,name=RegionServer,sub=Tables'
        },
    },

    mysql: {
        host: 'aaaaaaa.club',
        //host : 'localhost',
        user: 'root',
        pass: 'Test123.',
        db: 'db_hbase',
        char: 'utf8'
    },
}

module.exports = config