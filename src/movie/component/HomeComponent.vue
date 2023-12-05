<template>
	<view class="home-wrapper">
		<view class="search-wrapper module-block">
			<image class="user-avater user-avater-middle" :src="HOST + store.userData.avater"/>
			<view class="search-input-wrapper">
				<text class="search-input-placehold">{{keyword}}</text>
			</view>
		</view>	
		
		<SwiperComponent classify='电影'/>
		
		<view class="classify-wrapper module-block">
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_hot.png"/>
				<text class="classify-text">热门</text>
			</view>
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_play.png"/>
				<text class="classify-text">预告</text>
			</view>
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_top.png"/>
				<text class="classify-text">最新</text>
			</view>
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_classify.png"/>
				<text class="classify-text">分类</text>
			</view>
		</view>
		
		<CategoryComponent :key="item.category" v-for="item in classifyList" :classifyItem="item"/>
	</view>
</template>

<script setup lang="ts">
	import { ref,onMounted,reactive } from 'vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import {HOST} from '../../config/constant';
	import {getKeyWordService,getAllCategoryListByPageNameService} from '../service';
	import SwiperComponent from './SwiperComponent';
	import CategoryComponent from './CategoryComponent';
	import type { ClassifyType } from '../type';
	const keyword = ref<string>('');
	const classifyList = reactive<Array<ClassifyType>>([])
	const store = useMovieStore();
	onMounted(()=>{
		// 获取搜素框推荐电影
		getKeyWordService('电影').then(res => keyword.value = res.data.movieName)
		
		// 获取分类
		getAllCategoryListByPageNameService('首页').then(res => classifyList.push(...res.data))
	})
</script>

<style lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.home-wrapper{
    .search-wrapper{
        display: flex;
        .search-input-wrapper{
            flex: 1;
            margin-left: @page-padding;
            height: @middle-avater;
            background-color: @search-input-color;
            border-radius: @btn-border-radius;
            display: flex;
            align-items: center;
            padding-left: @page-padding;
            .search-input-placehold{
                color: @search-input-placehold;
            }
        }
    }
    .classify-wrapper{
        margin-top: @page-padding;
        display: flex;
        .classify-item{
            flex: 1;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            display: flex;
            .classify-img{
                width: @classify-icon-size;
                height: @classify-icon-size;
                margin-bottom: @small-margin;
            }
        }
    }
    
}
</style>