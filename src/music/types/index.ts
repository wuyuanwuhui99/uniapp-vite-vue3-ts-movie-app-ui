export type MusicType = {
		id:number, //主键
	  albumId:number, // 专辑id
	  songName:string, // 歌曲名称
	  authorName:string, // 歌手名称
	  authorId:number, // 歌手id
	  albumName:string, // 专辑
	  version:string, // 版本
	  language:string, // 语言
	  publishDate:string, // 发布时间
	  wideAudioId:number, // 未使用字段
	  isPublish:number, // 是否发布
	  bigPackId:number, // 未使用字段
	  finalId:number, // 未使用字段
	  audioId:number, // 音频id
	  similarAudioId:number, // 未使用字段
	  isHot:number, // 是否热门
	  albumAudioId:number, // 音频专辑id
	  audioGroupId:number, // 歌曲组id
	  cover:string, // 歌曲图片
	  playUrl:string, // 网络播放地址
	  localPlayUrl:string, // 本地播放地址
	  sourceName:string, // 歌曲来源
	  sourceUrl:string, // 来源地址
	  createTime:string, // 创建时间
	  updateTime:string, // 更新时间
	  label:string, // 标签
	  lyrics:string, // 歌词
	  isFavorite:number, // 是否喜欢
	  times:number, //  听过的次数，在获取播放记录的时候才有
}