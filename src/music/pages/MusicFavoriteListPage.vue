<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="page-header">
			<image class="icon-back" @click="useBack" src="../../../static/icon_back.png"/>
			<text class="my-favorite">我的收藏夹</text>
			<view class="icon-back"/>
		</view>
		<scroll-view  scroll-y show-scrollbar="false" class="page-body">
			<view class="module-block module-block-row">
				<image class="favorite-cover" :src="getMusicCover(favoriteDirectory.cover)"/>
				<view class="favorite-name-wrapper">
					<text>{{ favoriteDirectory.name }}</text>
					<text class="favorite-total">{{ favoriteDirectory.total }}首</text>
				</view>
				<image class="icon-middle" src="../../../static/icon_edit.png"/>
			</view>

			<view class="module-block module-block-column">
				<view class="music-row" v-for="item,index in musicList" :key="item.id" @click="usePlayMusic(item,index)">
					<image class="music-cover" :src="getMusicCover(item.cover)"/>
					<text class="music-name">{{ item.authorName }} - {{ item.songName }}</text>
					<image class="icon-small" :src="store.musicItem?.id == item.id && store.playing && store.classifyName === classifyName? playingIcon : pauseIcon"/>
					<image class="icon-small" :src="store.musicItem?.isLike ? likeActiveIcon : likeIcon"/>
					<image class="icon-small" src="../../../static/icon_music_menu.png"/>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref,defineProps, reactive } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicType,FavoriteDirectoryType } from '../types';
	import { getMusicListByFavoriteIdService } from '../service';
	import { HOST,MUSIC_CLASSIFY_NAME_STORAGE_KEY,MUSIC_FAVORITE_NAME_STORAGE_KEY,MAX_FAVORITE_NUMBER } from '../../common/constant';
	import { useStore } from "../../stores/useStore";
	import likeIcon from '../../../static/icon_like.png';
	import likeActiveIcon from '../../../static/icon_like_active.png';
	import pauseIcon from '../../../static/icon_music_play.png';
	import playingIcon from '../../../static/icon_music_playing_grey.png';
	import {getMusicCover} from '../../utils/util';
	const store = useStore();
	const route = useRoute();
	const pageSize:number = 20;
	const pageNum = ref<number>(1);
	const favoriteDirectory:FavoriteDirectoryType = JSON.parse(decodeURIComponent(route.query.data as string)) as FavoriteDirectoryType; // 获取URL上的查询参数并反序列化
	const musicList = reactive<Array<MusicType>>([]);
	const classifyName = MUSIC_FAVORITE_NAME_STORAGE_KEY + favoriteDirectory.name;
	getMusicListByFavoriteIdService(favoriteDirectory.id,pageNum.value,pageSize).then((res)=>{
		musicList.push(...res.data);
	})
	
	/**
	 * @description: 返回按钮
	 * @date: 2024-05-10 22:10
	 * @author wuwenqiang
	 */
	const useBack = ()=>{
		uni.navigateBack()
	}
	
	const usePlayMusic = async(item:MusicType,index:number)=>{
		if(store.classifyName != classifyName){
			await getMusicListByFavoriteIdService(favoriteDirectory.id, 1, MAX_FAVORITE_NUMBER).then((value) =>{
				store.setClassifyMusic(value.data,item,index,classifyName);
			});
		}else{
			store.setMusic(item,true);
		}
		uni.navigateTo({url: `../pages/MusicPlayerPage`});
	}
</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';

	.page-wrapper {
		.page-header {
			padding: @page-padding;
			display: flex;
			justify-content: space-between;
			background: @module-background-color;

			.icon-back{
				width: @small-icon-size;
				height: @small-icon-size;
			}
		}

		.page-body {
			flex: 1;
			overflow: hidden;
			padding:0 @page-padding @page-padding;
			box-sizing: border-box;
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
	}
</style>