export const zerofull=(value:number):string|number=>{
    return value < 9 ? "0"+value:value
}

export const formatTime=(value:any):string=>{
    var date =new Date(value);
    var nowDate = new Date()
    let diff = Math.ceil((nowDate.getTime()-date.getTime())/1000);
    if(diff < 60){
        return "刚刚"
    }else if(diff < 60*60){
        return Math.ceil(diff/60) + "分前"
    }else if(diff < 60*60*24){
        return Math.ceil(diff/(60*60))+"小时前"
    }else if(diff < 60*60*24*30){
        return Math.ceil(diff/(60*60*24))+"天前"
    }else if(diff < 60*60*24*30*12){
        return Math.ceil(diff/(60*60*24*30))+"个月前"
    }
    const year = zerofull(date.getFullYear());
    const month = zerofull(date.getMonth()+1);
    const dates = zerofull(date.getDate());
    const hour = zerofull(date.getHours());
    const minutes = zerofull(date.getMinutes());
    const seconds = zerofull(date.getSeconds());
    return `${year}-${month}-${dates} ${hour}:${minutes}:${seconds}`
};

export const formatSecond=(value:number,showHour:boolean = false):string => {
	if(showHour){
		return `${zerofull(Math.floor(value / (60 * 60)))}:${zerofull(Math.floor(value % (60 * 60) / 60))}:${zerofull(Math.floor(value % (60 * 60) % 60))}`
	}else{
		return `${zerofull(Math.floor(value / 60))}:${zerofull(Math.floor(value % 60))}`
	}
};