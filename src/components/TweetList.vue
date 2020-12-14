<template>
    <div class="tweet-list">
        <div v-for="(tweet,i) in periodicallyUpdatedList" :key="i">
            <Tweet :tweet="tweet"/>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Tweet from './Tweet.vue'
import { TweetModel } from '@/services/tweet'

// The user will se a list update every 2 seconds //
const LIST_UPDATE_INTERVAL = 2000

@Component({
    name: 'TweetList',
    components: { Tweet },
})
export default class TweetList extends Vue {
    public periodicallyUpdatedList: TweetModel[] = []
    private updateEventId = -1

    @Prop() private tweets!: TweetModel[]

    mounted() {
        this.updateEventId = setInterval(() => {
            this.periodicallyUpdatedList = this.tweets.slice()

        }, LIST_UPDATE_INTERVAL)
    }

    beforeDestroy() {
        clearInterval(this.updateEventId)
    }
}
</script>

<style scoped>
.tweet-list {
    max-width: 956px;
}
</style>
