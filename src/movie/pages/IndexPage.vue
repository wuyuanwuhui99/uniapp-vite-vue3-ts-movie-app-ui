<template>
  <view class="index-wrapper" v-if="isInitPage">
      <view class="page-container">
          <HomeComponent :style="{display:activeIndex === 0 ? 'block': 'none'}"/>
		  <MovieComponent v-if="isInitComponent[1]" :style="{display:activeIndex === 1 ? 'block': 'none'}"/>
		  <TVComponent v-if="isInitComponent[2]" :style="{display:activeIndex === 2 ? 'block': 'none'}"/>
		  <MyComponent v-if="isInitComponent[3]" :style="{display:activeIndex === 3 ? 'block': 'none'}"/>
      </view>
      <view class="tab-bar">
          <view class="tab-item" @click="useTab(0)">
              <image class="tab-icon" v-if="activeIndex === 0" src="../../../static/icon_home_active.png"/>
              <image class="tab-icon" v-else src="../../../static/icon_home.png"/>
              <text class="tab-text" :class='{"tab-text-active" : activeIndex === 0}'>首页</text>
          </view>
          <view class="tab-item" @click="useTab(1)">
              <image class="tab-icon" v-if="activeIndex === 1" src="../../../static/icon_movie_active.png"/>
              <image class="tab-icon" v-else src="../../../static/icon_movie.png"/>
              <text class="tab-text" :class='{"tab-text-active" : activeIndex === 1}'>电影</text>
          </view>
          <view class="tab-item" @click="useTab(2)">
              <image class="tab-icon" v-if="activeIndex === 2" src="../../../static/icon_tv_active.png"/>
              <image class="tab-icon" v-else src="../../../static/icon_tv.png"/>
              <text class="tab-text" :class='{"tab-text-active" : activeIndex === 2}'>电视剧</text>
          </view>
          <view class="tab-item" @click="useTab(3)" data-index="3">
              <image class="tab-icon" v-if="activeIndex === 3" src="../../../static/icon_user_active.png"/>
              <image class="tab-icon" v-else src="../../../static/icon_user.png"/>
              <text class="tab-text" :class='{"tab-text-active" : activeIndex === 3}'>我的</text>
          </view>
      </view>
  </view>
</template>

<script setup lang="ts">
import HomeComponent from '../component/HomeComponent.vue';
import MovieComponent from '../component/MovieComponent.vue';
import TVComponent from '../component/TVComponent.vue';
import MyComponent from '../component/MyComponent.vue';

import { ref,onMounted,reactive } from 'vue'
import {getUserDataService} from '../service';
import {httpRequest} from '../../utils/HttpUtils';
const activeIndex = ref<number>(0)
const isInitPage = ref<boolean>(false)
const isInitComponent = reactive<Array<boolean>>([true,false,false,false])
const useTab = (index:number) =>{
	activeIndex.value = index;
	!isInitComponent[index] && isInitComponent.splice(index,1,true)
}
onMounted(()=>{
	const token:string = uni.getStorageSync('token');
	getUserDataService(token).then((res)=>{
		uni.setStorage({key:'token',data:res.token});
		httpRequest.setToken(res.token);
		isInitPage.value = true;
	})
})
</script>

<style lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.index-wrapper{
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: @page-background-color;
    .page-container{
        flex:1;
        overflow: auto;
        @page-padding: 20rpx;
    }
    .tab-bar{
        display: flex;
        background-color: @module-background-color;
        border-top: @tab-border-buttom;
        padding: @middle-margin 0;
        .tab-item{
            flex:1;
            align-items: center;
            justify-content: center;
            display: flex;
            flex-direction: column;
            .tab-icon{
                width: @tab-icon-size;
                height: @tab-icon-size;
                margin-bottom: @small-margin;
            }
            .tab-text{
                color:#000;
                font-size: @font-size-normal;
                &.tab-text-active{
                    color: @tab-color-active;
                }
            }
        }
    }
}
</style>
