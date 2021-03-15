import * as echarts from "echarts";

import {Line} from "@/utils/_declare";
import {lineDefaultEvent, lineOption, resetEventXAxisLabel, resetRestoreEvent} from "@/utils/index";
import dayjs from "dayjs";

let myCharts = []
let init = true
/**
 * @param elementId {String}
 * @param defaultLinesMap {Map<String,Line>}
 * @param page {number}
 * @param pageSize {number}
 * @param day {number} 天数
 */
export default function initLines(elementId,defaultLinesMap,page = 1,pageSize = 6,day = 1){

    const lines = [...defaultLinesMap.values()]
    const data = lines.slice((page - 1) * pageSize,page * pageSize) // 六个数组

    if (init) {
        createChart(elementId,data,day)
        init = false
    }
    else {
        myCharts.forEach((item,index) => {
            console.log('item',item)
            const trafficIns = data[index] ?
                Array.isArray(data[index]['traffic.in']) ? data[index]['traffic.in'] : []
                : []
            const trafficOuts = data[index] ?
                Array.isArray(data[index]['traffic.out']) ? data[index]['traffic.out'] : []
                : []
            const name = data[index] ? data[index].name : ''


            const show = trafficIns.length > 0 || trafficOuts.length > 0 // 校检数据是否存在
            if (show) { // 存在的话，意思是要渲染
                item.clear() // 清空
                item.setOption(lineOption(trafficIns,trafficOuts,name),true) // 参数 true，不跟前面的option 进行合并
                resetEventXAxisLabel(item,day)
            }
            !show && item.setOption({},true) // 不显示的话，合并个空即可
        })
    }
}

/**
 *
 * @param element {String}
 * @param lines {Array<Line>}
 * @param day {number}
 */
function createChart(element,data,day){
    let lines = document.getElementById(element).childNodes
    // [].forEach.call(document.getElementById(element).childNodes)
    myCharts = [].map.call(lines,(item,index) => {
        const trafficIns = data[index] ?
            Array.isArray(data[index]['traffic.in']) ? data[index]['traffic.in'] : []
            : []
        const trafficOuts = data[index] ?
            Array.isArray(data[index]['traffic.out']) ? data[index]['traffic.out'] : []
            : []
        const myChart = echarts.init(item)
        myChart.setOption(
            lineOption(trafficIns,trafficOuts,data[index].name)
        )
        lineDefaultEvent(myChart)
        return myChart
    })
}


