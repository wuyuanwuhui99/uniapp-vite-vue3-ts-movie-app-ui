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