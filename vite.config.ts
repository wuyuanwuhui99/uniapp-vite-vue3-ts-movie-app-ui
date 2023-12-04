import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import TransformPages from 'uni-read-pages-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  define: {  
      ROUTES: new TransformPages().routes, // 注入路由表  
    } 
});
