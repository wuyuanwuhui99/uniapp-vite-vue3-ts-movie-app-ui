<template>
	<image @click="useNavigateTo" class="user-avater" :class="sizeMap[size]" :src="store.userData.avater ? HOST + store.userData.avater : defaulAvater"/>
</template>

<script setup lang="ts">
	import { defineProps } from 'vue';
	import { useStore } from '../stores/useStore';
	import {HOST} from '../common/constant';
	import defaulAvater from '../../static/default_avater.png';
	const store = useStore();
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

	const useNavigateTo = () => {
		uni.navigateTo({
			url: `../pages/UserPage`
		})
	}


</script>

<style lang="less">
	@import '../theme/size.less';
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
