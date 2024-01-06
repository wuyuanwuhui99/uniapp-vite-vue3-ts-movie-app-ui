<template>
	<view class="page-wrapper">
		<view class="module-block">
			<view class="row">
				<text class="text">头像</text>
				<image class="big-avater" :src="HOST + userData.avater"/>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('昵称','username')">
				<text class="text">昵称</text>
				<text>{{userData.username}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row">
				<text class="text">性别</text>
				<text>{{userData.sex}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">电话</text>
				<text>{{userData.telephone}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">邮箱</text>
				<text>{{userData.email}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row">
				<text class="text">生日</text>
				<text>{{userData.birthday}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">区域</text>
				<text>{{userData.region}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
			<view class="row last-row" @click="useEditUserData('电话','telephone')"> 
				<text class="text">个性签名</text>
				<text>{{userData.sign}}</text>
				<image class="icon-arrow" src="../../../static/icon_arrow.png"/>
			</view>
		</view>
		<button class="btn-logout" @click="useLogout">退出登录</button>
		<uni-popup ref="popup" class="popup-wrapper"  type="dialog">
			<view class="dialog-wrapper">
				<view class="dialog-box">
					<view class="dialog-header"><text>请输入</text></view>
					<view class="dialog-content">
						<view class="field-text">{{title}}:</view>
						<input class="text-input" v-model="inputValue"/>
					</view>
					<view class="dialog-btn">
						<view class="btn-cancle" @click="useCloseDialog">取消</view>
						<view class="btn-sure" @click="useSure">确定</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script setup lang="ts">
	import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
	import { useMovieStore } from '../../stores/useMovieStore';
	import {HOST} from '../../config/constant';
	import { ref } from 'vue';
	import type { UserDataType } from '../type';
	import {updateUserDataService} from '../service';
	
	const title = ref<string>('');
	const field = ref<string>('');
	const popup= ref<null | InstanceType<typeof uniPopup>>(null);
	const inputValue = ref<string>('');
	
	const useEditUserData = (mTitle:string,mField:string) => {
		title.value = mTitle;
		field.value = mField;
		inputValue.value = userData[mField];
		popup.value?.open('top')
	}
	
	const useCloseDialog = () => {
		popup.value?.close()
	}
	
	const store = useMovieStore();
	const userData:UserDataType = store.userData;
	
	/**
	 * @author: wuwenqiang
	 * @description: 退出登录
	 * @date: 2024-01-06 12:05
	 */
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
	
	/**
	 * @author: wuwenqiang
	 * @description: 确定修改用户信息
	 * @date: 2024-01-06 12:05
	 */
	const useSure = () => {
		const mUserData = {...userData};
		mUserData[field.value] = inputValue.value
		updateUserDataService(mUserData).then(res=>{
			store.setUserData(mUserData)
			popup.value?.close()
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
		.popup-wrapper{
			width: 100%;
			height: 100%;
			background-color: rgba(0,0,0,0.2);
			top: 0;
			left: 0;
			.dialog-wrapper{
				display: flex;
				height: 100vh;
				width: 100%;
				align-items: center;
				justify-content: center;
				.dialog-box{
					width: 80%;
					left: 50%;
					top: 50%;		
					border-radius: @module-border-radius;
					background-color: @white-background-color;
					.dialog-header{
						padding: @page-padding;
						display: flex;
						align-items: center;
						justify-content: center;
						font-weight: bold;
						border-bottom: 1rpx solid @page-background-color;
					}
					.dialog-content{
						padding: @page-padding;
						display: flex;
						align-items: center;
						.field-text{
							margin-right: @page-padding;
						}
						.text-input{
							flex: 1;
							background-color: @page-background-color;
							padding: @page-padding;
							color: @sub-title-color;
							border-radius: @module-border-radius;
						}
					}
					.dialog-btn{
						display: flex;
						border-top: 1rpx solid @page-background-color;
						.btn-cancle{
							flex: 1;
							padding: @page-padding;
							text-align: center;
							color: @sub-title-color;
						}
						.btn-sure{
							flex: 1;
							padding: @page-padding;
							text-align: center;
							color: @line-color;
							font-weight: bold;
							border-left: 1rpx solid @page-background-color;;
						}
					}
				}
			}
		}
	}
</style>
