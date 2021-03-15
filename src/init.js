import {getAlarm, getHistory, getLines, getPing, getTrafficLoad} from "@/network/request";
import dayjs from "dayjs";
import {getLineValue} from "@/utils/map";

export async function initDashboard(day = 1){
    const centerLinesMap = new Map() // 中心节点 Map
    const defaultLinesMap = new Map() // 默认节点 Map


    const lineTrafficEndpointMap = new Map() // 负载告警 绑定 线路 id
    const linePingEndpointMap = new Map() // ping 告警 绑定 线路 id
    const lineStatusEndpointMap = new Map() // 状态 告警 绑定 线路 id
    const endpointCounters = [] // 组装请求线路的数据，这个请求设计的数据会比较大。

    // 一小时的告警
    let _alerts = []
    let abnormalMap = new Map()

    let quality = [0,0,0,0]


    // 中心节点数据数组 暂时不考虑多个中心节点
    // let lineInValues = []
    // let lineOutValues = []
    // let lineValuesName = '' // 中心节点线路名称


    // 中心节点 id
    let centerId = ''
    // 数组的最后一个值，即最近的进出流量。
    let lineLastIn = 0
    let lineLastOut = 0;

    // 获取 进出流量，ping
    await Promise.all([
        getLines(),
        getAlarm(),
        getTrafficLoad(),
        getTrafficLoad(undefined,{metric: 'traffic.out'}),
        getPing(),
        getPing(undefined,{metric: 'ping.avgDelay'})
    ]).then(async ([
        {data: lines},
        {data: alerts},
                                  {data: {list: trafficInList}},
                                  {data: {list: trafficOutList}},
                                  {data: {list: pingLossList, avgLoss,maxLoss}},
                                  {data: {list: pingAvgDelayList, avgDelay, maxDelay}}
    ]) => {
        lines.forEach(item => {

            const trafficEndpoint = JSON.parse(item.trafficEndpoint || '[]')
            const pingEndpoint = JSON.parse(item.pingEndpoint || '[]')
            const statusEndpoint = JSON.parse(item.statusEndpoint || '[]')

            if (trafficEndpoint.length > 0) {
                lineTrafficEndpointMap.set(trafficEndpoint[0].endpoint,item.id)
            }
            if (pingEndpoint.length > 0) {
                linePingEndpointMap.set(pingEndpoint[0].endpoint,item.id)
            }
            if (statusEndpoint.length > 0) {
                lineStatusEndpointMap.set(statusEndpoint[0].endpoint,item.id)
            }
            // 这里流量表只需要 负载的 即可，
            endpointCounters.push(...trafficEndpoint); // 只要 javascript 语法是 () 开头的，前面的语句不能省略 ; ，否则语义不明，语法会认为是调用函数

            // 线路映射成map
            ;(item.lineType === 1 ? centerLinesMap : defaultLinesMap).set(
                item.id,
                {...item,coordinate: item.coordinate ? item.coordinate.split(',').reverse().map(item => parseFloat(item)) : [0,0]}
            )
            if (item.lineType === 1) centerId = item.id // 中心节点，总是取最后一个

        })

        /**
         * @param list {Array<{value: {value: {Number}}}>} 循环的数组
         * @param field {String} 取值的字段名
         * @param other {Array<{key: {String},value: {String}}>} 其他字段
         */
        function defaultLineValue(list,field,other = []){
            list.forEach(item => {
                if (defaultLinesMap.has(item.id) || centerLinesMap.has(item.id)) {
                    const line = defaultLinesMap.get(item.id) || centerLinesMap.get(item.id)
                    line[field] = item.value ? item.value.value : 0
                    other.forEach(o => line[o.key] = item[o.value])
                }
            })
        }
        defaultLineValue(trafficInList,'trafficIn',[{key: 'trafficInLoad', value: 'load'}])
        defaultLineValue(trafficOutList,'trafficOut',[{key: 'trafficOutLoad', value: 'load'}])
        defaultLineValue(pingLossList,'pingLoss')
        defaultLineValue(pingAvgDelayList,'pingAvgDelay')

        quality = [avgLoss || 0,avgDelay || 0,maxLoss || 0,maxDelay || 0]

        const historys = await getHistory(undefined,undefined,{
            cf: "AVERAGE",
            end: Math.floor(dayjs().valueOf() / 1000),
            endpoint_counters: endpointCounters,
            start: Math.floor(dayjs().subtract(day,'day').valueOf() / 1000)
        });


        historys.forEach && historys.forEach((history,index) => {
            // 这里只读取 非中心节点 的数据
            if (lineTrafficEndpointMap.has(history.endpoint)) {
                // const line = defaultLinesMap.get(lineTrafficEndpointMap.get(history.endpoint)) // 获取到线路
                const line = defaultLinesMap.get(lineTrafficEndpointMap.get(history.endpoint)) || centerLinesMap.get(lineTrafficEndpointMap.get(history.endpoint))
                line[history.counter] = history.Values

            }
        })

        // 中心节点的 in 和 out 的值，取最新线路
        if (centerLinesMap.has(centerId)) {
            const lineLast = centerLinesMap.get(centerId)
            let lineInValues = lineLast['traffic.in'] || []
            let lineOutValues = lineLast['traffic.out'] || []
            lineLastIn = lastEffectiveValue(lineInValues)
            lineLastOut = lastEffectiveValue(lineOutValues)
        }

        /**
         * 取最后一个有效值，最新值可能为 undefined
         * @param values {Array}
         * @return {number}
         */
        function lastEffectiveValue(values) {
            let len = values.length;
            if (len === 0) return 0;
            let value;
            do {
                value = values[len - 1].value
                len--;
            } while (typeof value !== "number")
            return value || 0

        }

        // 告警
        _alerts = alerts.map(item => {
            let resMonitorItemId = (item.resMonitorItemId || '').toString()

            let name = '';
            [lineTrafficEndpointMap,linePingEndpointMap,lineStatusEndpointMap].forEach(endpointMap => {
                if (endpointMap.has(resMonitorItemId)) {

                    let lineId = endpointMap.get(resMonitorItemId)
                    if (defaultLinesMap.has(lineId) || centerLinesMap.has(lineId)) {
                        const line = defaultLinesMap.get(lineId) || centerLinesMap.get(lineId)
                        line.alert = true // 设置 告警 为 true
                        name = line.name
                    }
                }
            })
            return {
                name: name,
                time: `${dayjs().diff(item.createTime,"minute")} 分前`,
                content: item.opContent,
            }
        })



        // 计算告警个数
        ;[...defaultLinesMap.values(),...centerLinesMap.values()].forEach(item => {
            const _value = getLineValue(item) // 取 map 哪里的计算颜色，10 是 正常，非 10 都算异常
            item._value = _value // map 使用这个值即可
            if (_value !== 10)
                abnormalMap.set(item.id,item)
        });
    })
    return {
        sum: defaultLinesMap.size + centerLinesMap.size, // 专线总数
        abnormal: abnormalMap.size, // 异常总数
        // 正常总数，用 总-异常 即可
        abnormalMap,

        // 最新线路 in out，这里不需要了，因为需要多线路
        // lineInValues,
        // lineOutValues,
        // lineValuesName,

        lineLastIn, // 最新线路的最后一个 in 和 out 值
        lineLastOut,

        // 中心节点 id，默认取最后一个
        centerId,
        centerLinesMap, // 中心节点
        defaultLinesMap,  // 默认节点

        alerts: _alerts, // 告警信息

        quality, // 质量
    }
}
