<template>
    <view class="favorite-list-wrapper">
        <template v-if="showCreateFavorite">
            <view class="favorite-add-row">
                <text class="require-text">*</text>
                <text>名称</text>
                <input v-model="favoriteName" placeholder="请输入收藏夹名称" class="favorite-input"/>
            </view>
            <view class="favorite-add-row favorite-cover-row">
                <text class="require-text require-text-hidden">*</text>
                <text>封面</text>
                <view class="rectangle">
                    <image class="icon-favorite-add" src="../../../static/icon_add.png"/>
                </view>
            </view>
            <view class="favorite-btn-row">
                <button class="favorite-btn favorite-create" :class="isEnableCreate ? '' : 'favorite-btn-disable'" @click="useInsertFavoriteDirectory">创建</button>
                <button class="favorite-btn favorite-cancle" @click="showCreateFavorite = false">取消</button>
            </view>
        </template>
        <template v-else>
            <view class="favorite-add" @click="showCreateFavorite = true">
                <view class="rectangle">
                    <image class="icon-favorite-add" src="../../../static/icon_add.png"/>
                </view>
                <text>新建收藏夹</text>
            </view>

            <scroll-view  class="favorite-directory" scroll-y show-scrollbar="false">
                <checkbox-group @change="useCheckChange">
                    <label class="checkbox-item"  v-for="item in favoriteDirectoryList" :key="item.id">
                        <image class="rectangle" v-if="item.cover" :src="HOST + item.cover"/>
                        <view v-else class="rectangle">
                            <image class="icon-favorite-add" src="../../../static/icon_music_default_cover.png"/>
                        </view>
                        <view class="checkbox-name">
                            <text>{{item.name}}</text>
                            <text class="favorite-total">{{ item.total }}首</text>
                        </view>
                        <checkbox :value="item.id" :checked="item.checked" />
                    </label>
                </checkbox-group>
            </scroll-view>
            <button @click="userAddFavorite" class="btn-add-favorite">{{isFavorite && checkboxValue.length == 0 ? '取消收藏': '添加'}}{{checkboxValue.length > 0 ? `（已选${checkboxValue.length}个）` : ''}}</button>
        </template>

    </view>
</template>

<script setup lang="ts">
    import { HOST } from '../../common/constant';
    import {reactive,defineProps,type PropType,defineEmits,ref,watch} from 'vue';
    import type {FavoriteDirectoryType,FavoriteMusicType} from '../types';
    import {getFavoriteDirectoryService,insertMusicFavoriteService,insertFavoriteDirectoryService} from '../service';
    const favoriteDirectoryList = reactive<Array<FavoriteDirectoryType>>([]);
    const checkboxValue = reactive<Array<number>>([]);
    const showCreateFavorite = ref<boolean>(false);
    const isEnableCreate = ref<boolean>(false);
    const favoriteName = ref<string>('');

    const { musicId,isFavorite } = defineProps({
        isFavorite:{
            type: Boolean as PropType<boolean>,
			reqiure: true,
			default: false
        },
		musicId: {
			type: Number as PropType<number>,
			reqiure: true,
			default: -1
		}
	});

    const emit = defineEmits(['useFavorite']);

     /**
	 * @description: 选择收藏夹
	 * @date: 2024-06-29 14:21
	 * @author wuwenqiang
	 */
    const useCheckChange = (e:EventHandler) => {
        checkboxValue.length = 0;
        checkboxValue.push(...e.detail.value);
    }

    /**
	 * @description: 添加收藏
	 * @date: 2024-06-29 14:20
	 * @author wuwenqiang
	 */
    const userAddFavorite = () => {
        const favoriteList:Array<FavoriteMusicType> = checkboxValue.map(item=>{
            return {favoriteId:item} as FavoriteMusicType
        });
        insertMusicFavoriteService(musicId,favoriteList).then(res => {
            if(res.data > 0){
                uni.showToast({
                    duration:2000,
                    position:'center',
                    title:favoriteList.length == 0 ? '取消收藏成功' :'添加收藏成功'
                });
            }
            emit('useFavorite',favoriteList.length != 0);
        })
    }

    const useInsertFavoriteDirectory = () => {
        const favoriteDirectory:FavoriteDirectoryType = {name: favoriteName.value,id:-1};
        insertFavoriteDirectoryService(favoriteDirectory).then(res => {
            if(res.data){
                uni.showToast({
                    duration:2000,
                    position:'center',
                    title:'创建收藏夹成功'
                });
                favoriteDirectoryList.unshift(res.data);
                favoriteName.value = '';
                showCreateFavorite.value = false;
            }else{
                uni.showToast({
                    duration:2000,
                    position:'center',
                    title:'收藏夹已存在'
                });
            }

        });
    }

    watch(() => favoriteName.value,
		(newVal) => {
			isEnableCreate.value = Boolean(newVal)
        }
	);

    getFavoriteDirectoryService(musicId).then(res => {
        res.data.forEach(item => {
            if(item.checked){
                checkboxValue.push(item.id);
            }
            favoriteDirectoryList.push(item);
        })
    });
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
    .favorite-add-row{
        display: flex;
        align-items: center;
        &.favorite-cover-row{
            margin-top: @page-padding;
            .rectangle{
                width: calc(@middle-icon-size * 4);
                height: calc(@middle-icon-size * 4);
                margin-left: @page-padding;
            }
        }
        .require-text{
            color:@warn-color;
            &.require-text-hidden{
                visibility: hidden;
            }
        }
        .favorite-input{
            flex: 1;
            width: 0;
            margin-left: @page-padding;
            padding: @page-padding;
            background:  @page-background-color;
            border-radius: @btn-border-radius;
        }
    }
    .favorite-btn-row{
        .favorite-btn{
            width: 100%;
            margin-top: @page-padding;
            border-radius: @big-border-radius;
            &.favorite-create{
                background: @warn-color;
                border:none;
                color: @white-background-color;
                &.favorite-btn-disable{
                    opacity: 0.5;
                    pointer-events: none;
                }
            }
            &.favorite-cancle{
                background: transparent;
                border:1rpx solid @page-background-color;
            }
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
    .btn-add-favorite{
        border: none;
        display: block;
        width: 100%;
        margin-top: @page-padding;
        background-color: @warn-color;
        color: @module-background-color;
        border-radius: @big-border-radius;
    }
}
</style>
