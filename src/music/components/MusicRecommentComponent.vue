<template>
	<scroll-view class="page-wrapper" @scrolltolower="onScrolltolower" scroll-y show-scrollbar="false">
		<view class="music-list">
			<view class="music-item module-block" :key="item.id" v-for="item,index in musicList">
				<image v-if="index === 0" src="../../../static/icon_no1.png" class="music-rank" />
				<image v-if="index === 1" src="../../../static/icon_no2.png" class="music-rank" />
				<image v-if="index === 2" src="../../../static/icon_no3.png" class="music-rank" />
				<text v-if="index > 2" class="music-rank">{{index + 1}}</text>
				<image class="music-cover" :src="getMusicCover(item.cover)" />
				<view class="music-info">
					<text>{{item.songName}}</text>
					<text class="music-author">{{item.authorName}}</text>
				</view>
				<image class="icon-operatation" @click="usePlayMusicList(item,index)" :src="store.isPlaying && store.musicItem?.id === item.id ? pauseIcon : playingIcon" />
				<image class="icon-operatation" v-if="item.isLike" src="../../../static/icon_like_active.png" />
				<image class="icon-operatation" v-else src="../../../static/icon_like.png" />
				<image class="icon-operatation" src="../../../static/icon_music_menu.png" />
			</view>

			<view class="bottom"><text>{{total > pageSize * pageNum  ? "正在加载更多..." :"已经到底了" }}</text></view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import { getMusicListByClassifyIdService } from '../service';
	import { ref, reactive } from 'vue';
	import type { MusicType } from '../types';
	import {getMusicCover} from '../../utils/util';
	import { useStore } from "../../stores/useStore";
	import {MAX_FAVORITE_NUMBER} from '../../common/constant';
	import playingIcon from '../../../static/icon_music_play.png';
	import pauseIcon from '../../../static/icon_music_playing_grey.png';

	const store = useStore()
	const pageSize = ref<number>(20);
	let loadding : boolean = false;

	const pageNum = ref<number>(1);
	const total = ref<number>(0);
	const musicList = reactive<Array<MusicType>>([]);


	/**
	 * @description: 获取推荐列表，1为列表的id
	 * @date: 2024-03-03 18:23
	 * @author wuwenqiang
	 */
	const useMusicList = () => {
		loadding = true;
		getMusicListByClassifyIdService(1, pageNum.value, pageSize.value).then((res) => {
			if (total.value === 0) total.value = res.total;
			musicList.push(...res.data);
		}).finally(() => {
			loadding = false;
		});
	}

	/**
	 * @description: 滚动到底部出发
	 * @date: 2024-03-03 18:23
	 * @author wuwenqiang
	 */
	const onScrolltolower = () => {
		if (loadding) return;
		if (total.value > pageSize .value * pageNum.value) {
			pageNum.value++;
			useMusicList();
		}
	}

	const usePlayMusicList =async (musicModel:MusicType) => {
		if(store.musicItem?.id !== musicModel.id){
			store.setMusic(musicModel);
			if(store.classifyName !== "推荐歌曲"){
				await getMusicListByClassifyIdService(1, 1, MAX_FAVORITE_NUMBER).then((res) => store.setMusicList(res.data));
			}
		}
		uni.navigateTo({url: `../pages/MusicPlayerPage`});
	}

	useMusicList()
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

		.music-list {
			margin-bottom: @page-padding;

			.music-item {
				display: flex;
				align-items: center;
				margin-top: @page-padding;

				.music-rank {
					width: @small-icon-size;
					height: @small-icon-size;
					align-items: center;
					justify-content: center;
					display: flex;
				}

				.music-info {
					display: flex;
					flex-direction: column;
					margin-left: @page-padding;
					flex: 1;

					.music-author {
						color: @disable-text-color;
						padding-top: @small-margin;
					}
				}

				.icon-operatation {
					width: @small-icon-size;
					height: @small-icon-size;
					margin-left: @page-padding;
					;
				}
			}
		}

		.bottom {
			display: flex;
			justify-content: center;
			margin: @page-padding 0;
		}
	}
</style>
