<template>
	<scroll-view scroll-x show-scrollbar="false" class="scroll-view">
	    <view class="scroll-view-item" :key="item.id" v-for="item in movieList">
	        <view class="movie-item-wrapper">
	            <image class="movie-img" :src="HOST + item.localImg"/>
	            <text class="movie-name">{{item.movieName}}</text>
	        </view>
	    </view>
	</scroll-view>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	import {HOST} from '../../config/constant';
	import type { MovieType,ClassifyType } from '../type';
	const { list } = defineProps({
		list:{
			type:Array,
			reqiure:true,
			default:[]
		}
	})
	const movieList = list as Array<MovieType>
</script>

<style lang="less">
	@import '../../theme/style.less';
	@import '../../theme/size.less';
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