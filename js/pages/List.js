import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <div class="search-container">
                    <input
                        type="text"
                        v-model="search"
                        placeholder="Search levels..."
                        class="search-bar"
                    />
                </div>
                <table class="list" v-if="list">
                    <tr v-for="([level, err], i) in filteredList">
                        <td class="rank">
                            <p v-if="i + 1 <= 150" class="type-label-lg">#{{ level ? list.indexOf(list.find(([l]) => l === level)) + 1 : '?' }}</p>
                            <p v-else class="type-label-lg">Legacy</p>
                        </td>
                        <td class="level" :class="{ 'active': selected == list.indexOf(list.find(([l]) => l === level)), 'error': !level }">
                            <button @click="selected = list.indexOf(list.find(([l]) => l === level))">
                                <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <div class="level-body">
                        <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                        <ul class="stats">
                            <li>
                                <div class="type-title-sm">Publisher</div>
                                <p>{{ level.author }}</p>
                            </li>
                            <li>
                                <div class="type-title-sm">Points</div>
                                <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                            </li>
                            <li>
                                <div class="type-title-sm">ID</div>
                                <p>{{ level.id }}</p>
                            </li>
                        </ul>
                    </div>
                    <h2>Records</h2>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="user">
                                <router-link class="type-label-lg" :to="{ path: '/leaderboard', query: { user: record.user } }">{{ record.user }}</router-link>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="yt-btn">
                                <a :href="record.link" target="_blank">
                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/></svg>
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">
                                    <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                    {{ editor.name }}
                                </a>
                                <template v-else>
                                    <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                    <p>{{ editor.name }}</p>
                                </template>
                            </li>
                        </ol>
                    </template>
                    <h3>Overview</h3>
                    <p>Bienvenue sur La YAAI List !</p>
                    <p>
                        Les niveaux sont placés en fonction de la difficulté sur la AREDL
                        (a community based project ranking every rated Extreme Demon in Geometry Dash as accurately as possible).
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        search: '',
        roleIconMap,
        store
    }),
    computed: {
        filteredList() {
            if (!this.search.trim()) return this.list;
            const q = this.search.trim().toLowerCase();
            return this.list.filter(([level]) =>
                level?.name?.toLowerCase().includes(q)
            );
        },
        level() {
            return this.list[this.selected]?.[0];
        },
        video() {
            if (!this.level) return '';
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }
            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    watch: {
        '$route.query.level'(targetLevel) {
            if (!targetLevel) return;
            const idx = this.list.findIndex(
                ([level]) => level?.path?.toLowerCase() === targetLevel.toLowerCase()
            );
            if (idx !== -1) {
                this.selected = idx;
                this.search = '';
            }
        }
    },
    async mounted() {
        this.list = await fetchList();
        this.editors = await fetchEditors();

        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;

        const targetLevel = this.$route.query.level;
        if (targetLevel) {
            const idx = this.list.findIndex(
                ([level]) => level?.path?.toLowerCase() === targetLevel.toLowerCase()
            );
            if (idx !== -1) {
                this.selected = idx;
                this.search = '';
            }
        }
    },
    methods: {
        embed,
        score,
    },
};
