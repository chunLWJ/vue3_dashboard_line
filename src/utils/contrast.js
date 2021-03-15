import * as echarts from 'echarts'
import {lineDefaultEvent, lineOption, resetEventXAxisLabel, resetRestoreEvent} from "@/utils/index";
import dayjs from "dayjs";


let myChart;

/**
 *
 * @param elementId {String}
 * @param _centerLinesMap {Map<String, Line>} 中心节点
 * @param lineId {string} 切换的线路id
 */
export default function initContrast(elementId,_centerLinesMap,lineId,day = 1){

    let lineInValues = []
    let lineOutValues = []
    let lineValuesName = ''

    if (_centerLinesMap.has(lineId)) {

        const line = _centerLinesMap.get(lineId)
        lineInValues = Array.isArray(line['traffic.in']) ? line['traffic.in'] : []
        lineOutValues = Array.isArray(line['traffic.out'] ) ? line['traffic.out'] : []
        lineValuesName = _centerLinesMap.get(lineId).name

    }

    if (!myChart) createChart(elementId,lineInValues,lineOutValues,lineValuesName)
    else {
        myChart.clear()
        myChart.setOption(lineOption(lineInValues,lineOutValues,lineValuesName),true)
        resetEventXAxisLabel(myChart,day)
    }
}

/**
 *
 * @param elementId {String}
 * @param lineInValues {Array}
 * @param lineOutValues {Array}
 * @param lineValuesName {String} 线路名称
 */
export function createChart(contrastId,lineInValues,lineOutValues,lineValuesName) {
    myChart = echarts.init(document.getElementById(contrastId))
    const options = lineOption(lineInValues,lineOutValues,lineValuesName)
    myChart.setOption(options)
    lineDefaultEvent(myChart)

}
