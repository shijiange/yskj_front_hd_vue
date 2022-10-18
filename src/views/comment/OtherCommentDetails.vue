<template>
  <div id="OtherCommentDetails">
    <c-title :hide="false" text='其它评价'></c-title>
    <div class="all">
      <div class="pjgoods">
        <div class="goods">
          <div class="img">
            <router-link :to='{name:"goods",params:{id:1},query:{i:toi}}'><img
              src="http://www.heliaigou.com/attachment/images/0/2016/12/Nw93tt3t5T9v3C5527Rjw9Xwwr22W9.jpg">
            </router-link>
          </div>
          <div class="inner">
            <div class="name">
              <router-link :to='{name:"goods",params:{id:1},query:{i:toi}}'> 奥康增高男鞋 新款真皮系带隐形内增高皮鞋韩版休闲鞋透气低帮鞋
              </router-link>
            </div>
            <div class="option">规格: 兰色+37</div>
          </div>

          <div class="price">
            <font>{{$i18n.t("money")}}299
              <br/> ×1</font>
            <!--<span><router-link :to='{name:"evaluate",params:{order_data:1}}' >评价</router-link></span>-->
            <span>评价</span>
          </div>
        </div>
      </div>

    </div>

    <div class="allpl">

      <div class="pj">
        <div layout="row"
             layout-align="start center"
             id="user">
          <div class="userimg"><img src="https://sfault-avatar.b0.upaiyun.com/726/291/726291045-57fdead795d4e_big64"/>
          </div>
          <div>jan横雅</div>
          <div class="spaet">2017.03.12 09:12:37</div>
        </div>
        <p>快递太慢，人员不足，卖家不在线~~~~~！！！！无人处理！</p>
      </div>
      <div class="pjhf" layout="row" layout-align="start center">
        <div class="pjtime">2017.03.12 09:12:37</div>
        <span>回复</span>
      </div>
      <div class="othepj" v-for="(n,i) in 3" :key='i'>
        <div class="pj" style="background: #efedf5;">
          <div layout="row"
               layout-align="start center"
               id="user">
            <div class="userimg"><img src="https://sfault-avatar.b0.upaiyun.com/726/291/726291045-57fdead795d4e_big64"/>
            </div>
            <div>jan横雅</div>
            <div class="spaet">2017.03.12 09:12:37</div>
          </div>
          <p>快递太慢，人员不足，卖家不在线~~~~~！！！！无人处理！</p>
          <div class="pjhf" layout="row" layout-align="start center">
            <div class="pjtime">2017.03.12 09:12:37</div>
            <span>回复</span>
          </div>
        </div>
      </div>
    </div>
    <div id="callback" layout="row" layout-align="start center">
      <input type="" placeholder="回复@昵称:"/>
      <button>提交</button>
    </div>
  </div>
</template>
<script>
import cTitle from "components/title";

export default {

  //name: 'login',
  data() {
    return {};
  },
  components: { cTitle }
};

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  #OtherCommentDetails {
    a {
      color: #000;
    }

    .all {
      background: #fff;
      padding: 0 0.625rem;
    }

    #callback {
      position: fixed;
      bottom: 0;
      width: 100%;
      background: #fff;
      padding: 0.625rem 0;

      input {
        flex: 5;
        border: #919191 solid 0.0625rem;
        border-radius: 0.3125rem;
        line-height: 1.875rem;
        padding-left: 0.3125rem;
        margin-left: 0.3125rem;
      }

      button {
        flex: 1;
        border: #dd191d solid 0.0625rem;
        border-radius: 0.3125rem;
        background: #e84e40;
        color: #fff;
        line-height: 1.875rem;
        margin: 0 0.625rem;
      }
    }

    .userimg {
      border: solid 0.0625rem #666;
      border-radius: 0.625rem;
      overflow: hidden;
      width: 1.25rem;
      margin-right: 0.625rem;

      img {
        display: block;
        width: 3.125rem;
      }
    }

    .zp {
      span {
        color: #e84e40;
      }
    }

    #zjpj {
      border-bottom: #e8e8e8 solid 0.0625rem;
      background: #fff;
      padding: 0.625rem 0;
    }

    .spaet {
      color: #919191;
      flex: 3;
      text-align: right;
    }

    .pj {
      border-bottom: #e8e8e8 solid 0.0625rem;
      background: #fff;
      padding: 0.625rem 0;

      p {
        text-align: left;
        margin: 0;
      }

      img {
        width: 100%;
      }
    }

    .pic {
      display: flex;
      align-items: stretch;
      flex-flow: row wrap;
      padding: 0.625rem;
      background: #fff;

      div {
        flex: 33%;

        img {
          width: 90%;
        }
      }
    }

    .pjgoods {
      padding: 0.625rem 0;
      background: #fff;
    }

    .goods {
      display: flex;
      align-items: stretch;
      flex-flow: row wrap;
      background: #e0e0e0;
      padding: 0.3125rem;

      .img {
        flex: 3;

        img {
          width: 100%;
        }
      }

      .inner {
        flex: 5;
        padding: 0 0.3125rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }

      .name {
        flex: 5;
        text-align: left;
      }

      .price {
        flex: 2;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        font {
          flex: 3;
        }

        span {
          border: solid 0.0625rem #bfcbd9;
          border-radius: 0.8125rem;
          padding: 0.0625rem 0.625rem;
          font-size: 12px;
          line-height: 1.2rem;
          margin: 0;
          background: #fff;
        }

        .yijp {
          background: #888;
          padding: 0 0.3125rem;
          color: #fff;
        }
      }

      .option {
        color: #888;
        font-size: 12px;
        flex: 1;
      }

      .option2 {
        color: #e84e40;
        font-size: 14px;
        flex: 1;
        width: 100%;

        font {
          float: left;
        }
      }
    }

    .allpl {
      margin-top: 0.625rem;
      margin-bottom: 3.125rem;
      background: #fff;
      padding: 0.625rem;

      .tilse {
        text-align: left;
        line-height: 2rem;
        border-bottom: #e8e8e8 solid 0.0625rem;
      }

      .pjhf {
        padding: 0.625rem 0;

        .pjtime {
          color: #919191;
          flex: 5;
          text-align: left;
        }

        span {
          padding: 0.0625rem 0.625rem;
          border: solid 0.0625rem #bfcbd9;
          border-radius: 0.8125rem;
        }
      }

      .othepj {
        background: #efedf5;
        padding-left: 1.875rem;
        padding-right: 0.625rem;
      }
    }
  }
</style>
