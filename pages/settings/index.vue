<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="onSubmit">
            <fieldset>
                <fieldset class="form-group">
                  <input v-model="user.image" class="form-control" type="text" placeholder="URL of profile picture">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
                </fieldset>
                <fieldset class="form-group">
                  <textarea v-model="user.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
                </fieldset>
                <fieldset class="form-group">
                  <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
                </fieldset>
                <button class="btn btn-lg btn-primary pull-xs-right">
                  Update Settings
                </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { editUser } from '@/api/user'

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  middleware: 'authenticated',
  name: 'SettingsIndex',
  data () {
    return {
      user: {
        username: '',
        image: '',
        bio: '',
        email: '303944689@qq.com',
        password: 'shengda123'
      },
      errors: {} // 错误信息
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 提交表单请求登录
        const { data } = await editUser({ user: this.user })
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)

        // 跳转到首页
        this.$router.push(`/profile/${data.user.username}`)
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
