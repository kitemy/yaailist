import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    methods: {
        localize(n) {
            return localize(n);
        },
    },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>

                <div class="board-container">
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td>
                            <td class="total">
                                <p class="type-label-lg">{{ localize(ientry.total) }}</p>
                            </td>
                            <td class="user" :class="{ active: selected == i }">
                                <button @click="selected = i">
                                    <span class="type-label-lg">{{ ientry.user }}</span>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="player-container">
                    <div class="player">

                        <h1>#{{ selected + 1 }} {{ entry.user }}</h1>

                        <h3>{{ localize(entry.total) }} points</h3>

                        <h2 v-if="entry.verified.length > 0">
                            Verified ({{ entry.verified.length }})
                        </h2>

                        <table class="table">
                            <tr v-for="score in entry.verified">
                                <td class="rank"><p>#{{ score.rank }}</p></td>
                                <td class="level">
                                    <router-link class="type-label-lg" :to="{ path: '/', query: { level: score.path } }">
                                        {{ score.level }}
                                    </router-link>
                                </td>
                                <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                <td class="yt-btn">
                                    <a v-if="score.link" target="_blank" :href="score.link">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.completed.length > 0">
                            Completed ({{ entry.completed.length }})
                        </h2>

                        <table class="table">
                            <tr v-for="score in entry.completed">
                                <td class="rank"><p>#{{ score.rank }}</p></td>
                                <td class="level">
                                    <router-link class="type-label-lg" :to="{ path: '/', query: { level: score.path } }">
                                        {{ score.level }}
                                    </router-link>
                                </td>
                                <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                <td class="yt-btn">
                                    <a v-if="score.link" target="_blank" :href="score.link">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <h2 v-if="entry.progressed.length > 0">
                            Progressed ({{ entry.progressed.length }})
                        </h2>

                        <table class="table">
                            <tr v-for="score in entry.progressed">
                                <td class="rank"><p>#{{ score.rank }}</p></td>
                                <td class="level">
                                    <router-link class="type-label-lg" :to="{ path: '/', query: { level: score.path } }">
                                        {{ score.percent }}% {{ score.level }}
                                    </router-link>
                                </td>
                                <td class="score"><p>+{{ localize(score.score) }}</p></td>
                                <td class="yt-btn">
                                    <a v-if="score.link" target="_blank" :href="score.link">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                            <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
                                        </svg>
                                    </a>
                                </td>
                            </tr>
                        </table>

                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected] || {
                user: "",
                total: 0,
                verified: [],
                completed: [],
                progressed: []
            };
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = Array.isArray(leaderboard) ? leaderboard : [];
        this.err = err || [];
        this.loading = false;

        const targetUser = this.$route.query.user;
        if (targetUser) {
            const idx = this.leaderboard.findIndex(
                e => e.user.toLowerCase() === targetUser.toLowerCase()
            );
            if (idx !== -1) this.selected = idx;
        }
    },
}
