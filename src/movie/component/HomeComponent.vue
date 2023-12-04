<template>
	<view class="home-wrapper">
		<view class="search-wrapper module-block">
			<image class="user-avater user-avater-middle" :src="HOST + store.userData.avater"/>
			<view class="search-input-wrapper">
				<text class="search-input-placehold">{{keyword}}</text>
			</view>
		</view>	
	</view>
</template>

<script setup lang="ts">
	import { ref,onMounted,reactive } from 'vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import {HOST} from '../../config/constant';
	const keyword = ref<string>('我是女特警');
	const store = useMovieStore()
</script>

<style lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
.home-wrapper{
    padding:0 @page-padding 0;
    .search-wrapper{
        display: flex;
        .search-input-wrapper{
            flex: 1;
            margin-left: @page-padding;
            height: @middle-avater;
            background-color: @search-input-color;
            border-radius: @btn-border-radius;
            display: flex;
            align-items: center;
            padding-left: @page-padding;
            .search-input-placehold{
                color: @search-input-placehold;
            }
        }
    }
    .classify-wrapper{
        margin-top: @page-padding;
        display: flex;
        .classify-item{
            flex: 1;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            display: flex;
            .classify-img{
                width: @classify-icon-size;
                height: @classify-icon-size;
                margin-bottom: @small-margin;
            }
        }
    }
    
}
</style>