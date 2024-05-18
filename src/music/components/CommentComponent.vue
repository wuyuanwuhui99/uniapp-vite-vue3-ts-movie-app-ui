<template>
    <view class="comment-wrapper">
        <view class="comment-item" :key="aItem.id"
            v-for="aItem in myCommentList">
            <image class="comment-avater" :src="HOST + aItem.avater" />
            <view class="comment-content-wrapper">
                <text class="comment-username">{{aItem.username}}</text>
                <text class="comment-text" @click="useComment(aItem,aItem)">{{aItem.content}}</text>
                <text class="comment-time">{{formatTime(aItem.createTime)}}</text>
                <view class="comment-item" :key="bItem.id" v-for="bItem in aItem.replyList">
                    <image class="comment-reply-avater" :src="HOST + bItem.avater" />
                    <view class="comment-content-wrapper">
                        <text class="comment-username">{{bItem.username}}▶{{bItem.replyUserName}}</text>
                        <text class="comment-text" @click="useComment(aItem,bItem)">{{bItem.content}}</text>
                        <text class="comment-time">{{formatTime(bItem.createTime)}}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="input-wrapper" v-if="showInput">
			<input v-model="inputValue" class="input" @blur="useBlur" :placeholder="placeholder" />
			<text class="btn-send" @click="useSend">发送</text>
		</view>
    </view>
</template>

<script setup lang="ts">
    import { defineProps, reactive, type PropType,onMounted,ref } from 'vue';
    import type { CommentType} from "../types";
    import { formatTime } from '../../utils/util';
    import { insertCommentService } from "../service";

    const { commentList,relationId } = defineProps({
		commentList: {
			type: Object as PropType<Array<CommentType>>,
			reqiure: true,
			default: {}
		},

        relationId:{
            type: Object as PropType<number>,
			reqiure: true,
			default: -1
        }
	});


    const myCommentList = reactive<Array<CommentType>>([]);
    const showInput = ref<boolean>(false);//是否显示评论 
    const placeholder = ref<string>("评论");// 评论框提示语
    const inputValue = ref<string>("");// 评论框的值
        
    let firstComment : CommentType | null;// 一级评论
	let replyComment : CommentType | null;// 二级评论，即回复的内容
    let timer : number = 0;// 输入框隐藏的定时器
    let loading : boolean = false;

    onMounted(()=>{
        myCommentList.push(...commentList);
    });

    /**
	 * @description: 隐藏弹窗的气泡
	 * @date: 2024-03-12 22:09
	 * @author wuwenqiang
	 */
	const useComment = (mFirstComment : CommentType | null, mReplyComment : CommentType | null) => {
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
			relationId,//影片id
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
				myCommentList.push(res.data);
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
</script>


<style scoped lang="less">
@import '../../theme/color.less';
@import '../../theme/size.less';
@import '../../theme/style.less';
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
}
</style>