import axios, { AxiosInstance, AxiosResponse } from 'axios'
import * as rax from 'retry-axios'


const BASE_URL = 'http://bumble-twitter-interview.herokuapp.com/ioana-dinca'

export class BaseApi {
    public api: AxiosInstance
    public baseUrl: string

    constructor(url: string) {
        this.baseUrl = url
        this.api = axios.create()
        rax.attach(this.api)
    }

    public get<T, R = AxiosResponse>(url: string): Promise<R> {

        return this.api.request<T, R>({
            method: 'GET',
            url: this.baseUrl + url,
            raxConfig: { retry: 0 },
        })
    }

    public getWithRetry<T, R = AxiosResponse>(url: string): Promise<R> {
        
        return this.api.request<T, R>({
            method: 'GET',
            url: this.baseUrl + url,
            raxConfig: {
                // Retry 5 times on requests that return a response (500, etc) before giving up.  Defaults to 3.
                retry: 7,

                // Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
                noResponseRetries: 2,

                // Milliseconds to delay at first.  Defaults to 100. Only considered when backoffType is 'static' 
                retryDelay: 200,

                // HTTP methods to automatically retry.  Defaults to:
                // ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT']
                httpMethodsToRetry: ['GET'],

                // The response status codes to retry.  Supports a double array with a list of ranges.
                //Defaults to: [[100, 199], [429, 429], [500, 599]]
                statusCodesToRetry: [[500, 599]],

                // If you are using a non static instance of Axios you need
                // to pass that instance here (const ax = axios.create())
                instance: this.api,

                // You can set the backoff type.
                // options are 'exponential' (default), 'static' or 'linear'
                backoffType: 'exponential',
            }
        })
    }

}

export default new BaseApi(BASE_URL)