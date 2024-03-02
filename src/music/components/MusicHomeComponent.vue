<template>
	<view class="page-wrapper">
		<MusicSearchComponent/>
		<view class="classsify-wrapper module-block">
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_music_singer.png"/>
				<text class="classify-name">歌手</text>
			</view>
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_music_classify.png"/>
				<text class="classify-name">分类歌曲</text>
			</view>
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_music_classics.png"/>
				<text class="classify-name">经典老歌</text>
			</view>
			<view class="classify-item">
				<image class="classify-img" src="../../../static/icon_music_rank.png"/>
				<text class="classify-name">热门榜单</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import MusicSearchComponent from './MusicSearchComponent';
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.page-wrapper{
		width: 100%;
		height: 100%;
		.classsify-wrapper{
			display: flex;
			.classify-item{
				width: 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.classify-img{
					width: calc(@big-icon-size * 1.5);
					height: calc(@big-icon-size * 1.5);
					margin-bottom: @small-margin;
				}
				.classify-name{
					
				}
			}
		}
		
	}
</style>
