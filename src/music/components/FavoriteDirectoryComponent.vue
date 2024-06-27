<template>
    <view class="favorite-list-wrapper">
        <view class="favorite-add">
            <view class="rectangle">
                <image class="icon-favorite-add" src="../../../static/icon_add.png"/>
            </view>
            <text>新建收藏夹</text>
        </view>
        <scroll-view class="favorite-directory" scroll-y show-scrollbar="false">
            <checkbox-group>
                <label class="checkbox-item"  v-for="item in favoriteDirectoryList" :key="item.id">
                    <image class="rectangle" v-if="item.cover" :src="HOST + item.cover"/>
                    <view v-else class="rectangle">
                        <image class="icon-favorite-add" src="../../../static/icon_music_default_cover.png"/>
                    </view>
                    <view class="checkbox-name">
                        <text>{{item.name}}</text>
                        <text class="favorite-total">{{ item.total }}</text>
                    </view>
                    
                    <checkbox value="cb" :checked="item.checked" />
                </label>
            </checkbox-group>
        </scroll-view>
    </view>
</template>

<script setup lang="ts">
    import { HOST } from '../../config/constant';
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
        align-items: center;
    }
    .rectangle{
        width: calc(@middle-icon-size * 2);
        height: calc(@middle-icon-size * 2);
        display: flex;
        justify-content: center;
        align-items: center;
        background: @page-background-color;
        border-radius: @btn-border-radius;
        .icon-favorite-add{
            width: @middle-icon-size;
            height: @middle-icon-size;
        }
    }
    
    .favorite-directory{
        flex: 1;
        height: 0;
        margin-top: @page-padding;
        .checkbox-item{
            margin-bottom: @page-padding;
            display: flex;
            align-items: center;
            &:last-child{
                margin-bottom:0;
            }
            .checkbox-name{
                display: flex;
                flex: 1;
                margin-left: @page-padding;
                flex-direction: column;
                .favorite-total{
                    color: @sub-title-color;
                }
            }
        }
    }
}
</style>