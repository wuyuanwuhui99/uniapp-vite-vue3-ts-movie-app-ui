<template>
	<view class="classify-title-wrapper">
		<image class="icon-classify-arrow" src="../../../static/icon_down.png" />
		<text class="classify-name">{{classifyItem.classifyName}}</text>
		<slot>
			<text class="classify-more" @click="useMore">更多</text>
		</slot>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, defineEmits } from 'vue';
	const { classifyItem } = defineProps({
		classifyItem: {
			type: Object,
			reqiure: true,
			default: {}
		}
	});
	const emits = defineEmits(['useMore']);

	/**
	 * @description: 点击更多
	 * @date: 2024-07-21 14:45
	 * @author wuwenqiang
	 */
	const useMore = ()=>{
		emits('useMore');
	}
</script>

<style lang="less">
	@import '../../theme/size.less';
	@import '../../theme/color.less';
	.classify-title-wrapper {
		display: flex;

		.icon-classify-arrow {
			width: @small-icon-size;
			height: @small-icon-size;
		}

		.classify-name {
			padding-left: @page-padding;
			flex: 1;
		}
		
		.classify-more{
			color: @sub-title-color;
			text-decoration: underline;
		}
	}
</style>