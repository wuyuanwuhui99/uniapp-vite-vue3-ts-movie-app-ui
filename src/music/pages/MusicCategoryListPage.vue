<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<NavigatorTitleComponent title="歌曲分类"/>
		<scroll-view  scroll-y show-scrollbar="false" @scrolltolower="onScrolltolower" class="page-body">
			<view class="module-block">
                <view class="category-grid">
                    <text @click="onTabItem(item)" :class="{'category-btn-active':activeCategory?.id === item.id}" class="category-btn" :key="'category-btn'+item.id" v-for="item in currentClassify">{{ item.classifyName }}</text>
                </view>
                <view class="expand-more" @click="useExpand">
                    <text class="expand-text">{{ expand ? '收起': '展开更多' }}</text>
                    <image class="icon-small" :class="expand ? 'icon-expand' : ''"  src="../../../static/icon_arrow.png"></image>
                </view>
			</view>
            <view class="module-block">
                <MusicClassifyListComponent class="component-gap" @onPlayMusic="usePlayMusic" :musicList = 'musicList' :classifyName = 'activeCategory.classifyName'/>
            </view>
            <text class="footer">{{ total > pageNum * PAGE_SIZE ? '正在加载更多' : '已经到底了'}}</text>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { useRoute } from "vue-router";
	import type {MusicClassifyType, MusicType } from '../types';
	import { getMusicClassifyService,getMusicListByClassifyIdService,getMusicAuthorListByCategoryIdService,insertMyLikeMusicAuthorService,deleteMyLikeMusicAuthorService } from '../service';
    import {PAGE_SIZE,MAX_FAVORITE_NUMBER} from '../../common/constant';
	import NavigatorTitleComponent from '../components/NavigatorTitleComponent.vue';
    import { useStore } from "../../stores/useStore";
    import MusicClassifyListComponent from '../components/MusicClassifyListComponent.vue';

    const allClassifies = reactive<Array<MusicClassifyType>>([]);// 所有分类模块
    const currentClassify =  reactive<Array<MusicClassifyType>>([]);// 所有分类模块
    const total = ref<number>(0);// 总数
	const pageNum = ref<number>(1);
	const musicList = reactive<Array<MusicType>>([]);
    const activeCategory = ref<MusicClassifyType>({} as MusicClassifyType);
    const store = useStore();
    const expand = ref<boolean>(false);
    let loading:boolean = false;

    
    /**
	 * @description: 获取模块分类
	 * @date: 2024-03-03 11:23
	 * @author wuwenqiang
	 */
	getMusicClassifyService().then((res) => {
		allClassifies.push(...res.data);
        activeCategory.value = allClassifies[0] as MusicClassifyType;
        currentClassify.push(...allClassifies.slice(0,9));
        useMusicListByClassifyId();
	});

    /**
	 * @description: 展开折叠
	 * @date: 2024-09-10 22:44
	 * @author wuwenqiang
	 */
    const useExpand = ()=>{
        expand.value = !expand.value;
        currentClassify.length = 0;
        currentClassify.push(...allClassifies.slice(0,expand.value ? allClassifies.length : 9))
    }

     /**
	 * @description: 根据分类获取音乐列表
	 * @date: 2024-09-09 22:47
	 * @author wuwenqiang
	 */
    const useMusicListByClassifyId = () => {
        loading = true;
        getMusicListByClassifyIdService(activeCategory.value.id,pageNum.value,PAGE_SIZE).then((res)=>{
            musicList.push(...res.data);
            total.value = res.total;
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
			useMusicListByClassifyId();
		}
    }

     /**
	 * @description: 切换歌手类型
	 * @date: 2024-08-27 21:19
	 * @author wuwenqiang
	 */
    const onTabItem = (item:MusicClassifyType)=>{
        if(loading || item.id === activeCategory.value.id)return;
        pageNum.value = 1;
        activeCategory.value = item;
        musicList.length = 0;
		useMusicListByClassifyId();
    }

    /**
	 * @description: 播放音乐
	 * @date: 2024-08-27 23:05
	 * @author wuwenqiang
	 */
     const usePlayMusic = (item : MusicType, index : number)=>{
		if (store.classifyName != activeCategory.value.classifyName) {
			getMusicListByClassifyIdService(activeCategory.value.id,1,MAX_FAVORITE_NUMBER).then((res)=>{
				store.setClassifyMusic(res.data, item, index, activeCategory.value.classifyName);
        	});
		}else{
			store.setMusic(item, true);
		}
		uni.navigateTo({ url: `../pages/MusicPlayerPage` });
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
			padding:0 @page-padding;
			box-sizing: border-box;
			.module-block{
                .category-grid{
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: @page-padding;
                    .category-btn{
                        text-align: center;
                        padding: @small-margin 0;
                        border: 1rpx solid @sub-title-color;
                        border-radius: @btn-border-radius;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        &.item-two{
                            grid-column-end: span 2;
                        }
                        &.item-one{
                            grid-column-end: span 1;
                        }
                        &.category-btn-active{
                            border-color: @selected-color;
                            color:@selected-color;
                        }
                    }
                }
                .expand-more{
                    .expand-text{
                        color: @sub-title-color;
                    }
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top:@page-padding;
                    gap: @small-margin;
                    .icon-expand{
                        transform: rotate(90deg);
                    }
                }
                
				&.module-column{
                    display: flex;
                    flex-direction: column;
                    margin-bottom: @page-padding;
                    .author-item{
                        display: flex;
                        gap: @page-padding;
                        align-items: center;
                        padding-bottom: @page-padding;
                        border-bottom: 1rpx solid @disable-text-color;
                        margin-top:  @page-padding;
                        &:first-child{
                            margin-top: 0;
                        }
                        .music-cover{
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-color: @page-background-color;
                        }
                        &:last-child{
                            border-bottom:none;
                            padding-bottom:0;
                        }
                        .total{
                            flex: 1;
                            color:@sub-title-color
                        }
                        .icon-play {
                            width: @small-icon-size;
                            height: @small-icon-size;
                        }
                    }
                }
			}
            .footer {
				width: 100%;
				padding: @page-padding;
				text-align: center;
				display: inline-block;
			}
		}
	}
</style>
