<template>
	<view class="play-wrapper">
		<view class="song-bg" :style="`background-image: url(${HOST + store.musicItem.cover})`"></view>
		<view class="play-controller-wrapper">
			<text class="song-name">{{store.musicItem.songName}}</text>
			<view class="circle-wrapper">
				<view class="inner-circle" :style="{transform:`rotate(${angle}deg)`}">
					<view class="song-cover" :style="{backgroundImage: `url(${HOST + store.musicItem.cover})`}"/>
				</view>
			</view>
			<view class="lyrice-wrapper">
				<text class="lyrice-text lyrice-text-active">依然记得从你口中</text>
				<text class="lyrice-text">说出再见坚决如铁</text>
			</view>
			<text class="singer">孙露</text>
			<view class="play-operate-wrapper">
				<image class="icon-favorite" src="../../../static/icon_music_collect.png"/>
				<image class="icon-favorite" src="../../../static/icon_music_down.png"/>
				<image class="icon-favorite" src="../../../static/icon_music_comments.png"/>
				<image class="icon-favorite" src="../../../static/icon_music_white_menu.png"/>
			</view>
			<view class="play-progress-wrapper">
				<text class="play-time">{{currentTime}}</text>
				<view class="play-progress-bar">
					<progress class="play-progress" :percent="percent" stroke-width="5" backgroundColor="rgba(255,255,255,0.3)" activeColor="rgba(255,255,255,0.6)"/>
					<view class="play-indication" :style="{left:percent + '%'}"/>
				</view>
				<text class="play-time">{{formatSecond(store.audio.duration)}}</text>
			</view>
		</view>
	</view>
</template>

<script  setup lang="ts">
	import { useStore } from "../../stores/useStore"; 
	import {HOST} from '../../config/constant';
	import {ref,onMounted} from 'vue';
	import {formatSecond} from '../../utils/util';
	
	const angle = ref<number>(0);// 旋转的角度
	const store = useStore()
	const percent = ref<number>(0);// 播放进度
	const currentTime = ref<string>('');// 当前播放的时间
	
	/**
	 * @description: 头像旋转
	 * @date: 2024-05-10 22:10
	 * @author wuwenqiang
	 */
	const useRotate = () => {
		currentTime.value = formatSecond(store.audio.currentTime);
		percent.value = (store.audio.currentTime/store.audio.duration) * 100
		angle.value += 5
		angle.value = angle.value === 360 ? 0 : angle.value;
	}
	
	store.audio.addEventListener('timeupdate', useRotate);
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
					box-sizing: border-box;
					padding: @middle-avater;
					background-image: linear-gradient(to top, #000, @linear-gradient 50%, #000);
					.song-cover{
						width: 100%;
						height: 100%;
						border-radius: 50%;
						background-size: 100% 100%;
					}
				}
			}
			.lyrice-wrapper{
				display: flex;
				flex-direction: column;
				padding-top: @page-padding;
				color: @white-background-color;
				font-weight: bold;
				.lyrice-text{
					text-align: center;
					opacity: 0.5;
					padding-bottom: @page-padding;
					&.lyrice-text-active{
						opacity: 1;
					}
				}
			}
			.singer{
				width: 80%;
				color: @white-background-color;
			}
			.play-operate-wrapper{
				width: 80%;
				display: flex;
				justify-content: space-between;
				padding-top: @page-padding;
				.icon-favorite{
					width: @middle-icon-size;
					height: @middle-icon-size;
				}
			}
			.play-progress-wrapper{
				width: 100%;
				padding: @page-padding;
				margin-top: @page-padding;
				box-sizing: border-box;
				display: flex;
				.play-time{
					opacity: 0.8;
					color: @white-background-color;
				}
				.play-progress-bar{
					flex: 1;
					margin: 0 @page-padding;
					position: relative;
					display: flex;
					align-items: center;
					.play-progress{
						width: 100%;
					}
					.play-indication{
						width: @play-indication;
						height: @play-indication;
						background-color: @white-background-color;
						opacity: 0.8;
						left:0;
						top:50%;
						border-radius: 50%;
						position: absolute;
						transform: translateY(-50%);
					}
				}
				
			}
		}
		
	}
</style>
