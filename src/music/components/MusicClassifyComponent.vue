<template>
	<view class="module-block">
		<MusicTitleComponent :classifyItem="classifyItem" />
		<view class="classify-music-list">
			<view class="classify-music-item" :key="classifyItem.id + '_' + item.id" v-for="item in classifyMusicList">
				<image class="song-cover" :src="HOST + item.cover" />
				<view class="song-info">
					<text class="song-name">{{item.songName}}</text>
					<text class="song-desc">{{`${item.authorName} - ${item.albumName}`}}</text>
				</view>
				<image class="icon-play" src="../../../static/icon_music_play.png"></image>
				<text class="icon-add">+</text>
				<image class="icon-play" src="../../../static/icon_music_menu.png" />
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, reactive } from 'vue';
	import type { MusicType } from "../types";
	import { getMusicListByClassifyIdService } from '../service';
	import { HOST } from "../../config/constant";
	import MusicTitleComponent from './MusicTitleComponent';

	const { classifyItem } = defineProps({
		classifyItem: {
			type: Object,
			reqiure: true,
			default: {}
		}
	});
	const classifyMusicList = reactive<Array<MusicType>>([]);
	getMusicListByClassifyIdService(classifyItem.id, 1, 3).then((res) => {
		classifyMusicList.push(...res.data);
	})
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';

	.module-block-last {
		margin-bottom: @page-padding;
	}

	.classify-music-list {
		.classify-music-item {
			display: flex;
			margin-top: @page-padding;
			align-items: center;

			.song-cover {
				width: @middle-avater;
				height: @middle-avater;
				border-radius: 50%;
				margin-right: @page-padding;
			}

			.song-info {
				display: flex;
				flex-direction: column;
				flex: 1;

				.song-name {
					font-weight: bold;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: @max-text-width;
				}

				.song-desc {
					color: @disable-text-color;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					max-width: @max-text-width;
				}
			}

			.icon-play {
				width: @small-icon-size;
				height: @small-icon-size;

			}

			.icon-add {
				padding-right: @page-padding;
				padding-left: @page-padding;
				color: @disable-text-color;
				font-size: 60rpx;
			}
		}
	}
</style>