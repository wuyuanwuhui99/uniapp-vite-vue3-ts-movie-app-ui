<template>
	<view class="page-wrapper">
		<view class="module-block">
			<view class="row">
				<text class="text">头像</text>
				<image class="big-avater" :src="store.userData.avater ? HOST + store.userData.avater:defaulAvater"/>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('昵称','username')">
				<text class="text">昵称</text>
				<text>{{store.userData.username}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditSex">
				<text class="text">性别</text>
				<text>{{SexMap[store.userData.sex] || ''}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','telephone')">
				<text class="text">电话</text>
				<text>{{store.userData.telephone}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('邮箱','email')">
				<text class="text">邮箱</text>
				<text>{{store.userData.email}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row">
				<text class="text">生日</text>
				<text>{{store.userData.birthday}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row" @click="useEditUserData('电话','region')">
				<text class="text">区域</text>
				<text>{{store.userData.region}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
			<view class="row last-row" @click="useEditUserData('个性签名','sign')">
				<text class="text">个性签名</text>
				<text>{{store.userData.sign}}</text>
				<image class="icon-arrow" src="../../static/icon_arrow.png"/>
			</view>
		</view>
		<button class="btn-logout" @click="useLogout">退出登录</button>
		<uni-popup ref="popup1" class="popup-wrapper"  type="dialog">
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
		<OptionsDialog ref="sexOptionsDialog" @onCheck= "useCheckSex" :options="[{value:0,text:'男'},{value:1,text:'女'}]"/>
	</view>
</template>

<script setup lang="ts">
	import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
	import { useStore } from '../stores/useStore';
	import OptionsDialog from '../components/OptionsDialog';
	import {HOST} from '../common/constant';
	import { ref } from 'vue';
	import type { UserDataType } from '../types';
	import {updateUserDataService} from '../service';
	import defaulAvater from '../../static/default_avater.png';
	import { SexMap } from '../common/config';

	const title = ref<string>('');
	const field = ref<string>('');
	const popup1= ref<null | InstanceType<typeof uniPopup>>(null);
	const sexOptionsDialog = ref<null | InstanceType<typeof OptionsDialog>>(null);
	const inputValue = ref<string>('');
	const store = useStore();

	/**
	 * @author: wuwenqiang
	 * @description: 编辑用户信息
	 * @date: 2024-01-16 22:49
	 */
	const useEditUserData = (mTitle:string,mField:string) => {
		title.value = mTitle;
		field.value = mField;
		inputValue.value = store.userData[mField];
		popup1.value?.open('top')
	}

	/**
	 * @author: wuwenqiang
	 * @description: 关闭用户信息编辑对话框
	 * @date: 2024-01-16 22:49
	 */
	const useCloseDialog = () => {
		popup1.value?.close()
	}


	/**
	 * @author: wuwenqiang
	 * @description: 性别选择
	 * @date: 2024-01-16 22:49
	 */
	const useCheckSex = (sex:number) => {
		const mUserData:UserDataType = {...store.userData};
		mUserData.sex = sex;
		updateUserDataService(mUserData).then(res=>{
			store.setUserData(mUserData);
		})
	}


	/**
	 * @author: wuwenqiang
	 * @description: 退出登录
	 * @date: 2024-01-06 12:05
	 */
	const useLogout = () => {
		uni.showModal({
		    title: '提示',
		    content: '是否退出登录',
				success:  res => {
				if (res.confirm) {
					uni.setStorageSync('token','');
					uni.reLaunch({
						url: `../pages/MovieLoginPage`
					})
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
		const mUserData = {...store.userData};
		mUserData[field.value] = inputValue.value
		updateUserDataService(mUserData).then(res=>{
			store.setUserData(mUserData)
			popup1.value?.close()
		})

	}

	const useEditSex = () => {
		sexOptionsDialog.value?.$refs.popup.open('top')
	}
</script>

<style lang="less">
	@import '../theme/color.less';
	@import '../theme/size.less';
	@import '../theme/style.less';
	.page-wrapper{
		height: 100%;
		display: flex;
		flex-direction: column;
		padding: 0 @page-padding @page-padding;
		background-color: @page-background-color;
		box-sizing: border-box;
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
			border-radius: @big-border-radius;
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
				&.sex-dialog-wrapper{
					flex-direction: column;
					justify-content: flex-end;
					padding: @page-padding;
					box-sizing: border-box;
					.option-wrapper{
						display: flex;
						flex-direction: column;
						background-color: @module-background-color;
						width: 100%;
						border-radius: @module-border-radius;
						.option-item{
							display: block;
							width: 100%;
							text-align: center;
							padding: @page-padding 0;
							border-bottom: 1rpx solid @page-background-color;
							&:last-child{
								border-bottom:none;
							}
						}
					}
					.option-btn{
						margin-top: @page-padding;
						width: 100%;
						text-align: center;
						padding: @page-padding 0;
						background-color: @module-background-color;
						border-radius: @module-border-radius;
					}
				}
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
