import { defineStore } from 'pinia'
import type {UserDataType} from '../movie/types/index';
import type {MusicType} from '../music/types/index';
import { HOST, MUSIC_STORAGE_KEY, MUSIC_LIST_STORAGE_KEY, LOOP_STORAGE_KEY,MUSIC_CLASSIFY_NAME_STORAGE_KEY} from '../common/constant';
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
			playMusicList: [] as  Array<MusicType>,// 已播放的歌曲
			musicList: [] as Array<MusicType>,// 所有歌曲
			unPlayMusicList:[] as Array<MusicType>,// 未播放歌曲
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
		 * @description: 
		 * @date: 2024-05-08 21:51
		 * @author wuwenqiang
		 */
		setClassifyMusic(musicList:Array<MusicType>,musicItem:MusicType,index:number,classifyName:string){
			this.musicItem = musicList[index];
			this.musicList = musicList;
			this.classifyName = classifyName;
			this.playMusicList = [];
			this.unPlayMusicList =  [...musicList];
			this.isPlaying = true;
			uni.setStorage({key:MUSIC_STORAGE_KEY,data:JSON.stringify(musicItem)});
			uni.setStorage({key:MUSIC_LIST_STORAGE_KEY,data:JSON.stringify(musicList)});
			uni.setStorage({key:MUSIC_CLASSIFY_NAME_STORAGE_KEY,data:JSON.stringify(classifyName)});
			this.audio.src = HOST + musicItem.localPlayUrl;
			this.audio.play();			
			insertMusicRecordService(musicItem);
		},


		/**
		 * @description: 设置播放的歌曲列表
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		setMusicList(musicList:Array<MusicType>){
			this.musicList = musicList;
			this.playMusicList = [...musicList];
			uni.setStorage({key:MUSIC_LIST_STORAGE_KEY,data:JSON.stringify(musicList)});
			this.playIndex = this.musicList.findIndex(item => item.id === this.musicItem.id);
			this.removePlayMusic()
		},

		resetplayMusicList(){
			this.playMusicList = [...this.musicList];
		},

		/**
		 * @description: 从待播放歌曲中移除一首歌
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		removePlayMusic(){
			const index = this.playMusicList.findIndex(item => item.id === this.musicItem.id);
			if(index !== -1)this.playMusicList.splice(index,1);
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
			if(this.musicList[playIndex])this.setMusic(this.musicList[playIndex]);
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
