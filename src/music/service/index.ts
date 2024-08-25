import {httpRequest} from '../../utils/HttpUtils';
import type {MyAwesomeData} from '../../utils/HttpUtils';
import api from '../api';
import type * as types from '../types';
import type {CommentEnum,CircleEnum} from '../../common/enum';

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
export const getMusicAuthorListService = (categoryId:number,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicAuthorType>>> => {
    return httpRequest.get<Array<types.MusicAuthorType>>(`${api.getMusicAuthorList}?categoryId=${categoryId}&pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 获取音乐圈数据
 * @date: 2024-03-03 18:23
 * @author wuwenqiang
 */
export const getCircleListByTypeService = (type:CircleEnum,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.CircleType>>> => {
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
export const getMyLikeMusicAuthorService = (pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicAuthorType>>> => {
    return httpRequest.get<Array<types.MusicAuthorType>>(`${api.getMyLikeMusicAuthor}?pageNum=${pageNum}&pageSize=${pageSize}`);
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
 * @description: 插入播放记录
 * @date: 2024-03-17 22:12
 * @author wuwenqiang
 */
export const insertMusicRecordService = (musicModel:types.MusicType):Promise<MyAwesomeData<number>> => {
    return httpRequest.post<number>(api.insertMusicRecord,musicModel);
}

/**
 * @description: 添加收藏
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const insertMusicLikeService = (musicId:number):Promise<MyAwesomeData<number>> => {
    return httpRequest.post<number>(api.insertMusicLike + musicId);
}

/**
 * @description: 删除收藏
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const deleteMusicLikeService = (musicId:number):Promise<MyAwesomeData<number>> => {
    return httpRequest.delete<number>(api.deleteMusicLike + musicId);
}

/**
 * @description: 获取一级评论
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const getTopCommentListService = (relationId:number,type:CommentEnum,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.CommentType>>> => {
    return httpRequest.get<Array<types.CommentType>>(`${api.getTopCommentList}?relationId=${relationId}&type=${type}&pageSize=${pageSize}&pageNum=${pageNum}`);
}

/**
 * @description: 删除收藏
 * @date: 2024-05-12 12:21
 * @author wuwenqiang
 */
export const getCommentCountService = (relationId:number,type:CommentEnum):Promise<MyAwesomeData<number>> => {
    return httpRequest.get<number>(`${api.getCommentCount}?relationId=${relationId}&type=${type}`);
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
 * @description: 查询音乐是否已经收藏
 * @date: 2024-06-25 22:02
 * @author wuwenqiang
 */
export const isMusicFavoriteService = (musicId:number):Promise<MyAwesomeData<number>> => {
    return httpRequest.get<number>(api.isMusicFavorite + musicId);
}

/**
 * @description: 查询音乐是否已经收藏
 * @date: 2024-06-25 22:02
 * @author wuwenqiang
 */
export const getFavoriteDirectoryService = (musicId:number):Promise<MyAwesomeData<Array<types.FavoriteDirectoryType>>> => {
    return httpRequest.get<Array<types.FavoriteDirectoryType>>(`${api.getFavoriteDirectory}?musicId=${musicId}`);
}

/**
 * @description: 添加音乐收藏
 * @date: 2024-06-29 11:26
 * @author wuwenqiang
 */
export const insertMusicFavoriteService = (musicId:number,favoriteList:Array<types.FavoriteMusicType>):Promise<MyAwesomeData<number>> => {
    return httpRequest.post<number>(api.insertMusicFavorite+ musicId,favoriteList);
}

/**
 * @description: 添加音乐收藏
 * @date: 2024-06-29 11:26
 * @author wuwenqiang
 */
export const insertFavoriteDirectoryService = (favoriteDirectory:types.FavoriteDirectoryType):Promise<MyAwesomeData<types.FavoriteDirectoryType>> => {
    return httpRequest.post<types.FavoriteDirectoryType>(api.insertFavoriteDirectory,favoriteDirectory);
}

/**
 * @description: 音乐搜索
 * @date: 2024-07-08 23:05
 * @author wuwenqiang
 */
export const searchMusicService = (keyword:string,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicType>>> => {
    return httpRequest.get<Array<types.MusicType>>(`${api.searchMusic}?keyword=${keyword}&pageNum=${pageNum}&pageSize=${pageSize}`);
}

/**
 * @description: 插入一条说说
 * @date: 2024-07-08 23:05
 * @author wuwenqiang
 */
export const saveCircleService = (circle:types.CircleType):Promise<MyAwesomeData<Array<number>>> => {
    return httpRequest.post<Array<number>>(api.insertCircle,circle);
}

/**
 * @description: 根据收藏夹id查询音乐列表
 * @date: 2024-07-16 23:39
 * @author wuwenqiang
 */
export const getMusicListByFavoriteIdService = (favoriteId:number,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicType>>> => {
    return httpRequest.get<Array<types.MusicType>>(`${api.getMusicListByFavoriteId}?favoriteId=${favoriteId}&pageNum=${pageNum}&pageSize=${pageSize}`);
  }