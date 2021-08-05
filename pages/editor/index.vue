<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="onPost">
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input type="text" class="form-control" placeholder="Enter tags"><div class="tag-list"></div>
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { postArticles } from '@/api/article'

export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: 'authenticated',
  name: 'EditorIndex',
  data () {
    return {
      article: {
        body: "",
        description: "",
        tagList: [],
        title: "",
      },
      errors: {} // 错误信息
    }
  },
  methods: {
    async onPost () {
      try {
        // 提交表单请求登录
        const { data } = await postArticles({ article: this.article })
        // 跳转到首页
        this.$router.push(`/article/${data.article.slug}`)
      } catch (err) {
        // console.log('请求失败', err)
        this.errors = err.response.data.errors
      }
    }
  }
}
</script>

<style>

</style>
