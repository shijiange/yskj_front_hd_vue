<template>
  <div id="inviter">
    <c-title
      :hide="false"
      text='邀请码'
       class="hidden"
    ></c-title>
    <div id="content">
      <p class="content_a">请确认邀请人</p>
      <div class="ueser">
        <div class="header">
          <img :src="img">
        </div>
        <p class="ueser_a">邀请人</p>
        <p class="ueser_b">{{name}}</p>
      </div>
      <div v-if="is_bind_invite == 1" class="btn">
        <button class="affirm"
            type="button"
            @click="error"
        >填写邀请码</button>
      </div>
      <div class="btn" v-else>
        <button class="affirm"
          type="button"
          @click="affirm"
        >确定</button>
        <button class="error"
          type="button"
          @click="error"
        >修改邀请人</button>
      </div>

      <p class="content_b">“邀请码是{{title}}为会员用户提供的专属编码,普通用户需要有会员的推荐方可在商城内购买商品，快去找您身边的{{title}}会员吧”</p>
    </div>
  </div>
</template>
<script>
import inviter_Controllerc from "./inviter_Controllerc";

export default inviter_Controllerc;
</script>
<style lang="scss" rel="stylesheet/scss" >
#inviter {
  background: #fff;
  min-height: 41.25rem;

  #content {
    .content_a {
      font-size: 18px;
      font-weight: bold;
      margin: 2.5rem auto;
    }

    .ueser {
      .header {
        width: 3.75rem;
        height: 3.75rem;
        border-radius: 1.875rem;
        overflow: hidden;
        margin: 0.625rem auto 0;

        img {
          width: 100%;
        }
      }

      .ueser_a {
        font-size: 16px;
        color: #8c8c8c;
        line-height: 1.875rem;
      }

      .ueser_b {
        font-size: 18px;
        line-height: 1.875rem;
      }
    }

    .btn {
      margin-top: 10px;

      button {
        width: 16.875rem;
        height: 2.8125rem;
        border-radius: 1.875rem;
        color: #fff;
        margin: 0.625rem auto;
        border: none;
        font-size: 18px;
      }

      .affirm {
        background: #f15353;
      }

      .error {
        border: solid 0.0625rem #f15353;
        color: #f15353;
      }
    }

    .content_b {
      margin: 0.625rem auto;
      width: 16.875rem;
      font-size: 14px;
      color: #8c8c8c;
    }
  }
}
</style>
