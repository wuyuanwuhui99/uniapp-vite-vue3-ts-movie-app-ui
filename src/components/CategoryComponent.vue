<template>
	<view class="module-block">
	    <TitleComponent :title="classifyItem.category"/>
	    <MovieListComponent direction="horizontal" :list='movieList'/>
	</view>
</template>

<script setup lang="ts">
	import { reactive,defineProps } from 'vue';
	import {getCategoryListService} from '../service/index';
	import type { MovieType,ClassifyType } from '../types';
	import TitleComponent from './TitleComponent.vue';
	import MovieListComponent from './MovieListComponent.vue';
	const props = defineProps({
		classifyItem:{
			type:Object,
			reqiure:true,
			default:{}
		}
	})
	const movieList = reactive<Array<MovieType>>([]);
	getCategoryListService(props.classifyItem as ClassifyType).then((res)=>{
		movieList.push(...res.data);
	})
</script>

<style lang="less" scoped>
	@import '../theme/style.less';
	@import '../theme/size.less';
	.scroll-view{
		white-space: nowrap;
		margin-top: @page-padding;
		.scroll-view-item{
			display: inline-block;
			margin-left: @page-padding;
			&:first-child{
				margin-left: 0;
			}
			.movie-item-wrapper{
				display: flex;
				align-items: center;
				width: @movie-img-width;
				flex-direction: column;

				.movie-img{
					width: @movie-img-width;
					height: @movie-img-height;
					border-radius: @module-border-radius;
					margin-bottom: @small-margin;
				}
				.movie-name{
					display: inline;
				}
			}
		}
	}
</style>
