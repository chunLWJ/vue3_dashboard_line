<template>
  <svg
    class="svg-icon"
    @click="$emit('click')"
    :title="props.title"
    :style="{
      width: props.size + 'px',
      height: props.size + 'px',
      color: props.color,
      cursor: props.cursor
    }"
  >
    <use
      :xlink:href="`#icon-${props.name}`"
      :fill="props.color"
    />
  </svg>
  <slot></slot>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 32
    },
    color: {
      type: String,
      default: '#000'
    },
    cursor: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    }
  },
  setup(props) {
    return {
      props
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
