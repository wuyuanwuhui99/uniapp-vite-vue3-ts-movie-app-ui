<template>
	<view class="my-wrapper">
		<view class="user-wrapper module-block">
			<AvaterComponent size='big'/>
			<view class="user-name-wrapper">
				<text class="user-name">{{store.userData.username}}</text>
				<text class="user-sign">{{store.userData.sign}}</text>
			</view>
			<image class="icon-edit" src="../../../static/icon_edit.png"/>
		</view>
		
		<view class="user-msg-wrapper module-block">
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.userAge}}</text>
				<text class="user-msg-title">使用天数</text>
			</view>
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.favoriteCount}}</text>
				<text class="user-msg-title">收藏</text>
			</view>
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.playRecordCount}}</text>
				<text class="user-msg-title">观看记录</text>
			</view>
			<view class="user-msg-item">
				<text class="user-msg-count">{{userMsg.viewRecordCount}}</text>
				<text class="user-msg-title">浏览记录</text>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import AvaterComponent from './AvaterComponent';
	import { reactive, onMounted } from 'vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import { getUserMsgService } from '../service';
	import type { UserMsgType,UserDataType } from '../type'; 
	const store = useMovieStore();
	const userMsg = reactive<UserMsgType>({
		userAge: 0,// 使用天数
		favoriteCount: 0,// 收藏数
		playRecordCount: 0,// 观看记录
		viewRecordCount: 0// 浏览记录
	})
	onMounted(()=>{
		// 获取分类
		getUserMsgService().then(res=>{
			Object.assign(userMsg,res.data);
		})
	})
</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.my-wrapper{
		overflow: auto;
		.user-wrapper{
			display: flex;
			align-items: center;
			.user-name-wrapper{
				display: flex;
				flex-direction: column;
				flex: 1;
				margin-left: @page-padding;
				.user-name{
					font-size: @font-size-big;
					font-weight: bolder;
					padding-bottom: @small-margin;
				}
				.user-sign{
					font-size: @font-size-normal;
					color: @disable-text-color;
				}
			}
			.icon-edit{
				width: @big-icon-size;
				height: @big-icon-size;
			}
		}
		.user-msg-wrapper{
			display: flex;
			.user-msg-item{
				display: flex;
				flex: 1;
				flex-direction: column;
				align-items: center;
				.user-msg-count{
					font-size: @font-size-big;
					font-weight: bolder;
					padding-bottom: @small-margin;
				}
				.user-msg-title{
					font-size: @font-size-normal;
					color: @disable-text-color;
				}
			}
		}
	}
	
	
</style>