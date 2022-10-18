<template>
  <div id="my_bank"
       ref="my_bank">
    <c-title :hide="false"
             text="我的银行卡"></c-title>
    <div class="content">
      <ul>
        <li v-for="(item,index) in datas"
            :key="index">
          <div class="left">
            <div class="logo">
              <img src="../../../assets/images/bank_logo.png">
            </div>
            <div class="text">
              <p class="bank_name">{{item.bankName}}</p>
              <p class="bank_type">{{item.bankCardType}}</p>
            </div>
          </div>
          <div class="absolute">
            <span>{{item.isAcFlg}}</span>
          </div>
          <div class="bottom">
            {{item.account}}
          </div>
        </li>
      </ul>
      <div class="blank"
           v-if="datas.length<=0">
        <img src="../../../assets/images/blank.png">
        <span>还没有记录哦</span>
      </div>
    </div>
  </div>
</template>

<script>
import my_bank_controller from "./my_bank_controller";
export default my_bank_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#my_bank {
  background-color: #fff;

  .content {
    padding: 1rem;
    padding-bottom: 0;

    ul {
      li {
        margin-top: 1rem;
        padding-top: 1rem;
        padding-left: 1rem;
        position: relative;
        width: 100%;
        height: 8rem;
        background-size: 100% 100%;
        background-image: url("../../../assets/images/bank_bg.png");

        .left {
          display: flex;
          align-items: center;
          text-align: left;

          .logo {
            width: 2.5rem;
            height: 2.5rem;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            img {
              width: 1.5rem;
              height: 1.5rem;
            }
          }

          .text {
            margin-left: 0.5rem;

            .bank_name {
              font-size: 16px;
              color: #fff;
            }

            .bank_type {
              font-size: 12px;
              color: rgba(255, 255, 255, 0.71);
            }
          }
        }

        .absolute {
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4rem;
          height: 2rem;
          background-color: rgba(1, 59, 110, 0.64);
          border-radius: 0 1rem 0 1rem;

          span {
            color: #fff;
            font-size: 14px;
          }
        }

        .bottom {
          margin-top: 2rem;
          text-align: center;
          color: #fff;
          font-size: 18px;
        }
      }

      li:first-child {
        margin-top: 0;
      }
    }

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
  }
}
</style>
