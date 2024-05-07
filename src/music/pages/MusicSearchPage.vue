<template>
	<view class="search-wrapper">
		
	</view>
</template>

<script setup lang="ts">
	import { ref,onMounted,reactive } from 'vue';
	import {httpRequest} from '../../utils/HttpUtils';
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.search-wrapper{
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: @page-background-color;
	}
</style>
