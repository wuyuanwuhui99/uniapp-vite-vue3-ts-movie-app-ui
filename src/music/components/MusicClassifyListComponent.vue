<template>
	<view class="module-block module-block-column">
		<view class="music-row" v-for="item,index in musicList" :key="item.id" @click="usePlayMusic(item,index)">
			<image class="music-cover" :src="getMusicCover(item.cover)"/>
			<text class="music-name">{{ item.authorName }} - {{ item.songName }}</text>
			<image class="icon-small" :src="store.musicItem?.id == item.id && store.isPlaying && store.classifyName === classifyName? playingIcon : pauseIcon"/>
			<image class="icon-small" @click="useLike(item)" :src="store.musicItem?.isLike ? likeActiveIcon : likeIcon"/>
			<image class="icon-small" src="../../../static/icon_music_menu.png"/>
		</view>
	</view>
</template>

<script setup lang="ts">
	import {defineProps,defineEmits } from 'vue';
	import type { MusicType } from '../types';
	import { deleteMusicLikeService,insertMusicLikeService } from '../service';
	import { useStore } from "../../stores/useStore";
	import likeIcon from '../../../static/icon_like.png';
	import likeActiveIcon from '../../../static/icon_like_active.png';
	import pauseIcon from '../../../static/icon_music_play.png';
	import playingIcon from '../../../static/icon_music_playing_grey.png';
	import {getMusicCover} from '../../utils/util';
	let loading:boolean = false;
	const {musicList,classifyName} = defineProps({
		musicList:{
			type:Array<MusicType>,
			default:[]
		},
		classifyName:{
			type:String,
			default:''
		}
	})
	const emits = defineEmits(['onPlayMusic']);
	const usePlayMusic = (item:MusicType,index:number)=>{
		emits('onPlayMusic',item,index)
	}
	const store = useStore();
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

</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.module-block{
		align-items: center;
		gap:  @page-padding;
		.favorite-cover{
			width: @big-avater;
			height: @big-avater;
			border-radius: @module-border-radius;
		}

		.favorite-name-wrapper{
			display: flex;
			flex-direction: column;
			gap: @page-padding;
			flex: 1;
			.favorite-total{
				color:@disable-text-color;
			}
		}
		.music-row{
			width: 100%;
			display: flex;
			gap: @page-padding;
			align-items: center;
			padding-bottom: @page-padding;
			border-bottom: 1rpx solid @disable-text-color;
			&:last-child{
				border-bottom:none;
				padding-bottom:0;
			}
			.music-name{
				flex: 1;
				width: 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>