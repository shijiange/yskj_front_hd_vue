<template>
  <div id="GetRedRecord">
    <c-title :hide="false" :text="titleText">
    </c-title>

    <div class="head">
      <div class="head-img">
        <img :src="memberData.avatar_image" alt="">
        <span>{{memberData.username}}</span>
      </div>
      <div class="money">
        <div class="gray">累计领取金额</div>
        <div>
          <span>{{$i18n.t('money')}}</span>
          <span v-if="(tag == 'old') || (tag == 'other')">{{amount_sum}}</span>
          <span v-else>{{receive_total}}</span>
        </div>
      </div>
    </div>

    <div class="blank" v-if="recordsList.length <= 0">
      <img src="../../../assets/images/blank.png">
      <span>还没有记录哦</span>
    </div>

    <div class="content" v-if="recordsList.length > 0">
      <div class="title">
        <span>时间</span>
        <template v-if="tag == 'other'">
          <span>额外奖励(元)</span>
        </template>
        <template v-else>
          <span>领取红包(元)</span>
          <span>剩余红包额度(元)</span>
        </template>
      </div>
      <ul>
        <li v-for="(item,index) in recordsList" :key="index">
          <div>
            {{item.created_at}}
          </div>
          <template v-if="tag == 'other'">
            <div style="line-height: 2rem; color: #ff2a52;">
              {{item.receive_amount}}
            </div>
          </template>
          <template v-else>
            <div style="line-height: 2rem; color: #ff2a52;">
              {{tag == 'new'? item.amount : item.receive_amount}}
            </div>
            <div style="line-height: 2rem;">
              {{tag == 'new'? item.surplus_limit : item.amount}}
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import get_red_record_controller from "./get_red_record_controller";

export default get_red_record_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #GetRedRecord {
    background-color: #fff;
    padding: 1rem;

    .blank {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      img {
        width: 6rem;
        height: 6rem;
      }

      span {
        margin-top: 15px;
        color: #ccc;
        font-size: 14px;
      }
    }

    .head-img {
      display: flex;
      margin-bottom: 1rem;

      img {
        flex: 0 0 3.5rem;
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
      }

      span {
        flex: 1;
        line-height: 3rem;
        text-align: left;
        margin-left: 1rem;
      }
    }

    .money {
      display: flex;

      .gray {
        flex: 1;
        text-align: left;
        color: #999;
      }
    }

    .content {
      margin: 1.5rem 0;

      ul {
        margin-top: 0.3rem;
      }

      li {
        display: flex;
        padding: 0.8rem 0;
        border-bottom: 0.01rem solid #eeeded;

        div {
          flex: 1;
        }
      }
    }

    .title {
      display: flex;

      span {
        flex: 1;
        color: #666;
      }
    }
  }
</style>
