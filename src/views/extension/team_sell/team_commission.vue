<template>
  <div id="team_commission">
    <c-title :hide="false"
             :text="name"></c-title>
    <div class="content"
         v-if="$route.params.id!=5">
      <div class="list-wrap"
           v-if="!fun.isTextEmpty(datas)">
        <div class="list"
             v-for="(item, index) in datas"
             :key="index">
          <div class="list-content"
               @click="toggle(item)">
            <div class="top">
              <span>{{ item.order_sn }}</span>
              <span class="num">+{{ item.dividend_amount }}</span>
            </div>
            <div class="bottom">
              <span>{{ item.created_at }}</span>
               <span v-if="item.status==0">未结算</span>
              <span v-if="item.status==1">已结算</span>
            </div>
            <div class="team_list"
                 v-if="item.show">
              <div class="left"
                   v-if="item.has_one_member">
                <img :src="item.has_one_member.avatar_image" />
              </div>
              <div class="right">
                <div class="cpay">
                  <span>{{ item.has_one_member.nickname }}</span>
                  <div>
                    结算金额:<span style="color: #ff2c29;">{{ item.amount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <img src="../../../assets/images/blank.png"
           alt=""
           v-if="!loading && fun.isTextEmpty(datas)"
           style="width: 5rem; margin-top: 5rem;" />
    </div>
    <div
         v-if="$route.params.id==5">
      <div class="list-wrap"
           v-if="!fun.isTextEmpty(datas)">
        <div class="list-other"
             v-for="(item, index) in datas"
             :key="index">
          <div class="title">
            <span >{{item.created_at}}</span>
            <span style="color: #ff2c29;">+{{ item.dividend_amount}}</span>
          </div>
          <div class="content">
            <div class="left">
              <div>团队的商品订单业绩</div>
              <div class="cash">{{item.total_price}}</div>
            </div>
            <div class="right">
              <div>团队商品业绩的利润</div>
              <div class="cash">{{item.amount}}</div>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import team_commission_controller from './team_commission_controller';
export default team_commission_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#team_commission {
  height: 100vh;
  background-color: #fff;
  overflow: scroll;

  .list-wrap {
    background-color: #fff;

    .list {
      .list-content {
        padding: 1rem 0.75rem;

        .top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          .num {
            color: #ff2c29;
          }
        }

        .bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .team_list {
          background-color: #fff;
          padding: 0.625rem 0;
          overflow: hidden;
          border-top: 0.0625rem solid #e2e2e2;
          display: flex;

          .left {
            width: 2rem;
            height: 2rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .right {
            flex: 1;
            margin-left: 0.75rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            text-align: left;

            .cpay {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }

      .line {
        height: 0.3125rem;
        background-color: #f9f9f9;
      }
    }

    .list-other {
      .title {
        padding: 0 1.1563rem;
        height: 2.5625rem;
        border-bottom: solid 1.0016px #f2f2f2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
      }

      .content {
        padding: 26px 37.0016px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          flex-direction: column;

          .cash {
            color: #666;
            margin-top: 20px;
          }
        }

        .right {
          display: flex;
          flex-direction: column;

          .cash {
            color: #666;
            margin-top: 0.625rem;
          }
        }
      }

      .line {
        height: 0.3125rem;
        background-color: #f9f9f9;
      }
    }
  }
}
</style>
