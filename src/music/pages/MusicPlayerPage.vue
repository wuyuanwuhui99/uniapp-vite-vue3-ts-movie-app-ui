<template>
	<view class="play-wrapper" @click="showLoopMenu = false">
		<view class="song-bg" :style="`background-image: url(${HOST + store.musicItem.cover})`"></view>
		<view class="play-controller-wrapper">
			<text class="song-name">{{store.musicItem.songName}}</text>
			<view class="circle-wrapper">
				<view class="inner-circle" :style="{transform:`rotate(${angle}deg)`}">
					<view class="song-cover" :style="{backgroundImage: `url(${HOST + store.musicItem.cover})`}" />
				</view>
			</view>
			<scroll-view :scroll-into-view="'lyric' + currentLineNum" class="lyrice-scroll-wrapper" scroll-y
				show-scrollbar="false">
				<view class="lyric-wrapper" v-if="currentLyric">
					<text :id="'lyric'+index" :key="'lyric-index' + store.musicItem.id + index" class="text"
						:class="{'current': currentLineNum ===index}"
						v-for="(line,index) in currentLyric.lines">{{line.txt}}</text>
				</view>
				<text v-else>暂无歌词</text>
			</scroll-view>
			<text class="singer">{{store.musicItem.authorName}}</text>
			<view class="play-operate-wrapper">
				<image class="icon-operate" @click.stop="useFavorite"
					:src="store.musicItem.isFavorite ? favoriteActiveIcon: favoriteIcon" />
				<image class="icon-operate" src="../../../static/icon_music_down.png" />
				<image @click.stop="useComment" class="icon-operate" src="../../../static/icon_music_comments.png" />
				<image class="icon-operate" src="../../../static/icon_music_white_menu.png" />
			</view>
			<view class="play-progress-wrapper">
				<text class="play-time">{{currentTime}}</text>
				<slider @change="useChange" class="slider-bar" :value="percent" block-size="20" activeColor="#fff"
					backgroundColor="rgba(255,255,255,0.2)" />
				<text class="play-time">{{formatSecond(store.audio.duration)}}</text>
			</view>
			<view class="toggle-wrapper">
				<view class="play-menu-item">
					<image @click.stop="useShowMenu" class="icon-loop" :src="loopMap[store.loop]" />
					<view class="loop-menu" v-show="showLoopMenu">
						<view class="loop-item" @click="useToggleLoopMenu(LoopMode.ORDER)">
							<image class="icon-loop" src="../../../static/icon_music_order.png" />
							<text class="loop-name">顺序播放</text>
						</view>
						<view class="loop-item" @click="useToggleLoopMenu(LoopMode.REPEAT)">
							<image class="icon-loop" src="../../../static/icon_music_loop.png" />
							<text class="loop-name">单曲循环</text>
						</view>
						<view class="loop-item" @click="useToggleLoopMenu(LoopMode.RANDOM)">
							<image class="icon-loop" src="../../../static/icon_music_random.png" />
							<text class="loop-name">随机播放</text>
						</view>
					</view>
				</view>
				<image class="play-menu-item" @click.stop="onTabMusic(TabEnum.PREV)"
					src="../../../static/icon_music_prev.png" />
				<view @click.stop="store.usePlay(!store.isPlaying)" class="play-circle">
					<image class="play-menu-item" :src="store.isPlaying ? playingIcon : pauseIcon" />
				</view>
				<image class="play-menu-item" @click.stop="onTabMusic(TabEnum.NEXT)" src="../../../static/icon_music_next.png" />
				<image class="play-menu-item" src="../../../static/icon_music_play_menu.png" />
			</view>
		</view>
		<DialogComponent @onClose="showCommentDialog = false" v-if="showCommentDialog">
			<template #header><text class="comment-header">{{commentTotal}}条评论</text></template>
			<template #content><CommentComponent @onSend="useUpdateTotal" :isShowInput="true" :relationId="store.musicItem.id" :category='CommentEnum.MUSIC' :commentList="commentList"></CommentComponent></template>
		</DialogComponent>
	</view>
</template>

<script setup lang="ts">
	import { ref, onMounted, onUnmounted, reactive, onActivated,onDeactivated,watch } from 'vue';
	import Lyric from 'lyric-parser';

	import { useStore } from "../../stores/useStore";
	import { HOST, LoopMode,CommentEnum,TabEnum } from '../../config/constant';
	import { formatSecond } from '../../utils/util';
	import playingIcon from '../../../static/icon_music_playing.png';
	import pauseIcon from '../../../static/icon_music_play_white.png';
	import favoriteIcon from '../../../static/icon_music_collect.png';
	import favoriteActiveIcon from '../../../static/icon_collection_active.png';
	import type {CommentType,MusicType} from '../types';
	import { insertMusicFavoriteService, deleteMusicFavoriteService, getTopCommentListService, getCommentCountService} from '../service';
	import orderImg from '../../../static/icon_music_order.png';
	import repeatImg from '../../../static/icon_music_loop.png';
	import randomImg from '../../../static/icon_music_random.png';
	import DialogComponent from '../components/DialogComponent.vue';
	import CommentComponent from '../components/CommentComponent.vue';

	const angle = ref<number>(0);// 旋转的角度
	const percent = ref<number>(0);// 播放进度
	const currentTime = ref<string>('');// 当前播放的时间
	const currentLyric = ref<any>(null);// 歌词兑现
	const currentLineNum = ref<number>(0);// 歌词播放的当前行
	const showLoopMenu = ref<boolean>(false);// 显示循环播放选择菜单
	const showCommentDialog = ref<boolean>(false);// 显示评论弹窗
	const commentList = reactive<Array<CommentType>>([]);// 
	const pageSize = 20;
	const pageNum = ref<number>(1);// 评论分页
	const commentTotal = ref<number>(0);// 评论总数 
	const store = useStore();
	let musicModel:MusicType | null = null;// 当前歌曲
	let isActivePage:boolean = true;// 页面是否激活

	let loading = false;

	// 循环模式
	const loopMap = {
		[LoopMode.ORDER]: orderImg,
		[LoopMode.REPEAT]: repeatImg,
		[LoopMode.RANDOM]: randomImg,
	};

	/**
	 * @description: 头像旋转
	 * @date: 2024-05-10 22:10
	 * @author wuwenqiang
	 */
	const useRotate = () => {
		currentTime.value = formatSecond(store.audio.currentTime);
		percent.value = (store.audio.currentTime / store.audio.duration) * 100
		angle.value += 5
		angle.value = angle.value === 360 ? 0 : angle.value;
		currentLyric.value.seek(Math.floor(store.audio.currentTime * 1000))
	}

	/**
	 * @description: 显示循环模式的菜单
	 * @date: 2024-05-17 22:53
	 * @author wuwenqiang
	 */
	const useShowMenu = () => {
		showLoopMenu.value = !showLoopMenu.value;
	}

	/**
	 * @description: 切换循环模式
	 * @date: 2024-05-17 22:54
	 * @author wuwenqiang
	 */
	const useToggleLoopMenu = (loop : LoopMode) => {
		showLoopMenu.value = false;
		store.setLoop(loop);
	}

	/**
	 * @description: 随机切换歌曲
	 * @date: 2024-06-15 00:33
	 * @author wuwenqiang
	 */
	const useRandomTabMusic = () => {
		const randomIndex = Math.floor(Math.random() * store.playList.length);
		store.setMusic(store.playList[randomIndex]);
		useLyric();
	}

	/**
	 * @description: 切换歌曲
	 * @date: 2024-06-15 00:24
	 * @author wuwenqiang
	 */
	const onTabMusic = (direct:TabEnum) => {
		if(store.loop === LoopMode.ORDER || store.loop === LoopMode.REPEAT){
			useTabMusic(direct);
		}else {
			useRandomTabMusic();
		}
	}

	/**
	 * @description: 切换歌曲
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useLyric = () => {
		if (!store.musicItem.lyrics) return currentLyric.value = null;
		currentLyric.value = new Lyric(store.musicItem.lyrics, ({ lineNum = 0 }) => {
			currentLineNum.value = lineNum;
		});
	}

	/**
	 * @description: 切换歌曲进度
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useChange = (event : Event) => {
		store.audio.currentTime = (store.audio.duration * 60 / 100)
	}

	/**
	 * @description: 切换歌曲
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useTabMusic = (direct : TabEnum) => {
		let {playIndex,musicList} = store;
		if (direct === TabEnum.PREV) {// 切换上一首
			if (playIndex === 0) {
				store.resetPlayList();
				playIndex = musicList.length - 1;
			}else{
				playIndex--;
			}
		} else if (store.playIndex === store.musicList.length - 1){
			store.resetPlayList();
			playIndex = 0;
		}else{
			playIndex++;
		}
		store.setMusicPlayIndex(playIndex);
	}

	/**
	 * @description: 添加收藏或取消收藏
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useFavorite = () => {
		if (loading) return;
		loading = true;
		if (store.musicItem.isFavorite) {
			deleteMusicFavoriteService(store.musicItem.id).then((res) => {
				if (res.data > 0) {
					store.musicItem.isFavorite = 0;
					uni.showToast({
						duration: 2000,
						position: 'center',
						title: '取消收藏成功'
					})
				}

			}).finally(() => loading = false)
		} else {
			insertMusicFavoriteService(store.musicItem.id).then(res => {
				if (res.data > 0) {
					store.musicItem.isFavorite = 1;
					uni.showToast({
						duration: 2000,
						position: 'center',
						title: '添加收藏成功'
					})
				}
			}).finally(() => loading = false)
		}
	}

	/**
	 * @description: 添加收藏或取消收藏
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useComment = () => {
		getTopCommentListService(store.musicItem.id,CommentEnum.MUSIC,pageNum.value,pageSize).then(res => {
			commentTotal.value = res.total;
			commentList.splice(0,commentList.length,...res.data);
			showCommentDialog.value = true;
		});
	}

	/**
	 * @description: 更新总数
	 * @date: 2024-05-12 11:45
	 * @author wuwenqiang
	 */
	const useUpdateTotal = () => getCommentCountService(store.musicItem.id,CommentEnum.MUSIC).then(res => commentTotal.value = res.data)

	/**
	 * @description: 歌曲播放完成之后切换歌曲
	 * @date: 2024-05-17 22:54
	 * @author wuwenqiang
	 */
	 store.audio.onEnded(()=>{
		switch (store.loop){
			case LoopMode.REPEAT:
				store.audio.play()
				break;
			case LoopMode.RANDOM:
				useRandomTabMusic();
				break;
			default:
				useTabMusic(TabEnum.NEXT);
		}
	});


	store.audio.onTimeUpdate(useRotate);

	watch(() => store.musicItem, 
		(newVal, oldVal) => {
			if(!isActivePage)return;// 如果是进入缓存页面，不查询歌词和收藏
			musicModel = newVal;
			useLyric();
        }
	);

	onMounted(() => {
		useLyric();
	})

	onUnmounted(() => {
		store.audio.offTimeUpdate(useRotate);
	})

	onActivated(()=>{
		isActivePage = true;
		if(musicModel !== store.musicItem){// 从缓存中唤醒
			useLyric();
		}
		store.audio.onTimeUpdate(useRotate);
	})

	onDeactivated(()=>{
		isActivePage = false;// 进入缓存
		store.audio.offTimeUpdate(useRotate);// 移除监听
	});


</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';

	.play-wrapper {
		width: 100%;
		height: 100%;
		position: relative;

		.song-bg {
			width: 100%;
			height: 100%;
			filter: blur(@background-blur);
			background-size: 100% 100%;
			position: absolute;
			top: 0;
			left: 0;
		}

		.play-controller-wrapper {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 100%;
			align-items: center;
			position: relative;
			z-index: 1;

			.song-name {
				font-size: @font-size-big;
				font-weight: bolder;
				color: #fff;
				margin-top: @page-padding;
			}

			.circle-wrapper {
				width: @play-circle-size;
				height: @play-circle-size;
				border-radius: 50%;
				margin-top: @middle-avater;
				background-color: rgba(0, 0, 0, 0.1);
				padding: @middle-margin;
				overflow: hidden;

				.inner-circle {
					width: 100%;
					height: 100%;
					border-radius: 50%;
					box-sizing: border-box;
					padding: @middle-avater;
					background-image: linear-gradient(to top, #000, @linear-gradient 50%, #000);

					.song-cover {
						width: 100%;
						height: 100%;
						border-radius: 50%;
						background-size: 100% 100%;
					}
				}
			}

			.lyrice-scroll-wrapper {
				width: 100%;
				display: flex;
				flex-direction: column;
				padding-top: @page-padding;
				color: @white-background-color;
				font-weight: bold;
				height: 0;
				flex: 1;

				.lyric-wrapper {
					width: 80%;
					margin: 0 auto;
					overflow: hidden;
					text-align: center;
					flex-direction: column;
					display: flex;

					.text {
						color: @white-background-color;
						opacity: 0.5;

						&.current {
							opacity: 1;
						}
					}
				}

				/deep/.uni-scroll-view::-webkit-scrollbar {
					display: none;
				}

				.lyrice-text {
					text-align: center;
					opacity: 0.5;
					padding-bottom: @page-padding;

					&.lyrice-text-active {
						opacity: 1;
					}
				}
			}

			.singer {
				width: 80%;
				color: @white-background-color;
			}

			.play-operate-wrapper {
				width: 80%;
				display: flex;
				justify-content: space-between;
				padding-top: @page-padding;

				.icon-operate {
					width: @middle-icon-size;
					height: @middle-icon-size;
				}
			}

			.play-progress-wrapper {
				width: 100%;
				padding: @page-padding;
				margin-top: @page-padding;
				box-sizing: border-box;
				display: flex;

				.play-time {
					opacity: 0.8;
					color: @white-background-color;
				}

				.slider-bar {
					flex: 1;
					margin: 0 @page-padding;
				}
			}

			.toggle-wrapper {
				display: flex;
				width: 90%;
				justify-content: space-around;
				margin-bottom: @page-padding ;
				align-items: center;

				.play-menu-item,
				.icon-loop {
					position: relative;
					width: @middle-icon-size;
					height: @middle-icon-size;

					.loop-menu {
						position: absolute;
						width: @popup-menu-width;
						left: 0;
						bottom: 100%;
						height: @popup-menu-width;
						display: flex;
						flex-direction: column;
						background: @black-background-color;
						opacity: 0.8;
						border-radius: @module-border-radius;
						z-index: 2;

						.loop-item {
							flex: 1;
							display: flex;
							align-items: center;
							padding-left: @page-padding;

							.loop-name {
								padding-left: @page-padding;
								color: @white-background-color;
							}
						}
					}
				}

				.play-circle {
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

		.comment-header{
			width: 100%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>