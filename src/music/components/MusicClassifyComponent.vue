<template>
	<view class="module-block">
		<MusicTitleComponent @useMore="useMore" :classifyItem="classifyItem" />
		<MusicClassifyListComponent class="component-gap" @onPlayMusic="usePlayMusic" :musicList = 'classifyMusicList' :classifyName = 'classifyItem.classifyName'/>
	</view>
</template>

<script setup lang="ts">
	import { defineProps, reactive, type PropType } from 'vue';
	import type { MusicClassifyType, MusicType } from "../types";
	import { getMusicListByClassifyIdService } from '../service';
	import MusicTitleComponent from './MusicTitleComponent';
	import MusicClassifyListComponent from './MusicClassifyListComponent';
	import { useStore } from "../../stores/useStore";
	import {MAX_FAVORITE_NUMBER} from '../../common/constant';
	const classifyMusicList = reactive<Array<MusicType>>([]);

	const store = useStore();

	const { classifyItem } = defineProps({
		classifyItem: {
			type: Object as PropType<MusicClassifyType>,
			reqiure: true,
			default: {}
		}
	});

	/**
	 * @description: 播放音乐
	 * @date: 2024-05-07 22:56
	 * @author wuwenqiang
	 */
	const usePlayMusic =async (musicModel:MusicType) => {
		if(store.musicItem?.id !== musicModel.id){
			store.setMusic(musicModel,true);
			if(store.classifyName !== classifyItem.classifyName){
				await getMusicListByClassifyIdService(classifyItem.id,1,MAX_FAVORITE_NUMBER).then((res)=>store.setMusicList(res.data));
			}
		}
		uni.navigateTo({url: `../pages/MusicPlayerPage`});
	}

	

	/**
	 * @description: 点击更多
	 * @date: 2024-07-21 14:59
	 * @author wuwenqiang
	 */
	const useMore = () => {
		uni.navigateTo({url: `../pages/MusicClassifyListPage?data=${encodeURIComponent(JSON.stringify(classifyItem))}`});
	}

	getMusicListByClassifyIdService(classifyItem.id, 1, 3).then((res) => {
		classifyMusicList.push(...res.data);
	});


</script>

<style lang="less">
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.component-gap{
		margin-top:@page-padding;;
	}
</style>
