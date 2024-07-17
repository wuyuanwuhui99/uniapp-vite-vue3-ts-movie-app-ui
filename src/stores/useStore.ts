import { defineStore } from 'pinia'
import type {UserDataType} from '../movie/types/index';
import type {MusicType} from '../music/types/index';
import { HOST, MUSIC_STORAGE_KEY, MUSIC_LIST_STORAGE_KEY, LOOP_STORAGE_KEY} from '../common/constant';
import {LoopModeEnum} from '../common/enum';
import {insertMusicRecordService} from '../music/service';
export const useStore = defineStore("myStore", {
    state:() => {
        return {
			userData:{} as UserDataType,
			token: '',
			musicItem: {} as MusicType,
			audio: uni.createInnerAudioContext(),
			isPlaying: false,
			playList: [] as  Array<MusicType>,// 待播放的歌曲
			musicList: [] as Array<MusicType>,
			classifyName: '' as string,// 播放的类型
			playIndex: -1 as number,// 播放的下标
			total: 0,
			loop: LoopModeEnum.ORDER,// 默认顺序播放
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
			this.removePlayMusic();
			uni.setStorage({key:MUSIC_STORAGE_KEY,data:JSON.stringify(musicItem)});
			isPlaying && insertMusicRecordService(musicItem);
		},


		/**
		 * @description: 设置播放的歌曲列表
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		setMusicList(musicList:Array<MusicType>){
			this.musicList = musicList;
			this.playList = [...musicList];
			uni.setStorage({key:MUSIC_LIST_STORAGE_KEY,data:JSON.stringify(musicList)});
			this.playIndex = this.musicList.findIndex(item => item.id === this.musicItem.id);
			this.removePlayMusic()
		},

		resetPlayList(){
			this.playList = [...this.musicList];
		},

		/**
		 * @description: 从待播放歌曲中移除一首歌
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		removePlayMusic(){
			const index = this.playList.findIndex(item => item.id === this.musicItem.id);
			if(index !== -1)this.playList.splice(index,1);
		},

		/**
		 * @description: 播放或者暂停音乐
		 * @date: 2024-05-12 11:45
		 * @author wuwenqiang
		 */
		usePlay(isPlaying:boolean){
			this.isPlaying = isPlaying;
			this.audio[this.isPlaying ? 'play' : 'pause']()
		},

		/**
		 * @description: 切换歌曲
		 * @date: 2024-05-12 11:45
		 * @author wuwenqiang
		 */
		setMusicPlayIndex(playIndex:number){
			this.playIndex = playIndex;
			this.setMusic(this.musicList[playIndex]);
		},

		/**
		 * @description: 切换歌曲
		 * @date: 2024-05-17 23:09
		 * @author wuwenqiang
		 */
		setLoop(loop:LoopModeEnum){
			uni.setStorage({key:LOOP_STORAGE_KEY,data:loop});
			this.loop = loop;
		}
    }
})
