export const formatTime = (data:string) => {
  // 获取当前时间对象
  const now:Date = new Date();
  const date:Date = new Date(data);
  // 相差多少分钟
  const minutes:number = Math.floor(now.getTime() - date.getTime())/1000/60;
  if(minutes < 1){
    return '刚刚';
  }else if(minutes >= 1 && minutes < 60){
    return minutes + '分钟前';
  }else if(minutes >= 60 && minutes < 60*24){
    return Math.floor(minutes/60) + '小时前';
  }else if(minutes > 60 * 24 && minutes <  60 * 24 *30){
    return Math.floor(minutes/60/24) + '天前';
  }else if(minutes > 60 * 24 * 30 && minutes <  60 * 24 *30 *12){
    return Math.floor(minutes/60 / 24 / 30)+ '个月前';
  }else{
    return data;
  }
}