<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="page-header">
            <text class="page-btn btn-cancle" @click="useCancle">取消</text>
            <text class="page-btn btn-publish" @click="useSave">发布</text>
        </view>
        <view class="page-body">
            <textarea class="textarea" v-model="content" placeholder="这一刻的想法"></textarea>
            <view class="module-block module-block-row">
                <image class="music-cover" :src="/http[s]?:\/\//.test(musicItem.cover) ? musicItem.cover.replace('{size}','480') : HOST + musicItem.cover" />
                <text>{{ musicItem.authorName }} - {{ musicItem.songName }}</text>
            </view>
            <view class="module-block module-block-row" @click="usePermission">
                <image class="icon-permission" src="../../../static/icon_permission.png"/>
                <text class="permission-text">谁可以看</text>
                <text>{{PermissionMap[permission]}}</text>
                <image class="icon-arrow" src="../../../static/icon_arrow.png"/>
            </view>
        </view>
        <OptionsDialog ref="permissionOptionsDialog" @onCheck= "onCheckPermission" :options="[{text:'公开',value:1},{text:'私密',value:0}]"/>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicType, CircleType } from '../types';
	import { saveCircleService } from '../service';
    import { HOST } from '../../common/constant';
    import { CircleEnum } from '../../common/enum';
    import { PermissionMap } from '../../common/config';
	import { useStore } from "../../stores/useStore";
    import OptionsDialog from '../../movie/components/OptionsDialog.vue';
    const content = ref<string>('');
    const permission = ref<number>(1);
    const permissionOptionsDialog = ref<null | InstanceType<typeof OptionsDialog>>(null);

	const store = useStore();
	const route = useRoute();

    const musicItem:MusicType = JSON.parse(decodeURIComponent(route.query.musicItem as string)) as MusicType;


    /**
	 * @description: 下载权限
	 * @date: 2024-07-11 23:00
	 * @author wuwenqiang
	 */
    const usePermission = (value:number) => {
        permissionOptionsDialog.value?.$refs.popup.open('top');
    }


    /**
	 * @description: 选中权限
	 * @date: 2024-07-13 13:50
	 * @author wuwenqiang
	 */
    const onCheckPermission = (vlaue:number) => {
        permission.value = vlaue;
    }

     /**
	 * @description: 取消说说
	 * @date: 2024-07-13 13:50
	 * @author wuwenqiang
	 */
    const useCancle = () => {
        uni.navigateBack();
    }

     /**
	 * @description: 保存说说
	 * @date: 2024-07-13 14:50
	 * @author wuwenqiang
	 */
    const useSave = () => {
        const params:CircleType = {
            permission:permission.value,
            type:CircleEnum.MUSIC,
            relationId:musicItem.id,// 关联音乐audio_id或者电影movie_id
            content:content.value,// 朋友圈内容
        }        
        saveCircleService(params).then(()=>{
            uni.showToast({
				duration:2000,
				position:'center',
				title:'发布成功'
			})
            uni.navigateBack();
        })
        
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
