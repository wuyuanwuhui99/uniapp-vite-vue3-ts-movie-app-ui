<template>
	<view v-if="score" class="score-wrapper">
		<uni-rate :touchable="false" :value="score/2" />
		<text class="score-text">{{score}}</text>
	</view>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	import uniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue';
	const {score} = defineProps({
		score:{
			type:[Number,String],
			reqiure:true,
			default:0
		}
	})
</script>

<style lang="less">
	@import '../theme/size.less';
	.score-wrapper{
		margin-top: @small-margin;
		display: flex;
		align-items: center;
		.score-text{
			padding-left: @small-margin;
			font-size: @font-size-normal;
			font-weight: bolder;
			color: red;
		}
	}
</style>