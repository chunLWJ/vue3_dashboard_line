<template>

  <div class="dv-capsule-chart">
    <template v-if="mergedConfig">
      <div class="label-column">
        <div v-for="item in mergedConfig.data" :key="item.name" :title="item.name" @click="rowClick(item.id)" style="cursor: pointer;">
          {{ item.name }}
        </div>
        <div>&nbsp;</div>
      </div>

      <div class="capsule-container">
        <div class="capsule-item" v-for="(capsule, index) in capsuleLength" :key="index">
<!--          :style="`width: ${capsule * 100}%; background-color: ${mergedConfig.colors[index % mergedConfig.colors.length]};`"-->
          <div
              class="capsule-item-column"
              :style="`width: ${capsule * 100 >= 100 ? 100 : capsule * 100}%; background-color: ${getColors(capsule * 100)};`"
          >
            <div
                v-if="mergedConfig.showValue"
                class="capsule-item-value"
                style="white-space: nowrap;transform: translateX(120%)"
            >
              {{ `${capsuleValue[index]} ${mergedConfig.customerUnit}` }}
            </div>
          </div>
        </div>

        <div class="unit-label">
          <div
              v-for="(label, index) in labelData"
              :key="label + index"
          >{{ label }}</div>
        </div>
      </div>

      <div class="unit-text" v-if="mergedConfig.unit">{{ mergedConfig.unit }}</div>
    </template>
  </div>
</template>

<script>

import {setPollingCustomerContent} from "@/utils/map";

export default {
  name: "DvCapsuleChartUpdate",
  props: {
    config: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultConfig: {
        /**
         * @description Capsule chart data
         * @type {Array<Object>}
         * @default data = []
         * @example data = [{ name: 'foo1', value: 100 }, { name: 'foo2', value: 100 }]
         */
        data: [],
        /**
         * @description Colors (hex|rgb|rgba|color keywords)
         * @type {Array<String>}
         * @default color = ['#37a2da', '#32c5e9', '#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293']
         * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
         */
        colors: [
          '#37a2da',
          '#32c5e9',
          '#67e0e3',
          '#9fe6b8',
          '#ffdb5c',
          '#ff9f7f',
          '#fb7293'
        ],
        /**
         * @description Chart unit
         * @type {String}
         * @default unit = ''
         */
        unit: '',
        /**
         * @description Show item value
         * @type {Boolean}
         * @default showValue = false
         */
        showValue: false
      },

      mergedConfig: null,

      capsuleLength: [],
      capsuleValue: [],
      labelData: [],
      labelDataLength: []
    }
  },
  watch: {
    config() {
      const { calcData } = this

      calcData()
    }
  },
  methods: {
    rowClick(id){
      setPollingCustomerContent(id)
    },
    getColors(value){
      if (value >= 80)
        return '#e54f39';
      if (value >= 60)
        return '#edce8b'
      return '#53E2E8'
    },
    calcData() {
      const { config,defaultConfig, calcCapsuleLengthAndLabelData } = this

      // 这里就简单的修改下配置，不采用 源码 自带的，因为用到部分工具函数
      this.mergedConfig = {
        ...defaultConfig,
        ...config,
      }

      calcCapsuleLengthAndLabelData()
    },
    calcCapsuleLengthAndLabelData() {
      const { data } = this.mergedConfig

      if (!data.length) return

      const capsuleValue = data.map(({ value }) => value)

      // const maxValue = Math.max(...capsuleValue)
      const maxValue = 100

      this.capsuleValue = capsuleValue

      this.capsuleLength = capsuleValue.map(v => (maxValue ? v / maxValue : 0))


      const oneFifth = maxValue / 5

      const labelData = Array.from(
          new Set(new Array(6).fill(0).map((v, i) => Math.ceil(i * oneFifth)))
      )

      this.labelData = labelData

      this.labelDataLength = Array.from(labelData).map(v =>
          maxValue ? v / maxValue : 0
      )
    }
  },
  mounted() {
    const { calcData } = this

    calcData()
  }
}
</script>

<style lang="scss" scoped>
.dv-capsule-chart {
  .label-column {
    //max-width: 30%;
    width: 30%;
    padding-right: 20px;
    & > div {
      width: 100%;
      overflow: hidden;
      /*文本不会换行*/
      white-space: nowrap;
      /*当文本溢出包含元素时，以省略号表示超出的文本*/
      text-overflow: ellipsis;

    }
  }
}
</style>
