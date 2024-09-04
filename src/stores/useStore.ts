import { defineStore } from 'pinia'
import type {UserDataType} from '../movie/types/index';
import type {MusicType,MusicRecordType} from '../music/types/index';
import { HOST, MUSIC_STORAGE_KEY, MUSIC_LIST_STORAGE_KEY, LOOP_STORAGE_KEY,MUSIC_CLASSIFY_NAME_STORAGE_KEY} from '../common/constant';
import {LoopModeEnum} from '../common/enum';
import {insertMusicRecordService} from '../music/service';
export const useStore = defineStore("myStore", {
    state:() => {
        return {
			userData:{} as UserDataType,
			token: '',
			platform:'',// 平台
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

		setPlatform(platform:string){
			this.platform = platform;
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
			const musicRecord:MusicRecordType = {
				musicId:musicItem.id,
				platform:this.platform
			}
			isPlaying && insertMusicRecordService(musicRecord);
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
			const musicRecord:MusicRecordType = {
				musicId:musicItem.id,
				platform:this.platform
			}	
			insertMusicRecordService(musicRecord);
		},


		/**
		 * @description: 设置播放的歌曲列表
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		setMusicList(musicList:Array<MusicType>){
			this.musicList = musicList;
			this.unPlayMusicList = [...musicList];
			uni.setStorage({key:MUSIC_LIST_STORAGE_KEY,data:JSON.stringify(musicList)});
			this.playIndex = this.musicList.findIndex(item => item.id === this.musicItem.id);
			this.removePlayMusic()
		},

		resetplayMusicList(){
			this.unPlayMusicList = [...this.musicList];
		},

		/**
		 * @description: 从待播放歌曲中移除一首歌
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		removePlayMusic(){
			const index = this.unPlayMusicList.findIndex(item => item.id === this.musicItem.id);
			if(index !== -1)this.unPlayMusicList.splice(index,1);
		},

		/**
		 * @description: 随机切换上一首
		 * @date: 2024-06-12 23:38
		 * @author wuwenqiang
		 */
		randomTabPrev(){
			let musicItem:MusicType = this.playMusicList[this.playMusicList.length - 1];
			if(musicItem){
				this.playMusicList.pop()
			}else{
				musicItem = this.musicList[this.musicList.length - 1];
			}
			this.setMusic(musicItem,true);
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
