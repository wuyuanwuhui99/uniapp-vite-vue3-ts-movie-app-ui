<template>
	<view class="page-wrapper" scroll-y show-scrollbar="false">
		<view class="page-header">
            <text class="page-btn btn-cancle">取消</text>
            <text class="page-btn btn-publish">发布</text>
        </view>
        <view class="page-body">
            <textarea class="textarea"></textarea>
        </view>
	</view>
</template>

<script setup lang="ts">
	import { reactive,ref,onMounted } from 'vue';
	import { useRoute } from "vue-router";
	import type { MusicType} from '../types';
	import {searchMusicService} from '../service';
	import { useStore } from "../../stores/useStore"; 

	const store = useStore();
	const route = useRoute();

	const musicItem:MusicType = JSON.parse(decodeURIComponent(route.query.musicItem as string)) as MusicType;
    
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
            background: @disable-text-color;
            width: 100%;
            padding: @page-padding;
            border-radius: @module-border-radius;
            box-sizing: border-box;
        }
    }
}
</style>
