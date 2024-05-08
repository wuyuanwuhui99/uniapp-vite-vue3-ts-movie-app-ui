import { defineStore } from 'pinia'
import type {UserDataType} from '../movie/types/index';
import type {MusicType,MusicClassifyType} from '../music/types/index';
import {HOST} from '../config/constant';
export const useStore = defineStore("myStore", {
    state:() => { 
        return {
			userData:{} as UserDataType,
			token: '',
			musicItem: {} as MusicType,
			audio: new Audio() as HTMLAudioElement,
			isPlaying: false as boolean,
			musicList: [] as Array<MusicType>,
			musicClassify: {} as MusicClassifyType,// 播放的类型
			playIndex: -1 as number// 播放的下标
		}
    },
    actions: {
		setUserData(userData:UserDataType){
			this.userData = userData;
		},
		
		setToken(token:string){
			this.token = token
		},
		
		/**
		 * @description: 播放音乐
		 * @date: 2024-05-08 21:51
		 * @author wuwenqiang
		 */
		setMusic(musicItem:MusicType,isPlaying:boolean = true){
			this.musicItem = musicItem;
			this.audio.src = HOST + musicItem.localPlayUrl;
			if(isPlaying){
				this.audio.play();
				this.isPlaying = true;
			}
			this.playIndex = this.musicList.findIndex((item)=>{item.id === this.musicItem.id})
			uni.setStorage({key:'music',data:JSON.stringify(musicItem)});
		},
		
		/**
		 * @description: 播放音乐列表
		 * @date: 2024-05-08 21:51
		 * @author wuwenqiang
		 */
		setMusicList(musicList:Array<MusicType>,musicClassify:MusicClassifyType){
			this.musicList = musicList;
			this.musicClassify = musicClassify;
			this.playIndex = this.musicList.findIndex((item)=>{item.id === this.musicItem.id})
			uni.setStorage({key:'musicClassify',data:JSON.stringify(musicClassify)});
		},
		
		/**
		 * @description: 设置播放音乐的类型
		 * @date: 2024-05-08 21:51
		 * @author wuwenqiang
		 */
		setMusicClassify(musicClassify:MusicClassifyType){
			this.musicClassify = musicClassify;
			uni.setStorage({
				key: 'musicClassify',
				data: JSON.stringify(musicClassify)
			})
		},
		
		usePlay(isPlaying:boolean){
			this.isPlaying = isPlaying;
			this.audio[this.isPlaying ? 'play' : 'pause']()
		}
		
    }
})