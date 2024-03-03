<template>
	<scroll-view scroll-y show-scrollbar="false" class="page-wrapper">
		<view class="music-list">
			<view class="music-item module-block" :key="item.id" v-for="item,index in musicList">
				<image v-if="index === 0" src="../../../static/icon_no1.png" class="music-rank" />
				<image v-if="index === 1" src="../../../static/icon_no2.png" class="music-rank" />
				<image v-if="index === 2" src="../../../static/icon_no3.png" class="music-rank" />
				<text v-if="index > 2" class="music-rank">{{index + 1}}</text>
				<image class="music-cover"
					:src="/http[s]?:\/\//.test(item.cover) ? item.cover.replace('{size}','480') : HOST + item.cover" />
				<view class="music-info">
					<text>{{item.songName}}</text>
					<text class="music-author">{{item.authorName}}</text>
				</view>
				<image class="icon-operatation" src="../../../static/icon_music_play.png" />
				<image class="icon-operatation" v-if="item.isFavorite" src="../../../static/icon_like_active.png" />
				<image class="icon-operatation" v-else src="../../../static/icon_like.png" />
				<image class="icon-operatation" src="../../../static/icon_music_menu.png" />
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import { getMusicListByClassifyIdService } from '../service';
	import { ref, reactive } from 'vue';
	import type { MusicType } from '../types';
	import { HOST } from '../../config/constant';

	const pageSize = 20;
	const pageNum = ref<number>(1);
	const musicList = reactive<Array<MusicType>>([]);

	/**
	 * @description: 获取推荐列表，1为列表的id
	 * @date: 2024-03-03 18:23
	 * @author wuwenqiang
	 */
	getMusicListByClassifyIdService(1, pageNum.value, pageSize).then((res) => {
		musicList.push(...res.data);
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
			overflow: auto;

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

				.music-cover {
					display: flex;
					margin-left: @page-padding;
					width: @middle-avater;
					height: @middle-avater;
					border-radius: 50%;
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
	}
</style>