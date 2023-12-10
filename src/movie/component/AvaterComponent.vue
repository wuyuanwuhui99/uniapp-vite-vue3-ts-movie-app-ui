<template>
	<image class="user-avater" :class="sizeMap[size]" :src="HOST + store.userData.avater"/>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import {HOST} from '../../config/constant';
	const store = useMovieStore();
	const sizeMap = {
		middle:'user-avater-middle',
		big:'user-avater-big'
	}
	const {size} = defineProps({
		size:{
			type:String,
			reqiure:true,
			default:'middle'
		}
	})
	
	
	
</script>

<style lang="less">
	@import '../../theme/size.less';
	.user-avater{
	    border-radius: 50%;
	    &.user-avater-middle{
	        width: @middle-avater;
	        height: @middle-avater;
	    }
		&.user-avater-big{
		    width: @big-avater;
		    height: @big-avater;
		}
	}
</style>