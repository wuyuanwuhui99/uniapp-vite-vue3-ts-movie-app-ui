<template>
	<scroll-view class="page-wrapper" @click="useHideMenu" scroll-y @scrolltolower="onScrolltolower"
		show-scrollbar="false">
		<view class="module-block" :key="item.id" v-for="item,index in circleList">
			<image class="user-avater" v-if="item.useravater" :src="HOST + item.useravater" />
			<image class="user-avater" v-else src="../../../static/default_avater.png" />
			<view class="content-wrapper">
				<text class="user-name">{{item.username}}</text>
				<text class="content">{{item.content}}</text>
				<view class="music-wrapper">
					<image class="music-cover" :src="HOST + item.musicCover" />
					<view class="music-info">
						<text class="music-name">{{item.musicSongName}} - {{item.musicAuthorName}}</text>
					</view>
					<image class="icon-music-play" src="../../../static/icon_music_play.png" />
				</view>
				<view class="operate-wrapper">
					<text class="create-time">{{formatTime(item.createTime)}}</text>
					<view class="popup-wrapper">
						<image class="icon-menu" src="../../../static/icon_music_menu.png"
							@click.stop="useMenu(index)" />
						<view class="popup-menu" v-if="circleIndex === index">
							<view class="popup-menu-item" @click.stop="useLike(item)">
								<image class="icon-popup-menu" src="../../../static/icon_like_white.png" />
								<text>{{(item.circleLikes||[]).find((dItem)=>dItem.userId === store.userData.userId) ? '取消赞' : '赞'}}</text>
							</view>
							<view class="popup-menu-item" @click="useComment(item,null,null)">
								<image class="icon-popup-menu" src="../../../static/icon_comment_white.png" />
								<text>评论</text>
							</view>
						</view>
					</view>

				</view>
				<view class="social-wrapper">
					<view class="like-wrapper">
						<image class="icon-like" src="../../../static/icon_music_like.png" />
						<template v-for="aItem,aIndex in item.circleLikes" :key="aItem.id">
							<text class="like-user">{{aItem.username}}</text>
							<text v-if="aIndex !== item.circleLikes.length - 1">、</text>
						</template>
					</view>
					<view class="comment-wrapper">
						<view class="comment-item" :key="bItem.id"
							v-for="bItem,bIndex in item.circleComments">
							<image class="comment-avater" :src="HOST + bItem.avater" />
							<view class="comment-content-wrapper">
								<text class="comment-username">{{bItem.username}}</text>
								<text class="comment-text"
									@click="useComment(item,bItem,bItem)">{{bItem.content}}</text>
								<text class="comment-time">{{formatTime(bItem.createTime)}}</text>
								<view class="comment-item" :key="cItem.id" v-for="cItem in bItem.replyList">
									<image class="comment-reply-avater" :src="HOST + cItem.avater" />
									<view class="comment-content-wrapper">
										<text class="comment-username">{{cItem.username}}▶{{cItem.replyUserName}}</text>
										<text class="comment-text"
											@click="useComment(item,bItem,cItem)">{{cItem.content}}</text>
										<text class="comment-time">{{formatTime(cItem.createTime)}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>
		<view class="input-wrapper" v-if="showInput">
			<input v-model="inputValue" class="input" @blur="useBlur" :placeholder="placeholder" />
			<text class="btn-send" @click="useSend">发送</text>
		</view>
		<text class="bottm" v-if="total">{{pageNum*pageSize >= total?"已经到底了":"正在加载更多"}}</text>
		<image @click="usePublishCircle" class="icon-add-circle" src="../../../static/icon_music_add.png"/>
	</scroll-view>
</template>

<script setup lang="ts">
	import { HOST } from "../../config/constant";
	import { getCircleListByTypeService, saveLikeService, deleteLikeService, insertCommentService } from "../service";
	import { reactive, ref } from "vue";
	import type { CircleType, CommentType, LikeType } from '../types';
	import { formatTime } from '../../utils/util';
	import { useStore } from '../../stores/useStore';

	const circleIndex = ref<number>(-1);// 朋友圈动态的id
	const circleList = reactive<Array<CircleType>>([]);
	const pageNum = ref<number>(1);
	const pageSize = 5;
	const total = ref<number>(0);
	const placeholder = ref<string>("评论");// 评论框提示语
	const showInput = ref<boolean>(false);//是否显示评论 
	const store = useStore();// 获取当前登录的用户账号
	const inputValue = ref<string>("");// 评论框的值

	let circleItem : CircleType;// 评论的id
	let loading : boolean = false;
	let firstComment : CommentType | null;// 一级评论
	let replyComment : CommentType | null;// 二级评论，即回复的内容
	let timer : number = 0;// 输入框隐藏的定时器

	/**
	 * @description: 获取朋友圈动态数据
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	getCircleListByTypeService("music", pageNum.value, pageSize).then((res) => {
		circleList.push(...res.data);
		total.value = res.total;
	})

	/**
	 * @description: 显示弹窗的气泡
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useMenu = (index : number) => {
		circleIndex.value = index;
	}

	/**
	 * @description: 点赞
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useLike = (circleItem : CircleType) => {
		if (loading) return;
		loading = true;
		const index : number = circleItem.circleLikes.findIndex((dItem) => dItem.userId === store.userData.userId);
		if (index !== -1) {// 取消点赞
			deleteLikeService(circleItem.id, "music_circle").then((res) => {
				if (res.data > 0) {
					circleItem.circleLikes.splice(index, 1)
				}
			}).finally(() => {
				loading = false;
				circleIndex.value = -1;
			})
		} else {// 新增点赞
			const likeItem : LikeType = {
				type: "music_circle",
				relationId: circleItem.id
			}
			saveLikeService(likeItem).then((res) => {
				if (res.data) {
					circleItem.circleLikes.push(res.data)
				}
			}).finally(() => {
				loading = false;
				circleIndex.value = -1
			});
		}

	}

	/**
	 * @description: 隐藏弹窗的气泡
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useHideMenu = () => {
		circleIndex.value = -1;
	}

	/**
	 * @description: 隐藏弹窗的气泡
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useComment = (mCircleItem : CircleType, mFirstComment : CommentType | null, mReplyComment : CommentType | null) => {
		circleItem = mCircleItem;// 朋友圈id
		firstComment = mFirstComment;// 一级评论
		replyComment = mReplyComment;// 二级评论（回复）
		showInput.value = true;
		if (mReplyComment) {
			placeholder.value = `回复${mReplyComment.username}`;
		} else if (firstComment) {
			placeholder.value = `回复${firstComment.username}`;
		} else {
			placeholder.value = "评论";
		}
	}

	/**
	 * @description: 发送评论
	 * @date: 2024-03-13 21:17
	 * @author wuwenqiang
	 */
	const useSend = () => {
		// 先清除定时器，避免出发失去焦点事件导致发送按钮隐藏
		// 点击按钮式，先触发输入失去焦点事件，在触发点击事件
		clearTimeout(timer);
		if (!inputValue.value || loading) {
			return;
		}
		loading = true;
		const commentItem : CommentType = {
			id: 0,//主键
			content: inputValue.value,//评论内容
			parentId: 0,//父节点id
			topId: 0,//顶级节点id
			type: "music_circle",// 类型
			relationId: 0,//影片id
			createTime: "",//创建时间
			updateTime: "",//更新时间
			replyCount: 0,//回复数量
			userId: "",//用户id
			username: "",//用户名
			avater: "",//用户头像
			replyUserId: "",//被回复者id
			replyUserName: "",//被回复者名称
			showCommentCount: "",//显示的回复数量
			replyPageNum: 0,
			replyList: []
		}
		commentItem.relationId = circleItem.id;
		if (firstComment) {// 获取一级评论的id
			commentItem.topId = firstComment.id;
		}
		if (replyComment) {// 获取回复的id
			commentItem.parentId = replyComment.id;
		}
		insertCommentService(commentItem).then((res) => {
			inputValue.value = "";
			showInput.value = false;
			if(firstComment){// 回复的评论，二级评论
				firstComment.replyList.push(res.data)
			}else{// 一级评论
				circleItem.circleComments.push(res.data);
			}
			firstComment = replyComment = null;// 清空评论和回复
			placeholder.value = "评论";
		}).finally(() => {
			loading = false;
		});
	}

	/**
	 * @description: 输入框失去焦点后隐藏
	 * @date: 2024-03-13 21:17
	 * @author wuwenqiang
	 */
	const useBlur = () => {
		if (timer) clearInterval(timer);
		// 点击发送时失去焦点事件要比点击事件先执行，可能导致发送按钮隐藏而点击不到，
		// 在点击发送按钮式清除定时器，不要隐藏输入框
		timer = setTimeout(() => {
			showInput.value = false;
		}, 100)
	}

	const onScrolltolower = () => {
		if (pageNum.value * pageSize >= total.value) return;
		pageNum.value++;
		getCircleListByTypeService("music", pageNum.value, pageSize).then((res) => {
			circleList.push(...res.data);
		});
	}
	
	const usePublishCircle = ()=>{
		uni.navigateTo({
			url: `../pages/MusicCirClePublishPage`
		})
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

		.module-block {
			display: flex;

			.user-avater {
				width: @middle-avater;
				height: @middle-avater;
				border-radius: 50%;
				margin-right: @page-padding;
			}

			.user-name {
				color: @blue-color;
				font-weight: bold;
			}

			.content-wrapper {
				display: flex;
				flex: 1;
				flex-direction: column;

				.content {
					padding: @page-padding 0;
				}

				.music-wrapper {
					display: flex;
					height: @middle-avater;
					background: @page-background-color;
					border-radius: @middle-avater;
					align-items: center;

					.music-cover {
						width: @middle-avater;
						height: @middle-avater;
						border-radius: 50%;
					}

					.music-info {
						display: flex;
						margin-left: @page-padding;
						flex: 1;

						.music-author {
							color: @disable-text-color;
						}
					}

					.icon-music-play {
						width: @small-icon-size;
						height: @small-icon-size;
						margin-right: @page-padding;
					}
				}

				.operate-wrapper {
					display: flex;
					align-items: center;
					margin-top: @page-padding;

					.create-time {
						flex: 1;
						color: @disable-text-color;
					}

					.popup-wrapper {
						width: @small-icon-size;
						height: @small-icon-size;
						position: relative;

						.icon-menu {
							width: @small-icon-size;
							height: @small-icon-size;
						}

						.popup-menu {
							position: absolute;
							background: @sub-title-color;
							color: @white-background-color;
							width: @popup-menu-width;
							display: flex;
							left: @popup-menu-left;
							height: @popup-menu-height;
							top: @popup-menu-top;
							border-radius: @module-border-radius;

							.popup-menu-item {
								display: flex;
								flex: 1;
								justify-content: center;
								align-items: center;
								height: @popup-menu-height;

								.icon-popup-menu {
									margin-right: @small-margin;
									width: @small-icon-size;
									height: @small-icon-size;
								}
							}
						}
					}

				}

				.social-wrapper {
					background: @page-background-color;
					padding: @page-padding;
					border-radius: @module-border-radius;
					margin-top: @page-padding;

					.like-wrapper {
						display: flex;
						flex-wrap: wrap;

						.icon-like {
							width: @small-icon-size;
							height: @small-icon-size;
							margin-right: @page-padding;
						}

						.like-user {
							color: @blue-color;
						}
					}

					.comment-wrapper {
						.comment-item {
							display: flex;
							margin-top: @page-padding;

							.comment-avater {
								width: @middle-avater;
								height: @middle-avater;
								border-radius: 50%;
								margin-right: @page-padding;
							}

							.comment-reply-avater {
								width: @small-avater;
								height: @small-avater;
								border-radius: 50%;
								margin-right: @page-padding;
							}

							.comment-content-wrapper {
								flex: 1;
								display: flex;
								flex-direction: column;

								.comment-text {
									padding: @small-margin 0;
								}

								.comment-username,
								.comment-time {
									color: @sub-title-color;
								}
							}
						}

					}
				}

			}
		}

		.input-wrapper {
			width: 100%;
			position: fixed;
			bottom: 0;
			left: 0;
			display: flex;
			z-index: 2;
			padding: @page-padding;
			box-sizing: border-box;
			background: @white-background-color;
			align-items: center;
			justify-content: center;

			.input {
				flex: 1;
				background: @page-background-color;
				height: @input-height;
				border-radius: @input-height;
				margin-right: @page-padding;
				padding-left: @page-padding;
			}

			.btn-send {
				background: @line-color;
				color: @white-background-color ;
				height: @input-height;
				display: flex;
				align-items: center;
				padding-left: calc(@page-padding * 2);
				padding-right: calc(@page-padding * 2);
				border-radius: @module-border-radius;
			}
		}

		.bottm {
			padding: @page-padding;
			display: inline-block;
			width: 100%;
			text-align: center;
		}
		.icon-add-circle{
			width: @middle-avater;
			height: @middle-avater;
			position: fixed;
			right: @page-padding;
			bottom:15%;
			opacity: 0.2;
		}
	}
</style>