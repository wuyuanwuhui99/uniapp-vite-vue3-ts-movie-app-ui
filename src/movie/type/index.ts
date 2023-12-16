export type UserDataType = {
    userId:     string;
    createDate: string;
    updateDate: string;
    username:   string;
    telephone:  string;
    email:      string;
    avater:     string;
    birthday:   string;
    sex:        string;
    role:       string;
    password:   string;
    sign:       string;
    region:     string;
    disabled:   number;
    permission: number;
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
