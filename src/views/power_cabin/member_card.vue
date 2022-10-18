<template>
  <div id="member_card">
    <c-title :hide="false"
             text='会员卡'></c-title>
      <div class="without"
         v-if="result.familyCard==0&&result.onceCard==0&&result.timeCard==0">
      <div class="img">
        <img src="../../assets/images/energytank_vipblank@2x.png">
      </div>
      <p class="no-message">暂无会员卡</p>
    </div>
    <div class="content" >
      <van-swipe style="height: 100%;" @change="getIndex" :initial-swipe="index">
 
        <van-swipe-item style="height: 100%;"
                        v-if="result.familyCard=='1'||result.familyCard=='2'">
          <div class="banner">
            <img :src="result.family_card_pic">
            <div class="type">
              家庭卡
            </div>
          </div>
          <div class="shop-info">
            <div class="title" v-if="result.team_dividend_agency">店铺信息</div>
            <div class="info" v-if="result.team_dividend_agency">
              <p>店铺名称：{{result.team_dividend_agency.shop_name}}</p>
              <p>联系方式：{{result.team_dividend_agency.phone}}</p>
              <p>店铺地址：{{result.team_dividend_agency.shop_address}}</p>
            </div>
          </div>
          <div class="line"></div>
          <div class="icon">
            <div class="item"
                 @click="toDetail('2')">
              <img src="../../assets/images/energytank_carddetle@2x.png">
              <span>卡详情</span>
            </div>
            <div class="item"
                 v-if="result.familyCard=='1'"
                 @click="toFamily('2')">
              <img src="../../assets/images/energytank_homemember@2x.png">
              <span>家庭成员</span>
            </div>
            <div class="item" @click="toRecord('2')">
              <img src="../../assets/images/energytank_record@2x.png">
              <span>核销记录</span>
            </div>
          </div>
         
        </van-swipe-item>
         <van-swipe-item v-if="result.onceCard">
          <div class="banner">
            <img :src="result.once_card_pic">
            <div class="type">
              次卡
            </div>
            <div class="time">
              {{result.onceCard.use_count}}次
            </div>
          </div>
          <div class="shop-info">
            <div class="title">店铺信息</div>
           <div class="info" v-if="result.team_dividend_agency">
              <p>店铺名称：{{result.team_dividend_agency.shop_name}}</p>
              <p>联系方式：{{result.team_dividend_agency.phone}}</p>
              <p>店铺地址：{{result.team_dividend_agency.shop_address}}</p>
            </div>
          </div>
          <div class="line"></div>
          <div class="icon">
            <div class="item"
                 @click="toDetail('0')">
              <img src="../../assets/images/energytank_carddetle@2x.png">
              <span>卡详情</span>
            </div>
            <div class="item"  @click="toRecord('0')">
              <img src="../../assets/images/energytank_record@2x.png">
              <span>核销记录</span>
            </div>
          </div>
          
        </van-swipe-item>
        <van-swipe-item v-if="result.timeCard">
          <div class="banner">
            <img :src="result.time_card_pic">
            <div class="type">
              时间卡
            </div>
            <div class="time">
              {{result.timeCard.created_at}}
            </div>
          </div>
          <div class="shop-info">
            <div class="title">店铺信息</div>
            <div class="info" v-if="result.team_dividend_agency">
              <p>店铺名称：{{result.team_dividend_agency.shop_name}}</p>
              <p>联系方式：{{result.team_dividend_agency.phone}}</p>
              <p>店铺地址：{{result.team_dividend_agency.shop_address}}</p>
            </div>
          </div>
          <div class="line"></div>
          <div class="icon">
            <div class="item"
                 @click="toDetail('1')">
              <img src="../../assets/images/energytank_carddetle@2x.png">
              <span>卡详情</span>
            </div>
            <div class="item"  @click="toRecord('1')">
              <img src="../../assets/images/energytank_record@2x.png">
              <span>核销记录</span>
            </div>
          </div>
         
        </van-swipe-item> 
      </van-swipe>
    </div>
  </div>
</template>

<script>
import member_card_controller from './member_card_controller';
export default member_card_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#member_card {
  height: 100vh;
  background-color: #fff;

  .without {
    padding-top: 2.5rem;
    text-align: center;

    .img {
      width: 19.1875rem;
      height: 12.75rem;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .no-message {
      margin-top: 2.125rem;
      color: #999;
    }

    .without-btn {
      width: 18.75rem;
      height: 2.5rem;
      background-image: linear-gradient(0deg, #ff8a66 0%, #ff4946 84%), linear-gradient(#03ddc8, #03ddc8);
      background-blend-mode: normal, normal;
      box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
      border-radius: 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 16px;
      margin: 0 auto;
      margin-top: 2.5rem;
    }
  }

  .content {
    padding-top: 1.625rem;
    height: 100%;

    .banner {
      width: 21.5625rem;
      height: 9.8125rem;
      border-radius: 1.0625rem;
      margin: 0 auto;
      position: relative;

      .type {
        position: absolute;
        left: 0.75rem;
        bottom: 0.625rem;
      }

      .time {
        position: absolute;
        top: 0.75rem;
        right: 0.625rem;
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 1.0625rem;
      }
    }

    .shop-info {
      width: 21.5625rem;
      padding-bottom: 1.625rem;
      margin: 0 auto;

      .title {
        font-size: 16px;
        margin-bottom: 1.625rem;
        margin-top: 1.625rem;
        text-align: left;
      }

      .info {
        text-align: left;
        padding-left: 0.5rem;

        p {
          margin-bottom: 1.1875rem;
        }

        p:last-child {
          margin-bottom: 0;
        }
      }
    }

    .line {
      height: 0.625rem;
      background-color: #f5f7fa;
    }

    .icon {
      width: 100%;
      padding-top: 1.5625rem;
      display: flex;

      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 33%;
        align-items: center;

        img {
          width: 2.6875rem;
          height: 2.6875rem;
        }

        span {
          margin-top: 1rem;
          color: #666;
        }
      }
    }

    .btn-wrap {
      position: absolute;
      bottom: 0.5rem;
      width: 100%;

      .btn {
        width: 18.75rem;
        height: 2.5rem;
        background-image: linear-gradient(0deg, #ff8a66 0%, #ff4946 84%), linear-gradient(#ff4846, #ff4846);
        background-blend-mode: normal, normal;
        box-shadow: 0 0.125rem 0.25rem 0 rgba(255, 79, 73, 0.13);
        border-radius: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 16px;
        margin: 0 auto;
      }
    }
  }
}
</style>
<style>
#member_card .van-swipe__indicators {
  display: none !important;
}
</style>
