<template>
	<swiper class="swiper-wrapper" indicator-dots autoplay="true" interval="5000" duration="500" 	indicator-active-color="#ffae00" circular="true">
		<swiper-item class="swiper-item" v-for="item in movieList" :key="item.id">
			<image mode="aspectFill" class="swiper-item" :src="HOST + item.localImg"/>
		</swiper-item>
	</swiper>
</template>

<script setup lang="ts">
	import { ref,onMounted,reactive,defineProps } from 'vue';
	import {getCategoryListService} from '../service/index';
	import {HOST} from '../../config/constant';
	import type { MovieType } from '../types';
	const prop = defineProps({
		classify:{
			type:String,
			require:true,
			default:''
		}
	})
	const movieList = reactive<Array<MovieType>>([]);
	
	onMounted(()=>{
		getCategoryListService({classify:prop.classify,category:'轮播'}).then((res)=>{
			movieList.push(...res.data.slice(0,5))
		})
	})
	
</script>

<style lang="less" scoped>
	@import '../../theme/style.less';
	@import '../../theme/size.less';
	@import '../../theme/color.less';
	.swiper-wrapper{
	    margin-top: @page-padding;
	    height: @swiper-height;
	    border-radius: @module-border-radius;
	    overflow: hidden;
	    .swiper-item{
	        width: 100%;
	        height: @swiper-height;
	    }
	}

</style>