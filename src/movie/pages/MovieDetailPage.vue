<template>
	<view class="movie-detail-wrapper" v-if="movieItem.id">
		<scroll-view scroll-y>
			<view class="module-block module-block-row">
				<view class="movie-img-wrapper" :style="{backgroundImage:'url('+HOST + movieItem.localImg+')'}">
					<image class="icon-play" src="../../../static/icon_detail_play.png"/>
				</view>
				
				<view class="movie-name-wrapper">
					<text class="movie-name">{{movieItem.movieName}}</text>
					<text class="movie-description">{{movieItem.description.replace(/\n\s/g,'')}}</text>
					<text class="movie-description">{{movieItem.star}}</text>
					<text class="movie-description">{{movieItem.type}}</text>
					<view v-if="movieItem.score" class="score-wrapper">
						<uni-rate :touchable="false" :value="movieItem.score/2" />
						<text class="score-text">{{movieItem.score}}</text>
					</view>
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
			
			<view class="module-block">
				<TitleComponent title="推荐"/>
				<MovieListComponent :list="recommentList"/>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import uniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue'
	import { reactive,onMounted } from 'vue';
	import { useRoute } from "vue-router";
	import type { MovieType,StarType } from '../type';
	import {HOST} from '../../config/constant';
	import TitleComponent from '../component/TitleComponent.vue';
	import MovieListComponent from '../component/MovieListComponent.vue';
	import {getMovieStartListService,getRecommentListService} from '../service';
	
	const movieItem = reactive<MovieType>({} as MovieType);
	const starList = reactive<Array<StarType>>([]);
	const recommentList = reactive<Array<MovieType>>([]);
	
	onMounted(()=>{
		const route = useRoute();
		const queryData:string = decodeURIComponent(route.query.data as string); // 获取URL上的查询参数并反序列化
		Object.assign(movieItem,JSON.parse(queryData))
		
		movieItem.id = 16575 //有数据的电影id
		getMovieStartListService(movieItem.id).then(res=>starList.push(...res.data))
	
		getRecommentListService(movieItem.classify).then(res=>recommentList.push(...res.data))
	})
</script>

<style lang="less" scoped>
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.movie-detail-wrapper{
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
			.score-wrapper{
				margin-top: @small-margin;
				display: flex;
				align-items: center;
				.score-text{
					padding-left: @small-margin;
					font-size: @font-size-normal;
					font-weight: bolder;
					color: red;
				}
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
