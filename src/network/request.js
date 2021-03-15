import request from './serve'

// 获取所有线路
export const getLines = (method = 'GET', params, data) =>
    request({
        url: '/v1/resDashboardLines.do',
        method,
        params,
        data
    })

// 获取所有告警信息
export const getAlarm = (method = 'GET',params = {time: 60,isNotice:1},data) =>
    request({
        url: '/v1/resDashboardLine/getAlarm.do',
        method,
        params,
        data
    })

// 获取进出流量 ，默认是 进，出的参数是 traffic.out
export const getTrafficLoad = (method = 'GET', params = {
    metric: 'traffic.in'
}, data = {}) =>
    request({
        url: '/v1/resDashboardLine/trafficLoad.do',
        method,
        params,
        data
    })

// 获取线路延时，默认是 丢包率，平均延时 参数是 ping.avgDelay
export const getPing = (method = 'GET', params = {
    metric: 'ping.loss'
}) =>
    request({
        url: '/v1/resDashboardLine/ping.do',
        method,
        params,
    })

export const getHistory = (method = 'POST',params = {},data = {}) =>
    request({
        url: '/v1/graph/historys.do',
        method,
        params,
        data
    })
