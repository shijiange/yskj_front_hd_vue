<template>
  <div id="shareholderCenter">
    <c-title :hide="false"
             :text=' custom_name'></c-title>

    <div class="share_holder">

      <div class="left">
        团队等级:{{team_level}} <br />
        <span v-if="capping">封顶金额:{{capping_money}}</span>
      </div>
      <div class="right">
        <span>{{$i18n.t('money')}} {{amountTotal}} </span><br />
        <span>已分红(元)</span>
      </div>
    </div>

    <div class="shareholder-order">
      <div id="tabs">
        <van-tabs v-model="activeName">
          <van-tab name="first">
				<span slot="title" @click="handleClick('0')">分红记录</span>
			</van-tab>
        </van-tabs>
        <div>
        <!-- <mt-tab-container v-model="activeName"> -->
          <!--<el-tabs v-model="activeName" @tab-click="handleClick">-->
          <!--<el-tab-pane label="分红记录" name="first">-->
          <div v-show="activeName=='first'">
          <!-- <mt-tab-container-item id="first"> -->
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
              <ul class='rationList'>
                <li v-for="(elem,i) in first_content"
                    :key='i'
                    class="list">
                  <h4>
                    分红ID:{{elem.id}}
                    <span>{{elem.amount}}<small>元</small></span>
                  </h4>

                  <p>
                    {{elem.created_at}}
                  </p>
                </li>
              </ul>
            </van-pull-refresh>
          <!-- </mt-tab-container-item> -->
          </div>
          <!--</el-tab-pane>-->
          <!--</el-tabs>-->
        <!-- </mt-tab-container> -->
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import shareholder_dividend_controller from "./shareholder_dividend_controller";
export default shareholder_dividend_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
p {
  margin: 0;
  padding: 0;
}

#shareholderCenter {
  .m_header {
    width: 100%;
    height: 2.8125rem;
    line-height: 2.8125rem;
    font-size: 15px;
    font-weight: bold;
    background: #fff;

    span {
      display: inline-block;
      width: 1rem;
      height: 1.5rem;
      float: left;
      margin-left: 0.625rem;
      font-size: 30px;
    }
  }

  .share_holder {
    padding: 1rem 0.75rem;
    box-sizing: border-box;
    background-color: #e84f40;
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    .right {
      width: 55%;
      text-align: right;
      color: #fff;
      box-sizing: border-box;

      span {
        line-height: 1.5rem;
      }

      span:first-child {
        font-weight: bold;
        font-size: 20px;
      }
    }

    .left {
      width: 45%;
      box-sizing: border-box;
      color: #fff;
      text-align: left;
      line-height: 1.5rem;
    }
  }

  .share_info {
    width: 100%;
    height: 4.0625rem;
    background-color: #fff;
    margin-bottom: 0.625rem;

    div {
      color: #737372;
      font-size: 12px;
      padding-top: 0.9375rem;
      line-height: 1.25rem;
      float: left;
      width: 50%;
      box-sizing: border-box;

      span {
        color: #e84f40;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }

  .shareholder-order {
    #tabs {
      .rationList {
        .list {
          margin: 0.1875rem 0;
          background-color: #fff;

          h4 {
            width: 100%;
            box-sizing: border-box;
            padding: 0.625rem 1.25rem;
            text-align: left;
            color: #333;
            font-size: 14px;
            font-weight: normal;

            span {
              display: inline-block;
              font-size: 14px;
              font-weight: normal;
              color: #000;
              background-color: #fff;
              border-radius: 0.3125rem;
              float: right;
            }
          }

          ul::after {
            content: "";
            display: block;
            clear: both;
          }

          ul {
            width: 100%;
            padding: 0.625rem 0;

            li {
              width: 33%;
              float: left;
              font-size: 12px;
              color: #8c9295;
              line-height: 1.375rem;

              span {
                color: #333;
                font-size: 14px;
              }
            }
          }

          p {
            color: #aab2b9;
            text-align: left;
            box-sizing: border-box;
            padding: 0 1.25rem 0.9375rem;
            font-size: 14px;

            span {
              color: #728ae3;
              float: right;
            }
          }
        }

        .recordList {
          padding: 0.9375rem;
          font-size: 14px;
          line-height: 1.125rem;
          color: #333;
          text-align: left;
          background-color: #fff;
          margin: 0.125rem;

          span {
            font-size: 14px;
            float: right;
          }
        }
      }

      .rationList::after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }
}
</style>
