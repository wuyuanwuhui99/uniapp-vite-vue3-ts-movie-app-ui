<template>
	<view class="module-block">
		<MusicTitleComponent :classifyItem="classifyItem" />
		<view class="singer-list">
			<view class="singer-item" :key="item.id" v-for="item in singerList">
				<image v-if="item.avatar" class="singer-avatar"
					:src="/http[s]?:\/\//.test(item.avatar) ? item.avatar.replace('{size}', '480') : HOST + item.avatar" />
				<image v-else class="singer-avatar" src="../../../static/default_avater.png" />
				<text class="singer-name">{{item.authorName}}</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive, defineProps } from "vue";
	import { getSingerListService } from '../service';
	import type { MusicAuthorType } from "../types";
	import MusicTitleComponent from './MusicTitleComponent';
	import { HOST } from '../../config/constant';
	
	const singerList = reactive<Array<MusicAuthorType>>([]);
	const { classifyItem } = defineProps({
		classifyItem: {
			type: Object,
			reqiure: true,
			default: {}
		}
	});
	
	/**
	 * @description: 获取前四个歌手列表
	 * @date: 2024-03-03 18:23
	 * @author wuwenqiang
	 */
	getSingerListService(null, 1, 4).then((res) => {
		singerList.push(...res.data);
	})
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';

	.singer-list {
		display: flex;
		margin-top: @page-padding;

		.singer-item {
			display: flex;
			flex-direction: column;
			flex: 1;
			justify-content: center;
			align-items: center;

			.singer-avatar {
				width: @big-avater;
				height: @big-avater;
				border-radius: 50%;
				margin-bottom: @small-margin;
			}
		}

	}
</style>