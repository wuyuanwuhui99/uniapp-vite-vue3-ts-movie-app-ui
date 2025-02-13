<template>
	<view class="page-wrapper">
        <NavigatorTitleComponent title="忘记密码"/>
		<view class="page-body">
			<view class="module-block module-block-column">
				<view class="row">
					<view class="title">
						<text class="require">*</text>
						<text>邮箱地址</text>
					</view>
					<input class="input" v-model="email" placeholder="请输入您的保密邮箱"/>
				</view>
			</view>
			<view class="login-btn" @click="useSumbit">提交</view>
		</view>
		
	</view>
</template>

<script setup lang="ts">

    import { ref } from 'vue';
    import NavigatorTitleComponent from '../components/NavigatorTitleComponent.vue';
	import { sendEmailVertifyCodeService } from '../service';
	import { EMAIL_REG } from '../common/constant';
    const email = ref<string>("");
	let loading:boolean = false;

    /**
	 * @author: wuwenqiang
	 * @description: 注册
	 * @date: 2024-01-10 22:13
	 */
	const useSumbit = async() => {
		if(!email.value){
			uni.showToast({
				title: '请输入邮箱',
				icon: "none"
			});
		}else if(!EMAIL_REG.test(email.value)){
			uni.showToast({
				title: '请输入正确的邮箱地址',
				icon: "none"
			});
		}else{
			if(loading)return;
			loading = true;
			uni.showLoading()
            sendEmailVertifyCodeService(email.value).then((res)=>{
				uni.showToast({
					title: res.msg,
					icon: "none"
				});
				uni.navigateTo({
					url: `../pages/ResetPasswordPage?email=${encodeURIComponent(email.value)}`
				})
			}).finally(()=>{
				loading = false;
				uni.hideLoading();
			})
		}	
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
		background-color: @page-background-color;
		.page-body{
			flex: 1;
			padding: 0 @page-padding @page-padding;
			.module-block{
				align-items: center;
				.row{
					width: 100%;
					display: flex;
					align-items: center;
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
		
	}
</style>
