<template>
    <section id="detail">
        <c-title :hide="false" text='奖励详情'></c-title>
        <section id="info">
            <div class="top">
                <font>奖励积分</font>
                <h1>{{amount}}</h1>
            </div>
            <ul>
                <li>
                    <span>奖励积分</span>
                    <span>{{order_price}}</span>
                </li>
                <li>
                    <span>奖励比例</span>
                    <span>{{ratio}}%</span>
                </li>
                <li>
                    <span>星级会员</span>
                    <span v-html="star" style="word-wrap: break-word; word-break: normal;">
                        
                    </span>
                </li>
                <li>
                    <span>奖励总额</span>
                    <span>{{all_amount}}</span>
                </li>
                <li>
                    <span>剩余奖励金额</span>
                    <span>{{amount_surplus}}</span>
                </li>
                <li>
                    <span>奖励时间</span>
                    <span>{{created_at}}</span>
                </li>
            </ul>
        </section>
        <!-- <el-row>
            <el-button type="success" plain @click="previousPage()">奖项记录</el-button>
        </el-row> -->
    </section>
    
    <!-- <section>
        <el-row>
            <el-button type="success" plain @click="previousPage()">奖项记录</el-button>
        </el-row>
    </section> -->
</template>

<script>
import record from "./record_of_awards";
export default record;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#detail {
  background-color: #fff;
  font-size: 14px;

  #info {
    font {
      line-height: 3rem;
    }

    h1 {
      font-size: 28px;
    }

    ul {
      margin-top: 1.25rem;
      padding-bottom: 0.625rem;

      li {
        height: 1.875rem;
        line-height: 1.875rem;
        display: flex;
        padding: 0 0.875rem;
        justify-content: space-between;

        span:first-child {
          color: #8c8c8c;
        }
      }
    }
  }
}

</style>