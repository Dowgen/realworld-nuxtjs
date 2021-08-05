<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="user.image" class="user-img" />
            <h4>{{ user.username }}</h4>
            <p>
              {{ user.bio }}
            </p>
            <button
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="$router.push('/settings')"
            >
              <i class="ion-plus-round"></i>
              &nbsp; Edit Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{ active: tab === 'my_articles' }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'my_articles',
                    },
                  }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited_articles',
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    query: {
                      tab: 'favorited_articles',
                    },
                  }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
          </div>

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: {
                    username: article.author.username,
                  },
                }"
              >
                <img :src="article.author.image" />
              </nuxt-link>
              <div class="info">
                <nuxt-link
                  class="author"
                  :to="{
                    name: 'profile',
                    params: {
                      username: article.author.username,
                    },
                  }"
                >
                  {{ article.author.username }}
                </nuxt-link>
                <span class="date">{{
                  article.createdAt | date("MMM DD, YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited,
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser } from "@/api/user";
import {
  getArticles,
  getYourFeedArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import { mapState } from "vuex";

export default {
  middleware: "authenticated",
  async asyncData({ query }) {
    const { data } = await getUser();
    const { user } = data;
    // if (!user?.image) {
    //   user.image = "https://static.productionready.io/images/smiley-cyrus.jpg";
    // }

    const tab = query.tab || "my_articles";
    const tag = query.tag
    const page = Number.parseInt(query.page || 1);
    const limit = 10;
    const offset = (page - 1) * limit;
    let params = {
      limit,
      offset,
      tag,
    }

    if (tab === "my_articles") {
      params.author = user.username;
    }
    if (tab === "favorited_articles") {
      params.favorited = user.username;
    }

    const articleRes = await getArticles(params);
    const { articles, articlesCount } = articleRes.data;
    articles.forEach((article) => (article.favoriteDisabled = false));

    console.log(tab, 'tab');
    return {
      user, //用户信息
      articles, // 文章列表
      articlesCount, // 文章总数
      limit, // 每页大小
      page, // 页码
      tab // 选项卡
    };
  },
  watchQuery: ["page", "tab"],
  computed: {
    // ...mapState(["userInfo"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
  },
};
</script>

<style></style>
