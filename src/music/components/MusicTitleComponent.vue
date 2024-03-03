<template>
	<view class="classify-title-wrapper">
		<image class="icon-classify-arrow" src="../../../static/icon_down.png" />
		<text class="classify-name">{{classifyItem.classifyName}}</text>
		<text>更多</text>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, reactive } from 'vue';
	const { classifyItem } = defineProps({
		classifyItem: {
			type: Object,
			reqiure: true,
			default: {}
		}
	});
</script>

<style lang="less">
	@import '../../theme/size.less';

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
	}
</style>