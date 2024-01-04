<template>
	<view class="page-wrapper" v-if="movieItem.id">
		<scroll-view scroll-y>
			<view class="module-block module-block-row">
				<view class="movie-img-wrapper" @click="usePlayRouter" :style="{backgroundImage:'url('+HOST + movieItem.localImg+')'}">
					<image class="icon-play" src="../../../static/icon_detail_play.png"/>
				</view>
				
				<view class="movie-name-wrapper">
					<text class="movie-name">{{movieItem.movieName}}</text>
					<text class="movie-description">{{movieItem.description.replace(/\n\s/g,'')}}</text>
					<text class="movie-description">{{movieItem.star}}</text>
					<text class="movie-description">{{movieItem.type}}</text>
					<ScoreComponent :score="movieItem.score"/>
				</view>
			</view>
			
			<view class="module-block">
				<TitleComponent title="剧情"/>
				<text class="plot">{{movieItem.plot}}</text>
			</view>
			
			<view class="module-block">
				<TitleComponent title="演员"/>
				<scroll-view scroll-x show-scrollbar="false" class="scroll-view" v-if="starList.length > 0">
				    <view class="scroll-view-item" :key="item.id" v-for="item in starList">
				        <view class="movie-item-wrapper">
				            <image class="movie-img" :src="HOST + item.localImg"/>
				            <text class="movie-name">{{item.starName}}</text>
				        </view>
				    </view>
				</scroll-view>
			</view>
			
			<view class="module-block module-block-last">
				<TitleComponent title="推荐"/>
				<MovieListComponent :list="recommentList"/>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { reactive,onMounted } from 'vue';
	import { useRoute } from "vue-router";
	import type { MovieType,StarType } from '../type';
	import {HOST} from '../../config/constant';
	import TitleComponent from '../component/TitleComponent.vue';
	import MovieListComponent from '../component/MovieListComponent.vue';
	import ScoreComponent from '../component/ScoreComponent.vue';
	import {getMovieStartListService,getRecommentListService,saveViewRecordService} from '../service';
	
	const movieItem = reactive<MovieType>({} as MovieType);
	const starList = reactive<Array<StarType>>([]);
	const recommentList = reactive<Array<MovieType>>([]);
	
	const usePlayRouter = ()=>{
		uni.navigateTo({
			url: `../pages/MoviePlayPage?data=${encodeURIComponent(JSON.stringify(movieItem))}`
		})
	}
	
	
	onMounted(()=>{
		const route = useRoute();
		const queryData:string = decodeURIComponent(route.query.data as string); // 获取URL上的查询参数并反序列化
		Object.assign(movieItem,JSON.parse(queryData))
		
		movieItem.id = 16575 //有数据的电影id
		getMovieStartListService(movieItem.id).then(res=>starList.push(...res.data))
	
		getRecommentListService(movieItem.classify).then(res=>recommentList.push(...res.data))
		
		saveViewRecordService(movieItem);// 插入浏览记录
	})
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
		.movie-img-wrapper{
			position: relative;
			width: @movie-img-width;
			height: @movie-img-height;
			border-radius: @module-border-radius;
			background-size: cover;
			background-position: center;
			display: flex;
			align-items: center;
			justify-content: center;
			.icon-play{
				width: @big-icon-size;
				height: @big-icon-size;
			}
		}
		.movie-name-wrapper{
			margin-left: @page-padding;
			display: flex;
			flex-direction: column;
			.movie-name{
				font-size: @font-size-big;
				font-weight: bolder;
			}
			.movie-description{
				margin-top: @small-margin;
			}
		}
	}
	.plot{
		padding-top: @page-padding;
		display: inline-block;
		text-indent: 2em;
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
