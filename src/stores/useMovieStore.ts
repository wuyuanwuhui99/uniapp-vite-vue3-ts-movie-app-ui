import { defineStore } from 'pinia'
import type {UserDataType} from '../movie/type/index';

export const useMovieStore = defineStore("myStore", {
    state:() => { 
        return {
			userData<UserDataType>:null,
			token<string>: ''
		}
    },
    actions: {
		setUserData(userData:UserDataType){
			this.userData = userData;
		},
		
		setToken(token:string){
			this.token = token
		}
    }
})