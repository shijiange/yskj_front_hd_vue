<template>
  <div id="commentDetails">
    <c-title :hide="false" text="评价详情"></c-title>
    <div class="all">
      <div class="pj">
        <div layout="row" layout-align="start center" id="user">
          <div class="userimg"><img :src="head_img_url" /></div>
          <div class="name">
            <div>{{ nick_name }}</div>
            <div class="level-name">{{ level_name }}</div>
          </div>
          <div class="spaet">{{ created_at }}</div>
        </div>
        <p>
          <span v-if="content">{{ content }}</span>
          <span v-else style="color: #908a8a;">此用户没有填写评价</span>
        </p>
      </div>
      <div style="text-align: left; padding-left: 1rem;" v-if="images && images.length > 0">
        <div style="margin:0.5rem 0">晒图：</div>
        <viewer :images="images">
          <img :src="item" v-for="(item, index) in images" :key="index" class="pj-img" alt="" />
        </viewer>
      </div>
      <div style="text-align: left; margin: 5px; line-height: 1.25rem; height: 1.25rem;">
        <span style="height: 1.25rem; line-height: 1.25rem; float: left; margin-left: 0.8rem;">评分：</span>
        <van-rate v-model="level" readonly />
      </div>
      <!-- <div style="text-align: left; margin: 5px; line-height: 1.25rem; height: 1.25rem;" v-if="worker_score">
        <span style="height: 1.25rem; line-height: 1.25rem; float: left; margin-left: 0.5rem;">{{ worker_score.worker_name }}安装师傅评分：</span>
        <van-rate v-model="worker_score.worker_score" readonly />
      </div> -->
      <div id="zjpj" v-if="append && !(append instanceof Array)">
        <div class="zp" layout="row">
          <span class="append-class" v-if="append.diff_date.value > 0">{{ append.diff_date.value }}{{ append.diff_date.sku }}追评:</span>
          <span class="append-class" v-else>追评:</span>
          <span style="margin-left: 0.3rem">{{ append.content }}</span>
        </div>
        <div class="pic">
          <viewer :images="append.images">
            <img v-for="(item, index) in append.images" :key="index" class="pj-img" :src="item" />
          </viewer>
        </div>
      </div>
      <div class="pjgoods" v-if="has_one_order_goods" @click="toGoods(has_one_order_goods.goods_id)">
        <div class="goods">
          <div class="img">
            <img :src="has_one_order_goods.thumb" />
          </div>
          <div class="warp">
            <ul class="inner">
              <li class="name">{{ has_one_order_goods.title }}</li>

              <li class="option">规格: {{ has_one_order_goods.goods_option_title }}</li>
            </ul>

            <ul class="price">
              <li class="product_price">
                <small>{{ $i18n.t("money") }}</small
                >{{ has_one_order_goods.price }}
              </li>
              <li class="option">×{{ has_one_order_goods.total }}</li>
              <!--<span><router-link :to='{name:"evaluate",params:{order_data:1}}' >评价</router-link></span>-->
              <!--<span @click="">评价</span>-->
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="allpl" v-if="has_many_reply.length > 0">
      <div class="tilse"><i class="fa fa-comment-o" style="font-size: 1.125rem;"></i>全部评论</div>

      <div class="pj">
        <div layout="row" layout-align="start center" id="user">
          <div class="userimg"><img :src="head_img_url" /></div>
          <div><span>{{ nick_name }}</span></div>
          <div class="spaet">{{ created_at }}</div>
        </div>
        <p>{{ content }}</p>
      </div>
      <div class="pjhf" layout="row" layout-align="start center">
        <div class="pjtime">{{ created_at }}</div>
        <span @click="submitReplyForComment">回复</span>
      </div>
      <div class="othepj" v-if="has_many_reply.length > 0">
        <div v-for="(item, i) in has_many_reply" class="pj" style="background: #efedf5;" :key="i">
          <div layout="row" layout-align="start center" id="user">
            <div class="userimg"><img :src="item.head_img_url" /></div>
            <div>{{ item.nick_name }}</div>
            <div class="spaet">{{ item.created_at }}</div>
          </div>
          <p>{{ item.nick_name }}回复{{ item.reply_name }}:{{ item.content }}</p>
          <viewer :images="item.images" class="pjImgs">
            <div class="pjImgWrapper" v-for="(imgItem, imgIndex) in item.images" :key="imgIndex">
              <img :src="imgItem" alt="" />
            </div>
          </viewer>
          <div class="pjhf" layout="row" layout-align="start center">
            <div class="pjtime">{{ item.created_at }}</div>
            <span @click="replyToSomeOne(item)">回复</span>
          </div>
        </div>
      </div>
    </div>
    <div style="height: 60px;"></div>
    <div id="callback" layout="row" layout-align="start center" class="set-pc-styleLeft">
      <input v-model="reply_content" type="" :placeholder="reply_placeholder" />
      <button @click="submitReply">提交</button>
      <div class="share-btn" @click="showShareOverlay">分享</div>
    </div>

    <yz-wechat-share-img v-model="isShowShare"></yz-wechat-share-img>
  </div>
</template>
<script>
//CommentDetailsController
import CommentDetailsController from "./CommentDetailsController";
export default CommentDetailsController;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#commentDetails {
  a {
    color: #000;
  }

  .all {
    background: #fff;
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

    .share-btn {
      flex: 1;
      text-align: center;
      color: #6c6b6b;
      line-height: 1.875rem;
      margin: 0 0.625rem;
    }
  }

  .userimg {
    border-radius: 50%;
    overflow: hidden;
    width: 2.5rem;
    margin-right: 0.625rem;

    img {
      display: block;
      width: 100%;
    }
  }

  .zp {
    .append-class {
      white-space: nowrap;
      word-break: break-all;
      color: #e84e40;
    }
  }

  #zjpj {
    border-bottom: #e8e8e8 solid 0.0625rem;
    background: #fff;
    padding: 0.625rem 1rem;
    text-align: left;
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
    margin: 0 1rem;

    p {
      text-align: left;
      margin-top: 0.625rem;
      line-height: 1.5rem;
      font-size: 14px;
    }

    img {
      width: 100%;
    }

    .name {
      font-size: 14px;
      .level-name {
        color: #8c8c8c;
        margin-top: 0.3rem;
      }
    }
    .pjImgs {
      display: flex;
      flex-wrap: wrap;

      .pjImgWrapper {
        height: 2.8rem;
        padding: 0.15rem;

        img {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }
  }

  .pj-img {
    width: 5rem;
    height: 5rem;
    margin: 0 0.5rem 0.5rem 0;
    object-fit: cover;
  }

  .pic {
    display: flex;
    align-items: stretch;
    flex-flow: row wrap;
    padding: 0.625rem 0;
    background: #fff;
  }

  .pjgoods {
    padding: 0.625rem 0;
    background: #fff;
  }

  .goods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goods {
    /* display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: stretch;
            -ms-flex-align: stretch;
            align-items: stretch;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-flow: row wrap;
            flex-flow: row wrap;
            */

    width: 100%;
    box-sizing: border-box;
    background: #fafafa;

    .img {
      /* flex: 1; */
      width: 6rem;
      height: 6rem;
      padding: 0.875rem;
      float: left;
      display: inline-block;

      /* background:blue; */
      img {
        width: 100%;
      }
    }

    .warp {
      width: 70%;
      padding-top: 0.625rem;
      padding-right: 1rem;
      float: left;
      display: inline-block;

      .inner {
        width: 70%;
        float: left;
        box-sizing: border-box;
        text-align: left;

        .name {
          text-align: left;
          color: #333;
          margin-bottom: 0.625rem;
          font-size: 14px;
        }
      }

      .price {
        width: 30%;
        align-items: center;
        text-align: right;
        color: #333;
        box-sizing: border-box;
        float: left;
        padding-right: 0.25rem;

        p {
          margin-top: 0;
        }
      }
    }

    .product_price {
      margin-bottom: 0.625rem;
      font-size: 14px;
    }

    /*	.price {flex: 2;display: flex;flex-direction: column;align-items: flex-end;
			font {flex: 3;}
			span {border: solid 1px #BFCBD9;border-radius: 13px;padding: 1px 10px;font-size: .8rem;line-height: 1.2rem;	margin: 0;background: #FFF;}
			.yijp {	background: #888888;padding: 0 5px;color: #FFF;	}
		} */
    .option {
      color: #8c8c8c;
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
