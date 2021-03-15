import dayjs from "dayjs";

/**
 *
 * @param number {number}
 * @return {string} number 三位加一个 ,
 */
export function thousandsSeparator (number) {
    const numbers = number.toString().split('').reverse()
    const segs = []

    while (numbers.length) segs.push(numbers.splice(0, 3).join(''))

    return segs.join(',').split('').reverse().join('')
}

/**
 *
 * @param byte 字节 {number}
 * @param decimals 尾数 {number}
 * @returns {string}
 */
export function byteTransform(byte, decimals = 2) {
    // 出自：https://cloud.tencent.com/developer/ask/34815
    // 这种事情还是百度靠谱，方便好看，而不是各种各样的 if else
    if (byte < 1) return `0`;
    let unit = 1024,
        unitArr = ["bit", "K", "M", "G", "T", "P", "E", "Z", "Y"],
        bytePosition = Math.floor(Math.log(byte) / Math.log(unit));
    return `${parseFloat((byte / Math.pow(unit, bytePosition)).toFixed(decimals))} ${unitArr[bytePosition]}`
}


/**
 *
 * @param lineInValues {Array}
 * @param lineOutValues {Array}
 * @param lineValuesName {String} 线路名称
 * @return {EChartsFullOption}
 * */
export function lineOption(lineInValues ,lineOutValues ,lineValuesName = '' ) {
    return {
        title: {
            text: lineValuesName,
            textStyle: {
                color: '#fff'
            },
            left: 'center',
        },
        dataset: [
            {
                source: lineInValues,
            },
            {
                source: lineOutValues
            }
        ],

        xAxis: {
            type: 'time',
            boundaryGap: false,
            axisLine: { show: false, },
            axisTick: { show: false, },
            splitLine: {show: false },
            // show: false,
            axisLabel: {
                formatter: function (value) {
                    return dayjs(value * 1000).format('HH:mm')
                },
                color: '#fff',
            },
            // splitNumber: 12,
            interval: 24,
            // max: dayjs().valueOf() / 1000,
            // min: dayjs().subtract(1,'day').valueOf() / 1000,
        },
        yAxis: {
            type: 'value',
            splitNumber: 5,
            boundaryGap: [0, '10%'],
            axisLine: {show: false},
            axisTick: {show: false},
            splitLine: {show: false},
            axisLabel: {
                formatter: function (value) {
                    return byteTransform(value,0)
                },
                color: '#fff',
            }
        },
        grid: {
            top: '10%',
            bottom: '15%',
            right: '5%',
            // right: '0',

        },
        legend: {
            data: ['进流量','出流量'],
            textStyle: {
                color: '#fff',
            },

            bottom: '0%',
            left: 'center',
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'none',
            }
        ],
        toolbox: {
            right: '40px',
            // show: false,
            feature: {
                dataZoom: {
                    show: true,
                    yAxisIndex: false,
                    iconStyle: {
                        opacity: 0, // 隐藏，虽然还是能点击
                    },
                    title: {
                        zoom: '',
                        back: '',
                    }
                },
                restore: {
                    title: '重置'
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: '#191D32',
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
            formatter: function (val) {
                // const [Ins,Outs] = val
                const time = dayjs(val[0].value.timestamp * 1000).format('YYYY/MM/DD HH:mm:ss')
                return `
                    <div class="tooltip">
                        <div class="tooltip-title note-circle-blue">${time}</div>
                         ${val.map(item => `
                             <div class="tooltip-content">
                                ${item.marker}
                                <span>${item.seriesName}</span>
                                <sapn style="padding: 0px 10px;"> ${byteTransform(item.value.value || 0)} </sapn>
                             </div>
                         `).join('\n')}
                    </div>
                `;
            }
        },
        series: [
            {
                name: '进流量',
                type: 'line',
                // stack: true,
                symbol: "none",
                // symbolSize: 1,
                // symbol: 'circle',
                lineStyle: {
                    width: 1,
                    opacity: 1,
                    color: '#5B8FF9',
                },
                areaStyle: {
                    color: '#5B8FF9',
                    opacity: 0.2,
                },
                datasetIndex: 0,
            },
            {
                name: '出流量',
                type: 'line',
                // stack: true,
                symbol: "none",
                // symbolSize: 1,
                // symbol: 'circle',
                lineStyle: {
                    width: 1,
                    opacity: 1,
                    color: '#5AD8A6'
                },
                areaStyle: {
                    color: '#5AD8A6',
                    opacity: 0.2,
                },
                datasetIndex: 1,
            },
        ]
    }
}

export function lineDefaultEvent(myChart) {
    window.addEventListener("resize", myChart.resize)
    setTimeout(() => {
        myChart.resize()
        myChart.dispatchAction({
            type: "takeGlobalCursor",
            key: "dataZoomSelect",
            dataZoomSelectActive: true // 框选状态
        })
        // 监听重置事件，重置，就重新启动框选，默认是重置后就关闭框选的，因为框选也是工具栏的一部分
        myChart.on('restore',function(){
            myChart.dispatchAction({
                type: "takeGlobalCursor",
                key: "dataZoomSelect",
                dataZoomSelectActive: true
            })
        })
    })
}

/**
 * 重置 lineOption 部分选项
 * @param myChart {Echarts}
 * @param day {number}
 */
export function resetEventXAxisLabel(myChart,day){
    myChart.dispatchAction({type: 'restore'}) // 激活 restore 事件，会重置框选状态
    if (day === 7) { // 日期是 7 的话，单独调整下 坐标
        myChart.setOption({ // 单独改下 x 轴的问题
            xAxis: {
                axisLabel: {
                    formatter: function (value,index) {
                        return index % 2 !== 0 ? dayjs(value * 1000).format('MM-DD') : `${dayjs(value * 1000).format('HH')}:00`
                    },
                },
            }
        })
    }
}

// 全屏
export const appFullScreen = (function appFullScreen(){

    // let app = document.getElementById('app')

    // 进入 h5 支持的全屏
    function fullScreen(){
        let app = document.body
        // 支持 且 全屏元素不存在时，进入全屏
        if (isFullscreenEnable() && isFullscreen() === false) {
            if (app.requestFullscreen)
                app.requestFullscreen()
            else if (app.mozRequestFullScreen)
                app.mozRequestFullScreen()
            else if (app.webkitRequestFullScreen)
                app.webkitRequestFullScreen()
            else if (el.msRequestFullscreen)
                app.msRequestFullscreen()
        }

    }
    // 退出 h5 进入的全屏
    function exitFullScreen(){
        // 支持 且 全屏元素存在时，退出全屏
        if (isFullscreenEnable() && isFullscreen()) {
            if (document.exitFullscreen)
                document.exitFullscreen()
            else if (document.mozCancelFullScreen)
                document.mozCancelFullScreen()
            else if (document.webkitExitFullscreen)
                document.webkitExitFullscreen()
            else if (document.msExitFullscreen)
                document.msExitFullscreen()
        }
    }

    // 来自 https://blog.csdn.net/k358971707/article/details/60465689
    /**
     * 判断 全屏 模式是否可用 H5 API
     * @return {boolean|*}
     */
    function isFullscreenEnable(){
        return document.fullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.msFullscreenEnabled || false
    }

    /**
     * 判断浏览器是否处于 全屏，H5 API
     * @return {Element|*|boolean} 全屏则返回当前调用全屏的元素，不全屏返回 false
     */
    function isFullscreen(){
        return document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement || false
    }

    /**
     * 判断是否全屏，这个模式是根据 window 宽高 和 body 进行判断
     * 这个实现上要确保 页面 是不能出现滚动条。
     * 同时支持 F11 + H5 API
     * 保留，先不用。
     */
    function isFullscreenForNoScroll(){
        let explorer = window.navigator.userAgent.toLowerCase()
        if (explorer.indexOf('chrome') > 0) {
            if (
                document.body.scrollHeight === window.screen.height &&
                document.body.scrollWidth === window.screen.width
            ) {
                alert('全屏')
            } else {
                alert('不全屏')
            }
        } else {
            if (
                window.outerHeight === window.screen.height &&
                window.outerWidth === window.screen.width
            ) {
                alert('全屏')
            } else {
                alert('不全屏')
            }
        }
    }


    return {
        fullScreen, // 进入全屏
        exitFullScreen, // 退出全屏
        isFullscreen,
    }
})()
