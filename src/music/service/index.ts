import {httpRequest} from '../../utils/HttpUtils';
import type {MyAwesomeData} from '../../utils/HttpUtils';
import api from '../api';
import type * as types from '../types';

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
export const getMusicListByClassifyIdService = (classifyId:string,pageNum:number,pageSize:number):Promise<MyAwesomeData<Array<types.MusicType>>> => {
    return httpRequest.get<Array<types.MusicType>>(`${api.getMusicListByClassifyId}?classifyId=${classifyId}&pageNum=${pageNum}&pageSize=${pageSize}`);
}
