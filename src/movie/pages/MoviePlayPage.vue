<template>
	<view class="page-wrapper">
		<scroll-view scroll-y>
			<div id="player" class="play-webview"></div>
			<view class="section-wrapper">
				<view class="module-block row">
					<image @click="useShowCommentDialog" class="icon-middle" src="../../../static/icon_comment.png"/>
					<text class="comment-count small-margin">{{commonCount}}</text>
					<image class="icon-middle" v-if="isFavorite" @click="useDeleteFavorite" src="../../../static/icon_collection_active.png"/>
					<image class="icon-middle" v-else @click="useSaveFavorite" src="../../../static/icon_collection.png"/>
					<image class="icon-middle small-margin" src="../../../static/icon_share.png"/>
				</view>

				<view class="module-block column">
					<text class="movieName">{{movieItem.movieName}}</text>
					<text class="sub-title">{{movieItem.star}}</text>
					<text class="sub-title" v-if="movieItem.description">{{movieItem.description?.replace(/\n|\s/g,'')}}</text>
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
		<DialogComponent @onClose="showCommentDialog = false" v-if="showCommentDialog">
			<template #header><text class="comment-header">{{commonCount}}条评论</text></template>
			<template #content><CommentComponent @onSend="useUpdateTotal" :isShowInput="true" :relationId="movieItem.id" :category='CommentEnum.MOVIE' :commentList="commentList"></CommentComponent></template>
		</DialogComponent>
	</view>
</template>

<script setup lang="ts">
	// 播放器样式文件
	import 'mui-player/dist/mui-player.min.css'
	// npm安装方式引入mui-player
	import MuiPlayer from 'mui-player'
	// 要播放m3u8的视频就必须要引入hls.js
	import Hls from 'hls.js'
	
	import { reactive,onMounted,ref,onUnmounted } from 'vue';
	import { HOST, LoopMode,CommentEnum } from '../../config/constant';
	import { useRoute } from "vue-router";
	import type { MovieType,MovieUrlType } from '../types';
	import TitleComponent from '../components/TitleComponent.vue';
	import MovieListComponent from '../components/MovieListComponent.vue';
	import ScoreComponent from '../components/ScoreComponent.vue';
	import DialogComponent from '../../music/components/DialogComponent.vue';
	import CommentComponent from '../../music/components/CommentComponent.vue';
	import type {CommentType} from '../../music/types';
	import {getCommentCountService,getTopCommentListService} from '../../music/service';
	import {savePlayRecordService,getMovieUrlService,getRecommentListService,isFavoriteService,saveFavoriteService,deleteFavoriteService} from '../service';

	const movieItem = reactive<MovieType>({} as MovieType);
	const currentUrl = ref<string>('');// 当前播放地址
	const commonCount = ref<number>(0);// 评论数量
	const isFavorite = ref<boolean>(false);// 是否收藏
	const movieUrlGroup = reactive<Array<Array<MovieUrlType>>>([]);//电影分组
	const currentUrlGroup = ref<number>(0);// 播放的分组
	const recommentList = reactive<Array<MovieType>>([]);// 推荐电影
	const commentList = reactive<Array<CommentType>>([]);// 
	const showCommentDialog = ref<boolean>(false);// 是否评论展示弹窗
	let mp:MuiPlayer;

	const useTabPlayGroup = (index:number) => {
		currentUrlGroup.value = index;
	}

	const route = useRoute();
	const queryData:string = decodeURIComponent(route.query.data as string); // 获取URL上的查询参数并反序列化
	Object.assign(movieItem,JSON.parse(queryData))
	movieItem.id = 72667;// 测试数据

	getCommentCountService(movieItem.id,CommentEnum.MOVIE).then((res)=>{
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
		saveFavoriteService(movieItem.id).then((res)=>{
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


	/**
	 * @description: 更新总数
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useUpdateTotal = () => {
		getCommentCountService(movieItem.id,CommentEnum.MUSIC).then(res => commonCount.value = res.data)
	}

	const useShowCommentDialog = () => {
		getTopCommentListService(movieItem.id,CommentEnum.MOVIE,1,20).then(res => {
			commentList.splice(0,commentList.length,...res.data)
			showCommentDialog.value = true;
		})	
	}

	savePlayRecordService(movieItem);
	
	onMounted(()=>{
		mp = new MuiPlayer({
		    container:document.getElementById("player"),
		    src:currentUrl.value,
		    parse:{
		        type:'hls',
		        loader:Hls,
		        config:{ 
		            cors:true
		        },
		    },
		});
	})
	
	onUnmounted(()=>{
		mp.destroy();
	})
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
		.comment-header{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
