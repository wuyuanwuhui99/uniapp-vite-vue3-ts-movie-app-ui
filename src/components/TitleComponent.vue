<template>
	<view class="title-wrapper">
	    <view class="title-line"></view>
	    <text class="title-text">{{title}}</text>
	</view>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	const prop = defineProps({
		title:{
			type:String,
			require:true,
			default:''
		}
	})
</script>

<style lang="less" scoped>
	@import '../theme/size.less';
	@import '../theme/color.less';
	.title-wrapper{
	    display: flex;
	    align-items: center;
	    .title-line{
	        margin-right: @small-margin;
	        height: @line-height;
	        width: @line-width;
	        background-color: @line-color;
	    }
	    .title-line{
	        font-size: @font-size-normal;
	    }
	}
</style>