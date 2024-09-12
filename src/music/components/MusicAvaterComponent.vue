<template>
	<image class="music-cover" :class="'music-cover' + size" v-if="avater" :src="getMusicCover(avater)" />
	<image class="music-cover" :class="'music-cover' + size" v-else-if="type === 'music'" src="../../../static/default_cover.jpg"/>
	<text class="music-cover" v-else :class="'music-cover' + size">{{ name[0] }}</text>
</template>

<script setup lang="ts">
	import { getMusicCover } from '../../utils/util';
	import { defineProps } from 'vue';

	const {type,avater,name,size} = defineProps({
		type:{
			type:String,
			default:''
		},
		avater:{
			type:String,
			default:'',
		},
		name:{
			type:String,
			default:'',
		},
		size:{
			type:String,
			default:'middle',
		}
	})
</script>


<style scoped lang="less">
	@import '../../theme/style.less';
	@import '../../theme/size.less';
	.music-cover{
		&.music-cover-middle{
			width: @middle-avater;
			height: @middle-avater;
		}
		&.music-cover-big{
			width: @big-avater;
			height: @big-avater;
		}
	}
	
</style>