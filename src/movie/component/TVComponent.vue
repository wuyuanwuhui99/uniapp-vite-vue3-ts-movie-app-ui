<template>
	<view class="tv-wrapper">
		<SearchComponent classify='电视剧'/>
		
		<SwiperComponent classify='电视剧'/>
		
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
		getAllCategoryListByPageNameService('电视剧').then(res => classifyList.push(...res.data))
	})
</script>

<style lang="less" scoped>

</style>