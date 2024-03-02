<template>
	<view class="page-wrapper">
		<view class="module-block">
			<view class="row">
				<view class="title">
					<text class="require">*</text>
					<text>账号</text>
				</view>
				<input @blur="useCheckUserId" class="input" v-model="userData.userId" placeholder="请输入账号名称"/>
			</view>
			<view class="row">
				<view class="title">
					<text class="require">*</text>
					<text>密码</text>
				</view>
				<input type="password" class="input" v-model="userData.password" placeholder="请输入密码"/>
			</view>
			<view class="row">
				<view class="title">
					<text class="require">*</text>
					<text>确认密码</text>
				</view>
				<input type="password" v-model="confirmPassowrd" class="input" placeholder="请确认密码"/>
			</view>
			<view class="row">
				<view class="title">
					<text class="require">*</text>
					<text>昵称</text>
				</view>
				<input class="input" v-model="userData.username" placeholder="请输入昵称"/>
			</view>
			<view class="row">
				<view class="title">
					<text>性别</text>
				</view>
				<input class="input" disabled @click="useEditSex" v-model="userData.sex" placeholder="请选择性别"/>
			</view>
			<view class="row">
				<view class="title">
					<text>出生日期</text>
				</view>
				<uni-datetime-picker :border="false" class="input" type="date" :clear-icon="false" v-model="userData.birthday"/>
			</view>
			<view class="row">
				<view class="title">
					<text>电话</text>
				</view>
				<input class="input" v-model="userData.telephone" placeholder="请输入电话号码"/>
			</view>
			<view class="row">
				<view class="title">
					<text>邮箱</text>
				</view>
				<input class="input" v-model="userData.email" placeholder="请输入邮箱"/>
			</view>
			<view class="row">
				<view class="title">
					<text>区域</text>
				</view>
				<input class="input" v-model="userData.region" placeholder="请输入区域"/>
			</view>
			<view class="row">
				<view class="title">
					<text>个性签名</text>
				</view>
				<input class="input" v-model="userData.sign" placeholder="请输入个性签名"/>
			</view>
		</view>
		
		<view class="login-btn" @click="useRegister">注册</view>
		
		<OptionsDialog ref="sexOptionsDialog" @onCheck= "useCheckSex" :options="['男','女']"/>
		
		
	</view>
</template>

<script setup lang="ts">
	import uniDatetimePicker from '@dcloudio/uni-ui/lib/uni-datetime-picker/uni-datetime-picker.vue';
	import { ref, reactive } from 'vue';
	import type { UserDataType } from '../type';
	import { registerService, getUserByIdService } from '../service';
	import { useMovieStore } from '../../stores/useMovieStore';
	import OptionsDialog from '../component/OptionsDialog';
	
	let loading:boolean = false;
	
	const sexOptionsDialog = ref<null | InstanceType<typeof OptionsDialog>>(null);
	// 用户信息
	const userData = reactive<UserDataType>({
		userId: '',
		username: '',
		telephone: '',
		email: '',
		birthday: '',
		sex: '',
		password: '',
		sign: '',
		region: ''
	});
	const confirmPassowrd = ref<string>('');// 企鹅人密码

	/**
	 * @author: wuwenqiang
	 * @description: 性别选择
	 * @date: 2024-01-19 23:20
	 */
	const useEditSex = () => {
		sexOptionsDialog.value?.$refs.popup.open('top')
	}
	
	/**
	 * @author: wuwenqiang
	 * @description: 性别选择
	 * @date: 2024-01-16 22:49
	 */
	const useCheckSex = (sex:string) => {
		userData.sex = sex
	}
	
	/**
	 * @author: wuwenqiang
	 * @description: 校验账号和密码
	 * @date: 2024-01-20 00:17
	 */
	const useCheckUserId = (): Promise<boolean> => {
		return getUserByIdService(userData.userId).then((res)=>{
			if(res.data > 0){
				uni.showToast({
					title: '账号已存在',
					icon: "none"
				});
				return false;
			}
			return true;
		});
	}
	
	/**
	 * @author: wuwenqiang
	 * @description: 校验账号和密码
	 * @date: 2024-01-20 00:17
	 */
	const useVerifyUserId = () => {
		if(loading)return;
		loading = true;
		useCheckUserId().finally(()=>loading = false);
	}
	
	/**
	 * @author: wuwenqiang
	 * @description: 注册
	 * @date: 2024-01-10 22:13
	 */
	const useRegister = async() => {
		if(!userData.userId){
			uni.showToast({
				title: '请输入账号',
				icon: "none"
			});
		}else if(!userData.password){
			uni.showToast({
				title: '请输入密码',
				icon: "none"
			});
		}else if(!confirmPassowrd.value){
			uni.showToast({
				title: '请输入确认密码',
				icon: "none"
			});
		}else if(!userData.username){
			uni.showToast({
				title: '请输入昵称',
				icon: "none"
			});
		}else if(userData.password !== confirmPassowrd.value){
			uni.showToast({
				title: '确认密码错误',
				icon: "none"
			});
		}else{
			if(loading)return;
			loading = true;
			const verify = await useCheckUserId();
			if(verify){
				await registerService({...userData}).then((res)=>{
					uni.setStorageSync('token',res.token);
					uni.redirectTo({
						url: `../pages/IndexPage`
					})
				})
			}
			loading = false;
		}
	}
</script>

<style lang="less" scoped>
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.page-wrapper{
		height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 @page-padding @page-padding;
		background-color: @page-background-color;
		.module-block{
			display: flex;
			flex-direction: column;
			align-items: center;
			.row{
				width: 100%;
				display: flex;
				align-items: center;
				margin-top: @page-padding;
				border-bottom: 1rpx solid @page-background-color;
				.title{
					width: 25%;
					.require{
						color: @warn-color;
					}
				}
				.input{
					flex: 1;
					padding-left: @small-margin;
					height: @input-height
				}
				/deep/.icon-calendar{
					display: none;
				}
			}
		}
		.login-btn{
			text-align: center;
			width: 100%;
			padding: @page-padding;
			box-sizing: border-box;
			border-radius: @big-border-radius;
			margin-top:  @page-padding;
			background-color: @warn-color;
			color: @module-background-color;
			display: inline-block;
		}
	}
</style>
