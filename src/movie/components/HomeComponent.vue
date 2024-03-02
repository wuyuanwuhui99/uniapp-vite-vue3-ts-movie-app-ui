<template>
	<view class="page-wrapper">
		<SearchComponent classify='电影'/>
		
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
	import { onMounted,reactive } from 'vue';
	import {getAllCategoryListByPageNameService} from '../service';
	import SwiperComponent from './SwiperComponent';
	import CategoryComponent from './CategoryComponent';
	import type { ClassifyType } from '../type';
	import SearchComponent from './SearchComponent';
	const classifyList = reactive<Array<ClassifyType>>([])
	onMounted(()=>{
		// 获取分类
		getAllCategoryListByPageNameService('首页').then(res => classifyList.push(...res.data))
	})
</script>

<style lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';

.page-wrapper{
	width: 100%;
	height: 100%;
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
				width: @big-icon-size;
				height: @big-icon-size;
				margin-bottom: @small-margin;
			}
		}
	}
}
</style>