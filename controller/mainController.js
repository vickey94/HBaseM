const config = require('../config')
const mService = require('../service/mysqlService')
const utils = require('../utils/util')

/**
 * index.html和table.html在初次访问时，会一次性加载20条数据填充页面
 * snapshot则是依次加载
 */
test = async (ctx, next) => {

}

indexPage = async (ctx, next) => {
   
    ctx.render('index.html', {
     
    });
}

tablePage = async (ctx, next) => {

    ctx.render('table.html', {

    });
}


snapshotPage = async (ctx, next) => {

    let beans = await mService.getLatest(1);
    let bean = beans[0];
    bean.table = JSON.parse(bean.table);
    let ds = bean.table.ds;
    let sTables = [];
    sTables.push({"value":-1,"table":"All"})
    for(let i = 0; i < ds.length; i++){
        sTables.push({"value":i,"table":ds[i].table+"("+ds[i].Namespace+")"})
    }

    ctx.render('snapshot.html', {

        sTables:sTables,
    });
}


getIdByTs = async(ctx,next) =>{
    let start = ctx.query.start;
    let beans = await mService.getByTimestamp(utils.formatTime(new Date(start)))

    if(beans.length > 0){
        let bean = beans[0];
        bean.sys = JSON.parse(bean.sys);
        bean.server = JSON.parse(bean.server);
        bean.table =  JSON.parse(bean.table);
      
        ctx.state.data = beans[0];
    }else{
        ctx.state.data = -1;
    }

}


indexInit = async (ctx, next) => {
    let beans = await mService.getLatest(20);
    for (let i = 0; i < beans.length; i++) {
        let bean = beans[i];
        bean.sys = JSON.parse(bean.sys);
        bean.server = JSON.parse(bean.server);
        delete bean['table']
    }

    ctx.state.data = {
        beans: beans,
    }
}

/**
 * 获取主页数据
 */
indexJMX = async (ctx, next) => {
    let id = ctx.query.id;
    let beans = null;
    beans = await mService.getById(id);

    for (let i = 0; i < beans.length; i++) {
        let bean = beans[i];
        bean.sys = JSON.parse(bean.sys);
        bean.server = JSON.parse(bean.server);
        delete bean['table']
    }

    ctx.state.data = {
        beans: beans,
    }
}

tableInit = async (ctx, next) => {
    let beans = await mService.getLatest(20);
    if (beans.length > 0) {
        for (let i = 0; i < beans.length; i++) {
            let bean = beans[i];
            delete bean['sys'];
            delete bean['server'];
            bean.table = JSON.parse(bean.table);
        }
        //整理数据
        let totalRequestCount = [];
        let readRequestCount = [];
        let writeRequestCount = [];

        for (let i = 0; i < beans[0].table.ds.length; i++) {
            totalRequestCount.push([]);
            readRequestCount.push([]);
            writeRequestCount.push([]);
        }

        for (let i = 0; i < beans.length; i++) {
            let bean = beans[beans.length - 1 - i];
            let ds = bean.table.ds;
            let ts = (new Date(bean.ts)).getTime();
            for (let j = 0; j < ds.length; j++) {
               
                totalRequestCount[j].push([ts, ds[j].totalRequestCount])
                readRequestCount[j].push([ts, ds[j].readRequestCount])
                writeRequestCount[j].push([ts, ds[j].writeRequestCount])
            }
        }

        ctx.state.data = {
            id: beans[0].id,
            ts: beans[0].ts,
            table: beans[0].table,
            totalRequestCount: totalRequestCount,
            readRequestCount: readRequestCount,
            writeRequestCount: writeRequestCount,
        }
    } else {
        ctx.state.code = -1
    }
}

//获取表页面数据
tableJMX = async (ctx, next) => {
    let id = ctx.query.id;
    let beans = null;

    beans = await mService.getById(id);

    if (beans.length > 0) {
        ctx.state.data = {
            id: beans[0].id,
            ts: beans[0].ts,
            table: JSON.parse(beans[0].table),
        }
    } else {
        ctx.state.code = -1
    }
}





module.exports = {
    indexInit,tableInit,
    indexPage, tablePage,snapshotPage,
    test, indexJMX, tableJMX,
    getIdByTs,
}