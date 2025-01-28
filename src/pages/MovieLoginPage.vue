<template>
	<view class="page-wrapper">
		<view class="module-block module-block-column">
			<image src="../../static/icon_logo.png" class="icon-logo"/>
			<view class="login-input-wrapper">
				<image src="../../static/icon_user_active.png" class="icon-login"/>
				<input v-model="userId" class="login-input" placeholder="请输入账号"/>
			</view>

			<view class="login-input-wrapper">
				<image src="../../static/icon_user_active.png" class="icon-login"/>
				<input type="password" v-model="password" class="login-input" placeholder="请输入密码"/>
			</view>

			<view class="login-btn" @click="useLogin">登录</view>

			<view class="register-btn" @click="useRegister">注册</view>
		</view>
	</view>
</template>

<script setup lang="ts">
	import { ref } from 'vue';
	import {loginService} from '../service';
	import { useStore } from '../stores/useStore';
	import {httpRequest} from '../utils/HttpUtils';

	const userId = ref<string>('');
	const password = ref<string>('123456');

	const store = useStore();
	userId.value = store.userData.userId || '吴时吴刻';
	uni.getStorage({key:userId.value}).then(res=>{
		password.value = res.data || '123456'
	});

	const useLogin = () => {
		if(!userId.value.trim()){
			uni.showToast({
				duration:2000,
				position:'center',
				title:'账号不能为空'
			})
		}else if(!password.value.trim()){
			uni.showToast({
				duration:2000,
				position:'center',
				title:'密码不能为空'
			})
		}else{
			loginService(userId.value,password.value).then((res)=>{
				uni.setStorage({key:userId.value,data:password.value});
				store.setUserData(res.data)
				store.setToken(res.token)
				uni.setStorage({key:'token',data:res.token});
				httpRequest.setToken(res.token);
				uni.navigateTo({url: '../pages/IndexPage'})
				uni.reLaunch({
					url: `../pages/IndexPage`
				})
				uni.showToast({
					duration:2000,
					position:'center',
					title:'登录成功'
				})
			}).catch(()=>{
				uni.showToast({
					duration:2000,
					position:'center',
					title:'账号或密码错误'
				})
			})
		}
	}

	const useRegister = () => {
		uni.navigateTo({
			url: `../pages/MovieRegisterPage`
		})
	}
</script>

<style lang="less" scoped>
	@import '../theme/color.less';
	@import '../theme/size.less';
	@import '../theme/style.less';
	.page-wrapper{
		height: 100vh;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding: 0 @page-padding @page-padding;
		background-color: @page-background-color;
		.module-block{
			height: 100%;
			align-items: center;
			.icon-logo{
				width: @big-avater;
				height: @big-avater;
				margin: @middle-icon-size 0;
			}
			.login-input-wrapper{
				margin-top: @page-padding;
				display: flex;
				align-items: center;
				width: 100%;
				border: 1rpx solid @disable-text-color;
				padding: @page-padding;
				box-sizing: border-box;
				border-radius: @big-border-radius;
				.icon-login{
					width: @small-icon-size;
					height: @middle-icon-size;
				}
				.login-input{
					flex: 1;
					margin-left: @page-padding;
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

			.register-btn{
				text-align: center;
				width: 100%;
				border: 1rpx solid @disable-text-color;
				padding: @page-padding;
				box-sizing: border-box;
				border-radius: @big-border-radius;
				margin-top:  @page-padding;
				display: inline-block;
				background-color: transparent;
			}
		}
	}
</style>
