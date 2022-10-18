<template>
  <div id="love_index">
    <c-title :hide="false" :text="'缴纳服务费'"></c-title>
    <div id="content">
      <div class="recharge">
        <ul class="recharge_a">
          <li>缴纳服务费</li>
          <li>
            <input type="text"
                   placeholder="0"
                   v-model="money" />
          </li>
        </ul>
        <p>

        </p>
      </div>
      <div class="recharge_way">
        <h1>缴纳方式</h1>
        <ul class="choose_box">
          <li @click="confirm(btn.value)"
              v-for="(btn,i) in buttons" :key='i'>
            <i class="iconfont"
               :class="[btnclass(btn.value)]"> </i>
            {{ btn.name }}充值
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import Controller from "./recharge_Controller";
export default Controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#love_index {
  #content {
    margin-top: 0.625rem;

    .current {
      padding-left: 0.875rem;
      font-size: 16px;
      background: #fff;

      li {
        line-height: 2.875rem;
        text-align: left;
        display: flex;
        justify-content: flex-start;
        border-bottom: solid 0.0625rem #ebebeb;
      }

      span {
        font-size: 16px;
        text-align: left;
      }

      span:first-child {
        width: 6.875rem;
        display: block;
        text-align: left;
      }
    }

    .recharge {
      background: #fff;
      padding: 0.625rem 0.875rem;

      .recharge_a {
        li:first-child {
          line-height: 2.5rem;
          text-align: left;
          font-size: 16px;
        }

        li:nth-child(2) {
          height: 3.75rem;
          font-size: 32px;
          // font-weight: bold;
          display: flex;
          align-items: flex-end;

          input {
            width: 18.75rem;
            font-size: 44px;
            line-height: 3rem;
            border: none;
            margin-left: 0.625rem;
          }
        }
      }

      p {
        height: 2.25rem;
        line-height: 2.25rem;
        text-align: left;
        font-size: 14px;
        color: #8c8c8c;
        border-top: solid 0.0625rem #ebebeb;
      }
    }
    //   .box{
    //       background:#fff;
    //       .current{
    //           padding-left:0.875rem;
    //           li{
    //               text-align: left;
    //               display: flex;
    //               font-size:16px;
    //               line-height: 2.8125rem;
    //               border-bottom:solid 0.0625rem #ebebeb;
    //               span:last-child{
    //                   color:#f15353;
    //               }
    //           }
    //       }
    //       .recharge{
    //           padding:0.625rem 0.875rem;
    //           li{
    //               text-align: left;
    //              span{
    //                     font-size:16px;
    //                     line-height: 1.875rem;
    //                 }
    //                 input{
    //                     border:none;
    //                     font-size:28px;
    //                     line-height: 3rem;
    //                 }
    //           }
    //           li:last-child{
    //               font-size:28px;
    //           }
    //       }
    //       p{
    //           padding: 0 0.875rem;
    //           background:#fafafa;
    //           line-height: 2.25rem;
    //           color:#8c8c8c;
    //           text-align: left;
    //           font-size:14px;
    //       }
    //   }
    .btn {
      margin-top: 1.5rem;

      button {
        width: 90%;
        height: 2.875rem;
        margin-bottom: 1rem;
        border-radius: 0.25rem;
        border: none;
        color: #fff;
        font-size: 16px;
      }

      .btn_a {
        background-color: #19ad19;
      }

      .btn_b {
        background-color: #22aaed;
      }
    }

    .recharge_way {
      background: #fff;
      margin-top: 0.625rem;

      h1 {
        line-height: 2.5rem;
        text-align: left;
        padding: 0 0.875rem;
        font-size: 16px;
      }

      li {
        position: relative;
        display: flex;
        align-items: center;
        line-height: 3.5rem;
        font-size: 16px;
        margin-left: 1.25rem;
        padding-right: 1.25rem;
        border-bottom: solid 0.0625rem #ebebeb;

        .iconfont_bg {
          background: #f15353;
          width: 2.25rem;
          height: 1.5rem;
          border-radius: 0.1875rem;
          display: flex;
          align-items: center;
          margin-right: 0.625rem;
        }

        .icon-balance_d {
          color: #00908c;
        }

        .icon-balance_e {
          color: #64b42e;
        }

        .icon-balance_f {
          color: #fac337;
        }

        .icon-balance_g {
          color: #fac337;
        }

        .icon-balance_h {
          color: #00508e;
        }

        .icon-balance_j {
          color: #29a1f7;
        }

        .icon-balance_i {
          color: #6cbf6a;
        }

        .iconfont {
          font-size: 2rem;
          margin-right: 0.625rem;
        }
      }

      li:last-child {
        border: none;
      }
    }
  }
}
</style>
