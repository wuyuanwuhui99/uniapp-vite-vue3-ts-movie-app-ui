
import { createSSRApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import router from './routers/index';  
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue'

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia()
  // 全局注册组件
  app.component("uni-icons",uniIcons)
  app.use(pinia);
  app.use(router);
  return {
    app,
	pinia
  };
}
