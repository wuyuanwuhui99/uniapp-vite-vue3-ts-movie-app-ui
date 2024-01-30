<template>
	<scroll-view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="module-block module-block-row">
			<view class="search-input-wrapper">
				<input class="search-input"  v-model="keyword" :placeholder="placeholder"/>
				<image @click="useClear" v-if="keyword" class="icon-clear" src="../../../static/icon_clear.png"/>
			</view>
			<text class="search-btn" @click="useSearch">搜索</text>
		</view>

		<template v-if="searching">
			<view v-if="!loading" class="module-block module-block-last">
			<MovieListComponent direction="vertical" :list="searchList"/>
			</view>
		</template>
		<template v-else>
			<view class="module-block" style="padding-right: 0;">
				<TitleComponent title="历史记录"/>
				<view class="record-list">
					<text @click="useLabelSearch(item)" v-if="searchRecordList.length > 0" class="record-item" v-for="item,index in searchRecordList" :key="item+index">{{item}}</text>
					<text class="no-data">暂无搜索记录</text>
				</view>
			</view>
			
			<view class="module-block">
				<TitleComponent title="推荐"/>
				<MovieListComponent direction="vertical" :list="recommentList"/>
			</view>
		</template>
	</scroll-view>
</template>

<script setup lang="ts">
	import { reactive,ref,onMounted } from 'vue';
	import { useRoute } from "vue-router";
	import type { MovieType} from '../type';
	import {HOST} from '../../config/constant';
	import TitleComponent from '../component/TitleComponent.vue';
	import MovieListComponent from '../component/MovieListComponent.vue';
	import {getRecommendService,getSearchService} from '../service';

	const searchRecordList:Array<string> = [];
	const route = useRoute();
	const placeholder:string = decodeURIComponent(route.query.keyword as string);
	const recommentList = reactive<Array<MovieType>>([]);
	const searchList = reactive<Array<MovieType>>([]);
	const searching = ref<boolean>(false);
	const loading = ref<boolean>(false);
	const keyword = ref<string>("");
	const pageNum = ref<number>(1);
	const pageSize = ref<number>(20);
	
	uni.getStorage('historyMovieLabels').then(res=>{
		if(res){
			searchRecordList.push(...res.data.split(","))
		}
	}) 
	
	/**
	 * @description: 获取推荐的电影
	 * @date: 2024-01-30 22:24
	 * @author wuwenqiang
	 */
	getRecommendService(route.query.classify as string).then((res)=>{
		recommentList.push(...res.data);
	})
	
	/**
	 * @description: 搜索
	 * @date: 2024-01-30 22:24
	 * @author wuwenqiang
	 */
	const useSearch = ()=>{
		if(!keyword.value){
			keyword.value = placeholder;
		}
		if(loading.value)return;
		searching.value = loading.value = true;
		const index = searchRecordList.findIndex(item=>item === keyword.value);
		if(index!==-1){
			searchRecordList.splice(index,1);
		}
		searchRecordList.unshift(keyword.value);
		uni.setStorage('historyMovieLabels',searchRecordList.join(","))
		getSearchService(keyword.value,pageNum.value,pageSize.value).then(res=>{
			searchList.splice(0,searchList.length,...res.data);
		}).finally(()=>{
			loading.value = false
		})
	}
	
	/**
	 * @description: 清除搜索
	 * @date: 2024-01-30 22:24
	 * @author wuwenqiang
	 */
	const useClear =()=>{
		if(loading.value)return;
		searching.value = false;
		keyword.value = '';
	}
	
	/**
	 * @description: 点击历史搜索记录进行搜索
	 * @date: 2024-01-30 22:24
	 * @author wuwenqiang
	 */
	const useLabelSearch = (item:string)=>{
		keyword.value = item;
		useSearch();
	}
</script>

<style lang="less" scoped>
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.page-wrapper{
    height: 100%;
    display: flex;
	overflow: hidden;
    flex-direction: column;
	padding: 0 @page-padding @page-padding;
    background-color: @page-background-color;
	box-sizing: border-box;
	/deep/.uni-scroll-view::-webkit-scrollbar {
	  display: none;
	}
	.module-block-row{
		display: flex;
		flex-direction: row;
		.search-input-wrapper{
			flex: 1;
			background-color: @page-background-color;
			height:@input-height;
			border-radius: @input-height;
			padding-left: @page-padding;
			padding-right: @page-padding;
			display: flex;
			flex-direction: row;
			align-items: center;
			.search-input{
				flex: 1;
			}
			.icon-clear{
				width: @small-icon-size;
				height: @small-icon-size;
			}
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
