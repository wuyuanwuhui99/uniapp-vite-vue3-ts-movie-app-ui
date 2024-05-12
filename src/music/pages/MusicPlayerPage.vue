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
			<text class="singer">{{store.musicItem.authorName}}</text>
			<view class="play-operate-wrapper">
				<image class="icon-operate" @click="useFavorite" :src="store.musicItem.isFavorite ? favoriteActiveIcon: favoriteIcon"/>
				<image class="icon-operate" src="../../../static/icon_music_down.png"/>
				<image class="icon-operate" src="../../../static/icon_music_comments.png"/>
				<image class="icon-operate" src="../../../static/icon_music_white_menu.png"/>
			</view>
			<view class="play-progress-wrapper">
				<text class="play-time">{{currentTime}}</text>
				<slider class="slider-bar" :value="percent" block-size="20"  activeColor="#fff" backgroundColor="rgba(255,255,255,0.2)"/>
				<text class="play-time">{{formatSecond(store.audio.duration)}}</text>
			</view>
			<view class="toggle-wrapper">
				<view class="play-menu">
					<image class="icon-loop" src="../../../static/icon_music_order.png"/>
				</view>
				<image class="play-menu" @click="useTabMusic('prev')" src="../../../static/icon_music_prev.png"/>
				<view @click="store.usePlay(!store.isPlaying)" class="play-circle">
					<image class="play-menu"  :src="store.isPlaying ? playingIcon : pauseIcon"/>
				</view>
				<image class="play-menu"  @click="useTabMusic('next')" src="../../../static/icon_music_next.png"/>
				<image class="play-menu" src="../../../static/icon_music_play_menu.png"/>
			</view>
		</view>
	</view>
</template>

<script  setup lang="ts">
	import { useStore } from "../../stores/useStore"; 
	import {HOST} from '../../config/constant';
	import {ref,onMounted,onUnmounted} from 'vue';
	import {formatSecond} from '../../utils/util';
	import playingIcon from '../../../static/icon_music_playing.png';
	import pauseIcon from '../../../static/icon_music_play_white.png';
	import favoriteIcon from '../../../static/icon_music_collect.png'; 
	import favoriteActiveIcon from '../../../static/icon_collection_active.png'; 
	import {insertMusicFavoriteService,deleteMusicFavoriteService} from '../service'
	const angle = ref<number>(0);// 旋转的角度
	const store = useStore()
	const percent = ref<number>(0);// 播放进度
	const currentTime = ref<string>('');// 当前播放的时间
	let loading = false;
	
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
	
	store.audio.addEventListener('ended', () => useTabMusic('next'));

	store.audio.addEventListener('timeupdate', useRotate);
	
	onUnmounted(()=>{
		store.audio.removeEventListener('timeupdate', useRotate);
	});

	/**
	 * @description: 切换歌曲
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useTabMusic = (direct:string) => {
		if(direct === 'prev'){
			if(store.playIndex === 0)return;
			store.setMusicPlayIndex(store.playIndex - 1);
		}else{
			if(store.playIndex === store.musicList.length - 1)return;
			store.setMusicPlayIndex(store.playIndex + 1);
		}
	}

	/**
	 * @description: 添加收藏或取消收藏
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useFavorite = () => {
		if (loading)return;
		loading = true;
		if(store.musicItem.isFavorite){
			deleteMusicFavoriteService(store.musicItem.id).then((res)=>{
				if(res.data > 0){
					store.musicItem.isFavorite = 0;
					uni.showToast({
						duration:2000,
						position:'center',
						title:'取消收藏成功'
					})
				}
				
			}).finally(()=>loading = false)
		}else{
			insertMusicFavoriteService(store.musicItem.id).then((res)=>{
				if(res.data > 0){
					store.musicItem.isFavorite = 1;
					uni.showToast({
						duration:2000,
						position:'center',
						title:'添加收藏成功'
					})
				}
			}).finally(()=>loading = false)
		}
	}
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
				margin-top: @middle-avater;
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
				height: 0;
				flex: 1;
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
				.icon-operate{
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
				.slider-bar{
					flex: 1;
					margin: 0 @page-padding;
				}
			}
			.toggle-wrapper{
				display: flex;
				width: 90%;
				justify-content: space-around;
				margin-bottom: @page-padding ;
				align-items: center;
				.play-menu,.icon-loop{
					position: relative;
					width: @middle-icon-size;
					height: @middle-icon-size;
				}
				.play-circle{
					width: @big-avater;
					height: @big-avater;
					border-radius: 50%;
					border: @border-size solid @white-background-color;
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}
		
	}
</style>
