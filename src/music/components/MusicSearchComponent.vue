<template>
	<view class="search-wrapper module-block">
		<AvaterComponent size="middle"/>
		<view class="search-input-wrapper" @click="useNavigateToSearchPage">
			<text class="search-input-placehold">{{keyword}}</text>
		</view>
	</view>
</template>

<script setup lang="ts">
	import AvaterComponent from '../../movie/components/AvaterComponent';
	import { ref } from 'vue';
	import {getKeyWordMusicService} from '../service';
	const keyword = ref<string>('');
	

	/**
	 * @author: wuwenqiang
	 * @description: 跳转到搜索页面
	 * @date: 2024-01-29 22:46
	 */
	const useNavigateToSearchPage = () => {
		uni.navigateTo({
			url: `../pages/MusicSearchPage?keyword=`+encodeURIComponent(keyword.value),
		})
	}

	// 获取搜索框推荐的音乐
	getKeyWordMusicService().then(res => keyword.value = res.data.songName)
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.search-wrapper{
	    display: flex;
	    .search-input-wrapper{
	        flex: 1;
	        margin-left: @page-padding;
	        height: @middle-avater;
	        background-color: @search-input-color;
	        border-radius: @middle-avater;
	        display: flex;
	        align-items: center;
	        padding-left: @page-padding;
	        .search-input-placehold{
	            color: @search-input-placehold;
	        }
	    }
	}
</style>
