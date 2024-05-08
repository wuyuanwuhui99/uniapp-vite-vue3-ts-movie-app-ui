import { type } from "os"

// 歌曲字段
export type MusicType = {
	id : number, //主键
	albumId : number, // 专辑id
	songName : string, // 歌曲名称
	authorName : string, // 歌手名称
	authorId : number, // 歌手id
	albumName : string, // 专辑
	version : string, // 版本
	language : string, // 语言
	publishDate : string, // 发布时间
	wideAudioId : number, // 未使用字段
	isPublish : number, // 是否发布
	bigPackId : number, // 未使用字段
	finalId : number, // 未使用字段
	audioId : number, // 音频id
	similarAudioId : number, // 未使用字段
	isHot : number, // 是否热门
	albumAudioId : number, // 音频专辑id
	audioGroupId : number, // 歌曲组id
	cover : string, // 歌曲图片
	playUrl : string, // 网络播放地址
	localPlayUrl : string, // 本地播放地址
	sourceName : string, // 歌曲来源
	sourceUrl : string, // 来源地址
	createTime : string, // 创建时间
	updateTime : string, // 更新时间
	label : string, // 标签
	lyrics : string, // 歌词
	isFavorite : number, // 是否喜欢
	times : number, //  听过的次数，在获取播放记录的时候才有
}

// 歌曲分类字段
export type MusicClassifyType = {
	id : number,// 分类id
	classifyName : string, // 分类时间
	permission : number,// 权限
	classifyRank : number, // 分类排名
	cover : string,// 分类图标
	disabled : number,// 是否禁用
	createTime : string,// 创建时间
	updateTime : string// 更新时间
	pageNum: number,// 第几页
	pageSize: number// 每页显示条数
}

// 歌手字段
export type MusicAuthorType = {
  id : number,//主键
  authorId : number,// 歌手id
  authorName: string,// 歌手名称
  language: string,// 语言
  isPublish : number,// 是否发布
  avatar: string,// 头像
  type : number,// 类型
  country: string,// 国家
  birthday: string,// 生日
  identity : number,// 身份
  rank : number,// 排名
  createTime: string,// 创建时间
  updateTime: string,// 更新时间
  total: string// 歌曲总数
}

// 点赞字段
export type LikeType = {
	id?:number,
	type:string,
	relationId:number,// 朋友圈id
	userId?:string,// 用户id
	username?:string,// 用户名称
	createTime?:string,// 创建时间
	updateTime?:string// 更新时间
}

// 评论字段
export type CommentType = {
	id:number,//主键
	content:string,//评论内容
	parentId:number,//父节点id
	type:string,
	topId:number,//顶级节点id
	relationId:number,//影片id
	createTime:string,//创建时间
	updateTime:string,//更新时间
	replyCount:number,//回复数量
	userId:string,//用户id
	username:string,//用户名
	avater:string,//用户头像
	replyUserId:string,//被回复者id
	replyUserName:string,//被回复者名称
	showCommentCount:string,//显示的回复数量
	replyPageNum:number,
	replyList:Array<CommentType>
}

export type CircleType = {
  id:number,
  relationId:number,// 关联音乐audio_id或者电影movie_id
  content:string,// 朋友圈内容
  imgs:string,// 朋友圈图片
  type:string,// 类型
  userId:string,// 用户id
  username:string,// 用户的昵称
  useravater:string,// 用户头像
  createTime:string,// 创建时间
  updateTime:string,// 更新时间
  musicSongName:string,// 歌曲名称
  musicAudioId:string,// 歌曲id
  musicAuthorName:string,// 歌曲作者
  musicAlbumName:string,// 专辑名称
  musicCover:string,// 音乐图片
  musicPlayUrl:string,// 音乐播放地址
  musicLocalPlayUrl:string,// 音乐本地播放地址
  musicLyrics:string,// 歌词
  movieId:string,// 电影id
  movieName:string,// 电影名称
  movieDirector:string,// 电影导演
  movieStar:string,// 电影主演
  movieType:string,// 电影类型
  movieCountryLanguage:string,// 电影上映国家
  movieViewingState:string,// 电影状态
  movieReleaseTime:string,// 上映时间
  movieImg:string,// 电影海报
  movieClassify:string,// 电影分类
  movieLocalImg:string,// 电影本地图片
  movieScore:string,// 电影得分
  circleLikes:Array<LikeType>,
  circleComments: Array<CommentType> ,
}

export type MuiscPlayMenuType = {
  id:number,//主键
  name:string,// 歌单名称
  userId:string;// 用户id
  total:number;// 歌单里面的歌曲总数
  cover:string;// 歌单封面
  createTime:string;// 创建时间
  updateTime:string;// 更新时间
}