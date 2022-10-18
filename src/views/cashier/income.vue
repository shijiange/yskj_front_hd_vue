<template>
  <div id="all">
    <div id="member">
      <c-title :hide="false" text="收入明细"></c-title>
      <div id="tabs">
        <div>
          <van-tabs v-model="activeName" sticky @click="handleClick" >
            <van-tab name="first" title="今日"></van-tab>
            <van-tab name="second" title="昨日"></van-tab>
            <van-tab name="third" title="上月" ></van-tab>
            <van-tab name="fourth" title="本月"></van-tab>
          </van-tabs>
        </div>
        <div style="text-align: left;">
          <div class="content">
            <div class="total">
              <div class="total-a">
                <div>交易总数量</div>
                <div class="border-a-num">{{ total }}</div>
              </div>
              <div class="total-a total-b">
                <div>消费金额</div>
                <div class="border-a-num">{{ total_price }}</div>
              </div>
            </div>
            <div class="list">
              <div class="list-li" v-for="(item, index) in list" :key="index">
                <div class="li-col">
                  <div class="col-a">序号{{ index + 1 }}</div>
                  <div class="col-b">{{ item.price }}</div>
                </div>
                <div class="li-col">
                  <div class="col-c">{{ item.member_name }}</div>
                  <div class="col-d">{{ item.pay_type_name }}</div>
                </div>
                <div class="li-col">
                  <div class="col-c">{{ item.create_time }}</div>
                </div>
              </div>
              <div v-show="list.length <= 0" style="padding: 1rem 0; text-align: center;">~~暂无数据~~</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import income from './income_controller';

export default income;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.clearfix {
  clear: both;
}

#all {
  .content {
    width: 100%;
    padding-top: 0.3rem;
  }

  .total {
    width: 100%;
    background: #fff;
    text-align: center;
    display: flex;
    padding: 0 1rem;

    .total-a {
      flex: 1;
      margin: 1rem 0;
      line-height: 2rem;
      border-right: 2px solid #f5f5f5;

      .border-a-num {
        font-size: 1.25rem;
        color: #f15353;
        font-weight: 600;
      }
    }

    .total-b {
      border-right: 0;
    }
  }

  .list {
    margin: 0.5rem 0;
    background: #fff;
    line-height: 1.25rem;

    .list-li {
      padding: 0.5rem 1rem;
      border-bottom: 1px solid #f5f5f5;

      .li-col {
        display: flex;

        div {
          flex: 1;
        }

        .col-a {
          text-align: left;
          font-size: 1rem;
          font-weight: 600;
        }

        .col-b {
          text-align: right;
          color: #f15353;
          font-size: 1rem;
          font-weight: 600;
        }

        .col-c {
          text-align: left;
        }

        .col-d {
          text-align: right;
        }
      }
    }
  }
}
</style>
