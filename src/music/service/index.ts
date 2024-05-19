import {httpRequest} from '../../utils/HttpUtils';
import type {MyAwesomeData} from '../../utils/HttpUtils';
import api from '../api';
import type * as types from '../types';
import type {CommentEnum} from '../../config/constant';

/**
 * @description: 获取推荐的音乐
 * @date: 2024-03-02 22:44
 * @author wuwenqiang
 */
export const getKeyWordMusicService = ():Promise<MyAwesomeData<types.MusicType>> => {
    return httpRequest.get<types.MusicType>(api.getKeywordMusic);
}

/**
 * @description: 获取模块分类
 * @date: 2024-03-02 22:44
 * @author wuwenqiang
 */
export const getMusicClassifyService = ():Promise<MyAwesomeData<Array<types.MusicClassifyType>>> => {
    return httpRequest.get<Array<types.MusicClassifyType>>(api.getMusicClassify);
}

/**
 * @description: 获取模块分类
 * @date: 2024-03-03 11:50
 * @author wuwenqiang
 */
export const getMusicListByClassifyIdService = (classifyId:number,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicType>>> => {
    return httpRequest.get<Array<types.MusicType>>(`${api.getMusicListByClassifyId}?classifyId=${classifyId}&pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 获取推荐的歌手
 * @date: 2024-03-03 18:23
 * @author wuwenqiang
 */
export const getSingerListService = (category:string,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicAuthorType>>> => {
    return httpRequest.get<Array<types.MusicAuthorType>>(`${api.getSingerList}?${category != '' && category != null ? "category=" + category + "&" : ""}pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 获取音乐圈数据
 * @date: 2024-03-03 18:23
 * @author wuwenqiang
 */
export const getCircleListByTypeService = (type:string,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.CircleType>>> => {
    return httpRequest.get<Array<types.CircleType>>(`${api.getCircleListByType}?type=${type}&pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 点赞
 * @date: 2024-03-12 23:25
 * @author wuwenqiang
 */
export const saveLikeService = (likeItem:types.LikeType):Promise<MyAwesomeData<types.LikeType>> => {
    return httpRequest.post<types.LikeType>(api.saveLike,likeItem);
}

/**
 * @description: 删除点赞
 * @date: 2024-03-12 23:25
 * @author wuwenqiang
 */
export const deleteLikeService = (relationId:number,type:string):Promise<MyAwesomeData<number>> => {
    return httpRequest.delete<number>(`${api.deleteLike}?relationId=${relationId}&type=${type}`);
}

/**
 * @description: 添加评论
 * @date: 2024-03-12 23:25
 * @author wuwenqiang
 */
export const insertCommentService = (commentItem:types.CommentType):Promise<MyAwesomeData<types.CommentType>> => {
    return httpRequest.post<types.CommentType>(api.insertComment,commentItem);
}

/**
 * @description: 获取用户歌单
 * @date: 2024-03-16 23:25
 * @author wuwenqiang
 */
export const getMusicPlayMenuService = ():Promise<MyAwesomeData<Array<types.MuiscPlayMenuType>>> => {
    return httpRequest.get<Array<types.MuiscPlayMenuType>>(api.getMusicPlayMenu);
}

/**
 * @description: 获取我关注的歌手
 * @date: 2024-03-17 22:12
 * @author wuwenqiang
 */
export const getMySingerService = (pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicAuthorType>>> => {
    return httpRequest.get<Array<types.MusicAuthorType>>(`${api.getMySinger}?pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 获取播放记录
 * @date: 2024-03-17 22:12
 * @author wuwenqiang
 */
export const getMusicRecordService = (pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicType>>> => {
    return httpRequest.get<Array<types.MusicType>>(`${api.getMusicRecord}?pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 添加收藏
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const insertMusicFavoriteService = (musicId:number):Promise<MyAwesomeData<number>> => {
    return httpRequest.post<number>(api.insertMusicFavorite + musicId);
}

/**
 * @description: 删除收藏
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const deleteMusicFavoriteService = (musicId:number):Promise<MyAwesomeData<number>> => {
    return httpRequest.delete<number>(api.deleteMusicFavorite + musicId);
}

/**
 * @description: 删除收藏
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const getTopCommentListService = (relationId:number,type:CommentEnum,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.CommentType>>> => {
    return httpRequest.get<Array<types.CommentType>>(`${api.getTopCommentList}?relationId=${relationId}&type=${type}&pageSize=${pageSize}&pageNum=${pageNum}`);
}


