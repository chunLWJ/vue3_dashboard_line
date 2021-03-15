export class Line {
    constructor() {
        /**
         * 线路名称
         * @type {string}
         */
        this.name = ''
        /**
         * 坐标
         * @type {number[]}
         */
        this.coordinate= [0, 0]

        /**
         * 进流量
         * @type {number}
         */
        this.trafficIn= 0

        /**
         * 出流量
         * @type {number}
         */
        this.trafficOut= 0

        /**
         * 平均丢包率
         * @type {number}
         */
        this.pingLoss= 0

        /**
         * 平均延时
         * @type {number}
         */
        this.pingAvgDelay= 0

        /**
         * 进负载
         * @type {number}
         */
        this.trafficInLoad = 0

        /**
         * 出负载
         * @type {number}
         */
        this.trafficOutLoad = 0

        /**
         * 进流量 数组
         * @type {Array<{
         *     value: {number},
         *     timestamp: {number}
         * }>}
         */
        this['traffic.in'] = []

        /**
         * 出流量数组
         * @type {Array<{
         *     value: {number},
         *     timestamp: {number}
         * }>}
         */
        this['traffic.in'] = []
    }
}
