<template>
  <div id="team_limit">
    <c-title :hide="false"
             text='激活权限'></c-title>
    <van-tabs v-model="activeName"
              sticky
              @click.native="handleClick">
      <van-tab title="普通会员"
               name="0"></van-tab>
      <van-tab :title="item.level_name"
               v-for="(item,index) in levels"
               :key="index"
               :name="item.id"></van-tab>
    </van-tabs>
    <div class="search">
      <i class="iconfont icon-sousuo"
         style="margin-right: 0.5rem;"
         @click="search"></i>
      <input type="text"
             @keypress="enterSearch"
             v-model="keyword"
             placeholder="搜索会员ID/昵称/手机号">
    </div>
    <div class="content">
      <div class="item-list">
        <div class="item"
             v-for="(item,index) in datas"
             :key="index">
          <div class="left">
            <div class="user">
              <img :src="item.avatar_image"
                   v-if="activeName=='0'">
              <img :src="item.has_one_member.avatar_image"
                   v-if="activeName!='0'">
            </div>
            <div class="txt">
              <div class="top"
                   v-if="activeName=='0'">{{item.nickname}}</div>
              <div class="top"
                   v-if="activeName!='0'">{{item.has_one_member.nickname}}</div>
              <div class="bottom"
                   v-if="activeName=='0'"> 普通会员</div>
              <div class="bottom"
                   v-if="activeName!='0'">{{level_name}}</div>
            </div>
          </div>
          <div class="update"
               @click="update(item)">
            升级
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="show"
               position="bottom"
               class="pop">
      <div class="title">
        <span class="cancel"
              @click="show=false">取消</span>
        <span>选择升级等级</span>
        <span class="confirm" @click="confirm">确认</span>
      </div>
      <div class="pop-content">
        <van-radio-group v-model="radio"
                         checked-color="#ee2a2b">
          <div class="item"
               v-for="(obj,index) in upgrade_level"
               :key="index">
            <span>{{obj.level_name}}</span>
            <van-radio :name="obj.id"></van-radio>
          </div>
        </van-radio-group>
      </div>
    </van-popup>
  </div>
</template>
<script>
import team_limit_controller from './team_limit_controller';
export default team_limit_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#team_limit {
  height: 100vh;
  background-color: #fff;

  .search {
    width: 21.0625rem;
    height: 2.1875rem;
    background-color: #f2f2f7;
    border-radius: 1.0625rem;
    display: flex;
    align-items: center;
    padding-left: 0.75rem;
    margin: 0 auto;
    margin-top: 1rem;

    input {
      outline: none;
      border: none;
    }
  }

  .content {
    margin-top: 1.4375rem;
    padding: 0 1rem;
    background: #fff;
    padding-bottom: 1.4375rem;

    .item-list {
      .item {
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;

          .user {
            width: 2.875rem;
            height: 2.875rem;
            border-radius: 50%;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .txt {
          display: flex;
          flex-direction: column;
          margin-left: 0.75rem;
          justify-content: space-between;
          align-items: baseline;

          .top {
            font-size: 16px;
          }

          .bottom {
            color: #666;
            font-size: 12px;
          }
        }

        .update {
          width: 3.375rem;
          height: 1.5625rem;
          background-color: #ee2e2b;
          border-radius: 0.8125rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
      }
    }
  }

  .pop {
    border-radius: 1.3125rem 1.3125rem 0 0;
    padding-top: 0.75rem;
    padding-bottom: 2.875rem;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 1.75rem;

      .cancel {
        color: #666;
      }

      .confirm {
        color: #ee2e2b;
      }
    }

    .pop-content {
      .item {
        display: flex;
        justify-content: space-between;
        padding: 0 1.75rem;
        margin-top: 2.25rem;
      }
    }
  }
}
</style>
