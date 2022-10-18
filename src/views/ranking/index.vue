<template>
  <div id="income">
    <c-title :hide="true" text='排行榜'></c-title>
    <!--<c-myextension v-if="!is_agent"></c-myextension>-->
    <div class="myextension">
      <div class="banner">
        <img :src="info_img" v-if="!(info_img=='' ||info_img==undefined||info_img==null)">

        <img src="../../assets/images/myextension.png" v-if="(info_img=='' ||info_img==undefined||info_img==null)">
      </div>
    </div>

    <div>
      <h4>排行榜
        <span id="pricerg">
				<font color="red"></font></span>
      </h4>
      <template>
        <van-grid :column-num="2">
          <van-grid-item
            :link="fun.getUrl((teamDividendRankingLevel=='1'?'rankingListFirst':'rankingListSecond'),{'action':teamDividendRankingAction,'title':teamDividendTitle})"
            v-if="isTeamDividendShow">
            <span slot="text">{{teamDividendTitle}}
							<font></font></span>
          </van-grid-item>
        </van-grid>
      </template>
    </div>
    <div style="height: 3.75rem;"></div>
  </div>
</template>
<script>
import index_controller from "./index_controller";

export default index_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #income {
    .header {
      height: auto;
      background: #f15353;
      background-size: 100% 100%;
      padding: 0.625rem;
      position: relative;
    }

    .header .user {
      height: 7.5rem;
      text-align: center;
    }

    .header .user .user-head {
      box-sizing: content-box;
      height: 3rem;
      width: 3rem;
      background: #fff;
      border-radius: 50%;
      border: 0.125rem solid #fff;
      margin: 0.375rem auto;
    }

    .header .user .user-head img {
      height: 3rem;
      width: 3rem;
      border-radius: 50%;
    }

    .header .user .user-info {
      height: 3rem;
      width: 100%;
      float: left;
      color: #fff;
    }

    .header .user .user-info .user-name {
      height: 1.5rem;
      width: auto;
      font-size: 12px;
      line-height: 1.25rem;
    }

    .header .user .user-info .user-other {
      height: 1.25rem;
      width: auto;
      font-size: 12px;
      opacity: 0.8;
    }

    .header .user-gold {
      height: 2.1875rem;
      width: 94%;
      padding: 0.3125rem 3%;
      border-bottom: 0.0625rem solid #e3e3e3;
      background: #fff;
      font-size: 12px;
      line-height: 2.1875rem;
    }

    .header .user-gold .title {
      height: 2.1875rem;
      width: auto;
      float: left;
      color: #666;
    }

    .header .user-gold .num {
      height: 2.1875rem;
      width: auto;
      float: left;
      color: #f90;
    }

    .header .user-gold .draw {
      width: 5rem;
      height: 1.875rem;
      background: #6c9;
      float: right;
    }

    .header .user .set {
      position: absolute;
      right: 0.625rem;
      top: 0.625rem;
      color: #fff;
      font-size: 14px;
    }

    .header .user-op {
      height: 2.1875rem;
      width: 94%;
      padding: 0.3125rem 3%;
      border-bottom: 0.0625rem solid #e3e3e3;
      background: #fff;
      font-size: 12px;
      line-height: 2.1875rem;
    }

    h3 {
      background: #fff;
      margin: 0.625rem 0 0;
      font-weight: normal;
      font-size: 14px;
      height: 2.5rem;
      box-sizing: border-box;
      line-height: 2.5rem;
      color: #f15353;
      border-bottom: 1px solid #ddd;

      span {
        color: #999;
      }
    }

    h4 {
      background: #f5f5f5;
      text-align: left;
      font-weight: normal;
      font-size: 12px;
      height: 2.3rem;
      box-sizing: border-box;
      line-height: 2.3rem;
      color: #333;
      border-bottom: 0.0625rem solid #eee;
      padding: 0 0.625rem;

      span {
        color: #999;
      }
    }

    #gongge {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      column-count: 3;
      padding: 0.625rem 0;
      margin-bottom: 0.625rem;

      li {
        flex: 33%;
        padding: 0 0.625rem;
        border: 0.0625rem solid #ccc;
        margin: 0.1875rem;
        border-radius: 0.3125rem;

        i {
          font-size: 34px;
          color: #eb3943;
          margin: 0.625rem 0;
        }

        a {
          color: #333;
          font-size: 14px;

          img {
            width: 1.4375rem;
            margin: 0.3125rem 0;
          }

          font {
            color: #e84e40;
            font-size: 12px;
            padding-top: 0.3125rem;
          }
        }
      }
    }

    #un-gongge {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      column-count: 3;
      padding: 0.625rem 0;

      li {
        flex: 25%;
        padding: 0 0.625rem;

        i {
          font-size: 34px;
          margin: 0.9375rem 0;
        }

        a {
          color: #333;
          font-size: 12px;

          img {
            width: 1.4375rem;
            margin: 0.3125rem 0;
          }

          font {
            color: #e84e40;
            font-size: 12px;
            padding-top: 0.3125rem;
          }
        }
      }
    }

    #pricerg {
      text-align: right;
      float: right;
    }

    .mszf {
      background: #fff;
      padding: 0 0.625rem;
      margin: 0;
      text-align: left;
      overflow: hidden;
      margin-top: 0.625rem;
      height: 2.75rem;
      box-sizing: border-box;
      line-height: 2.75rem;
      font-size: 14px;
      color: #333;

      i {
        font-size: 17px;
        float: right;
        line-height: 2.75rem;
        color: #999;
      }

      span {
        float: left;
      }

      a {
        color: #000;
        display: block;
      }
    }
  }

  a {
    text-decoration: none;
    color: #222;
  }

  input {
    border-width: 0;
  }

  .myextension .banner img {
    width: 100%;
  }

  .myextension .main {
    position: relative;
    top: -0.25rem;
  }

  .welcome {
    padding: 0.625rem;
    background: #fff;

    .text {
      p {
        font-size: 12px;
        color: #666;
        line-height: 1.2rem;

        span {
          color: #f55955;
        }
      }
    }

    .info {
      margin-top: 0.625rem;

      input {
        display: block;
        margin-bottom: 0.5rem;
        width: 100%;
        height: 2rem;
        border-radius: 0.3125rem;
        padding: 0 0.3125rem;
        box-sizing: border-box;
        outline: none;
      }

      .inp {
        border: 0.0625rem solid #b8b8b8;
      }

      .inp:focus {
        border-color: #f55955;
        box-sizing: border-box;
      }

      span {
        color: #f55955;
      }

      .btn {
        background: #f55955;
        color: #fff;
        margin-bottom: 0.5rem;
        width: 100%;
        height: 2rem;
        border-radius: 0.3125rem;
        padding: 0 0.3125rem;
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        line-height: 2rem;

        i {
          display: inline-block;
        }
      }

      .btn:focus {
        background: #d8403c;
      }
    }
  }

  .myextension .main .vip_main {
    background: #fff;
    margin: 0.9375rem 0;

    .title {
      padding: 0.625rem;
      font-size: 12px;
      border-bottom: 0.0625rem solid #eee;
      text-align: center;
    }

    .vip {
      padding: 0.9375rem 0.625rem;
      overflow: hidden;
      font-size: 12px;
      color: #999;

      .ico1,
      .ico2 {
        width: 15%;
        float: left;
      }

      .ico1 {
        i {
          background: #32cd32;
        }
      }

      .ico2 {
        i {
          background: #fece00;
        }
      }

      .text {
        float: left;
        width: 85%;

        .t1 {
          font-size: 16px;
          color: #333;
          margin-bottom: 0.3125rem;
          text-align: left;
        }

        .t2 {
          text-align: justify;
        }
      }

      i {
        background: #32cd32;
        height: 2.25rem;
        width: 2.25rem;
        border-radius: 1.125rem;
        color: #fff;
        text-align: center;
        line-height: 2.375rem;
        font-size: 18px;
      }
    }

    .vip1 {
      border-bottom: 0.0625rem solid #eee;
    }
  }

  .myextension .success {
    height: 12.5rem;
    padding-top: 4.0625rem;
    background: #fff;

    .ico {
      height: 4.0625rem;
      width: 4.0625rem;
      margin: auto;
      border: 0.1875rem solid #32cd32;
      border-radius: 4rem;
      color: #32cd32;
      font-size: 36px;
      text-align: center;
      line-height: 4rem;
    }

    .text {
      height: 2rem;
      margin-top: 1.875rem;
      color: #666;
      line-height: 1.6rem;
      text-align: center;
    }

    a .sub {
      height: 2rem;
      width: 80%;
      background: #f55955;
      margin: 1.25rem auto;
      border-radius: 2rem;
      color: #fff;
      line-height: 2rem;
      text-align: center;
      font-size: 14px;
      margin-bottom: 1.25rem;
    }

    a .sub:focus {
      background: #d8403c;
    }
  }
</style>
