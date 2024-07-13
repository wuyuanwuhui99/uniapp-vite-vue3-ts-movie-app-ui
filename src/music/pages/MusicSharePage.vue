<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="page-header">
            <text class="page-btn btn-cancle">取消</text>
            <text class="page-btn btn-publish">发布</text>
        </view>
        <view class="page-body">
            <textarea class="textarea" placeholder="这一刻的想法"></textarea>
            <view class="module-block module-block-row">
                <image class="music-cover" :src="/http[s]?:\/\//.test(musicItem.cover) ? musicItem.cover.replace('{size}','480') : HOST + musicItem.cover" />
                <text>{{ musicItem.authorName }} - {{ musicItem.songName }}</text>
            </view>
            <view class="module-block module-block-row">
                <image class="icon-permission" src="../../../static/icon_permission.png"/>
                <text class="permission-text">谁可以看</text>
                <text>公开</text>
                <image class="icon-arrow" src="../../../static/icon_arrow.png"/>
            </view>
        </view>
        <OptionsDialog ref="sexOptionsDialog" @onCheck= "usePermission" :options="['公开','私密']"/>
	</view>
</template>

<script setup lang="ts">
	import { reactive,ref,onMounted } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicType,CircleType} from '../types';
	import {searchMusicService} from '../service';
    import {HOST} from '../../common/constant';
    import {CircleEnum} from '../../common/enum';
	import { useStore } from "../../stores/useStore";
    import OptionsDialog from '../../movie/components/OptionsDialog.vue';
    const content = ref<string>('');
    const sexOptionsDialog = ref<null | InstanceType<typeof OptionsDialog>>(null);

	const store = useStore();
	const route = useRoute();

    const musicItem:MusicType = JSON.parse(decodeURIComponent(route.query.musicItem as string)) as MusicType;
    const permissionMap = {
        '公开':1,
        '私密':0
    }

    const params:CircleType = {
        permission:1,
        type:CircleEnum.MUSIC,
        relationId:musicItem.id,// 关联音乐audio_id或者电影movie_id
        content:content.value,// 朋友圈内容
    }

    /**
	 * @description: 下载权限
	 * @date: 2024-07-11 23:00
	 * @author wuwenqiang
	 */
    const usePermission = (value:string) => {

    }



</script>

<style lang="less" scoped>
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.page-wrapper{
    height: 100%;
    display: flex;
	overflow: hidden;
    flex-direction: column;
    background-color: @page-background-color;
	box-sizing: border-box;
	.page-header{
        padding: @page-padding;
        display: flex;
        justify-content: space-between;
        background: @module-background-color;
        .page-btn{
            background-color: @module-background-color;
            border-radius: @btn-border-radius;
            border:1rpx solid @disable-text-color;
            margin: 0;
            overflow: hidden;
            padding: @page-padding @btn-padding;
            &.btn-publish{
                border: none;
                background: @line-color;
                color: @module-background-color;
            }
        }
    }
    .page-body{
        flex: 1;
        overflow: hidden;
        padding: @page-padding;
        .textarea{
            background: @search-input-placehold;
            width: 100%;
            padding: @page-padding;
            border-radius: @module-border-radius;
            box-sizing: border-box;
        }
        .module-block{
            gap: @page-padding;
            align-items: center;
            .icon-permission{
                width: @middle-icon-size;
                height: @middle-icon-size;
            }
            .permission-text{
                flex: 1;
            }
            .icon-arrow{
                opacity: 0.5;
                width: @small-icon-size;
                height: @small-icon-size;
            }
        }
    }
}
</style>
