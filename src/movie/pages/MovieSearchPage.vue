<template>
	<view class="page-wrapper">
		<scroll-view scroll-y>
			<view class="module-block module-block-row">
				<input class="search-input" :placeholder="keyword"/>
				<text class="search-btn">搜索</text>
			</view>
			
			<view class="module-block" style="padding-right: 0;">
				<TitleComponent title="历史记录"/>
				<view class="record-list">
					<text v-if="searchRecordList.length > 0" class="record-item" v-for="item,index in searchRecordList" :key="item+index">{{item}}</text>
					<text class="no-data">暂无搜索记录</text>
				</view>
			</view>
			
			<view class="module-block">
				
			</view>
			
			<view class="module-block module-block-last">
				
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { reactive,onMounted } from 'vue';
	import { useRoute } from "vue-router";
	import type { MovieType} from '../type';
	import {HOST} from '../../config/constant';
	import TitleComponent from '../component/TitleComponent.vue';
	import MovieListComponent from '../component/MovieListComponent.vue';
	import {getMovieStartListService} from '../service';
	
	const searchRecordList:Array<string> = [];
	const route = useRoute();
	const keyword:string = decodeURIComponent(route.query.keyword as string);

			
</script>

<style lang="less" scoped>
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.page-wrapper{
    height: 100vh;
    display: flex;
    flex-direction: column;
	padding: 0 @page-padding @page-padding;
    background-color: @page-background-color;
	.module-block-row{
		display: flex;
		flex-direction: row;
		.search-input{
			flex: 1;
			background-color: @page-background-color;
			height:@input-height;
			border-radius: @input-height;
			padding-left: @page-padding;
		}
		.search-btn{
			display: inline-block;
			background-color: @line-color;
			height: @input-height;
			color: @module-background-color;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 20%;
			margin-left: @page-padding;
			border-radius: @input-height;
		}
	}
	.record-list{
		display: flex;
		flex-wrap: wrap;
		
		.record-item{
			margin-top: @page-padding;
			margin-right: @page-padding;
			height: @input-height;
			background-color: @page-background-color;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0 @btn-padding;
			border-radius: @input-height;
		}
		.no-data{
			display: flex;
			width: 100%;
			height: @big-avater;
			justify-content: center;
			align-items: center;
		}
	}
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
}
</style>
