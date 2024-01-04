<template>
	<view class="page-wrapper">
		<view class="module-block">
			<view class="row">
				<text class="text">头像</text>
				<image class="big-avater" :src="HOST + store.userData.avater"/>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('昵称','username')">
				<text class="text">昵称</text>
				<text>{{store.userData.username}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row">
				<text class="text">性别</text>
				<text>{{store.userData.sex}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">电话</text>
				<text>{{store.userData.telephone}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">邮箱</text>
				<text>{{store.userData.email}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row">
				<text class="text">生日</text>
				<text>{{store.userData.birthday}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">区域</text>
				<text>{{store.userData.region}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row last-row" @click="useEditUserData('电话','telephone')"> 
				<text class="text">个性签名</text>
				<text>{{store.userData.sign}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
		</view>
		<button class="btn-logout" @click="useLogout">退出登录</button>
		<uni-popup ref="popup" background-color="#fff">底部弹出 Popup</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import {HOST} from '../../config/constant';
	import { ref } from 'vue'
	const popup= ref();
	const useEditUserData = (title:string,field:string) => {
		console.log(popup)
		popup.open('top')
	}
	const store = useMovieStore();
	
	const useLogout = () => {
		uni.showModal({
		    title: '提示',
		    content: '是否退出登录',
				success: function (res) {
				if (res.confirm) {
					console.log('用户点击确定');
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
		    }
		})
	}
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.page-wrapper{
		height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 0 @page-padding @page-padding;
		background-color: @page-background-color;
		.row{
			display: flex;
			padding: @page-padding;
			align-items: center;
			border-bottom: 1rpx solid @page-background-color;
			&.last-row{
				border-bottom:none
			}
			.text{
				flex: 1;
			}
			.big-avater{
				width: @big-avater;
				height: @big-avater;
				border-radius: @big-avater;
			}
			.icon-arrow{
				margin-left: @page-padding;
				width: @small-icon-size;
				height: @small-icon-size;
				opacity: 0.5;
			}
		}
		.btn-logout{
			border: none;
			display: block;
			width: 100%;
			margin-top: @page-padding;
			background-color: @warn-color;
			color: @module-background-color;
			border-radius: @module-border-radius;
		}
	}
</style>
