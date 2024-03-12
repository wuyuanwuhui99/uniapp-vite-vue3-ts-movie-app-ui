<template>
	<scroll-view class="page-wrapper" @click="useHideMenu" scroll-y @scrolltolower="onScrolltolower" show-scrollbar="false">
		<view class="module-block" :key="item.id" v-for="item in circleList">
			<image class="user-avater" v-if="item.useravater" :src="HOST + item.useravater"/>
			<image class="user-avater" v-else src="../../../static/default_avater.png"/>
			<view class="content-wrapper">
				<text class="user-name">{{item.username}}</text>
				<text class="content">{{item.content}}</text>
				<view class="music-wrapper">
					<image class="music-cover" :src="HOST + item.musicCover"/>
					<view class="music-info">
						<text class="music-name">{{item.musicSongName}} - {{item.musicAuthorName}}</text>
					</view>
					<image class="icon-music-play" src="../../../static/icon_music_play.png"/>
				</view>
				<view class="operate-wrapper">
					<text class="create-time">{{formatTime(item.createTime)}}</text>
					<view class="popup-wrapper">
						<image class="icon-menu" src="../../../static/icon_music_menu.png" @click.stop="useMenu(item)"/>
						<view class="popup-menu" v-if="circleId === item.id">
							<view class="popup-menu-item" @click.stop="useLike(item)">
								<image class="icon-popup-menu" src="../../../static/icon_like_white.png"/>
								<text>{{item.circleLikes.find((dItem)=>dItem.userId === store.userData.userId) ? '取消赞' : '赞'}}</text>
							</view>
							<view class="popup-menu-item">
								<image class="icon-popup-menu" src="../../../static/icon_comment_white.png"/>
								<text>评论</text>
							</view>
						</view>
					</view>
					
				</view>
				<view class="social-wrapper">
					<view class="like-wrapper">
						<image class="icon-like" src="../../../static/icon_music_like.png"/>
						<template v-for="aItem,aIndex in item.circleLikes" :key="aItem.id">
							<text class="like-user">{{aItem.username}}</text>
							<text v-if="aIndex !== item.circleLikes.length - 1">、</text>
						</template>
					</view>
					<view class="comment-wrapper">
						<view class="comment-item" :key="bItem.id" v-for="bItem,bIndex in item.circleComments.filter((item)=>!item.parentId)">
							<image class="comment-avater" :src="HOST + bItem.avater"/>
							<view class="comment-content-wrapper">
								<text class="comment-username">{{bItem.username}}</text>
								<text class="comment-text">{{bItem.content}}</text>
								<text class="comment-time">{{formatTime(bItem.createTime)}}</text>
								<view class="comment-item" :key="cItem.id" v-for="cItem in item.circleComments.filter((item)=>item.parentId && item.parentId === bItem.id)">
									<image class="comment-reply-avater" :src="HOST + cItem.avater"/>
									<view class="comment-content-wrapper" >
										<text class="comment-username">{{cItem.username}}▶{{cItem.replyUserName}}</text>
										<text class="comment-text">{{cItem.content}}</text>
										<text class="comment-time">{{formatTime(cItem.createTime)}}</text>
									</view>	
								</view>
							</view>
						</view>
					</view>
					
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script setup lang="ts">
	import {HOST} from "../../config/constant";
	import {getCircleListByTypeService,saveLikeService,deleteLikeService} from "../service";
	import {reactive,ref} from "vue";
	import type {CircleType,LikeType} from '../types'; 
	import {formatTime} from '../../utils/util';
	import { useMovieStore } from '../../stores/useMovieStore';
	
	const circleId = ref<number>();// 朋友圈动态的id
	const circleList = reactive<Array<CircleType>>([]);
	const pageNum = ref<number>(1);
	const pageSize = 5;
	const store = useMovieStore();
	let loading = false;
	
	/**
	 * @description: 获取朋友圈动态数据
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	getCircleListByTypeService("music",pageNum.value,pageSize).then((res)=>{
		circleList.push(...res.data);
	})
	
	/**
	 * @description: 显示弹窗的气泡
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useMenu = (circleItem:CircleType) => {
		console.log(circleItem)
		circleId.value = circleItem.id;
	}
	
	/**
	 * @description: 点赞
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useLike = (circleItem:CircleType)=>{
		if(loading)return;
		loading = true;
		const index:number = circleItem.circleLikes.findIndex((dItem)=>dItem.userId === store.userData.userId);
		if(index !== -1){
			deleteLikeService(circleItem.id,"music_circle").then((res)=>{
				if(res.data > 0){
					circleItem.circleLikes.splice(index,1)
				}
			}).finally(()=>{
				loading = false;
				circleId.value = 0;
			})
		}else{
			const likeItem:LikeType = {
				type:"music_circle",
				relationId:circleItem.id
			}
			saveLikeService(likeItem).then((res)=>{
				if(res.data){
					circleItem.circleLikes.push(res.data)
				}
			}).finally(()=>{
				loading = false;
				circleId.value = 0
			});
		}
		
	}
	
	/**
	 * @description: 隐藏弹窗的气泡
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useHideMenu = ()=>{
		circleId.value = 0;
	}
	
	const onScrolltolower = () => {
		
	}
</script>

<style lang="less">
	@import '../../theme/color.less';
	@import '../../theme/size.less';
	@import '../../theme/style.less';
	.page-wrapper {
		width: 100%;
		height: 100%;

		/deep/.uni-scroll-view-content {
			&::-webkit-scrollbar {
				display: none;
			}
		}
		.module-block{
			display: flex;
			.user-avater{
				width: @middle-avater;
				height: @middle-avater;
				border-radius: 50%;
				margin-right: @page-padding;
			}
			.user-name{
				 color: @blue-color;
				 font-weight: bold;
			}
			.content-wrapper{
				display: flex;
				flex: 1;
				flex-direction: column;
				.content{
					padding: @page-padding 0;
				}
				.music-wrapper{
					display: flex;
					height: @middle-avater;
					background: @page-background-color;
					border-radius: @middle-avater;
					align-items: center;
					.music-cover{
						width: @middle-avater;
						height: @middle-avater;
						border-radius: 50%;
					}
					.music-info{
						display: flex;
						margin-left: @page-padding;
						flex: 1;
						.music-author{
							color: @disable-text-color;
						}
					}
					.icon-music-play{
						width: @small-icon-size;
						height: @small-icon-size;
						margin-right: @page-padding;
					}
				}
				.operate-wrapper{
					display: flex;
					align-items: center;
					margin-top: @page-padding;
					.create-time{
						flex: 1;
						color: @disable-text-color;
					}
					.popup-wrapper{
						width: @small-icon-size;
						height: @small-icon-size;
						position: relative;
						.icon-menu{
							width: @small-icon-size;
							height: @small-icon-size;
						}
						.popup-menu{
							position: absolute;
							background: @sub-title-color;
							color: @white-background-color;
							width: @popup-menu-width;
							display: flex;
							left: @popup-menu-left;
							height: @popup-menu-height;
							top: @popup-menu-top;
							border-radius: @module-border-radius;
							.popup-menu-item{
								display: flex;
								flex: 1;
								justify-content: center;
								align-items: center;
								height: @popup-menu-height;
								.icon-popup-menu{
									margin-right: @small-margin;
									width: @small-icon-size;
									height: @small-icon-size;
								}
							}
						}
					}
					
				}
				.social-wrapper{
					background: @page-background-color;
					padding: @page-padding;
					border-radius: @module-border-radius;
					margin-top: @page-padding;
					.like-wrapper{
						display: flex;
						flex-wrap: wrap;
						.icon-like{
							width: @small-icon-size;
							height: @small-icon-size;
							margin-right: @page-padding;
						}
						.like-user{
							color: @blue-color;
						}
					}
					.comment-wrapper{
						.comment-item{
							display: flex;
							margin-top: @page-padding;
							.comment-avater{
								width: @middle-avater;
								height: @middle-avater;
								border-radius: 50%;
								margin-right:@page-padding;
							}
							.comment-reply-avater{
								width: @small-avater;
								height: @small-avater;
								border-radius: 50%;
								margin-right:@page-padding;
							}
							.comment-content-wrapper{
								flex: 1;
								display: flex;
								flex-direction: column; 
								.comment-text{
									padding: @small-margin 0;
								}
								.comment-username,.comment-time{
									color: @sub-title-color;
								}
							}
						}
						
					}
				}
				
			}
		}
		
	}
</style>
