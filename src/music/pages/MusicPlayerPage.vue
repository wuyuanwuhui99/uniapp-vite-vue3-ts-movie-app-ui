<template>
	<view class="play-wrapper">
		<view class="song-bg" :style="`background-image: url(${HOST + store.musicItem.cover})`"></view>
		<view class="play-controller-wrapper">
			<text class="song-name">{{store.musicItem.songName}}</text>
			<view class="circle-wrapper">
				<view class="inner-circle"></view>
			</view>
		</view>
	</view>
</template>

<script  setup lang="ts">
	import { useStore } from "../../stores/useStore"; 
	import {HOST} from '../../config/constant';
	import {ref,onMounted} from 'vue';
	const store = useStore()
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.play-wrapper{
		width: 100%;
		height: 100%;		
		position: relative;
		.song-bg{
			width: 100%;
			height: 100%;
			filter: blur(@background-blur);
			background-size: 100% 100%;
			position: absolute;
			top: 0;
			left: 0;
		}
		.play-controller-wrapper{
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;		
			align-items: center;
			position: relative;
			z-index: 1;
			.song-name{
				font-size: @font-size-big;
				font-weight: bolder;
				color: #fff;
				margin-top: @page-padding;
			}
			.circle-wrapper{
				width: @play-circle-size;
				height: @play-circle-size;
				border-radius: 50%;
				margin-top: @big-avater;
				background-color: rgba(0, 0, 0, 0.1);
				padding: @middle-margin;
				overflow: hidden;
				.inner-circle{
					width: 100%;
					height: 100%;
					border-radius: 50%;
					background-image: linear-gradient(to top, #000, @linear-gradient 50%, #000);
				}
			}
		}
		
	}
</style>
