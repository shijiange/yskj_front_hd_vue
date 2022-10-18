<template>
  <div id="evaluate">
    <c-title :hide="false" :text="'评价'"></c-title>
    <div class="top_public">
      <div class="goods">
        <div class="img">
          <img :src="order_info.has_one_order_project.project_thumb" alt=""/>
        </div>
        <div class="info">
          <div class="good-title">
            {{order_info.has_one_order_project.project_title}}
          </div>
          <div class="flex-box" style="color: #f49f19;"><i style="font-size: 14px;" class="iconfont icon-dengdaichuli"></i><span>{{order_info.begin_time}}</span></div>
          <div class="flex-box">
            <i class="iconfont icon-stores_staff" style="color: #f4a82e;"></i>
            <div class="content">
              <em>{{order_info.has_one_worker.name}}</em>
              | {{order_info.has_one_store.store_name}}
            </div>
          </div>
          <div class="flex-box">
            <i class="iconfont icon-order_locate" style="color: #f4a82e;"></i>
            <div class="content">
              {{order_info.has_one_store.address}}
            </div>
          </div>
        </div>
      </div>
      <!-- 评价星级van-rate组件 readonly	是否为只读状态 -->
      <div class="rate-box">
        <div class="rate-child">
          <div class="text">{{appointmentLang.project}}评价</div>
          <van-rate v-if="!comment.project_level" v-model="applyModel.project_level"/>
          <van-rate v-else v-model="comment.project_level" readonly/>
        </div>
        <div class="rate-child">
          <div class="text">{{appointmentLang.worker}}评价</div>
          <van-rate v-if="!comment.worker_level" v-model="applyModel.worker_level"/>
          <van-rate v-else v-model="comment.worker_level" readonly/>
        </div>
        <div class="rate-child">
          <div class="text">门店评价</div>
          <van-rate v-if="!comment.store_level" v-model="applyModel.store_level"/>
          <van-rate v-else v-model="comment.store_level" readonly/>
        </div>
      </div>

      <!-- 第一次评价部分 -->
      <van-cell-group v-if="!comment.worker_level">
        <van-field
          v-model="applyModel.content"
          rows="1"
          :autosize="{ minHeight: 120 }"
          type="textarea"
          placeholder="输入评论内容"
        />
      </van-cell-group>
      <div class="comment" v-if="comment.worker_level && comment.content">
        评论： {{comment.content}}
      </div>

      <div class="imgflex" v-if="!comment.worker_level">
        <div v-for="(val, index) in imagesList" :key="index">
          <div class="photobox">
            <img
              :src="val"
              style="width: 100%; height: 100%; object-fit: contain;"
              @click="showimg(index)"
            />
            <i @click="removeImg_1(index)"></i>
          </div>
        </div>
        <van-uploader
          :after-read="multipleMethod_1"
          multiple
        >
          <div
            style="padding: 0.2rem; width: 4.938rem; height: 4.938rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
          >
            <img
              src="../../../assets/images/sendimg@2x.png"
              style="width: 70%; height: 60%;"
              class="avatar"
            />
          </div>
        </van-uploader>
      </div>

      <div class="imgflex" v-if="comment.worker_level">
        <div v-for="(val, index) in comment.images" :key="index">
          <div class="photobox">
            <img
              :src="val"
              style="width: 100%; height: 100%; object-fit: contain;"
              @click="showimg(index)"
            />
          </div>
        </div>
      </div>

      <div class="comment-time">{{comment.created_at}}</div>

      <div class="many_reply" v-if="comment.has_many_reply && comment.has_many_reply.length>0" >
        <div v-for="item in comment.has_many_reply" :key="item.id">
          <p style="padding: 0.5rem 1rem;">
            追加评论： {{item.content}}
          </p>
          <div class="imgflex">
            <div v-for="(val, index) in item.images" :key="index">
              <div class="photobox">
                <img
                  :src="val"
                  style="width: 100%; height: 100%; object-fit: contain;"
                  @click="showimg(index)"
                />
              </div>
            </div>
          </div>
          <div class="comment-time">{{item.created_at}}</div>
        </div>
      </div>

      <!-- 追加评论部分 -->

      <template v-if="comment.worker_level">
        <van-cell-group>
          <van-field
            v-model="applyMoreModel.content"
            rows="1"
            :autosize="{ minHeight: 120 }"
            type="textarea"
            placeholder="输入追加评论内容"
          />
        </van-cell-group>

        <div class="imgflex">
          <div v-for="(val, index) in imagesList" :key="index">
            <div class="photobox">
              <img
                :src="val"
                style="width: 100%; height: 100%; object-fit: contain;"
                @click="showimg(index)"
              />
              <i @click="removeImg_1(index)"></i>
            </div>
          </div>
          <van-uploader
            :after-read="multipleMethod_1"
            multiple
          >
            <div
              style="padding: 0.2rem; width: 4.938rem; height: 4.938rem; border: 1px dashed #c0ccda; margin: 0 auto; display: flex;"
            >
              <img
                src="../../../assets/images/sendimg@2x.png"
                style="width: 70%; height: 60%;"
                class="avatar"
              />
            </div>
          </van-uploader>
        </div>
      </template>

      <div id="submitBtn">
        <span class="btn" v-if="!comment.worker_level" @click="makeEvaluate">提交</span>
        <span class="btn" v-else @click="makeMoreEvaluate">追加评论</span>
      </div>

      <van-image-preview
        v-model="show"
        :images="applyModel.images"
        :start-position="imgIndex"
      >
      </van-image-preview>
    </div>
  </div>
</template>

<script>
import evaluate_controller from "./evaluate_controller";

export default evaluate_controller;
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #evaluate {
    text-align: left;
    color: #000;

    .top_public {
      background: #fff;
      padding-top: 0.625rem;
      padding-bottom: 4.5rem;

      > > > .van-cell-group::after {
        border: none;
      }

      .goods {
        display: flex;
        width: 90%;
        margin: 0 5% 0.875rem;
        padding: 0.825rem;
        box-shadow: 0 0 18px 0 rgba(169, 169, 169, 0.24);
        border-radius: 5px;

        .img {
          width: 6.25rem;
          height: 6.25rem;
          border-radius: 0.406rem;
          overflow: hidden;
          margin-right: 0.625rem;

          img {
            width: 100%;
          }
        }

        .info {
          flex: 1;
          padding: 0.5rem 0;

          .good-title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-height: 1.125rem;
            height: 2.25rem;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 0.5rem;
          }

          .flex-box {
            display: flex;
            margin-bottom: 0.25rem;
            color: #999;
            font-size: 14px;

            .content {
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
            }
          }
        }
      }

      .rate-box {
        padding: 0 5%;

        .rate-child {
          display: flex;
          margin-bottom: 1.125rem;

          .text {
            margin-right: 0.625rem;
            font-size: 14px;
            color: #666;
          }
        }
      }

      .comment {
        padding: 0.5rem 1rem;
      }

      .comment-time {
        font-size: 14px;
        color: #999;
        padding: 0.5rem 0.875rem;
      }

      .imgflex {
        display: flex;
        flex-wrap: wrap;
        padding: 0 0.875rem;

        .photobox {
          position: relative;
          width: 4.938rem;
          height: 4.938rem;
          background-color: #fcfcfc;
          border-radius: 0.156rem;
          border: solid 0.031rem #ccc;
          overflow: hidden;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }
      }

      #submitBtn {
        position: fixed;
        left: 0;
        bottom: 0;
        background: #fff;
        box-shadow: 0 0 0.563rem 0 rgba(169, 169, 169, 0.24);
        width: 100%;
        height: 3.719rem;
        line-height: 3.719rem;
        display: flex;
        align-items: center;
        justify-content: center;

        .btn {
          width: 90%;
          height: 2.5rem;
          background-color: #f4a82e;
          border-radius: 1.25rem;
          line-height: 2.5rem;
          text-align: center;
          font-size: 1rem;
          font-weight: bold;
          display: block;
          color: #fff;
        }
      }
    }

    .many_reply {
      padding: 0 1rem;
    }
  }
</style>
