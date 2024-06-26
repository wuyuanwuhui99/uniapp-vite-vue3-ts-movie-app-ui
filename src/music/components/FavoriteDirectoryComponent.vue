<template>
    <view class="favorite-list-wrapper">
        <view class="favorite-add">
            <text>新建收藏夹</text>
            <image class="icon-favorite-add" src="../../../static/icon_favorite_add.png"/>
        </view>
        <scroll-view class="favorite-directory" scroll-y show-scrollbar="false">
            <view>
                <view v-for="item in favoriteDirectoryList" :key="item.id">
                    <text>{{item.name}}</text>
                </view>	
            </view>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
    import {reactive,defineProps,type PropType} from 'vue';
    import type {FavoriteDirectoryType} from '../types';
    import {getFavoriteDirectoryService} from '../service';
    const favoriteDirectoryList = reactive<Array<FavoriteDirectoryType>>([]);
    const { musicId } = defineProps({
		musicId: {
			type: Number as PropType<number>,
			reqiure: true,
			default: {}
		}
	});
    getFavoriteDirectoryService(musicId).then(res => favoriteDirectoryList.push(...res.data));
</script>


<style scoped lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.favorite-list-wrapper{
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: @page-padding;
    .favorite-add{
        display: flex;
        justify-content: space-between;
        .icon-favorite-add{
            width: @middle-icon-size;
            height: @middle-icon-size;
        }
    }
    .favorite-directory{
        flex: 1;
        height: 0;
    }
}
</style>