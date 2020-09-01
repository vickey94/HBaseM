const router = require('koa-router')({
})

const mc = require('../controller/mainController')
router.get('/test',mc.test)
router.get('/',mc.indexPage)
router.get('/indexInit',mc.indexInit)
router.get('/indexJMX',mc.indexJMX)

router.get('/table',mc.tablePage)
router.get('/tableInit',mc.tableInit)
router.get('/tableJMX',mc.tableJMX)

router.get('/snapshot',mc.snapshotPage)
router.get('/getIdByTs',mc.getIdByTs)


module.exports = router
