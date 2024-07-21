<template>
	<view class="module-block">
		<MusicTitleComponent @useMore="useMore" :classifyItem="classifyItem" />
		<view class="classify-music-list">
			<view class="classify-music-item" @click="usePlayMusic(item)" :key="classifyItem.id + '_' + item.id" v-for="item in classifyMusicList">
				<image class="music-cover" :src="getMusicCover(item.cover)" />
				<view class="song-info">
					<text class="song-name">{{item.songName}}</text>
					<text class="song-desc">{{`${item.authorName} - ${item.albumName}`}}</text>
				</view>
				<image class="icon-play" :src="store.isPlaying && store.musicItem?.id === item.id ? pauseIcon : playingIcon"/>
				<image class="icon-play" @click.stop="useLike(item)" :src="item.isLike ? isLikeActiveIcon : isLikeIcon"/>
				<image class="icon-play" src="../../../static/icon_music_menu.png" />
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, reactive, type PropType } from 'vue';
	import type { MusicClassifyType, MusicType } from "../types";
	import { getMusicListByClassifyIdService,deleteMusicLikeService,insertMusicLikeService } from '../service';
	import { getMusicCover } from '../../utils/util';
	import MusicTitleComponent from './MusicTitleComponent';
	import { useStore } from "../../stores/useStore";
	import {MAX_FAVORITE_NUMBER} from '../../common/constant';
	import isLikeIcon from '../../../static/icon_like.png';
	import isLikeActiveIcon from '../../../static/icon_like_active.png';
	import playingIcon from '../../../static/icon_music_play.png';
	import pauseIcon from '../../../static/icon_music_playing_grey.png';

	let loading:boolean = false;

	const store = useStore();

	const { classifyItem } = defineProps({
		classifyItem: {
			type: Object as PropType<MusicClassifyType>,
			reqiure: true,
			default: {}
		}
	});

	/**
	 * @description: 播放音乐
	 * @date: 2024-05-07 22:56
	 * @author wuwenqiang
	 */
	const usePlayMusic =async (musicModel:MusicType) => {
		if(store.musicItem?.id !== musicModel.id){
			store.setMusic(musicModel,true);
			if(store.classifyName !== classifyItem.classifyName){
				await getMusicListByClassifyIdService(classifyItem.id,1,MAX_FAVORITE_NUMBER).then((res)=>store.setMusicList(res.data));
			}
		}
		uni.navigateTo({url: `../pages/MusicPlayerPage`});
	}

	const classifyMusicList = reactive<Array<MusicType>>([]);


	/**
	 * @description: 添加或者取消点赞
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	 const useLike = (musicItem:MusicType) => {
		if (loading) return;
		loading = true;
		if (musicItem.isLike) {
			deleteMusicLikeService(musicItem.id).then((res) => {
				if (res.data > 0) {
					musicItem.isLike = 0;
					uni.showToast({
						duration: 2000,
						position: 'center',
						title: '取消点赞成功'
					})
				}

			}).finally(() => loading = false)
		} else {
			insertMusicLikeService(musicItem.id).then(res => {
				if (res.data > 0) {
					musicItem.isLike = 1;
					uni.showToast({
						duration: 2000,
						position: 'center',
						title: '点赞成功'
					})
				}
			}).finally(() => loading = false)
		}
	}

	/**
	 * @description: 点击更多
	 * @date: 2024-07-21 14:59
	 * @author wuwenqiang
	 */
	const useMore = () => {
		uni.navigateTo({url: `../pages/MusicClassifyListPage?data=${encodeURIComponent(JSON.stringify(classifyItem))}`});
	}

	getMusicListByClassifyIdService(classifyItem.id, 1, 3).then((res) => {
		classifyMusicList.push(...res.data);
	});


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
			gap: @page-padding;

			.song-info {
				display: flex;
				flex-direction: column;
				flex: 1;
				width: 0;

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
		}
	}
</style>
