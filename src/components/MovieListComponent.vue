<template>
	<view>
		<scroll-view v-if="direction === 'horizontal'" scroll-x show-scrollbar="false" class="scroll-view">
			<view  class="scroll-view-item" :key="item.id" v-for="item in movieList">
				<view class="movie-item-wrapper" @click="useNavigateTo(item)">
					<image class="movie-img" :src="HOST + item.localImg"/>
					<text class="movie-name">{{item.movieName}}</text>
				</view>
			</view>
		</scroll-view>

		<view class="grid-wrapper" v-else>
			<view v-for="item in movieList" :key="item.id" class="movie-item-wrapper" @click="useNavigateTo(item)">
				<image class="movie-img" :src="HOST + item.localImg"/>
				<text class="movie-name">{{item.movieName}}</text>
			</view>
		</view>
	</view>

</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	import {HOST} from '../common/constant';
	import type { MovieType } from '../types';
	const { list } = defineProps({
		list:{
			type:Array,
			reqiure:true,
			default:[]
		},
		direction:{
			type:String,
			reqiure:true,
			default:'horizontal'
		}
	});
	const movieList = list as Array<MovieType>;

	const useNavigateTo = (movieItem:MovieType) => {
		uni.navigateTo({
			url: `../pages/MovieDetailPage?data=${encodeURIComponent(JSON.stringify(movieItem))}`
		})
	}

</script>

<style lang="less">
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
					overflow: hidden;
					  display: -webkit-box;
					  -webkit-line-clamp: 2; /* 设置最大显示行数 */
					  -webkit-box-orient: vertical;
					  text-overflow: ellipsis;
				}
			}
		}

	}
	.grid-wrapper{
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-column-gap: @page-padding;
		.movie-item-wrapper{
			width: 100%;
			display: flex;
			align-items: center;
			flex-direction: column;
			margin-top: @page-padding;
			.movie-img{
				width: 100%;
				border-radius: @module-border-radius;
				margin-bottom: @small-margin;
				height: @movie-img-height;
			}
			.movie-name{
				overflow: hidden;
				display: -webkit-box;
				-webkit-line-clamp: 1; /* 设置最大显示行数 */
				-webkit-box-orient: vertical;
				text-overflow: ellipsis;
			}
		}
	}

</style>
