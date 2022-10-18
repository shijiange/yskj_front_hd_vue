<template>
  <div id="distributor">
    <c-title :hide="false" :text="'累计收入'"> </c-title>
    <van-tabs v-model="activeName" @click="handleClick" sticky :ellipsis="false" swipeable>
      <van-tab :title="items.name" v-for="(items, ind) in titleArr" :key="ind">
        <ul class="content" v-if="dataList[ind] && !fun.isTextEmpty(dataList[ind].list)">
          <li v-for="(item, index) in dataList[ind].list" :key="index">
            <p>
              <span class="left">{{ item.order_sn || '' }}</span
              ><span class="red right">{{ item.amount || '' }}</span>
            </p>
            <p>
              <span class="time left">{{ item.created_at || '' }}</span
              ><span class="right">{{ item.status_name || '' }}</span>
            </p>
          </li>
        </ul>
        <img
          v-if="dataList[ind] && fun.isTextEmpty(dataList[ind].list)"
          src="../../assets/images/blank.png"
          alt=""
          style="width: 5rem; margin: 2rem auto;"
        />
      </van-tab>
    </van-tabs>
    <div v-if="shareholder_award_conditions_display" v-show="titleArr[activeName].name == '股东分红'" class="fixed-btn" @click.stop="getQualification()">
      分红资格
    </div>
    <van-dialog
      v-model="fh_dialog"
      title="获得分红资格"
      :showConfirmButton="false"
      show-cancel-button
      class="fh_dialog-style"
    >
      <div class="fh_dialog-style-main" v-if="dividend_text">
        <template v-if="dividend_text.saleroom_short"> 
          月销售额还差<em>{{ dividend_text.saleroom_short }}</em>元<br />
        </template>
        <template v-if="dividend_text.recommend"> 
          直推【{{ dividend_text.recommend.level_name }}】人数还差<em>{{ dividend_text.recommend.short }}</em>人 <br />
        </template>
        <template v-if="dividend_text.channel_team"> 
          团队中【{{ dividend_text.channel_team.grade }}】人数还差<em>{{ dividend_text.channel_team.gap }}</em>人 <br />
        </template>
        <template v-if="dividend_text.type_name"> 
          分红资格：{{ dividend_text.type_name }}
        </template>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import accumulated_income_controller from './accumulated_income_controller';

export default accumulated_income_controller;
</script>
<style lang="scss" rel="stylesheet/scss">
#distributor {
  .van-tab {
    padding: 0 10px;
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
#distributor {
  background: #fff;

  .red {
    color: #f0201f;
  }

  .time {
    color: #8e8e8e;
  }

  .content {
    font-size: 15px;
    padding-bottom: 1rem;

    li {
      padding: 1rem 1rem 0 1rem;
      line-height: 1rem;
      display: flex;
      flex-direction: column;

      p {
        display: flex;
        margin-bottom: 0.3rem;

        span {
          display: inline-block;
        }
      }

      .right {
        flex: 1;
        text-align: right;
      }
    }
  }

  .fixed-btn {
    position: fixed;
    right: 50%;
    transform: translateX(10rem);
    bottom: 3.875rem;
    background: #f14e4e;
    color: #fff;
    font-size: 0.75rem;
    width: 2.875rem;
    height: 2.875rem;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    box-shadow: 0 0.094rem 0.219rem 0 rgba(131, 131, 131, 0.59);
  }

  .fh_dialog-style {
    text-align: left;

    .fh_dialog-style-main {
      padding: 0.875rem;
      line-height: 1.875rem;

      em {
        color: #f14e4e;
      }
    }
  }
}
</style>
