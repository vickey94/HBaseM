const schedule = require('node-schedule');
const axios = require('axios');
const config = require('../config')
const utils = require('../utils/util')
const mService = require('./mysqlService')

// 定期向hbase获取数据并存储
const scheduleCronstyle = ()=>{
   // console.log('scheduleCronstyle is start!')
    let second = config.hbase.second // 每隔 5 秒执行一次
    let rs = [];
    for(let i = 0 ; i<60; i++){if(i%second==0){rs.push(i);}}
    let rule = new schedule.RecurrenceRule();
    rule.second = rs;

    schedule.scheduleJob(rule,()=>{
        scanJmxJobs()
      }); 
  }

scheduleCronstyle()


//扫描jmx
const scanJmxJobs = () => {
    axios.get(config.hbase.host + ":16010/jmx")
    .then((res) => { 
        saveBeans(res.data.beans)
    })
    .catch(function (error) { console.log(error);});
}


const saveBeans = (beans) =>{
    let qrys = [
        'java.lang:type=OperatingSystem',
        'Hadoop:service=HBase,name=RegionServer,sub=Server',
        'Hadoop:service=HBase,name=RegionServer,sub=Tables'
    ]

    let data = []

    for(let i = 0; i < qrys.length; i++){
        let qry = qrys[i];
        for(let j = 0; j < beans.length; j++){
            let bean = beans[j];
            if(bean.name == qry){
                data.push(bean);
                break;
            }
        }
    }
    data[2] = tablePreProcess(data[2])
    mService.addJMX(utils.formatTime(new Date()),JSON.stringify(data[0]),JSON.stringify(data[1]),JSON.stringify(data[2]))
}

//对table进行二次处理，解析数据
const tablePreProcess = (bean) =>{
        //解析出命名空间和表：
        let ds = []

        for(let key in bean){
            let keys = key.split('_');
            if(keys.length == 6){
                let d = {};
                d['Namespace'] = keys[1];
                d['table'] = keys[3];
                d[keys[5].split(":")[0]] = bean[key]
               
                let ishas = false;
                for(let i=0; i<ds.length;i++){
                    if(ds[i].Namespace == d.Namespace && ds[i].table == d.table){
                        ishas = true;
                        ds[i] = Object.assign(ds[i],d)
                        break;
                    }
                }
                if(!ishas){ds.push(d)}
              
            }
        }
        let ns = []
        ds.forEach(d=>{
            if(!ns.includes(d['Namespace'])) {ns.push(d['Namespace'])}
        })
        return {
            ds:ds,
            ns:ns,
        }
}

