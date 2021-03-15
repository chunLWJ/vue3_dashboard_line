module.exports = {
    extends: [
        // add more generic rulesets here, such as:
        // 'eslint:recommended',
        'plugin:vue/vue3-recommended',
        // 'plugin:vue/recommended' // Use this if you are using Vue.js 2.x.
    ],
    rules: {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error',

        // 由于 @jiaminghi/data-view 存在 template v-for 子组件 key 的操作，跟 vue 不兼容，我们关闭这条规则
        'vue/no-v-for-template-key-on-child': "off",
        "vue/no-deprecated-v-bind-sync": "off",
    }
}
