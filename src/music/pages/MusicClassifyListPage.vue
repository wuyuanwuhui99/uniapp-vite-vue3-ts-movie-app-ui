<template>
	<view class="page-wrapper" @scrolltolower="onScrolltolower" scroll-y show-scrollbar="false">
		<view class="page-header">
			<image class="icon-back" @click="useBack" src="../../../static/icon_back.png" />
			<text class="my-favorite">我的收藏夹</text>
			<view class="icon-back" />
		</view>
		<scroll-view scroll-y show-scrollbar="false" class="page-body">
			<MusicClassifyListComponent @on-play-music="usePlayMusic" :music-list="musicList"
				:classify-name="musicClassify.classifyName" />

			<text class="footer">{{ total > pageNum * PAGE_SIZE ? '正在加载更多' : '已经到底了'}}</text>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, defineProps, reactive } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicType, MusicClassifyType } from '../types';
	import { getMusicListByClassifyIdService } from '../service';
	import { MAX_FAVORITE_NUMBER, PAGE_SIZE } from '../../common/constant';
	import { useStore } from "../../stores/useStore";;
	import MusicClassifyListComponent from '../components/MusicClassifyListComponent.vue';

	const store = useStore();
	const route = useRoute();

	let loadding : boolean = false;
	const total = ref<number>(0);
	const pageNum = ref<number>(1);
	const musicClassify : MusicClassifyType = JSON.parse(decodeURIComponent(route.query.data as string)) as MusicClassifyType; // 获取URL上的查询参数并反序列化
	const musicList = reactive<Array<MusicType>>([]);

	/**
	 * @description: 加载音乐列表
	 * @date: 2024-07-21 14:31
	 * @author wuwenqiang
	 */
	const useMusicList = () => {
		getMusicListByClassifyIdService(musicClassify.id, pageNum.value, PAGE_SIZE).then((res) => {
			total.value = res.total;
			musicList.push(...res.data);
		}).finally(() => loadding = false);
	}


	/**
	 * @description: 返回按钮
	 * @date: 2024-05-10 22:10
	 * @author wuwenqiang
	 */
	const useBack = () => {
		uni.navigateBack()
	}

	const usePlayMusic = async (item : MusicType, index : number) => {
		if (store.classifyName != musicClassify.classifyName) {
			await getMusicListByClassifyIdService(musicClassify.id, 1, MAX_FAVORITE_NUMBER).then((value) => {
				store.setClassifyMusic(value.data, item, index, musicClassify.classifyName);
			});
		} else {
			store.setMusic(item, true);
		}
		uni.navigateTo({ url: `../pages/MusicPlayerPage` });
	}

	/**
	 * @description: 返回按钮
	 * @date: 2024-05-10 22:10
	 * @author wuwenqiang
	 */
	const onScrolltolower = () => {
		if (loadding) return;
		if (total.value > PAGE_SIZE * pageNum.value) {
			pageNum.value++;
			useMusicList();
		}
	}

	useMusicList();
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

			.icon-back {
				width: @small-icon-size;
				height: @small-icon-size;
			}
		}

		.page-body {
			flex: 1;
			overflow: hidden;
			padding: 0 @page-padding 0;
			box-sizing: border-box;

			.module-block {
				align-items: center;
				gap: @page-padding;

				.favorite-cover {
					width: @big-avater;
					height: @big-avater;
					border-radius: @module-border-radius;
				}

				.favorite-name-wrapper {
					display: flex;
					flex-direction: column;
					gap: @page-padding;
					flex: 1;

					.favorite-total {
						color: @disable-text-color;
					}
				}
			}

			.music-row {
				width: 100%;
				display: flex;
				gap: @page-padding;
				align-items: center;
				padding-bottom: @page-padding;
				border-bottom: 1rpx solid @disable-text-color;

				&:last-child {
					border-bottom: none;
					padding-bottom: 0;
				}

				.music-name {
					flex: 1;
					width: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.footer {
				width: 100%;
				padding: @page-padding;
				text-align: center;
				display: inline-block;
			}
		}
	}
</style>