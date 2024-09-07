<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<NavigatorTitleComponent title="我的收藏夹"/>
		<scroll-view  scroll-y show-scrollbar="false" class="page-body">
			<view class="module-block module-block-row">
				<MusicAvaterComponent type="author" size="big" :name="favoriteDirectory.name" :avater="favoriteDirectory.cover"/>

				<view class="favorite-name-wrapper">
					<text>{{ favoriteDirectory.name }}</text>
					<text class="favorite-total">{{ favoriteDirectory.total }}首</text>
				</view>
				<image class="icon-middle" src="../../../static/icon_edit.png"/>
			</view>

			<MusicClassifyListComponent @on-play-music="usePlayMusic" :music-list="musicList" :classify-name="classifyName"/>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicType,FavoriteDirectoryType } from '../types';
	import { getMusicListByFavoriteIdService } from '../service';
	import {MUSIC_FAVORITE_NAME_STORAGE_KEY,MAX_FAVORITE_NUMBER } from '../../common/constant';
	import { useStore } from "../../stores/useStore";
	import MusicClassifyListComponent from '../components/MusicClassifyListComponent.vue';
	import NavigatorTitleComponent from '../components/NavigatorTitleComponent.vue';
	import MusicAvaterComponent from '../components/MusicAvaterComponent.vue';

	const store = useStore();
	const route = useRoute();
	const pageSize:number = 20;
	const pageNum = ref<number>(1);
	const favoriteDirectory:FavoriteDirectoryType = JSON.parse(decodeURIComponent(route.query.data as string)) as FavoriteDirectoryType; // 获取URL上的查询参数并反序列化
	const musicList = reactive<Array<MusicType>>([]);
	const classifyName = MUSIC_FAVORITE_NAME_STORAGE_KEY + favoriteDirectory.name;

	getMusicListByFavoriteIdService(favoriteDirectory.id,pageNum.value,pageSize).then((res)=>{
		musicList.push(...res.data);
	})

	/**
	 * @description: 返回按钮
	 * @date: 2024-05-10 22:10
	 * @author wuwenqiang
	 */
	const useBack = ()=>{
		uni.navigateBack()
	}

	const usePlayMusic = async(item:MusicType,index:number)=>{
		if(store.classifyName != classifyName){
			await getMusicListByFavoriteIdService(favoriteDirectory.id, 1, MAX_FAVORITE_NUMBER).then((value) =>{
				store.setClassifyMusic(value.data,item,index,classifyName);
			});
		}else{
			store.setMusic(item,true);
		}
		uni.navigateTo({url: `../pages/MusicPlayerPage`});
	}
</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';

	.page-wrapper {
		.page-body {
			flex: 1;
			overflow: hidden;
			padding:0 @page-padding @page-padding;
			box-sizing: border-box;
			.module-block{
				align-items: center;
				gap:  @page-padding;

				.favorite-name-wrapper{
					display: flex;
					flex-direction: column;
					gap: @page-padding;
					flex: 1;
					.favorite-total{
						color:@disable-text-color;
					}
				}
			}

			.music-row{
				width: 100%;
				display: flex;
				gap: @page-padding;
				align-items: center;
				padding-bottom: @page-padding;
				border-bottom: 1rpx solid @disable-text-color;
				&:last-child{
					border-bottom:none;
					padding-bottom:0;
				}
				.music-name{
					flex: 1;
					width: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>
