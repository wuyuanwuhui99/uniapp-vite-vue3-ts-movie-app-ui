<template>
	<scroll-view class="page-wrapper" scroll-y @scrolltolower="onScrolltolower" show-scrollbar="false">
		<view class="module-block" :key="item.id" v-for="item in circleList">
			<image class="user-avater" v-if="item.useravater" :src="HOST + item.useravater"/>
			<image class="user-avater" v-else src="../../../static/default_avater.png"/>
			<view class="content-wrapper">
				<text class="user-name">{{item.username}}</text>
				<text class="content">{{item.content}}</text>
				<view class="music-wrapper">
					<image class="music-cover" :src="HOST + item.musicCover"/>
					<view class="music-info">
						<text class="music-name">{{item.musicSongName}} - {{item.musicAuthorName}}</text>
					</view>
					<image class="icon-music-play" src="../../../static/icon_music_play.png"/>
				</view>
				<view class="operate-wrapper">
					<text class="create-time">{{formatTime(item.createTime)}}</text>
					<image class="icon-menu" src="../../../static/icon_music_menu.png"/>
				</view>
				<view class="like-wrapper">
					<image class="icon-like" src="../../../static/icon_music_like.png"/>
					<template v-for="aItem,aIndex in item.circleLikes" :key="aItem.id">
						<text class="like-user">{{aItem.username}}</text>
						<text v-if="aIndex !== item.circleLikes.length - 1">、</text>
					</template>
					
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import {HOST} from "../../config/constant";
	import {getCircleListByTypeService} from "../service";
	import {reactive,ref} from "vue";
	import type {CircleType} from '../types'; 
	import {formatTime} from '../../utils/util';
	const circleList = reactive<Array<CircleType>>([]);
	const pageNum = ref<number>(1);
	const pageSize = 5;
	
	getCircleListByTypeService("music",pageNum.value,pageSize).then((res)=>{
		circleList.push(...res.data);
	})
	
	const onScrolltolower = () => {
		
	}
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.page-wrapper {
		width: 100%;
		height: 100%;

		/deep/.uni-scroll-view-content {
			&::-webkit-scrollbar {
				display: none;
			}
		}
		.module-block{
			display: flex;
			.user-avater{
				width: @middle-avater;
				height: @middle-avater;
				border-radius: 50%;
				margin-right: @page-padding;
			}
			.user-name{
				 color: @blue-color;
				 font-weight: bold;
			}
			.content-wrapper{
				display: flex;
				flex: 1;
				flex-direction: column;
				.content{
					padding: @page-padding 0;
				}
				.music-wrapper{
					display: flex;
					height: @middle-avater;
					background: @page-background-color;
					border-radius: @middle-avater;
					align-items: center;
					.music-cover{
						width: @middle-avater;
						height: @middle-avater;
						border-radius: 50%;
					}
					.music-info{
						display: flex;
						margin-left: @page-padding;
						flex: 1;
						.music-author{
							color: @disable-text-color;
						}
					}
					.icon-music-play{
						width: @small-icon-size;
						height: @small-icon-size;
						margin-right: @page-padding;
					}
				}
				.operate-wrapper{
					display: flex;
					align-items: center;
					margin-top: @page-padding;
					.create-time{
						flex: 1;
						color: @disable-text-color;
					}
					.icon-menu{
						width: @small-icon-size;
						height: @small-icon-size;
					}
				}
				.like-wrapper{
					margin-top: @page-padding;;
					display: flex;
					flex-wrap: wrap;
					background: @page-background-color;
					padding: @page-padding;
					border-radius: @module-border-radius;
					.icon-like{
						width: @small-icon-size;
						height: @small-icon-size;
						margin-right: @page-padding;
					}
					.like-user{
						color: @blue-color;
					}
				}
			}
		}
		
	}
</style>
