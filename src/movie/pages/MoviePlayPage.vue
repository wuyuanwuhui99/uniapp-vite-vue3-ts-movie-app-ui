<template>
	<view class="page-wrapper">
		<scroll-view scroll-y>
			<web-view class="play-webview" src="" v-if="currentUrl"></web-view>
			<view class="play-webview" v-else></view>
			<view class="section-wrapper">
				<view class="module-block row">
					<image class="icon-middle" src="../../../static/icon_comment.png"/>
					<text class="comment-count small-margin">{{commonCount}}</text>
					<image class="icon-middle" v-if="isFavorite" @click="useDeleteFavorite" src="../../../static/icon_collection_active.png"/>
					<image class="icon-middle" v-else @click="useSaveFavorite" src="../../../static/icon_collection.png"/>
					<image class="icon-middle small-margin" src="../../../static/icon_share.png"/>
				</view>

				<view class="module-block column">
					<text class="movieName">{{movieItem.movieName}}</text>
					<text class="sub-title">{{movieItem.star}}</text>
					<text class="sub-title" v-if="movieItem.description">{{movieItem.description.replace(/\n|\s/g,'')}}</text>
					<ScoreComponent :score="movieItem.score"/>
				</view>

				<view class="module-block">
					<scroll-view scroll-x>
						<view class="play-group-wrapper">
							<text @click="useTabPlayGroup(index)" class="group-text" :class="{'group-text-active': currentUrlGroup === index}" v-for="item,index in movieUrlGroup" :key="'playGround' + index">{{item[0].playGroup}}</text>
						</view>
					</scroll-view>

					<view class="grid-wrapper">
						<text class="grid-item" :key="item.id" :class="{'grid-item-active': currentUrl === item.url}" v-for="item,index in movieUrlGroup[currentUrlGroup]">
							{{item.label}}
						</text>
					</view>
				</view>

				<view class="module-block">
					<TitleComponent title="推荐"/>
					<MovieListComponent direction="horizontal" :list='recommentList'/>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { reactive,onMounted,ref } from 'vue';
	import { useRoute } from "vue-router";
	import type { MovieType,MovieUrlType } from '../type';
	import {HOST} from '../../config/constant';
	import TitleComponent from '../component/TitleComponent.vue';
	import MovieListComponent from '../component/MovieListComponent.vue';
	import ScoreComponent from '../component/ScoreComponent.vue';
	import {getCommentCountService,savePlayRecordService,getMovieUrlService,getRecommentListService,isFavoriteService,saveFavoriteService,deleteFavoriteService} from '../service';

	const movieItem = reactive<MovieType>({} as MovieType);
	const currentUrl = ref<string>('');// 当前播放地址
	const commonCount = ref<number>(0);// 评论数量
	const isFavorite = ref<boolean>(false);// 是否收藏
	const movieUrlGroup = reactive<Array<Array<MovieUrlType>>>([]);//电影分组
	const currentUrlGroup = ref<number>(0);// 播放的分组
	const recommentList = reactive<Array<MovieType>>([]);// 推荐电影

	const useTabPlayGroup = (index:number) => {
		currentUrlGroup.value = index;
	}

	const route = useRoute();
	const queryData:string = decodeURIComponent(route.query.data as string); // 获取URL上的查询参数并反序列化
	Object.assign(movieItem,JSON.parse(queryData))
	movieItem.id = 72667;// 测试数据

	getCommentCountService(movieItem.id).then((res)=>{
		commonCount.value = res.data
	})

	/**
	 * @description: 获取播放电影分组
	 * @date: 2023-12-28 22:34
	 * @author wuwenqiang
	 */
	getMovieUrlService(movieItem.id).then((res)=>{
		res.data.forEach((dItem,dIndex)=>{
			if(dIndex == 0){
			  currentUrl.value = dItem.url;
			}
			const index:number = movieUrlGroup.findIndex((mItem)=> mItem[0].playGroup === dItem.playGroup)
			if(index != -1){
			  movieUrlGroup[index].push(dItem);
			}else{
			  movieUrlGroup.push([dItem]);
			}
		})
	});

	/**
	 * @description: 获取推荐的电影
	 * @date: 2023-12-28 22:33
	 * @author wuwenqiang
	 */
	getRecommentListService(movieItem.classify).then((res)=>{
		recommentList.push(...res.data);
	})

	/**
	 * @author: wuwenqiang
	 * @description: 查询是否已经收藏
	 * @date: 2023-12-28 22:53
	 */
	isFavoriteService(movieItem.id).then((res)=>{
		isFavorite.value = res.data > 0;
	})

	/**
	 * @author: wuwenqiang
	 * @description: 添加收藏
	 * @date: 2023-12-28 22:58
	 */
	const useSaveFavorite = () => {
		saveFavoriteService(movieItem).then((res)=>{
			isFavorite.value = res.data > 0
		})
	}

	/**
	 * @author: wuwenqiang
	 * @description: 取消收藏
	 * @date: 2023-12-28 22:58
	 */
	const useDeleteFavorite = () => {
		deleteFavoriteService(movieItem.id).then((res)=>{
			isFavorite.value = !(res.data > 0)
		})
	}


	savePlayRecordService(movieItem)
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.page-wrapper{
		background-color: @page-background-color;
		.play-webview{
			width: 100%;
			height:@webview-height;
			background-color: @black-background-color;
		}
		.section-wrapper{
			padding-left: @page-padding;
			padding-right: @page-padding;
			padding-bottom: @page-padding;
		}
		.row{
			display: flex;
			align-items: center;
			.comment-count{
				flex: 1;
			}
		}
		.column{
			display: flex;
			flex-direction: column;
			.movieName{
				font-size: @font-size-big;
				font-weight: bolder;
			}
			.sub-title{
				color: @sub-title-color;
				margin-top: @small-margin;
			}
		}
		.play-group-wrapper{
			white-space: nowrap;
			.group-text{
				display: inline-block;
				border-bottom: 1rpx solid @disable-text-color;
				padding: @small-margin;
				&.group-text-active{
					border-left: 1rpx solid @disable-text-color;
					border-right: 1rpx solid @disable-text-color;
					border-top: 1rpx solid @disable-text-color;
					border-bottom:none;
					color: @selected-color;
				}
			}

		}
		.grid-wrapper{
			display: grid;
			margin-top: @middle-margin;
			grid-template-columns: 1fr 1fr 1fr 1fr;
			grid-column-gap: @middle-margin;
			grid-row-gap: @middle-margin;
			.grid-item{
				border-width: 1rpx;
				border-style: solid;
				border-color: @disable-text-color;
				padding: @small-margin;
				border-radius: @btn-border-radius;
				&.grid-item-active{
					color: @selected-color;
					border-color: @selected-color;
				}
			}
		}
	}
</style>
