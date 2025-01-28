import { defineStore } from 'pinia'
import type {UserDataType} from '../types/index';
export const useStore = defineStore("myStore", {
    state:() => {
        return {
			userData:{} as UserDataType,
			token: '',
			platform:'',// 平台
			device:'',
			version:'',
		}
    },
    actions: {
		setUserData(userData:UserDataType){
			this.userData = userData;
		},

		setDeviceInfo(deviceInfo:any){
			this.platform = deviceInfo.platform;
			this.device = deviceInfo.deviceModel;
			this.version = deviceInfo.osVersion;
		},

		setToken(token:string){
			this.token = token
		}
    }
})
