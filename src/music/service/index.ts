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
