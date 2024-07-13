<template>
	<uni-popup ref="popup" class="popup-wrapper"  type="dialog">
		<view class="dialog-wrapper sex-dialog-wrapper">
				<view class="option-wrapper">
					<text class="option-item" :key="item + '' + index" v-for="item,index in options" @click="useCheck(item.value)">
						<slot :name="index">
							{{item.text}}
						</slot>
					</text>
				</view>			
			<view class="option-btn" @click="useCloseDialog">取消</view>
		</view>
	</uni-popup>
</template>

<script lang="ts" setup>
	import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue';
	import { defineProps, defineEmits, ref} from 'vue';
	
	const popup= ref<null | InstanceType<typeof uniPopup>>(null);
	const emits = defineEmits(['onCheck']);

	type OptionType = {
		text:string,
		value:string | number
	}

	const {options} = defineProps({
		options:{
			type:Array<OptionType>,
			reqiure:true,
			default:[]
		}
	});
	
	const useCheck = (value:string|number) => {
		popup.value?.close()
		emits('onCheck',value)
	}
	
	const useCloseDialog = () => {
		popup.value?.close()
	}
</script>

<style  lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
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
</style>