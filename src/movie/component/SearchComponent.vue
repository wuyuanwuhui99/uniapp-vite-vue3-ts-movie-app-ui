<template>
	<view class="search-wrapper module-block">
		<AvaterComponent size="middle"/>
		<view class="search-input-wrapper">
			<text class="search-input-placehold">{{keyword}}</text>
		</view>
	</view>	
</template>

<script setup lang="ts">
	import AvaterComponent from './AvaterComponent';
	import { onMounted, defineProps, ref } from 'vue';
	import {getKeyWordService} from '../service/index';
	const keyword = ref<string>('');
	const {classify} = defineProps({
		classify:{
			type:String,
			reqiure:true,
			default:''
		}
	})
	onMounted(()=>{
		// 获取搜素框推荐电影
		getKeyWordService(classify).then(res => keyword.value = res.data.movieName)
	})
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.search-wrapper{
	    display: flex;
	    .search-input-wrapper{
	        flex: 1;
	        margin-left: @page-padding;
	        height: @middle-avater;
	        background-color: @search-input-color;
	        border-radius: @middle-avater;
	        display: flex;
	        align-items: center;
	        padding-left: @page-padding;
	        .search-input-placehold{
	            color: @search-input-placehold;
	        }
	    }
	}
</style>