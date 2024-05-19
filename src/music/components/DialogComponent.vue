<template>
    <view class="dialog-wrapper">
        <view class="mask" @click="onClose"></view>
        <view class="dialog-body-wrapper">
            <view class="dialog-header">
                <slot name="header"/>
                <image class="icon-close" @click="onClose" src="../../../static/icon_close.png"/>
            </view>
            <slot name="content"></slot>
        </view>
        
    </view>
</template>

<script setup lang="ts">
    import { defineEmits} from 'vue';
    const emits = defineEmits(['onClose']);

    /**
	 * @description: 关闭弹窗
	 * @date: 2024-05-18 16:27
	 * @author wuwenqiang
	 */
    const onClose = () => {
        emits('onClose');
    }
</script>


<style scoped lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.dialog-wrapper{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 2;
    .mask{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: @black-background-color;
        opacity: 0.5;
    }
    .dialog-body-wrapper{
        height: 80%;
        background: @white-background-color;
        position: absolute;
        width: 100%;
        z-index: 1;
        bottom: 0;
        border-top-right-radius: @module-border-radius;
        border-top-left-radius: @module-border-radius;
        display: flex;
        flex-direction: column;
        
        .dialog-header{
            position: relative;
            height: 10%;
            border-bottom: 1rpx solid @page-background-color;
            .icon-close{
                position: absolute;
                right: @page-padding;
                top: 50%;
                transform: translateY(-50%);
                width: @small-icon-size;
                height: @small-icon-size;
            }
        }
    }
}
</style>