<template>
  <div id="card_detail">
    <c-title :hide="false"
             text='核销'></c-title>
              <div class="without"
         v-if="!result.familyCard && !result.onceCard && !result.timeCard&&familyMemberCard.length<=0">
      <div class="img">
        <img src="../../assets/images/energytank_vipblank@2x.png">
      </div>
      <p class="no-message">暂无卡片可以核销</p>
    </div>
    <div class="content">
      <div class="list-wrap">
        <van-radio-group v-model="radio"
                         checked-color="#ee2a2b">
          <div class="list" v-if="result.familyCard">
            <div class="title">
              <span class="red-line"></span>
              <span>会员卡信息</span>
            </div>
            <div class="list-content">
              <div class="item">
                <span>卡类型:{{result.familyCard.card_type_name}}</span>
              </div>
                <div class="item">
                <span>有效期:{{result.familyCard.expiration_day}}天</span>
              </div>
              <div class="item">
                <span>今日剩余次数:{{result.familyCard.available_num}}</span>
              </div>
              <van-radio :name="String(result.familyCard.id)"
                         class="radio"></van-radio>
            </div>
           
          </div>
          <div class="list" v-if="result.onceCard">
            <div class="title">
              <span class="red-line"></span>
              <span>会员卡信息</span>
            </div>
            <div class="list-content">
              <div class="item">
                <span>卡类型:{{result.onceCard.card_type_name}}</span>
              </div>
              <div class="item">
                <span>剩余次数:{{result.onceCard.use_count}}</span>
              </div>
              <van-radio :name="String(result.onceCard.id)"
                         class="radio"></van-radio>
            </div>
           
          </div>
           <div class="list" v-if="result.timeCard">
            <div class="title">
              <span class="red-line"></span>
              <span>会员卡信息</span>
            </div>
            <div class="list-content">
              <div class="item">
                <span>卡类型:{{result.timeCard.card_type_name}}</span>
              </div>
                <div class="item">
                <span>有效期:{{result.timeCard.expiration_day}}天</span>
              </div>
              <div class="item">
                <span>今日剩余次数:{{result.timeCard.available_num}}</span>
              </div>
              <van-radio :name="String(result.timeCard.id)"
                         class="radio"></van-radio>
            </div>
          
          </div>
          <div class="list" v-for="(item,index) in familyMemberCard" :key="index">
            <div class="title">
              <span class="red-line"></span>
              <span>会员卡信息</span>
            </div>
            <div class="list-content">
              <div class="item">
                <span>卡类型:{{item.card_type_name}}</span>
              </div>
                <div class="item">
                <span>有效期:{{item.expiration_day}}天</span>
              </div>
              <div class="item">
                <span>今日剩余次数:{{item.available_num}}</span>
              </div>
              <van-radio :name="String(item.id)"
                         class="radio"></van-radio>
            </div>
            
          </div>
        </van-radio-group>
      </div>
    </div>
    <template v-if="!status">
      <div class="btn" @click="confirm()"  v-if="result.familyCard||result.onceCard||result.timeCard||familyMemberCard.length>0">
        确认核销
    </div>
    </template>
    <template    v-if="status">
      <div class="btn-two">
        确认核销
      </div>
    </template>
  </div>
</template>

<script>
import cancellation_controller from './cancellation_controller';
export default cancellation_controller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#card_detail {
  padding-bottom: 1rem;
  background-color: #fff;

  .without {
    padding-top: 2.5rem;
    text-align: center;
    height: 100vh;

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
    background-color: #fff;

    .list-wrap {
      .list {
        padding-top: 0.75rem;
        padding-left: 0.75rem;
        border-bottom: solid 0.625rem #f5f7fa;
        padding-bottom: 1.1875rem;

        .title {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-bottom: 1.1875rem;

          .red-line {
            width: 0.1875rem;
            height: 1rem;
            background-image: linear-gradient(#ff4d48, #ff4d48), linear-gradient(#03d4c0, #03d4c0);
            background-blend-mode: normal, normal;
            display: inline-block;
            margin-right: 1rem;
          }
        }

        .list-content {
          padding-left: 1.1875rem;
          position: relative;

          .radio {
            position: absolute;
            right: 1.5rem;
            top: 50%;
          }

          .item {
            text-align: left;
            margin-top: 1.1875rem;
          }

          .item.first-child {
            margin-top: 0;
          }
        }
      }

      .list:last-child {
        border: none;
      }
    }
  }

  .btn {
    width: 18.75rem;
    height: 2.5rem;
    background-image:
      linear-gradient(
        0deg,
        #ff8a66 0%,
        #ff4946 84%
      ),
      linear-gradient(
        #03ddc8,
        #03ddc8
      );
    background-blend-mode:
      normal,
      normal;
    box-shadow:
      0 0.125rem 0.25rem 0
      rgba(255, 79, 73, 0.13);
    border-radius: 1.25rem;
    margin: 0 auto;
    color: #fff;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .btn-two {
    width: 18.75rem;
    height: 2.5rem;
    background-color: #ccc;
    box-shadow:
      0 0.125rem 0.25rem 0
      rgba(255, 79, 73, 0.13);
    border-radius: 1.25rem;
    margin: 0 auto;
    color: #fff;
    margin-top: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
}
</style>
