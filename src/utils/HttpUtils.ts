import {HOST} from '../config/constant';
/**
 * @description: HTTP请求方法枚举
 */
enum HttpMethod {
	GET = "GET",
	POST = "POST",
	OPTIONS = "OPTIONS",
	PUT = "PUT",
	DELETE = "DELETE"
}

/**
 * @description: HTTP请求配置
*/
interface RequestConfig {
	/** API路径 */
	url: string
	/** Method类型 */
	method?: HttpMethod
	/** 接口返回数据 */
	data?: any
	/** Header头部 */
	header?: object
	/** 返回的数据格式 */
	dataType?: string
	/** 请求报错时，是否弹出message提示（默认弹出）*/
	noShowMsg?: boolean
}

/**
 * @description: 声明业务数据类型
*/
export type MyAwesomeData<T> = {
	data: T,
    token: string,
    status:string,
    msg:string,
    total:number
}

class HttpRequest {
    private static instance: HttpRequest;
    private token: string = '';
	private constructor() { }
	/** 请求函数(单例模式)
	*
	* **注意：**
	* `method`需使用`HttpMethod`枚举类，切勿自行定义
	*
	* **示例代码**
	* ```js
	 HttpRequest.getInstance().request({
		 url: "/Api",
		 method: HttpMethod.GET
	 })
	* ```
    */
    public setToken(token:string){
        this.token = token;
    }

	public static getInstance(): HttpRequest {
		if (!this.instance) {
			this.instance = new HttpRequest()
		}
		return this.instance;
	}

	// 处理请求异常状态码
	private handerErrorStatus(statusCode: number, requestConfig: RequestConfig) {
		let msg = "服务找不到"
		if (statusCode === 502 || statusCode === 503) {
			msg = "服务器开小差了~"
		}
		!requestConfig.noShowMsg && wx.showToast({
			title: `${msg}，错误码：${statusCode}`,
			icon: "none"
		})
		return msg
	}

	// 处理请求异常
	private handerError(err: { errMsg: string }, requestConfig: RequestConfig) {
		let msg = `请求异常`
		if (/timeout/.test(err.errMsg)) {
			msg = "请求超时"
		}
		!requestConfig.noShowMsg && uni.showToast({
			title: msg,
			icon: "none"
		});
		return msg
	}

	// 服务器接口请求
	public request<T>(requestConfig: RequestConfig): Promise<MyAwesomeData<T>> {
		return new Promise((resolve, reject) => {
			// 默认header
			const header = {
                "content-type": "application/json",
                "Authorization": this.token
			}
			uni.request({
				method: requestConfig.method,
				url: HOST + requestConfig.url,
				data: requestConfig.data,
				header: Object.assign(header, requestConfig?.header),
				dataType: !requestConfig.dataType ? "json" : "其他",
				success:  (res) => {
					// console.log("发送返回:", res) //res:{cookies, data, header, statusCode}
					const code = res.statusCode || -404
					const data = res.data
					/** 接口请求成功*/
					if (code == 200) {
						resolve(data as MyAwesomeData<T>)
					} else if (code === 401) {
						// 未授权
						!requestConfig.noShowMsg && wx.showModal({
							title: "登录失效",
							content: "登录失效，请重新登录",
						}).then(resModa => {
							if (resModa.confirm) { }
						})
						reject({ code, msg: "未登录", data: data })
					} else {
						//非200及401状态码-数据处理
						const errMsg = this.handerErrorStatus(code, requestConfig)
						reject({ code, msg: errMsg, data })
					}
				},
				fail: err => {
					let msg = this.handerError(err, requestConfig)
					reject({ msg })
				}
			})
		})
	}

	/**
	 * @description: get请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public get<T>(url: string, data?: Object, OtherConfig?: RequestConfig):Promise<MyAwesomeData<T>> {
		return this.request<T>({ method: HttpMethod.GET, url, data, ...OtherConfig })
	}

	/**
	 * @description: post请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public post<T>(url: string, data?: Object, OtherConfig?: RequestConfig) {
		return this.request<T>({ method: HttpMethod.POST, url, data, ...OtherConfig })
	}

	/**
	 * @description: delete请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public delete<T>(url: string, data?: Object, OtherConfig?: RequestConfig):Promise<MyAwesomeData<T>> {
		return this.request<T>({ method: HttpMethod.DELETE, url, data, ...OtherConfig })
	}

	/**
	 * @description: put请求函数
	 * @param {string} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {RequestConfig} OtherConfig request其他配置
	 * @return {*}
	 */
	public put<T>(url: string, data?: Object, OtherConfig?: RequestConfig):Promise<MyAwesomeData<T>> {
		return this.request<T>({ method: HttpMethod.PUT, url, data, ...OtherConfig })
	}
}

export const httpRequest = HttpRequest.getInstance()