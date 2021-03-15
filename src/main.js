import { createApp } from 'vue'
import App from './App.vue'

import dataV from '@jiaminghi/data-view'
import iconPlugin from '@/icons'

const app = createApp(App)
app.use(dataV)
app.mount('#app')
app.use(iconPlugin, {
    imports: []
})
