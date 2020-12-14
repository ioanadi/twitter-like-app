import { AxiosResponse } from 'axios'
import baseApi, { BaseApi } from './baseApi'

export interface TweetModel {
    id: string;
    image: string;
    text: string;
    timeStamp: number;
    username: string;
}

const TWEET_COUNT_PER_REQUEST = 10

class TweetService {
    public tweetCount: number
    private api: BaseApi

    constructor(api: BaseApi) {
        this.api = api
        this.tweetCount = TWEET_COUNT_PER_REQUEST
    }

    public getLatestTweets(): Promise<TweetModel[]> {
        const url = '/api?count=' + this.tweetCount

        return this.api.getWithRetry<TweetModel[]>(url)
            .then((res: AxiosResponse) => {
                return res.data
            }) 
    }

    public getTweetsCreatedAfterTime(timeStamp: number): Promise<TweetModel[]> {
        const url = '/api?count=' + this.tweetCount + '&afterTime=' + timeStamp

        return this.api.getWithRetry<TweetModel[]>(url)
            .then((res: AxiosResponse) => res.data ) 
    }

    public resetDB() {
        return this.api.get('/reset')
    }

}

export const tweetService = new TweetService(baseApi)
