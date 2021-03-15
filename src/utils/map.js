import * as echarts from 'echarts'

import { mapName,title} from '../map_data/index'
import {byteTransform} from "@/utils/index";
import {Line} from "@/utils/_declare";
import config from "@/config";


// 下钻配置表
class DrillDownOption {

    constructor() {
        /**
         * fileUrl: 文件引用地址，实现方案可以是 动态 import
         * @type {string | undefined}
         */
        this.fileUrl = ''

        /**
         * url: http://datav.aliyun.com/tools/atlas/#&lat=22.694185091871322&lng=113.86577150000002&zoom=11.5 这里提取即可。
         * 这个可以走 请求
         * @type {string|undefined}
         */
        this.url = ''

        /**
         * 这个可以走 预先 import，echarts都先注册号，这里使用这个，因为深圳下钻后整体数据不是很大
         * @type {string|undefined}
         */
        this.mapName = ''
    }
}
/**
 *
 * 地图名 -> drillDownOption
 * @type {Map<string, DrillDownOption>}
 */
const drillDownMap = new Map([
    ['宝安区',{mapName: '宝安区'}],
])



// 线路提示
const lineTooltip = document.createElement('div')
lineTooltip.classList.add('line_tooltip')

// 定时器
let pollingInterval = null
let myChart;
let lines = [] // 线路数据

let defaultLinesMap;
/**
 *
 * @param elementId {String} 地图 id
 * @param _centerLinesMap {Map<String, Line>} 中心节点
 * @param _defaultLinesMap {Map<String, Line>} 默认线路节点
 */
export default function initMap(elementId, _centerLinesMap, _defaultLinesMap) {

    lines = [] // 保存到外层，因为负载点击需要联动到地图
    const locations = [];
    [..._defaultLinesMap.values()].forEach(item => {

        let centerLine = _centerLinesMap.get(item.resDashboardLineId)
        let id = item.id,
            name = item.name,
            coords = [item.coordinate,centerLine ? centerLine.coordinate : []],
            value =  item._value
        locations.push({value: item.coordinate.slice(0,2).concat([2,2,item._value],)})
        lines.push({id,name,coords,value})
    });
    [..._centerLinesMap.values()].forEach(item => {
       locations.push({
           value: item.coordinate.slice(0,2).concat([2,2,item._value]),
           // label: {
           //     show: true,
           //     color: '#fff',
           //     formatter: function(val) {
           //         return val.name
           //     }
           // },
           // name: item.name,
           // itemStyle: {
           //     color: 'black',
           // }
       })
    });
    defaultLinesMap = _defaultLinesMap // 保存到外层，因为需要一些联动
    if (!myChart) createChart(elementId, lines, locations)
    else {
        // 更新数据
        myChart.setOption({
            series: [
                {
                    name: '专线',
                    data: lines,
                },
                {
                    name: '位置',
                    data: locations,
                }
            ]
        })
        // polling(myChart, 2, lines)
    }
}


/**
 * 计算 线 的颜色，会赋值到 value 值，交给  visualMap 处理
 * @param line {Line}
 * @return {number}
 */
export function getLineValue(line) {
    if (line.pingLoss >= 100) return 100

    if (line.alert === true) return 54
    if (line.pingAvgDelay >= 500) return 50
    if (line.pingLoss >= 50 && line.pingLoss < 100) return 51
    if (line.trafficInLoad >= 80) return 52
    if (line.trafficOutLoad >= 80) return 53

    return 10

}

/**
 * 说一下本次深圳地图需要实现的功能
 * 一：自动轮播每个地区的线路情况
 * 二：移动某条线路，要代替轮播提示框的内容
 * 三：线路显示直观需要根据颜色区分，比如不同颜色表示线路不同状态（顺畅，宕机，高延迟），移入的时候需要查看线路使用率等相关信息，就是 第二条需要实现的
 * @param mapId {String}
 * @param lines {Array} 线路数据
 * @param locations {Array} 点 数据
 */
export function createChart(mapId, lines,locations) {
    const sz_map = document.getElementById(mapId)
    myChart = echarts.init(sz_map)
    sz_map.append(lineTooltip)

    myChart.setOption({
        title: {
            text: title || mapName,
            show: false,
            x: 'center',
            textStyle: {
                color: '#fff',
            },
        },
        visualMap: [
            {
                type: 'piecewise',
                seriesIndex: 0,
                pieces: [
                    {value: 100, label: '宕机'}, // 占满
                    {value: 50, label: '平均延时>500ms'}, // 正常
                    {value: 51, label: '丢包率>50%'}, // 正常
                    {value: 52, label: '进流量>80%'}, // 正常
                    {value: 53, label: '出流量>80%'}, // 正常
                    {value: 54, label: '告警'}, // 正常
                    {value: 10, label: '正常', }, // 较少使用
                ],
                right: '5%',
                color: ['#e54f39','#F19000','#F19000','#F19000','#F19000','#0F0'],
                textStyle: {
                    color: '#fff'
                },
            },
            {
                type: 'piecewise',
                seriesIndex: 1,

                dimension: 4,
                pieces: [
                    {value: 100, label: '宕机'}, // 占满
                    {value: 50, label: '平均延时>500ms'}, // 正常
                    {value: 51, label: '丢包率>50%'}, // 正常
                    {value: 52, label: '进流量>80%'}, // 正常
                    {value: 53, label: '出流量>80%'}, // 正常
                    {value: 54, label: '告警'}, // 正常
                    {value: 10, label: '正常', }, // 较少使用
                ],
                right: '5%',
                color: ['#e54f39','#F19000','#F19000','#F19000','#F19000','#0F0'],
                textStyle: {
                    color: '#fff'
                },
                show: false,
            },
        ],
        geo: {
            // show: false,
            // map: mapName,
            name: mapName,
            type: "map",
            zlevel: 1,
            map: mapName,
            roam: true,
            zoom: 1.2,
            label: {
                show: false,
                color: '#fff'
            },
            emphasis: {
                label: {
                    show: true,
                    color: '#fff'
                }
            },

            itemStyle: {
                normal: {
                    color: config.mapItemStyleColor, //地图背景色
                    areaColor: config.mapItemStyleAreaColor,
                    borderWidth: config.mapItemStyleBorderWidth,
                    borderColor: config.mapItemStyleBorderColor,

                    shadowBlur: 5,
                    shadowColor: '#4682B4',
                    shadowOffsetY: 6,
                },
                emphasis: {
                    areaColor: config.mapEmphasisItemAreaColor, //悬浮背景
                }
            },
            select: {
                itemStyle: {
                    areaColor: config.mapSelectItemStyleAreaColor,
                },
                label: {
                    color: '#fff',
                }

            },

        },
        series: [
            {
                type: "lines",
                name: '专线',
                zlevel: 2,

                effect: {
                    show: true,
                    period: 3, //箭头指向速度，值越小速度越快
                    trailLength: 0.4, //特效尾迹长度[0,1]值越大，尾迹越长重
                    symbol: 'arrow', //箭头图标
                    symbolSize: 5, //图标大小
                },
                lineStyle: {
                    normal: {
                        width: config.mapLineStyleWidth, //线条宽度
                        opacity: 0.1, //尾迹线条透明度
                        curveness: 0.3 //尾迹线条曲直度
                    },
                    emphasis: {
                        width: config.mapEmphasisLineStyleWidth
                    },
                },
                data: lines,
            },
            {
                name: '位置',
                type: "effectScatter",
                geoIndex: 0,
                zlevel: 3,
                coordinateSystem: "geo",
                rippleEffect: { // 涟漪特效
                    period: 4, // 动画时间，值越小速度越快
                    brushType: 'stroke', // 波纹绘制方式 stroke, fill
                    scale: 4, // 波纹圆环最大限制，值越大波纹越大
                },
                itemStyle: {
                    normal: {
                        color: config.mapEffectScatterColor,
                        opacity: 1,
                    },
                    emphasis: {
                        color: config.mapEffectScatterColorEmphasis
                    }
                },

                symbol: config.mapEffectScatterSymbol,
                data: locations,
            }
        ]
    })
    window.addEventListener("resize", myChart.resize)
    setTimeout(() => myChart.resize())
    polling( '位置') // 这是 位置 的轮询
    // drillDown(myChart) // 下钻这个保留，有点怪怪的样子。。。

}

// /**
//  *
//  * @param myChart {ECharts}
//  */
// function drillDown(myChart){
//     myChart.on('click', 'series.map', function (params) {
//         if (drillDownMap.has(params.name)) {
//             const drillDownOption = drillDownMap.get(params.name)
//             mapToggleName(myChart,drillDownOption,params)
//         }
//     })
// }

/**
 * 地图切换
 * @param myChart {ECharts}
 * @param drillDownOption {DrillDownOption}
 * @param params {{name: string}}
 */
function mapToggleName(myChar,drillDownOption,params){
    // const {name: mapName} = params //
    const {name: prevMapName} = params
    console.log('prevMapName',prevMapName)

    myChart.setOption({
        geo: {
          map: drillDownOption.mapName
        },
        series: [
            {
                name: prevMapName,
                map:  drillDownOption.mapName,
                zoom: 1.5,
            }
        ]
    })
}

/**
 * 轮询
 * 本质上是 线路 只有 value 值，但是我们能拿到 下标，就能手动事件触发效果
 * 但是 线路是不存在更加详细的线路信息，所以这里需要 defaultLineMap 来实现这个
 * @param seriesName {string} 系列名称
 */
function polling(seriesName) {
    let count = 0;
    let dataLength = lines.length
    // 主函数
    const main = function () {
        pollingInterval && clearInterval(pollingInterval)
        pollingInterval = setInterval(task, 1000 * 30)
    }
    const task = function () {
        if (defaultLinesMap.has(lines[count % dataLength].id)) {
            pollingCustomerContent(defaultLinesMap.get(lines[count % dataLength].id))
        }
        pollingEvent(myChart,seriesName,count % dataLength)
        count++
    }

    // 鼠标移入
    myChart.on('mouseover', 'series.lines', function (params) {
        clearInterval(pollingInterval)
        pollingEvent(myChart,seriesName,params.dataIndex)
        if (defaultLinesMap.has(lines[count % dataLength].id)) {
            pollingCustomerContent(defaultLinesMap.get(lines[params.dataIndex].id))
        }
    })
    // 鼠标移出
    myChart.on('mouseout', 'series.lines', function () {
        main()
    })
    task()
    main()
}

/**
 * 根据某个 id，找到 线路 下标，触发效果，导出到外层，给 负载 进行联动
 * @param id
 * @param seriesName
 */
export function setPollingCustomerContent(id,seriesName = '位置'){
    clearInterval(pollingInterval)
    let dataIndex = lines.findIndex(item => item.id === id)
    if (dataIndex !== -1 && defaultLinesMap.has(id)) {
        pollingEvent(myChart,seriesName,dataIndex)
        pollingCustomerContent(defaultLinesMap.get(id))
    }
}

/**
 * 轮播事件
 * @param myChart {ECharts}
 * @param seriesName {string} 系列名称
 * @param dataIndex {number} 高亮的 下标
 */
function pollingEvent(myChart, seriesName, dataIndex) {
    myChart.dispatchAction({
        type: 'downplay',
        // seriesIndex: seriesIndex,
        seriesName,
    })
    myChart.dispatchAction({
        type: 'highlight',
        // seriesIndex: seriesIndex,
        seriesName,
        dataIndex: dataIndex
    })
}

/**
 * 修改 工具栏 显示
 * @param line {Line}
 */
function pollingCustomerContent(line) {
    const trafficOut = byteTransform(line.trafficOut || 0)
    const trafficIn = byteTransform(line.trafficIn || 0)
    const {resComputerRoomLine} = line

    const data = [
        {title: '专线编号',content: resComputerRoomLine ? resComputerRoomLine.idcNo : ''},
        {title: '出流量',content: trafficOut},
        {title: '进流量',content: trafficIn},
        {title: '平均延时',content: `${line.pingAvgDelay ? line.pingAvgDelay.toFixed(2) : 0} ms`},
        {title: '平均丢包率',content: `${line.pingLoss ? line.pingLoss.toFixed(2) : 0} %`},
    ]
    lineTooltip.innerHTML = `
        <div>
            <h6 style="text-align: center;height: 30px;line-height: 30px;font-weight: bold;font-size: 1em;" class="padding_10"> ${line.name}</h6>
            <div class="d_flex column padding_10">
                ${data.map(item => `
                    <div class="d_flex justify_content_space_between padding_10">
                    <span class=" text_nowrap" style="text-align: left;" title="${item.title}">${item.title}：</span>
                    <span class=" text_nowrap" title="${item.content}">${item.content}</span>
                </div>
                `).join('\n')}
            </div>
        </div>
    `
}
