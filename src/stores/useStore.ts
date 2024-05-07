import { defineStore } from 'pinia'
import type {UserDataType} from '../movie/types/index';
import type {MusicType} from '../music/types/index';
import {HOST} from '../config/constant';
export const useStore = defineStore("myStore", {
    state:() => { 
        return {
			userData:{} as UserDataType,
			token: '',
			musicItem: {} as MusicType,
			audio: new Audio() as HTMLAudioElement,
			isPlaying: false as boolean
		}
    },
    actions: {
		setUserData(userData:UserDataType){
			this.userData = userData;
		},
		
		setToken(token:string){
			this.token = token
		},
		
		setMusic(musicItem:MusicType,isPlaying:boolean = true){
			this.musicItem = musicItem;
			this.audio.src = HOST + musicItem.localPlayUrl;
			if(isPlaying){
				this.audio.play();
				this.isPlaying = true;
			}
			uni.setStorage({key:'music',data:JSON.stringify(musicItem)});
		},
		
		usePlay(isPlaying:boolean){
			this.isPlaying = isPlaying;
			this.audio[this.isPlaying ? 'play' : 'pause']()
		}
		
    }
})