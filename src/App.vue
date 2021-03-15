<template>
  <div
      class="app"
  >
    <header class="d_flex justify_content_space_between">
      <div class="d_flex align_items_center">
        <!-- 这里数量不多，就直接声明前缀，因为编译的时候 vue 里直接 src 是不会这样子加前缀的。要么这样子，要么就import导入图片试试。 -->

        <!--        src="/resDashboardLine/logo.png"-->
        <img
            class="padding_5 padding_clean_vertical"
            :src="logo"
            alt="Logo"
            style="height: 45px;"
        >
        <div class="company_description">
          <h2 style="font-size: 2em;color: white;height: 40px;line-height: 40px;">
            深圳水务（集团）有限公司
          </h2>
          <span style="font-size: 0.5em;color: darkgrey;height: 20px;">SHENZHEN WATER(GROUP)CO.,LTD.</span>
        </div>
      </div>
      <div class="d_flex align_items_center">
        <svg-icon
            name="time"
            :size="20"
        >
          <span class="padding_10 padding_clean_vertical">{{ time }}</span>
        </svg-icon>
        <div style="cursor: pointer;" @click="appFullScreenToggle">
          <svg-icon
              name="bit-screen"
              style="cursor: pointer;"
              color="#53E2E8"
              size="20">
          </svg-icon>
        </div>

        <div @click.stop.prevent="clickAutoSwitch" style="position: relative;padding: 0px 5px;">
          <div style="width: 100%;height: 100%;position: absolute;opacity: 0;z-index: 999;cursor: pointer;">

          </div>
          <div class="d_flex align_items_center">
            <label>自动刷新：</label>
            <my-switch open-name="开" close-name="关" size="lg" color="green" :value="autoSwitch"></my-switch>
            <!-- 由于 vue3 是不兼容 :value.sync 的，所以这里就单独传 :value，且用一个盒子覆盖掉，让其无法被点击到 -->
            <!-- <my-switch open-name="Love" close-name="Hate" size="lg" color="green" :value="autoSwitch"></my-switch>-->
          </div>
        </div>
      </div>
    </header>

    <main class="d_flex flex_1">
      <!--      <div class="left d_flex column justify_content_space_between">-->
      <div class="left d_flex column justify_content_space_between">
        <!-- 专线总览 -->
        <div class="overview">
          <div class="title">
            <h2>
              专线总览
            </h2>
            <div class="line"/>
          </div>
          <div
              class="content d_flex"
          >
            <div
                class="d_flex align_items_center flex_1 column"
            >
              <h6
                  style="font-size: 1.5em;font-weight: bold;color: #53E2E8;"
                  class="padding_15"
              >
                吞吐量
              </h6>
              <dv-digital-flop
                  :config="overview.defaultConfig"
                  style="height: 30px;"
              />
            </div>
            <div class="d_flex flex_1 column justify_content_center" style="padding: 15px 0px 5px;">
              <div class="padding_5 d_flex align_items_center" v-for="(item,index) in [
                  {config: overview.sumConfig, label: '专线总数',iconName: 'data-line'},
                  {config: overview.normalConfig, label: '正常总数',iconName: 'data-line-normal'},
                  {config: overview.abnormalConfig, label: '异常总数', iconName: 'data-line-abnormal',title: abnormalInfo},
              ]" :key="index" :title="item.title">
                <div class="d_flex column align_items_center padding_25 padding_clean_vertical">
                  <svg-icon
                      :name="item.iconName"
                      :size="30"
                      color="#fff"
                  />
                  <span
                      style="font-size: 0.8em;padding-top: 8px;"
                      class="text_nowrap"
                  >{{ item.label }}</span>
                </div>
                <dv-digital-flop
                    :config="item.config"
                    style="height: 30px;width: 90px;"
                />
              </div>
<!--              <div class="padding_5 d_flex align_items_center" @mousemove="event => overviewMousemove(event)" @mouseout="overviewMouseout">-->
<!--                <div class="d_flex column align_items_center padding_25 padding_clean_vertical">-->
<!--                  <svg-icon-->
<!--                      name="data-line-abnormal"-->
<!--                      :size="30"-->
<!--                      color="#fff"-->
<!--                  />-->
<!--                  <span-->
<!--                      style="font-size: 0.8em;padding-top: 8px;"-->
<!--                      class="text_nowrap"-->
<!--                  >异常总数</span>-->
<!--                </div>-->
<!--                <dv-digital-flop-->
<!--                    :config="overview.abnormalConfig"-->
<!--                    style="height: 30px;width: 90px;"-->
<!--                />-->
<!--                <div style="position: absolute;padding: 20px;" :style="{top: `${abnormalInfoData.top}px`,left: `${abnormalInfoData.left}px`}" v-show="abnormalInfoData.show" v-html="abnormalInfo"></div>-->
<!--              </div>-->
            </div>
          </div>
        </div>
        <!-- 专线质量 -->
        <div class="quality">
          <div class="title">
            <h2>
              专线质量
            </h2>
            <div class="line"/>
          </div>
          <div class="content d_flex padding_15">
            <div
                v-for="(item,index) in quality"
                :key="index"
                class="padding_5 d_flex align_items_center column"
                :class="`flex_${item.flex}`"
                style="text-align: center;"
            >
              <div class="d_flex">
                <dv-digital-flop
                    class="flex_1"
                    :config="item.config"
                    style="height: 40px;width: 100%;"
                />
                <!--                <span style="font-size: 0.2em;color: #13227A;height: 40px;line-height: 40px;padding: 0px 2px;">起</span>-->
              </div>
              <span
                  style="font-size: 0.8em;"
                  class="d_flex"
              >
                <div>{{ item.label }}</div>
                <template v-if="Number.isInteger(item.lift)">
                  <div class="d_flex align_items_center padding_5 padding_clean_vertical">
                    <svg-icon
                        :name="item.lift >= 0 ? 'up' : 'down'"
                        :size="15"
                    >
                      <span :style="{color: item.lift >= 0 ? 'red' : 'green'}">{{ `${Math.abs(item.lift)}%` }}</span>
                    </svg-icon>
                  </div>
                </template>
              </span>
            </div>

          </div>
        </div>
        <!-- 专线负载 -->
        <div class="load">
          <div class="title">
            <h2>
              专线负载
            </h2>
            <div class="line"/>
          </div>
          <div class="content d_flex column">
            <div class="d_flex" style="height: 30px;position: relative;">
              <div class="d_flex" style="cursor: pointer;">
                <div class="d_flex align_items_center" @click="loadTypeUpdate(3)" title="查看丢包率">
                  <SvgIcon name="bit" :size="20" color="#53E2E8">
<!--                    <span class="padding_5">丢包率</span>-->
                  </SvgIcon>
                </div>
                <div class="d_flex align_items_center padding_5 padding_clean_vertical"  @click="loadTypeUpdate(4)"  title="查看延时">
                  <SvgIcon name="delay" :size="20" color="#53E2E8">
<!--                    <span class="padding_5">延时</span>-->
                  </SvgIcon>
                </div>
              </div>
              <div
                  class="d_flex align_items_center"
                  style="cursor: pointer;"
                  :title="loadTypeInOut ? `查看${loadType === 1 ? '出' : '进'}流量` : `查看进流量`"
                  @click="loadTypeUpdate(loadTypeInOut ? loadType === 1 ? 2 : 1 : 1)"
              >
                <SvgIcon name="flow" :size="24" color="#53E2E8">
                  <span class="padding_5">{{ loadTypeInOut ? loadType === 1 ? '进' : '出' : '进' }}</span>
                </SvgIcon>
              </div>
              <div class="flex_1"></div>
              <div class="d_flex align_items_center" style="text-align: center;position: absolute;width: 30%;height: 100%;">
                <span>{{ loadTypeName }}</span>
              </div>
              <div class="d_flex justify_content_center align_items_center  padding_10 padding_clean_vertical">
                <SvgIcon name="page-left" size="20" color="#53E2E8" cursor="pointer"
                         @click="loadPageNumberUpdate(loadPageNumber - 1)"></SvgIcon>
                <span class="padding_5 padding_clean_vertical">{{ loadPageNumber }}</span>
                <SvgIcon name="page-right" size="20" color="#53E2E8" cursor="pointer"
                         @click="loadPageNumberUpdate(loadPageNumber + 1)"></SvgIcon>
              </div>
            </div>
            <div class="d_flex flex_1">
              <dv-capsule-chart-update
                  :key="Math.ceil(Math.random() * 99)"
                  :config="loadConfig"
                  style="width: 100%;padding: 0;"
              />
            </div>
          </div>
        </div>
        <!-- 实时告警 -->
        <div class="real_time_alert">
          <div class="title">
            <h2>
              实时告警
            </h2>
            <div class="line"/>
          </div>
          <div class="content padding_5 padding_clean_standard">
            <dv-scroll-board
                :config="alertConfig.config"
                class="scrollboard"
                style="height: 150px;"
                @mouseover="alertMouseover"
            />
          </div>
        </div>
      </div>

      <div class="right d_flex column justify_content_space_between">
        <div class="flex_5" style="position: relative;">
          <div
              :style="{zIndex: showMap ? 1 : -1}"
              id="sz_map"
          />
          <div
              :style="{zIndex: showMap ? -1 : 1}"
              id="lines"
              class="d_flex wrap justify_content_space_between"
          >
            <div style="width: 33%;height: 50%;"></div>
            <div style="width: 33%;height: 50%;"></div>
            <div style="width: 33%;height: 50%;"></div>
            <div style="width: 33%;height: 50%;"></div>
            <div style="width: 33%;height: 50%;"></div>
            <div style="width: 33%;height: 50%;"></div>
          </div>

          <div class="tooltip_menu d_flex">
            <div class="line_button" :title="showMap ? '查看详细线路' : '查看线路大体'" @click="showMap = !showMap">
              <svg-icon name="map" size="24" :color="showMap ? 'rgba(83,226,232,1)' : 'grey'"></svg-icon>
            </div>
            <template v-if="!showMap">
              <div class="turn_page d_flex">
                <div class="d_flex align_items_center flex_1" style="cursor: pointer;" title="上一页"
                     @click="pageNumberUpdate(pageNumber - 1)">
                  <svg-icon name="prev" color="rgba(83,226,232,1)" :size="15"></svg-icon>
                </div>
                <div class="flex_2" title="到指定页">
                  <input type="number" v-model="pageNumber" class="page_number" style="width: 100%;height: 100%;"
                         @change="pageNumberChange"/>
                </div>
                <div class="d_flex align_items_center flex_1" style="cursor:pointer;" title="下一页"
                     @click="pageNumberUpdate(pageNumber + 1)">
                  <svg-icon name="next" color="rgba(83,226,232,1)" :size="15"></svg-icon>
                </div>
              </div>
              <div class="d_flex align_items_center">
                <select v-model="contrastDay" style="width: 120px;background: transparent;height: 30px;cursor:pointer;" @change="contrastDayChange">
                  <option v-for="(item,index) in [
                    {value: 1,label: '天'},
                    {value: 7,label: '周'},
                ]" :key="index" :value="item.value" style="background-color: #181D32; color: #fff;">{{item.label}}</option>
                </select>
              </div>
            </template>
          </div>
        </div>
        <div class="flex_2" style="position: relative;">
          <div id="contrast"/>
          <div style="position: absolute;top: 5%;left: 10%;" class="d_flex justify_content_center align_items_center">
            <SvgIcon name="page-left" size="20" color="#53E2E8" cursor="pointer"
                     @click="centerIndexUpdate(centerIndex - 1)"></SvgIcon>
            <span class="padding_5 padding_clean_vertical">{{ centerIndex }}</span>
            <SvgIcon name="page-right" size="20" color="#53E2E8" cursor="pointer"
                     @click="centerIndexUpdate(centerIndex + 1)"></SvgIcon>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import SvgIcon from "@/icons/SvgIcon";
import {byteTransform} from "@/utils";
import dayjs from 'dayjs'
import {reactive, ref, computed, onMounted, onUnmounted, nextTick} from 'vue'
import createMap from "@/utils/map";
import createContrast from '@/utils/contrast'
import createLines from '@/utils/lines'
import {appFullScreen} from '@/utils/index'
import {initDashboard} from "@/init";
import {fontsize} from "@/utils/flexible";
import DvCapsuleChartUpdate from "@/datav_load_update/DvCapsuleChartUpdate";
import logo from '@/assets/logo.png'
import mySwitch from 'vue-switch';

export default {
  name: 'App',
  components: {
    DvCapsuleChartUpdate,
    SvgIcon,
    'my-switch': mySwitch
  },

  setup() {

    function appFullScreenToggle() {
      if (appFullScreen.isFullscreen())
        appFullScreen.exitFullScreen()
      else
        appFullScreen.fullScreen()
    }

    const autoSwitch = ref(true)
    function clickAutoSwitch(){
      autoSwitch.value = !autoSwitch.value
      timerInterval()
    }
    let timeInterval = null // 时间定时器
    let initInterval = null // 初始化定时器
    let loadTypeInterval = null // 负载定时器
    let linesInterval = null // 线路定时器
    let centerLinesInterval = null // 中心线路定时器
    const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

    /**
     * 生成 数字 翻盘器 的默认配置
     * @param textAlign
     * @param style
     * @return {{textAlign: string, style: {fill: string}}}
     */
    function generateNumberConfig(textAlign = 'center', style = {
      fill: '#fff'
    }) {
      return {textAlign, style}
    }


    // 告警配置
    const alertConfig = reactive({
      config: {
        data: [],
        oddRowBGC: 'rgba(0,0,0,.1)',
        evenRowBGC: 'rgba(0,0,0,.0)',
        waitTime: 2000,
        columnWidth: [20, 120, 80],
        headerHeight: 20,
        // headerBGC: '#53E2E8',
        headerBGC: '',
        align: ['center'],
        header: ['', '线路', '时间', '告警内容']
      }
    })

    /**
     *  更新 告警 内容
     */
    function alertUpdate(data) {
      alertConfig.config = {
        ...alertConfig.config,
        data: data.map(item => ([
          `<div style="width: 10px;height: 100%;display: flex;align-items: center;">
            <div style="width: 10px;height: 10px;border-radius: 50%;background: yellow;"></div>
           </div>`,
          `<span class="text_ellipsis_color" title="${item.name}">${item.name}</span>`,
          `<span class="text_ellipsis_color" title="${item.time}">${item.time}</span>`,
          `<span class="text_ellipsis_color" title="${item.content}">${item.content}</span>`,
        ]))
      }
    }

    // 告警引入，这个先不实现什么吧
    function alertMouseover(event, val2, val3) {

    }

    // 负载配置，用数字这里，以前就 In Out，现在要 延时，丢包率
    // const loadIn = ref(true)
    const loadType = ref(1) // 1->In  2->Out  3->丢包率  4 -> 延时
    const loadTypeInOut = computed(() => loadType.value === 1 || loadType.value === 2)
    function loadTypeUpdate(type){
      if (loadValueMap.has(type)) loadType.value = type
      else loadType.value = 1
      loadPageNumber.value = 1 // 重新到第一页
    }
    const loadTypeName = computed(() => {
      return loadValueMap.get(loadType.value).name || ''
    })
    const loadValueMap = new Map([
      [1, { key: 'trafficInLoad',unit: '使用率（%）', name: '进流量' }],
      [2, { key: 'trafficOutLoad',unit: '使用率（%）', name: '出流量' }],
      [3, { key: 'pingLoss',unit: '丢包率（%）', name: '丢包率' }],
      [4, { key: 'pingAvgDelay',unit: '毫秒（ms）', name: '延时' }],
    ])
    const loads = reactive({ // 负载存储的数组，更新的话更新这个即可
      /**
       * 负载数据，扩展了，以前就进出，现在还有延时，丢包率
       * @type {Array<{name: {String},trafficInLoad: {String}, trafficOutLoad: {String}}>}
       */
      data: []
    })
    const loadPageNumber = ref(1) // 输入框 翻页
    let loadPageSize = 10 // 默认十页

    const loadConfig = computed(() => {
      return {
        data: loads.data.map(item => ({
          name: item.name,
          // value: loadIn.value ? item.trafficInLoad : item.trafficOutLoad,
          value: (item[loadValueMap.get(loadType.value).key] || 0).toFixed(2),
          id: item.id
        }))
            .sort((prev, curr) => curr.value - prev.value)
            .slice((loadPageNumber.value - 1) * loadPageSize, loadPageNumber.value * loadPageSize),
        showValue: true,
        unit: loadValueMap.get(loadType.value).unit,
        customerUnit: loadType.value === 4 ? 'ms' : '%'
      }
    })


    function loadPageNumberUpdate(number) { // 输入框更新
      if (number >= 1 && number <= Math.ceil(loads.data.length / 10)) {
        // 1 到 最大翻页
        loadPageNumber.value = number;
      } else if (number >= Math.ceil(loads.data.length / 10) + 1) {
        // 最大翻页的 大一页
        loadPageNumber.value = 1
      }
    }

    // 概览
    const overview = reactive({
      sumConfig: { // 专线总数
        number: [0],
        ...generateNumberConfig(),
      },
      abnormalConfig: { // 异常总数
        number: [0],
        ...generateNumberConfig(undefined, {fill: '#e54f39'})
      },
      normalConfig: { // 正常总数
        number: [0 - 0],
        ...generateNumberConfig()
      },
      defaultConfig: { // 吞吐量
        number: [0, 0],
        ...generateNumberConfig(),
        formatter: (val) => byteTransform(val, 0),
        content: '{nt} / {nt}'
      },
    })

    const abnormalInfoData = reactive({
      left: 0,
      top: 0,
      show: false,
    })
    function overviewMousemove(event){
      console.log('abnormalInfoDataabnormalInfoData')
      abnormalInfoData.show = true
      abnormalInfoData.left = event.pageX
      abnormalInfoData.top = event.pageY
    }
    function overviewMouseout(){
      console.log('outoutout')
      abnormalInfoData.show = false
    }
    let abnormalInfo = ref('') // 异常提示

    /**
     * 更新概览函数
     * @param sum {number} 专线总数
     * @param abnormalSum {number} 异常总数
     * @param normalSum {number} 正常总数
     * @param newLineIn {number} 最新线路 进流量
     * @param newLineOut {number} 最新线路 出流量
     */
    function overviewUpdate(sum, abnormalSum, normalSum, newLineIn, newLineOut) {
      overview.sumConfig = {...overview.sumConfig, number: [sum]}
      overview.abnormalConfig = {...overview.abnormalConfig, number: [abnormalSum]}
      overview.normalConfig = {...overview.normalConfig, number: [sum - abnormalSum]}
      overview.defaultConfig = {...overview.defaultConfig, number: [Math.floor(newLineIn), Math.floor(newLineOut)]}
    }

    // 质量
    const quality = reactive([
      {
        config: {
          number: [0],
          ...generateNumberConfig(),
          content: '{nt} %',
        },
        label: '平均丢包率',
        flex: 1,
      },
      {
        config: {
          number: [0],
          ...generateNumberConfig(),
          content: '{nt} ms',
        },
        // lift: 30,
        label: '平均延时',
        flex: 1,
      },
      {
        config: {
          number: [0, 0],
          content: '{nt}% / {nt} ms',
          ...generateNumberConfig(),
        },
        // lift: -30,
        label: '最大丢包率/延时',
        flex: 2,
      }
    ])

    /**
     * 更新质量函数
     * @param avgLoss {number}
     * @param avgDelay {number}
     * @param maxLoss {number}
     * @param maxDelay {number}
     */
    function qualityUpdate(avgLoss, avgDelay, maxLoss, maxDelay) {
      quality[0].config = {...quality[0].config, number: [avgLoss]}
      quality[1].config = {...quality[1].config, number: [avgDelay]}
      quality[2].config = {...quality[2].config, number: [maxLoss, maxDelay]}
    }


    let defaultLinesMap = new Map()
    let centerLinesMap = new Map()
    const showMap = ref(true) // 默认显示地图
    const pageNumber = ref(1) // 输入框 翻页
    const contrastDay = ref(1)
    function contrastDayChange(){
      initDataInterval()
    }


    function pageNumberUpdate(number) { // 输入框更新
      if (number >= 1 && number <= Math.ceil(defaultLinesMap.size / 6)) {
        // 1 到 最大翻页
        pageNumber.value = number;
        createLines('line', defaultLinesMap, number,undefined,contrastDay.value)

      } else if (number >= Math.ceil(defaultLinesMap.size / 6) + 1) {
        // 最大翻页的 大一页
        pageNumber.value = 1
        createLines('line', defaultLinesMap, 1,undefined,contrastDay.value)
      }
    }

    function pageNumberChange() { // 输入框 更改事件
      if (pageNumber.value > defaultLinesMap.size / 6) { // 超出最大的页数，那就去最后一页即可。
        pageNumber.value = Math.ceil(defaultLinesMap.size / 6)
      }
      createLines('line', defaultLinesMap, pageNumber.value,undefined,contrastDay.value)
    }

    // 中心节点
    const centers = reactive({
      centerIds: [],
      centerId: ''
    })
    // 值 + 1，如果找不到，就是0，同时也就是说这个id不在这个数组下面
    const centerIndex = computed(() => {
      return centers.centerIds.findIndex((item) => item === centers.centerId) + 1
    })

    // centerIndex 是根据 数组 跟 中心节点 id 计算出 下标
    function centerIndexUpdate(number) {
      if (number >= 1 && number <= centers.centerIds.length) {
        // 数组范围内
        centers.centerId = centers.centerIds[number - 1]
        createContrast('contrast', centerLinesMap, centers.centerId,contrastDay)
      } else if (number === centers.centerIds.length + 1) {
        centers.centerId = centers.centerIds[0]
        createContrast('contrast', centerLinesMap, centers.centerId,contrastDay)
      }
    }

    /**
     * 初始化函数
     */
    async function initDataUpdate() {
      let initData = await initDashboard(contrastDay.value)


      overviewUpdate(initData.sum, initData.abnormal, initData.sum - initData.abnormal, initData.lineLastIn, initData.lineLastOut) // 更新概览
      qualityUpdate(...initData.quality) // 更新质量
      // 更新 负载
      loads.data = [...initData.defaultLinesMap.values(), ...initData.centerLinesMap.values()].map(item => ({
        name: item.name,
        trafficInLoad: item.trafficInLoad <= 100 ? item.trafficInLoad : 100,
        trafficOutLoad: item.trafficOutLoad <= 100 ? item.trafficOutLoad : 100,
        pingLoss: item.pingLoss,
        pingAvgDelay: item.pingAvgDelay,
        id: item.id,
      }));
      alertUpdate(initData.alerts) // 更新告警内容

      // vue 保存一份数据，供后续切换用
      defaultLinesMap = initData.defaultLinesMap // 这个赋值是后面跟 vue 切换的时候进行 echarts 图表 更新
      centerLinesMap = initData.centerLinesMap // 这个赋值是后面跟 vue 切换的时候进行 echarts 图标更新数据
      // abnormalInfo.value = [...initData.abnormalMap.values()].map((item,index) => `<span style="display: inline-block;padding: 2px;">${index + 1}. ${item.name}</span>`).join('<br />')
      abnormalInfo.value = [...initData.abnormalMap.values()].map((item,index) => `${index + 1}. ${item.name}`).join('\n')


      // 创建一系列图表
      // 创建地图
      createMap('sz_map', initData.centerLinesMap, initData.defaultLinesMap)
      // 创建 流量表，最新线路的流量表
      centers.centerIds = [...initData.centerLinesMap.entries()].map(([key]) => key)
      createContrast(
          'contrast',
          initData.centerLinesMap,
          centers.centerId || (centers.centerId = initData.centerId),
          contrastDay.value
      )
      createLines(
          'lines',
          initData.defaultLinesMap,
          pageNumber.value,
          undefined,
          contrastDay.value
      )


    }


    function timerInterval() {

      let second = 1000 * 30
      timeInterval && clearInterval(timeInterval)
      loadTypeInterval && clearInterval(loadTypeInterval)
      linesInterval && clearInterval(linesInterval)
      centerLinesInterval && clearInterval(centerLinesInterval)
      if (autoSwitch.value) {
        timeInterval = setInterval(() => {
          time.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
        }, 1000) // 时间 30 秒
        loadTypeInterval = setInterval(function () {
          // loadType.value = !loadIn.value
          loadTypeUpdate(loadType.value + 1)
        }, second) // 负载定时器 30秒

        linesInterval = setInterval(function () {
          pageNumberUpdate(pageNumber.value + 1)
        }, second) // 翻页定时去 30秒
        centerLinesInterval = setInterval(function () {
          centerIndexUpdate(centerIndex.value + 1)
        }, second)
      }
    }

    onMounted(async () => {

      fontsize();
      window.onresize = function () {
        fontsize()
        nextTick()
      }

      timerInterval() // 定时器，时间，负载，翻页的定时器

      await initDataInterval()

    })
    async function initDataInterval(){
      let second = 1000 * 30;
      initInterval && clearInterval(initInterval)
      initInterval = setInterval(initDataUpdate, second) // 定时更新数据
      await initDataUpdate()
    }

    onUnmounted(() => {
      clearInterval(timeInterval)
      clearInterval(initInterval)
      clearInterval(loadTypeInterval)
      clearInterval(linesInterval)
    })
    return {
      autoSwitch,
      clickAutoSwitch,
      // 时间
      time,

      // 概览
      overview,
      abnormalInfo,
      overviewMousemove,
      overviewMouseout,
      abnormalInfoData,

      // 专线质量
      quality,

      // 负载
      loadConfig,
      loadType,
      loadTypeUpdate,
      loadTypeInOut,
      loadTypeName,
      loadPageNumber,
      loadPageNumberUpdate,

      // 告警
      alertConfig,
      alertMouseover,

      // 地图
      showMap,
      pageNumber,
      contrastDay,
      contrastDayChange,
      pageNumberUpdate,
      pageNumberChange,

      // 中心节点
      centerIndex,
      centerIndexUpdate,

      appFullScreenToggle,
      logo
    }
  },
}
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  color: white;


  moz-user-select: -moz-none;
  -moz-user-select: none;
  -o-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

html,
body {
  width: 100%;
  height: 100vh;
  background-color: #161a2f;

  font-size: 62.5%;
}

#app {
  font-size: 1.6em;
}

// 定义几个常用的 css
$flexNum: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10;
$paddingNum: 5, 10, 15, 20, 25, 30;
@each $padding in $paddingNum {
  .padding_#{$padding} {
    padding: #{$padding}px
  }
}

.padding_clean_standard {
  padding-left: 0;
  padding-right: 0;
}

.padding_clean_vertical {
  padding-top: 0;
  padding-bottom: 0;
}

.text_nowrap {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.d_flex {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;

  &.column {
    flex-direction: column;
  }

  &.wrap {
    flex-wrap: wrap;
  }

  &.justify_content_space_between {
    justify-content: space-between;
  }

  &.justify_content_center {
    justify-content: center;
  }

  &.justify_content_flex_end {
    justify-content: flex-end;
  }

  &.justify_content_stretch {
    justify-content: stretch;
  }

  &.align_items_center {
    align-items: center;
  }

  &.align_items_flex_start {
    align-items: flex-start;
  }

  @each $flex in $flexNum {
    .flex_#{$flex} {
      flex: $flex
    }
  }
}

#app {
  //height: 100%;
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: url('./assets/background.png');
  background-size: cover;
  padding: 0px 40px;

  position: relative;
  top: 0;
  left: 0;
}

.app {
  height: 100%;
  width: 100%;

  header {
    height: 80px;
    min-height: 80px;
  }

  .text_ellipsis_color {
    display: block;
    color: #e54f39;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .title {
    h2 {
      width: 100%;
    }

    position: relative;
    //padding: 10px 0px;
    //padding: 15px 0px;
    padding: 10px 0px;

    .line {
      position: absolute;
      height: 4px;
      width: 100%;
      background: url('./assets/titleSplit.png') no-repeat;
      background-size: 100% 100%;
      bottom: 0px;
      left: 0;
      right: 0;
    }
  }

  main {
    height: calc(100vh - 80px);

    .left {
      flex: 0.3;

      > div {
        display: flex;
        flex-flow: column nowrap;
        flex: 1;

        > .content {
          flex: 1;
        }
      }

      > .load {
        flex: auto;
        //max-height: 300px;
      }

      > .overview {
        flex: auto;
      }

      //.load {
      //  flex: 2;
      //}
      //.quality {
      //  flex: 1;
      //}

    }

    .right {
      flex: 0.7;

      .tooltip_menu {
        position: absolute;
        bottom: 0px;
        left: 10%;
        z-index: 999;

        .turn_page {
          width: 160px;
          height: 30px;

          .page_number {
            background: transparent;
            padding: 0px 2px;
            box-shadow: none;

            &:hover {
            }
          }
        }

        .line_button {
          height: 30px;
          line-height: 30px;
          cursor: pointer;
          border: none;
          z-index: 999;
          opacity: 0.8;

          &:hover {
            opacity: 1;
          }
        }
      }

      #sz_map,
      #contrast,
      #lines {
        width: 100%;
        height: 100%;
        //padding: 20px;
        padding: 10px;
        position: absolute;
        left: 0;
        top: 0;
      }

      #sz_map {
        .line_tooltip {
          margin-right: 5px;
          min-width: 200px;
          background: rgba(0, 0, 0, 0.2);
          position: absolute;
          right: 5%;
          top: 5%;

        }
      }

      #contrast {
        padding: 0;
      }
    }
  }
}
</style>
