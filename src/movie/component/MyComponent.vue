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
			<MovieListComponent :list="playMovieList" v-if="playMovieList.length > 0 && showPlayMovieList" :class="{'scroll-view-margin':playMovieList.length > 0}"/>
		</view>
	</view>
</template>

<script setup lang="ts">
	import AvaterComponent from './AvaterComponent';
	import MovieListComponent from './MovieListComponent';
	import { reactive, onMounted ,ref } from 'vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import { getUserMsgService, getPlayRecordService } from '../service';
	import type { UserMsgType,UserDataType, MovieType } from '../type'; 
	import {HOST} from '../../config/constant';
	const showPlayMovieList = ref<boolean>(true)
	const loading = ref<boolean>(false)
	const store = useMovieStore();
	const userMsg = reactive<UserMsgType>({
		userAge: 0,// 使用天数
		favoriteCount: 0,// 收藏数
		playRecordCount: 0,// 观看记录
		viewRecordCount: 0// 浏览记录
	})
	const playMovieList = reactive<Array<MovieType>>([])
	const useTogglePlayList = () => {// 展开和收起播放记录
		if(loading.value)return
		showPlayMovieList.value = !showPlayMovieList.value;
		console.log(showPlayMovieList.value)
		if(showPlayMovieList.value){// 如果是展开状态，重新获取一次播放记录
			loading.value = true
			playMovieList.splice(0,playMovieList.length)
			getPlayRecordService()
				.then(res => playMovieList.push(...res.data))
				.finally(()=>loading.value = false)
		}
	}
	onMounted(()=>{
		// 获取分类
		getUserMsgService().then(res => Object.assign(userMsg,res.data))
		getPlayRecordService().then(res => playMovieList.push(...res.data))
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
			.title-wrapper{
				display: flex;
				align-items: center;
				.icon-play{
					width: @middle-icon-size;
					height: @middle-icon-size;
					margin-right: @page-padding;
				}
				.title-text{
					flex: 1;
				}
			}
			.scroll-view-margin{
				margin-top: @page-padding;;
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