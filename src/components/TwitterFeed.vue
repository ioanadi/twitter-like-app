<template>
	<div class="twitter-feed">
		<Loader v-if="loading" />
		<TweetList v-else :tweets="tweets" />
		<button @click="resetDb">reset database</button>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TweetModel, tweetService } from '@/services/tweet'
import TweetList from './TweetList.vue'
import Loader from './Loader.vue'

@Component({
	name: 'TwitterFeed',
	components: { TweetList, Loader }
})
export default class TwitterFeed extends Vue {
	public loading = false
	public tweets: Array<TweetModel> = []
	private latestTweetTimestamp = 0
	private scheduledEventId = -1

	mounted() {
		this.getInitialTweets()
	}

	getInitialTweets() {
		this.loading = true
		this.tweets = []
		tweetService.getLatestTweets().then((tweets: TweetModel[]) => {
			this.appendNewTweets(tweets)
			this.loading = false

			this.scheduleNextUpdate(2)
		})
	}

	scheduleNextUpdate(milliseconds: number) {
		this.scheduledEventId = setTimeout(() => {
			this.updateFeed()
		}, milliseconds)
	}

	appendNewTweets(tweets: TweetModel[]) {
		if (tweets && tweets.length) {
			this.tweets.unshift(...tweets)
			this.latestTweetTimestamp = tweets[0].timeStamp
		}
	}

	updateFeed() {
		return tweetService.getTweetsCreatedAfterTime(this.latestTweetTimestamp).then((list: TweetModel[]) => {
			this.appendNewTweets(list)

			// If the number of returned items is equal to max possible (tweetCount),
			// then it is likely that there are other tweets that we have to get before being up-to-date
			if (list.length === tweetService.tweetCount) {
				this.scheduleNextUpdate(0)
			} else {
				this.scheduleNextUpdate(2000)
			}
		})
	}

	resetDb() { 
		tweetService.resetDB().then(() => {
			this.getInitialTweets()
			if (this.scheduledEventId > -1) {
				clearInterval(this.scheduledEventId)
			}
		})
	}
}
</script>

<style>
.twitter-feed {
	display: flex;
	justify-content: center;
}
.twitter-feed > button {
	position: absolute;
	right: 1.5rem;
	top: 1.5rem;
	margin: 0.5rem;
}
</style>
