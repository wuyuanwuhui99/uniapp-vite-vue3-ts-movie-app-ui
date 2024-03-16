<template>
	<scroll-view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="module-block module-block-row">
			<AvaterComponent size="middle"/>
			<view class="use-info">
				<text class="username">{{store.userData.username}}</text>
				<text class="sign">{{store.userData.sign}}</text>
			</view>
		</view>
		
		<view class="module-block">
			<MusicTitleComponent :classifyItem="{classifyName:'我的歌单',category:''}">
				<text class="icon-add">+</text>
			</MusicTitleComponent>
			<view v-for="item in musicPlayMenu" class="singer-list">
				<image v-if="item.cover" class="music-cover" :src="/http[s]?:\/\//.test(item.cover) ? item.cover.replace('{size}','480') : HOST + item.cover" />
				<text class="music-cover" v-else>{{item.name.slice(0,1)}}</text>
				<view class="songname-wrapper">
					<text>{{item.name}}</text>
					<text class="total">{{item.total}}首</text>
				</view>
				<image class="icon-operate" src="../../../static/icon_music_play.png"/>
				<image class="icon-operate" src="../../../static/icon_delete.png"/>
				<image class="icon-operate" src="../../../static/icon_music_menu.png"/>
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import type { ClassifyType, MuiscPlayMenuType} from "../../movie/types";
	import AvaterComponent from "../../movie/components/AvaterComponent";
	import { useMovieStore } from "../../stores/useMovieStore";
	import MusicTitleComponent from "./MusicTitleComponent";
	import {getMusicPlayMenuService} from "../service";
	import {reactive} from 'vue';
	import {HOST} from '../../config/constant';
	
	const store = useMovieStore();
	const musicPlayMenu = reactive<Array<MuiscPlayMenuType>>([]);
	
	getMusicPlayMenuService().then((res)=>{
		musicPlayMenu.push(...res.data);
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
			&::-webkit-scrollbar {
				display: none;
			}
		}
		.use-info{
			margin-left: @page-padding;
			display: flex;
			flex-direction: column;
			.username{
				font-weight: bold;
			}
			.sign{
				color: @disable-text-color;
			}
		}
		.icon-add{
			font-size: @middle-icon-size;
			color: @disable-text-color;
			line-height: calc(@middle-icon-size / 1.5);
		}
		.singer-list{
			display: flex;
			margin-top: @page-padding;
			.music-cover{
				background-color: @page-background-color;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 0;
			}
			.songname-wrapper{
				display: flex;
				flex-direction: column;
				margin-left: @page-padding;
				flex: 1;
				.total{
					color: @disable-text-color;
				}
			}
			.icon-operate{
				width: @small-icon-size;
				height: @small-icon-size;
				margin-left: @page-padding;
			}
		}
	}		

</style>
