const mysql = require('./mysqlPool');
const utils = require('../utils/util')

async function addJMX(ts,sys,server,table){
    mysql("INSERT INTO t_jmx (`timestamp`,`sys`,`server`,`table`) VALUES ('"+ts+"','"+sys+"','"+server+"','"+table+"')");
}

async function getByTimestamp(ts){
    return mysql("SELECT *,DATE_FORMAT(`timestamp`,'%Y-%m-%d %H:%i:%S') AS `ts` FROM t_jmx WHERE `timestamp` >= '"+ts+"' LIMIT 0,1");
}


async function getById(id){
    return mysql("SELECT *,DATE_FORMAT(`timestamp`,'%Y-%m-%d %H:%i:%S') AS `ts` FROM t_jmx WHERE `id` >= '"+id+"' LIMIT 0,1");
}

async function getLatest(num){
    let beans = await  mysql("SELECT *,DATE_FORMAT(`timestamp`,'%Y-%m-%d %H:%i:%S') AS `ts` FROM t_jmx order by `id` desc LIMIT 0,"+num);
    if(beans.length>0){
         return beans;
    }else{
        return [];
    }
}

async function getMinTimestamp(){
    let ts = await mysql("SELECT DATE_FORMAT(`timestamp`,'%Y-%m-%dT%H:%i:%S') AS `ts` FROM t_jmx LIMIT 0,1");
    if (ts.length > 0) return ts[0].ts
    else return utils.formatTimeT(new Date())
}


module.exports = {
    addJMX,getByTimestamp,getById,getMinTimestamp,getLatest
}
