<template>
	<view class="my-wrapper">
		<view class="user-wrapper module-block">
			<AvaterComponent size='big'/>
			<view class="user-name-wrapper">
				<text class="user-name">{{store.userData.username}}</text>
				<text class="user-sign">{{store.userData.sign}}</text>
			</view>
			<image class="icon-edit" src="../../../static/icon_edit.png"/>
		</view>

		<view class="user-msg-wrapper module-block">
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.userAge}}</text>
				<text class="user-msg-title">使用天数</text>
			</view>
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.favoriteCount}}</text>
				<text class="user-msg-title">收藏</text>
			</view>
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.playRecordCount}}</text>
				<text class="user-msg-title">观看记录</text>
			</view>
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.viewRecordCount}}</text>
				<text class="user-msg-title">浏览记录</text>
			</view>
		</view>

		<view class="play-record-view module-block">
			<view class="title-wrapper" @click="useTogglePlayList">
				<image class="icon-play" src="../../../static/icon_play_record.png"/>
				<text class="title-text">观看记录</text>
				<image class="icon-arrow" :class="{'icon-arrow-rotate':showPlayMovieList}" src="../../../static/icon_arrow.png"/>
			</view>
			<MovieListComponent direction="horizontal" :list="playMovieList" v-if="playMovieList.length > 0 && showPlayMovieList" :class="{'scroll-view-margin':playMovieList.length > 0}"/>
		</view>

		<view class="module-block">
			<view class="title-wrapper" @click="useToggleMyFavorite">
				<image class="icon-play" src="../../../static/icon_collection.png"/>
				<text class="title-text">我的收藏</text>
				<image class="icon-arrow" :class="{'icon-arrow-rotate':showMyFavoriteMovieList}" src="../../../static/icon_arrow.png"/>
			</view>
			<MovieListComponent direction="horizontal" :list="myFavoriteMovieList" v-if="myFavoriteMovieList.length > 0 && showMyFavoriteMovieList" :class="{'scroll-view-margin':myFavoriteMovieList.length > 0}"/>
		</view>

		<view class="module-block">
			<view class="title-wrapper" @click="useToggleMyViews">
				<image class="icon-play" src="../../../static/icon_record.png"/>
				<text class="title-text">我浏览过的电影</text>
				<image class="icon-arrow" :class="{'icon-arrow-rotate':showMyViewsMovieList}" src="../../../static/icon_arrow.png"/>
			</view>
			<MovieListComponent direction="horizontal" :list="myViewsMovieList" v-if="myViewsMovieList.length > 0 && showMyViewsMovieList" :class="{'scroll-view-margin':myFavoriteMovieList.length > 0}"/>
		</view>

		<view class="module-block">
			<view class="title-wrapper title-wrapper-pading" @click="useNavigateToMusicIndex">
				<image class="icon-play" src="../../../static/icon_music.png"/>
				<text class="title-text">音乐</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>

			<view class="title-wrapper title-wrapper-pading">
				<image class="icon-play" src="../../../static/icon_music_circle.png"/>
				<text class="title-text">电影圈</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>

			<view class="title-wrapper title-wrapper-pading">
				<image class="icon-play" src="../../../static/icon_app.png"/>
				<text class="title-text">小程序</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import AvaterComponent from './AvaterComponent';
	import MovieListComponent from './MovieListComponent';
	import { reactive, onMounted ,ref } from 'vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import {
		getUserMsgService,
		getPlayRecordMovieListService,
		getMyFavoriteMovieListService,
		getMyViewsMovieListService
	} from '../service';
	import type { UserMsgType, MovieType } from '../type';

	const showPlayMovieList = ref<boolean>(true)
	const showMyFavoriteMovieList = ref<boolean>(false)
	const showMyViewsMovieList = ref<boolean>(false)
	const loading = ref<boolean>(false)

	const playMovieList = reactive<Array<MovieType>>([])
	const myFavoriteMovieList = reactive<Array<MovieType>>([])
	const myViewsMovieList = reactive<Array<MovieType>>([])

	const store = useMovieStore();

	const userMsg = reactive<UserMsgType>({
		userAge: 0,// 使用天数
		favoriteCount: 0,// 收藏数
		playRecordCount: 0,// 观看记录
		viewRecordCount: 0// 浏览记录
	})


	// 展开或折叠观看记录
	const useTogglePlayList = () => {// 展开和收起播放记录
		if(loading.value)return
		showPlayMovieList.value = !showPlayMovieList.value;
		if(showPlayMovieList.value){// 如果是展开状态，重新获取一次播放记录
			loading.value = true
			playMovieList.splice(0,playMovieList.length)
			getPlayRecordMovieListService()
				.then(res => playMovieList.push(...res.data))
				.finally(()=>loading.value = false)
		}
	}

	// 展开或折叠我的收藏
	const useToggleMyFavorite = () => {
		if(loading.value)return
		showMyFavoriteMovieList.value = !showMyFavoriteMovieList.value;
		if(showMyFavoriteMovieList.value){// 如果是展开状态，重新获取一次播放记录
			loading.value = true
			myFavoriteMovieList.splice(0,myFavoriteMovieList.length)
			getMyFavoriteMovieListService(1,20)
				.then(res => myFavoriteMovieList.push(...res.data))
				.finally(()=>loading.value = false)
		}
	}

	// 展开和收起我浏览过的额电影
	const useToggleMyViews = () => {
		if(loading.value)return
		showMyViewsMovieList.value = !showMyViewsMovieList.value;
		if(showMyViewsMovieList.value){// 如果是展开状态，重新获取一次播放记录
			loading.value = true
			myViewsMovieList.splice(0,myViewsMovieList.length)
			getMyViewsMovieListService(1,20)
				.then(res => myViewsMovieList.push(...res.data))
				.finally(()=>loading.value = false)
		}
	}

	
	/**
	 * @description: 跳转到音乐首页
	 * @date: 2024-03-02 22:22
	 * @author wuwenqiang
	 */
	const useNavigateToMusicIndex = () => {
		uni.navigateTo({
			url: `../../music/pages/MusicIndexPage`
		})
	}

	onMounted(()=>{
		// 获取分类
		getUserMsgService().then(res => Object.assign(userMsg,res.data))
		getPlayRecordMovieListService().then(res => playMovieList.push(...res.data))
	})
</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.my-wrapper{
		overflow: auto;
		.user-wrapper{
			display: flex;
			align-items: center;
			.user-name-wrapper{
				display: flex;
				flex-direction: column;
				flex: 1;
				margin-left: @page-padding;
				.user-name{
					font-size: @font-size-big;
					font-weight: bolder;
					padding-bottom: @small-margin;
				}
				.user-sign{
					font-size: @font-size-normal;
					color: @disable-text-color;
				}
			}
			.icon-edit{
				width: @big-icon-size;
				height: @big-icon-size;
			}
		}
		.user-msg-wrapper{
			display: flex;
			.user-msg-item{
				display: flex;
				flex: 1;
				flex-direction: column;
				align-items: center;
				.user-msg-count{
					font-size: @font-size-big;
					font-weight: bolder;
					padding-bottom: @small-margin;
				}
				.user-msg-title{
					font-size: @font-size-normal;
					color: @disable-text-color;
				}
			}
		}
		.play-record-view{
			.scroll-view-margin{
				margin-top: @page-padding;
			}
		}

		.title-wrapper{
			display: flex;
			align-items: center;
			&.title-wrapper-pading{
				padding-top: @page-padding;
				padding-bottom: @page-padding;
				border-bottom: 1px solid @page-background-color;
				&:first-child{
					padding-top:0
				}
				&:last-child{
					padding-bottom:0;
					border-bottom:none
				}
			}
			.icon-play{
				width: @middle-icon-size;
				height: @middle-icon-size;
				margin-right: @page-padding;
			}
			.title-text{
				flex: 1;
			}
		}
		.icon-arrow{
			width: @small-icon-size;
			height: @small-icon-size;
			opacity: 0.5;
			&.icon-arrow-rotate{
				transform: rotate(90deg);
			}
		}

	}
</style>
