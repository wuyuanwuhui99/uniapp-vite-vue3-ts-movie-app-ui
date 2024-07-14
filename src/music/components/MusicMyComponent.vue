<template>
	<scroll-view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="module-block module-block-row">
			<AvaterComponent size="middle"/>
			<view class="use-info">
				<text class="username">{{store.userData.username}}</text>
				<text class="sign">{{store.userData.sign}}</text>
			</view>
		</view>

		<view class="module-block">
			<MusicTitleComponent :classifyItem="{classifyName:'我的歌单',category:''}">
				<text class="icon-add">+</text>
			</MusicTitleComponent>
			<view v-for="item in musicPlayMenu" class="singer-list" :key="item.id">
				<image v-if="item.cover" class="music-cover" :src="getMusicCover(item.cover)"  />
				<text class="music-cover" v-else>{{item.name.slice(0,1)}}</text>
				<view class="songname-wrapper">
					<text>{{item.name}}</text>
					<text class="total">{{item.total}}首</text>
				</view>
				<image class="icon-operate" src="../../../static/icon_music_play.png"/>
				<image class="icon-operate" src="../../../static/icon_delete.png"/>
				<image class="icon-operate" src="../../../static/icon_music_menu.png"/>
			</view>
		</view>

		<view class="module-block">
			<MusicTitleComponent :classifyItem="{classifyName:'我关注的歌手',category:''}"/>
			<view v-for="item in mySingerList" class="singer-list" :key="item.id">
				<image v-if="item.avatar" class="music-cover" :src="getMusicCover(item.avatar)" />
				<text class="music-cover" v-else>{{item.authorName.slice(0,1)}}</text>
				<view class="songname-wrapper">
					<text>{{item.authorName}}</text>
					<text class="total">{{item.total}}首</text>
				</view>
				<image class="icon-operate" src="../../../static/icon_music_play.png"/>
				<image class="icon-operate" src="../../../static/icon_delete.png"/>
				<image class="icon-operate" src="../../../static/icon_music_menu.png"/>
			</view>
		</view>

		<view class="module-block">
			<MusicTitleComponent :classifyItem="{classifyName:'我发布的歌曲',category:''}"/>
			<view v-for="item in myPublishList" :key="item.id" class="singer-list">
				<image class="music-cover" :src="getMusicCover(item.cover)" />
				<view class="songname-wrapper">
					<text>{{item.authorName}}</text>
					<text class="total">听过{{item.times}}次</text>
				</view>
				<image class="icon-operate" src="../../../static/icon_music_play.png"/>
				<image class="icon-operate" src="../../../static/icon_delete.png"/>
				<image class="icon-operate" src="../../../static/icon_music_menu.png"/>
			</view>
		</view>

		<view class="module-block module-block-last">
			<MusicTitleComponent :classifyItem="{classifyName:'我听过的歌曲',category:''}"/>
			<view v-for="item in recordMusicList" class="singer-list" :key="item.id">
				<image class="music-cover" :src="getMusicCover(item.cover)" />
				<view class="songname-wrapper">
					<text>{{item.songName}}</text>
					<text class="total">{{formatTime(item.createTime)}}</text>
				</view>
				<image class="icon-operate" src="../../../static/icon_music_play.png"/>
				<image class="icon-operate" src="../../../static/icon_delete.png"/>
				<image class="icon-operate" src="../../../static/icon_music_menu.png"/>
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import type { ClassifyType, FavoriteDirectoryType, MuiscPlayMenuType,MusicAuthorType,MusicType} from "../types";
	import AvaterComponent from "../../movie/components/AvaterComponent";
	import { useStore } from "../../stores/useStore";
	import MusicTitleComponent from "./MusicTitleComponent";
	import {getMySingerService,getMusicRecordService,getFavoriteDirectoryService} from "../service";
	import {reactive} from 'vue';
	import {formatTime,getMusicCover} from '../../utils/util';
	const store = useStore();
	const musicPlayMenu = reactive<Array<FavoriteDirectoryType>>([]);
	const mySingerList = reactive<Array<MusicAuthorType>>([]);
	const recordMusicList = reactive<Array<MusicType>>([]);
	const myPublishList = reactive<Array<MusicType>>([]);

	/**
	 * @description: 获取用户歌单
	 * @date: 2024-03-16 23:25
	 * @author wuwenqiang
	 */
	getFavoriteDirectoryService(0).then((res)=>{
		musicPlayMenu.push(...res.data);
	});

	/**
	 * @description: 获取我关注的歌手
	 * @date: 2024-03-17 22:12
	 * @author wuwenqiang
	 */
	getMySingerService(1,5).then((res)=>{
		mySingerList.push(...res.data);
	});

	/**
	 * @description: 获取播放记录
	 * @date: 2024-03-17 22:12
	 * @author wuwenqiang
	 */
	getMusicRecordService(1,5).then((res)=>{
		recordMusicList.push(...res.data);
	});
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
		.use-info{
			margin-left: @page-padding;
			display: flex;
			flex-direction: column;
			.username{
				font-weight: bold;
			}
			.sign{
				color: @disable-text-color;
			}
		}
		.icon-add{
			font-size: @middle-icon-size;
			color: @disable-text-color;
			line-height: calc(@middle-icon-size / 1.5);
		}
		.singer-list{
			display: flex;
			margin-top: @page-padding;
			align-items: center;
			gap:@page-padding;
			.music-cover{
				background-color: @page-background-color;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 0;
			}
			.songname-wrapper{
				display: flex;
				flex-direction: column;
				flex: 1;
				.total{
					color: @disable-text-color;
				}
			}
			.icon-operate{
				width: @small-icon-size;
				height: @small-icon-size;
			}
		}
	}
</style>
