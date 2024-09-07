<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<NavigatorTitleComponent title="歌手分类"/>
		<scroll-view  scroll-y show-scrollbar="false" @scrolltolower="onScrolltolower" class="page-body">
			<view class="module-block module-block-grid">
				<text @click="onTabItem(item)" :class="{'item-two':item.categoryName.length > 2,'category-btn-active':activeAuthorCategory?.id === item.id}" class="category-btn" :key="'category-btn'+item.id" v-for="item in musicAuthorCategoryList">{{ item.categoryName }}</text>
			</view>

            <view class="module-block module-column">
                <view class="author-item" @click="useAuthoMusicList(item)" :key="'author-item' + item.id" v-for="item in musicAuthorList">
                    <MusicAvaterComponent type="author" :name="item.authorName" :avater="item.avatar"/>
                    <text>{{ item.authorName }}</text>
                    <text class="total">{{ item.total }}首</text>
                    <image class="icon-play" src="../../../static/icon_music_play.png"/>
                    <image class="icon-play" @click.stop="useLike(item)" :src="item.isLike > 0 ? isLikeActiveIcon : isLikeIcon"/>
                    <image class="icon-play" src="../../../static/icon_music_menu.png" />
                </view>
			</view>

            <text class="footer">{{ total > pageNum * PAGE_SIZE ? '正在加载更多' : '已经到底了'}}</text>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
	import { ref, reactive } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicAuthorCategoryType,MusicAuthorType } from '../types';
	import { getMusicAuthorCategoryService,getMusicAuthorListByCategoryIdService,insertMyLikeMusicAuthorService,deleteMyLikeMusicAuthorService } from '../service';
    import {PAGE_SIZE} from '../../common/constant';
	import NavigatorTitleComponent from '../components/NavigatorTitleComponent.vue';
    import isLikeIcon from '../../../static/icon_like.png';
	import isLikeActiveIcon from '../../../static/icon_like_active.png';
    import MusicAvaterComponent from '../components/MusicAvaterComponent.vue';

	const route = useRoute();
    const total = ref<number>(0);// 总数
	const pageNum = ref<number>(1);
    const musicAuthorCategoryList = reactive<Array<MusicAuthorCategoryType>>([]);
	const musicAuthorList = reactive<Array<MusicAuthorType>>([]);
    const activeAuthorCategory = ref<MusicAuthorCategoryType>({} as MusicAuthorCategoryType);
    let loading:boolean = false;

    /**
	 * @description: 获取所有音乐分类
	 * @date: 2024-08-26 22:02
	 * @author wuwenqiang
	 */
	getMusicAuthorCategoryService().then((res)=>{
		musicAuthorCategoryList.push(...res.data);
        activeAuthorCategory.value = musicAuthorCategoryList[0] as MusicAuthorCategoryType;
        useMusicAuthorListByCategoryId();
	});

     /**
	 * @description: 根据分类获取歌手列表
	 * @date: 2024-08-26 22:02
	 * @author wuwenqiang
	 */
    const useMusicAuthorListByCategoryId = () => {
        loading = true;
        getMusicAuthorListByCategoryIdService(activeAuthorCategory.value.id,pageNum.value,PAGE_SIZE).then((res)=>{
            musicAuthorList.push(...res.data);
            total.value = res.total;
        }).finally(()=> loading = false);
    }

     /**
	 * @description: 点赞歌手
	 * @date: 2024-08-27 21:19
	 * @author wuwenqiang
	 */
    const useLike = (item:MusicAuthorType)=>{
        if(item.isLike){
            deleteMyLikeMusicAuthorService(item.authorId).then((res)=>{
                if(res.data > 0){
                    uni.showToast({
                        duration:2000,
                        position:'center',
                        title:'取消收藏成功'
                    });
                    item.isLike = 0;
                }
            });
        }else{
            insertMyLikeMusicAuthorService(item.authorId).then((res)=>{
                if(res.data > 0){
                    uni.showToast({
                        duration:2000,
                        position:'center',
                        title:'收藏成功'
                    });
                    item.isLike = 1;
                }
            });
        }
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
			useMusicAuthorListByCategoryId();
		}
    }

     /**
	 * @description: 切换歌手类型
	 * @date: 2024-08-27 21:19
	 * @author wuwenqiang
	 */
    const onTabItem = (item:MusicAuthorCategoryType)=>{
        if(loading || item.id === activeAuthorCategory.value.id)return;
        pageNum.value = 1;
        activeAuthorCategory.value = item;
        musicAuthorList.length = 0;
		useMusicAuthorListByCategoryId();
    }

    /**
	 * @description: 跳转到歌手专辑页面
	 * @date: 2024-08-27 22:49
	 * @author wuwenqiang
	 */
    const useAuthoMusicList = (item:MusicAuthorType)=>{
        uni.navigateTo({ url: `../pages/AuthorMusicListPage?data=${encodeURIComponent(JSON.stringify(item))}` });
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
                &.module-block-grid{
                    display: grid;
                    grid-template-columns: repeat(7, 1fr);
                    gap: @page-padding;
                    .category-btn{
                        text-align: center;
                        padding: @small-margin 0;
                        border: 1rpx solid @sub-title-color;
                        border-radius: @btn-border-radius;
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
