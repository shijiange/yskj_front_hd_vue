<template>
  <div id="store_verification">
    <c-title text='多商户核销'></c-title>
    <div class="top_title">
      <img :src="member_avatar_image" alt="" />
      <div class="rigth">
        <span class="rigth_name">{{member_nickname}}</span>
        <span class="rigth_id">id：{{member_uid}}</span>
      </div>
    </div>
    <div class="bottom_list">
      <div class="list project_all" @click="btnProjectAll"><span class="list_icon"><i class="iconfont icon-fontclass-jianglijilu"></i>{{projectName}}大全</span><van-icon name="arrow" /></div>
      <div class="list my_project" @click="btnMyProject"><span class="list_icon"><i class="iconfont icon-fontclass-shangpindingdan"></i>我的{{projectName}}</span><van-icon name="arrow" /></div>
      <div class="list write_off"  @click="btnWriteOff"><span class="list_icon"><i class="iconfont icon-fontclass-dingdanguanli"></i>使用记录</span><van-icon name="arrow" /></div>
      <div class="list store_record" v-if="is_boss" @click="btnStoreRecord"><span class="list_icon"><i class="iconfont icon-massage_apply"></i>商户记录</span><van-icon name="arrow" /></div>
      <div class="list verification_record"  v-if="is_worker" @click="btnVerificationRecord"><span class="list_icon"><i class="iconfont icon-yq_massage"></i>核销员记录</span><van-icon name="arrow" /></div>
    </div>
  </div>
</template>

<script>
import store_verification_controller from "./store_verification_controller";

export default store_verification_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#store_verification {
  .top_title {
    height: 8.79rem;
    background-color: #3b3b3b;
    display: flex;

    img {
      width: 4.29rem;
      height: 4.29rem;
      border-radius: 50%;
      margin: 1.89rem 0 0 1.79rem;
    }

    .rigth {
      margin: 1.89rem 0 0 1.04rem;
      color: #fff;
      display: flex;
      flex-direction: column;
      width: 100%;
      text-align: left;

      .rigth_name {
        font-size: 23px;
        margin-bottom: 0.75rem;
        text-align: left;
      }
    }
  }

  .bottom_list {
    background: #fff;

    div:last-child {
      padding-bottom: 1.68rem;
    }

    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.68rem 1.07rem 0 1.07rem;
      font-size: 18px;

      .iconfont {
        color: #ce811d;
      }

      .list_icon {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .iconfont {
          margin-right: 0.4rem;
        }
      }
    }
  }
}
</style>
