<template>
  <div id="evaluate">
    <c-title :hide="false" text="评价"></c-title>
    <div id="shop">
      <div class="goods">
        <div class="img"><img :src="good.thumb" /></div>

        <div class="warp">
          <ul class="inner">
            <li class="name">{{ good.title | escapeTitle }}</li>
            <li class="option" v-if="good.goods_option_title">规格: {{ good.goods_option_title }}</li>
          </ul>
          <ul class="price">
            <li class="product_price">
              <small>{{ $i18n.t("money") }}</small
              >{{ good.price }}
            </li>
            <li class="option">×{{ good.total }}</li>
          </ul>
        </div>
      </div>

      <div id="pjall">
        <div class="clearfloat" style="width: 100%; text-align: left; line-height: 2rem;">
          <span>评论:</span>
        </div>
        <van-cell-group>
          <van-field v-model="comment" type="textarea" placeholder="请输入评论内容" rows="2" />
        </van-cell-group>
        <div style="height: 0.625rem;"></div>
        <div class="clearfloat" style="width: 100%; text-align: left; line-height: 2rem;">
          <span>晒图:</span>
        </div>
        <div class="clearfloat" style="width: 100%; text-align: left; line-height: 5rem;">
          <template v-for="(val, index) in fileList4">
            <div class="photobox" :key="index" style="float: left; max-width: 25%;">
              <img :src="val" style="max-width: 5rem;" />
              <van-icon @click="removeImg_1(index)" name="close" style="width: 1.2rem; height: 1.2rem; position: absolute; top: 0.1rem; right: 0.1rem; color: red; font-weight: 900;" />
            </div>
          </template>
          <van-uploader :disabled="fileList4.length >= 5" :after-read="multipleMethod_1" multiple>
            <div style="padding-left: 1rem; padding-top: 1rem; width: 5rem; height: 5rem; border: 1px dashed #c0ccda;">
              <img :src="require('../../assets/images/up_icon.png')" style="max-height: 3rem;" class="avatar" />
            </div>
          </van-uploader>
        </div>
        <div id="pj" class="clearfloat">
          <span>评分:</span>
          <van-rate v-model="level" @change="getStar" />
        </div>
        <div id="pj" class="clearfloat" v-if="good.is_install">
          <span>{{ good.install_another_name.worker_name }}评价:</span>
          <van-rate v-model="worker_score" @change="getStar" />
        </div>
      </div>
    </div>
    <div class="score-box" v-if="is_score_latitude">
      <div class="score-item"><span>描述/包装</span><van-rate v-model="describeScore" /></div>
      <div class="score-item"><span>物流服务/配送</span><van-rate v-model="deliveryScore" /></div>
      <div class="score-item"><span>服务态度/质量</span><van-rate v-model="serviceScore" /></div>
    </div>

    <div class="authorize_confirm" v-if="is_crm">
      <van-checkbox v-model="checked_confirm"  checked-color="#f15353">1.本人确认该上传内容（视频、图片、文字）为本人委托益生康健云平台服务编辑内容，未作实质性修改。
      </van-checkbox>
    </div>
    <div class="authorize_confirm_again" v-if="is_crm">
      <van-checkbox v-model="checked_confirm_again"   checked-color="#f15353">
        2.本人确认该上传内容（视频、图片、文字）为本人真实意思表示，同意上传，且知悉社区内容发布规范。
      </van-checkbox>
    </div>


    <div class="submit-tbn">
      <van-button type="danger" @click="toComment(good)">提交评价</van-button>
    </div>
  </div>
</template>
<script>
import order_list_evaluatecontroller from "./evaluatecontroller";
export default order_list_evaluatecontroller;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
#evaluate {
  #shop {
    background: #fff;
    padding: 0.625rem 0 0 0;
  }

  .goods::after {
    content: "";
    display: block;
    clear: both;
  }

  .goods {
    /* display: flex;
		align-items: stretch;
		flex-flow: row wrap;
		background: #efeded;
		padding: 5px;
		margin-bottom: 5px;
		.img {
			flex: 3;
			img {
				width: 100%;
			}
		}
		.inner {
			flex: 5;
			padding: 0 5px;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}
		.name {
			flex: 5;
			text-align: left
		}
		.price {
			flex: 2;
			align-items: center;
		} */

    display: flex;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;

    .img {
      width: 6rem;
      height: 6rem;
      padding: 0.875rem;
      display: inline-block;

      /* background:blue; */
      img {
        width: 100%;
      }
    }

    .warp {
      width: 70vw;
      padding: 0.625rem 1rem 0 0;
      display: inline-block;

      .inner {
        width: 70%;
        float: left;
        box-sizing: border-box;
        padding: 0 0.625rem;
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

        p {
          margin-top: 0;
        }
      }
    }

    .product_price {
      margin-bottom: 0.625rem;
      font-size: 14px;
    }

    .option {
      color: #8c8c8c;
      font-size: 12px;
      flex: 1;
    }
  }

  #pjall {
    background: #fff;
    padding: 0.625rem 0.875rem;

    .upfile {
      text-align: left;
      margin-top: 0.625rem;

      li {
        width: 20vw;
        float: left;
        height: 20vw;
        line-height: 20vw;
      }

      i {
        font-size: 1rem;
        border: 0.0625rem dashed #919191;
        font-weight: normal;
        color: #919191;
        padding: 0.625rem;
      }

      img {
        width: 100%;
      }
    }

    textarea {
      width: 87%;
      margin-top: 0.625rem;
      padding: 0.625rem;
    }

    #pj {
      text-align: left;

      span {
        float: left;
        font-size: 14px;
        padding-right: 0.625rem;
      }

      .van-rate {
        float: right;
      }
    }

    .van-cell-group {
      border: 1px solid #bfcbd9;
      border-radius: 4px;

      .van-cell {
        border-radius: 4px;
      }
    }
  }

  button {
    width: 90%;
    margin-top: 1.25rem;
    height: 2.25rem;
  }

  .submit-tbn {
    button {
      width: 90%;
      background-color: #f15353;
      height: 2.875rem;
      border-radius: 0.25rem;
      font-size: 16px;
      color: #fff;
      border: none;
    }
  }

  .score-box {
    margin-top: 0.625rem;
    background: #fff;
    padding: 0.625rem 0.875rem;
    .score-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.625rem 0;
    }
  }

    .authorize_confirm,.authorize_confirm_again{
      font-size: 0.88rem;
      color: #999;
      padding: 1rem 0.875rem 1rem;
      text-align:left;
    }
    .authorize_confirm_again{
      padding-bottom:4rem;
    }
    .van-checkbox{
      -webkit-box-align: start;
      -webkit-align-items: start;
      -ms-flex-align: start;
      align-items: start;
    }
  .photobox {
    position: relative;
    width: 5rem;
    height: 5rem;
    border: 1px dashed #c0ccda;

    /* float: left; */
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    margin-bottom: 0.2rem;

    img {
      width: 100%;
      height: 100%;
    }
  }

  /* 清除浮动代码 */
  .clearfloat::after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }

  .clearfloat {
    zoom: 1;
  }
}
</style>
