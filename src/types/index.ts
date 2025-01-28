export type UserDataType = {
    userId:     string;
    createDate?: string;
    updateDate?: string;
    username:   string;
    telephone:  string;
    email:      string;
    avater?:     string;
    birthday:   string;
    sex:        number;
    role?:       string;
    password:   string;
    sign:       string;
    region:     string;
    disabled?:   number;
    permission?: number;
}

export type MovieType = {
	classify: string;
	isRecommend: string;
	img: string;
	targetHref: string;
	updateTime: number;
	useStatus: string;
	sourceUrl: string;
	score: number;
	localImg: string;
	ranks: string;
	createTime: number;
	id: number;
	sourceName: string;
	category: string;
	movieName: string;
	description:string;
	star:string;
	plot: string;
}

export type ClassifyType = {
    classify: string,
    category: string
}

export type UserMsgType = {
	userAge: number,// 使用天数
	favoriteCount: number,// 收藏数
	playRecordCount: number,// 观看记录
	viewRecordCount: number// 浏览记录
}

export type StarType = {
	id: number,//主键
	starName: string,//演员名称
	img: string,//演员图片地址
	localImg:string,//演员本地图片地址
	createTime:string,//创建时间
	updateTime:string,//更新时间
	movieId:string,//对应电影的id
	role: string,//角色
	href: string,//演员的豆瓣链接地址
	works: string ;//代表作
}

export type MovieUrlType = {
  id:number;//主键
  movieName:string;//电影名称
  movieId:number;//对应的电影的id
  href:string;//源地址
  label:string;//集数
  createTime:string;//创建时间
  updateTime:string;//更新时间
  url:string;//播放地址
  playGroup:string;//播放分组，1, 2
}

export type EmitsType = {
	(e: 'onCheck', item: string | number): void
}