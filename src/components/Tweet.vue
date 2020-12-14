<template>
    <div class="tweet">
        <div class="tweet__col">
            <div :style="{ 'background-image': tweet.image }" class="tweet__col-avatar"></div>
        </div>
        <div class="tweet__col">
            <div class="tweet__col-username">{{tweet.username}}</div>
            <div class="tweet__col-text">{{tweet.text}}</div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { TweetModel } from '@/services/tweet'

@Component({
    name: 'Tweet'
})
export default class Tweet extends Vue {
  @Prop() private tweet!: TweetModel
}
</script>

<style scoped>
.tweet {
    display: flex;
    padding: 1rem;
    margin: 1rem 2rem;
    border: 1px solid black;
}
.tweet__col-avatar {
    margin-right: .5rem;
    border-radius: 50%;
    border: 1px solid black;
    height: 4rem;
    width: 4rem;
    background-size: cover;
}
.tweet__col-username {
    font-size: 15px;
    font-weight: bold;
    margin-bottom: .5rem;
}
.tweet__col {
    text-align: start;
}
</style>
