<template>
  <div class="comment_allgoods"
       id="comment-goods">
    <div class="comment_item"
         v-for="(good,good_index) in has_many_order_goods" :key='good_index'>
      <div class="goods">
        <a
          class="content">
          <img class="image"
               :src="good.thumb"
               width="50">
          <p class="name">{{good.title}}</p>
          <p class="price">{{$i18n.t("money")}}{{good.goods_price}}</p>
        </a>
      </div>
      <div class="foot">
        <div class="action">
					<span class="btn btn_1"
                @click="goEvaluate($event,index)">{{iscomment?"填写评价":"查看评价"}}<i class='fa'
                                                                                :class="{'fa-angle-down':index==display,'fa-angle-right':index!=display}"></i></span>
        </div>
      </div>

      <div class="inner"
           :class="{display: index==display}">
        <i class="arrow"></i>
        <div class="comment_view">
          <template v-if='iscomment'>
            <span class="label">评分：</span>
            <div class="stars"
                 data-tag="comment-scores">
              <!--<el-rate v-model="level"-->
              <!--show-text-->
              <!--@change="getStar"></el-rate>-->
              <van-rate v-model="level" @change="getStar"/>
            </div>
          </template>
          <template v-if='!iscomment'>
						<span class="label">
							<!--<el-rate v-model="comments[good_index]" disabled text-color="#ff9900" text-template="很好"></el-rate>-->
							<van-rate v-model="comments[good_index]" disabled disabled-color="#ff9900"/>
						</span>
          </template>
        </div>
        <div class="comment_textarea">
          <div class="textarea_wrap">
            <template v-if='!disabled[good_index]'>
              <!--<el-input :disabled="disabled[good_index]"-->
              <!--type="textarea"-->
              <!--:rows="2"-->
              <!--placeholder="请输入评论内容，长度在5-100字之间"-->
              <!--v-model="comments[good_index]"></el-input>-->
              <van-cell-group>
                <van-field :disabled="disabled[good_index]" v-model="comments[good_index]" type="textarea"
                           placeholder="请输入评论内容，长度在5-100字之间" rows="2"/>
              </van-cell-group>
            </template>
            <template v-if='disabled[good_index]'>
              <div class="option">{{comments[good_index]}}</div>
            </template>
          </div>
        </div>
        <!--<div class="comment_images comment_images_row">
              <span class="label">添加图片  <small>（您最多可以上传3张图片）</small></span>
              <ul class="images">
                <li >
                  <a href="javascript:;" class="btn_add">
                    <i class="fa fa-plus"></i>
                  </a>
                </li>
              </ul>
            </div>-->
        <template v-if='!disabled[good_index]'>
          <div class="mod_btns">
            <button :class="btn_class[good_index]"
                    @click="toComment(good,good_index)">发表评价
            </button>
          </div>
        </template>
      </div>

    </div>

    <div class="sure"
         style="display: none;">
      <a href=""
         class="btn-sure">确认发表</a>
    </div>
  </div>
</template>


<script>
import comment_controller from "./comment_controller";

export default comment_controller;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  a {
    text-decoration: none;
    color: #222;
  }

  .comment_item {
    background: #fff;
    margin-bottom: 0.9375rem;
    position: relative;
    overflow: hidden;

    a {
      position: relative;
      display: block;
      padding: 0 0.625rem 0.75rem 4.375rem;
      background: #fafafa;
      overflow: hidden;
      text-align: justify;

      img {
        position: absolute;
        left: 0.625rem;
        top: 0.9375rem;
        display: block;
        width: 3.125rem;
        height: 3.125rem;
        border: 0.0625rem solid #ddd;
      }

      .name {
        font-size: 12px;
        height: 3em;
        line-height: 1.5em;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        font-size: 12px;
        color: #e4393c;
      }
    }
  }

  #comment-goods .foot {
    position: relative;
    margin: 0 0.625rem;
    padding: 0.625rem 0;
    height: 1.875rem;

    .action {
      position: absolute;
      top: 0.625rem;
      right: 0;
      overflow: hidden;

      .btn {
        height: 1.875rem;
        font-size: 12px;
        background: #8476f3;
        color: #fff;
        padding: 0;
        width: 5rem;
        line-height: 1.875rem;
        border-radius: 0.3125rem;
        text-align: center;
        float: right;
        padding-right: 0.625rem;

        i {
          display: inline-block;
          position: absolute;
          width: 0.3125rem;
          height: 0.3125rem;
          vertical-align: 0.1875rem;
          margin-left: 0.3125rem;
          border-color: #333;
          top: 0.625rem;
        }
      }

      .btn_1 {
        background: #f15353;
        color: #fff;
        border: 0.0625rem solid transparent;
      }
    }
  }

  #comment-goods .inner.display {
    display: block;
  }

  #comment-goods .inner {
    position: relative;
    background: #f8f8f8;
    padding: 0 0.625rem 0.0625rem;
    margin: 0.3125rem 0.625rem 0.625rem;
    font-size: 12px;
    color: #999;
    display: none;

    .arrow {
      z-index: 1;
      background: #f8f8f8;
      position: absolute;
      top: -0.5rem;
      right: 1.875rem;
      border-top: 0.0625rem solid #ddd;
      border-left: 0.0625rem solid #ddd;
      width: 1rem;
      height: 1rem;
      -webkit-transform: rotate(45deg) scale(0.5);
      transform: rotate(45deg) scale(0.5);
    }

    .comment_view {
      position: relative;
      overflow: hidden;
      height: 1.5625rem;
      line-height: 1.5625rem;

      .label {
        font-size: 14px;
        color: #333;
        position: absolute;
        left: 0;
      }

      .stars {
        position: absolute;
        left: 2.8125rem;
        top: 0;
        font-size: 18px;

        i.active {
          color: #f7ba2a;
        }
      }

      .stars-finish {
        position: absolute;
        left: 0;
        top: 0;
        font-size: 18px;

        i.active {
          color: #f7ba2a;
        }
      }
    }

    p {
      text-align: justify;
      margin-bottom: 0.625rem;
    }

    .comment_textarea {
      position: relative;
      overflow: hidden;

      .textarea_wrap {
        padding: 0.625rem;
        background: #fff;
        position: relative;

        .option {
          text-align: left;
        }

        textarea {
          resize: none;
          width: 100%;
          height: 4.375rem;
          border: none;
          background: none;
          font-size: 12px;
          -webkit-appearance: none;
          -webkit-border-radius: 0;
        }

        .van-cell-group {
          border: 1px solid #bfcbd9;
          border-radius: 4px;

          .van-cell {
            border-radius: 4px;
          }
        }
      }
    }

    .comment_images_row {
      padding: 0;
      position: relative;

      .label {
        display: block;
        position: static;
        margin: 0.625rem 0;
        left: 0;
        top: 50%;
        font-size: 14px;
        color: #333;

        small {
          font-size: 10px;
          color: #999;
        }
      }

      .images {
        margin-bottom: 1.25rem;
        height: 3.125rem;

        li {
          position: relative;
          float: left;
          margin-right: 0.625rem;
          width: 3.125rem;
          height: 3.125rem;

          .btn_add {
            position: relative;
            display: block;
            width: 3rem;
            height: 3rem;
            background: #fff;
            border: 0.0625rem dashed #ddd;
            padding: 0;

            i {
              font-size: 20px;
              background-position: -2.5rem -1.25rem;
              position: absolute;
              top: 50%;
              left: 50%;
              margin: -0.625rem 0 0 -0.625rem;
              color: #ddd;
            }
          }
        }
      }

      .images-finish {
        margin: 0.625rem 0.625rem 0.625rem 0;
        height: 3.125rem;
      }
    }

    .mod_btns {
      overflow: hidden;
      margin: 0.625rem 0.625rem;

      .gray {
        background: #ccc;
        display: block;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        font-size: 14px;
        -webkit-border-radius: 0.125rem;
        border-radius: 0.125rem;
        position: relative;
        padding: 0;
        color: #fff;
        border: 0.0625rem solid #ccc;
      }

      .mod_btn {
        display: block;
        width: 100%;
        height: 2.5rem;
        line-height: 2.5rem;
        text-align: center;
        font-size: 14px;
        -webkit-border-radius: 0.125rem;
        border-radius: 0.125rem;
        position: relative;
        padding: 0;
        background: #f15353;
        color: #fff;
        border: 0.0625rem solid #f15353;
      }
    }
  }

  #comment-goods .sure .btn-sure {
    display: block;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
    font-size: 14px;
    -webkit-border-radius: 0.125rem;
    border-radius: 0.125rem;
    position: relative;
    padding: 0;
    background: #fff;
    color: #f15353;
    border: 0.0625rem solid #f15353;
    margin: 0.625rem 0.625rem 1.875rem;
    font-weight: bold;
  }
</style>
