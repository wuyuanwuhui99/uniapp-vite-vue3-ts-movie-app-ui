<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<NavigatorTitleComponent :title="musicAuthor.authorName"/>
		<scroll-view  scroll-y show-scrollbar="false" @scrolltolower="onScrolltolower" class="page-body">
            <view class="module-block">
                <MusicClassifyListComponent :music-list="musicList" :classify-name="musicAuthor.authorName" @on-play-music="usePlayMusic"/>
            </view>
            <text class="footer">{{ total > pageNum * PAGE_SIZE ? '正在加载更多' : '已经到底了'}}</text>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive,type Ref } from 'vue';
	import { useRoute,type RouteLocationNormalized } from "vue-router";
	import type { MusicType,MusicAuthorType } from '../types';
	import { getMusicListByAuthorIdService } from '../service';
    import {PAGE_SIZE,MAX_FAVORITE_NUMBER} from '../../common/constant';
	import NavigatorTitleComponent from '../components/NavigatorTitleComponent.vue';
    import MusicClassifyListComponent from '../components/MusicClassifyListComponent.vue';
	import { useStore } from "../../stores/useStore";

	const store = useStore();
	const route:RouteLocationNormalized = useRoute();
    const total:Ref<number> = ref<number>(0);// 总数
	const pageNum:Ref<number> = ref<number>(1);
	const musicList:Array<MusicType> = reactive<Array<MusicType>>([]);
    let loading:boolean = false;
    const musicAuthor = JSON.parse(decodeURIComponent(route.query.data as string)) as MusicAuthorType;

     /**
	 * @description: 根据分类获取歌手列表
	 * @date: 2024-08-26 22:02
	 * @author wuwenqiang
	 */
    const useMusicListByAuthorId = () => {
        loading = true;
        getMusicListByAuthorIdService(musicAuthor.authorId,pageNum.value,PAGE_SIZE).then((res)=>{
            total.value = res.total;
            musicList.push(...res.data);
        }).finally(()=> loading = false);
    }

     /**
	 * @description: 滚动加载更多
	 * @date: 2024-08-27 21:19
	 * @author wuwenqiang
	 */
    const onScrolltolower = ()=>{
        if (loading) return;
		if (total.value > PAGE_SIZE * pageNum.value) {
			pageNum.value++;
			useMusicListByAuthorId();
		}
    }

     /**
	 * @description: 播放音乐
	 * @date: 2024-08-27 23:05
	 * @author wuwenqiang
	 */
    const usePlayMusic = (item : MusicType, index : number)=>{
		if (store.classifyName != musicAuthor.authorName) {
			getMusicListByAuthorIdService(musicAuthor.authorId,1,MAX_FAVORITE_NUMBER).then((res)=>{
				store.setClassifyMusic(res.data, item, index, musicAuthor.authorName);
        	});
		}else{
			store.setMusic(item, true);
		}
		uni.navigateTo({ url: `../pages/MusicPlayerPage` });
    }

    useMusicListByAuthorId()
</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';

	.page-wrapper {
		.page-body {
			flex: 1;
			overflow: hidden;
			padding:0 @page-padding;
			box-sizing: border-box;
            .footer {
				width: 100%;
				padding: @page-padding;
				text-align: center;
				display: inline-block;
			}
		}
	}
</style>