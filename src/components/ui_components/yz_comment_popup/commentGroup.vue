<!-- 评论弹窗组件 父组件
    提供一个插槽：一级评论子组件入口
    需搭配 commentCell、commentCellItem 一起使用
 -->
<!-- domo 配置详情 请看wiki文档 -->
<template>
  <div id="components-comment">
    <van-popup v-model="showYzComment" position="bottom" :style="{ height: '70%' }" closeable round @closed="close">
      <div class="components-comment-main">
        <div class="components-comment-title">{{ length ? `全部评论${length}条` : "暂无评论" }}</div>
        <div class="components-comment-list-main">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
            <slot>
              <div class="components-comment-list-main-warn" v-if="length == 0 && !$store.state.isloadding">暂无评论,来抢沙发</div>
              <!-- <div class="components-comment-list-main-warn" v-if="length == 0 && this.$store.state.isloadding">加载中...</div> -->
            </slot>
          </van-list>
        </div>
        <div class="components-comment-input-box">
          <input type="text" @focus="focusCommentInput" placeholder="来都来了，留点什么吧" class="components-comment-input" />
        </div>
      </div>
    </van-popup>
    <van-action-sheet v-model="showSheet" :actions="actions" :description="`评论内容：${commentInputOptiones.content}`" cancel-text="取消" close-on-click-action @select="onSelect" />
    <yz-comment-input v-model="showCommentInput" :openImg="openImg" v-on:confirm="subMainBtn" :options="commentInputOptiones"> </yz-comment-input>
  </div>
</template>

<script>
import yzCommentInput from "components/ui_components/yz_commentInput";
export default {
  model: {
    prop: "showYzComment",
    event: "onEmit"
  },
  props: {
    //弹窗是否显示，默认不显示
    showYzComment: {
      type: Boolean,
      default: false
    },
    loading: {
      //是否处于加载状态，加载过程中不触发load事件
      type: Boolean,
      default: false
    },
    finished: {
      //是否已加载完成，加载完成后不再触发load事件
      type: Boolean,
      default: false
    },
    //评论列表
    length: {
      type: String,
      default: ""
    },
    //是否支持图片评论
    openImg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: true,
      showCommentInput: false,
      commentInputOptiones: {},
      showSheet: false,
      actions: [{ name: "回复" }, { name: "删除" }],
      isAuthority: false // false游客||其他为：作者、管理员...可进行删除操作
    };
  },
  activated() {},
  components: { yzCommentInput },
  computed: {},
  mounted() {},
  provide: function() {
    return {
      clickComment: this.clickComment,
      setAuthority: this.setAuthority
    };
  },

  methods: {
    setAuthority(value) {
      this.isAuthority = value;
    },
    close() {
      this.$emit("onEmit", false);
    },
    onLoad() {
      this.$emit("onMore", false);
    },
    onSelect(item, index) {
      if (index == 0) {
        //回复操作
        this.showCommentInput = true;
      } else if (index == 1) {
        console.log("=======进行删除评论=========");
        this.$emit("delComment", this.commentInputOptiones); //触发父组件请求删除api
      }
    },
    clickComment(e) {
      //评论弹窗显示
      console.log("=======获取到当前评论信息=========", e);
      this.commentInputOptiones = e;
      if (this.commentInputOptiones.type != "main" && this.isAuthority) {
        //显示动作面板，可进行删除操作
        this.showSheet = true;
        return;
      }
      this.showCommentInput = true;
    },
    subMainBtn(e) {
      if (e) {
        this.showCommentInput = false;
        this.$emit("sendComment", e); //触发父组件请求评论、回复api
      }
    },
    focusCommentInput() {
      this.commentInputOptiones = {
        type: "main"
      };
      this.clickComment(this.commentInputOptiones);
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#components-comment {
  .components-comment-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    text-align: left;

    .components-comment-title {
      height: 3rem;
      line-height: 3rem;
      font-size: 12px;
      text-align: center;
    }

    .components-comment-list-main {
      flex: 1;
      overflow: scroll;

      .components-comment-list-main-warn {
        padding: 1rem 0;
        text-align: center;
        color: #999;
      }

      .components-comment-list {
        display: flex;
        padding: 0.375rem 0.875rem;

        .components-comment-main-left {
          width: 2rem;
          height: 2rem;
          margin-right: 0.72rem;
          overflow: hidden;
          border-radius: 50%;

          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .components-comment-main-right {
          flex: 1;

          .master-main {
            width: 100%;
            display: flex;
            height: 2rem;

            .master-main-left {
              flex: 1;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: center;

              .master-name {
                font-size: 12px;
                color: #1c96fe;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 100%;
              }

              .master-time {
                width: 100%;
                font-size: 10px;
                color: #999;
              }
            }

            .master-main-right {
              min-width: 1rem;
            }
          }

          .master-main-content {
            padding: 0.125rem 1rem 0 0;
          }
        }
      }

      .child-list {
        padding: 0.375rem 0;

        .components-comment-main-left {
          width: 1.375rem;
          height: 1.375rem;
          margin-top: 0.3125rem;
        }
      }
    }

    .components-comment-input {
      border: none;
      margin: 0.875rem auto;
      padding: 0.5rem;
      background: #eaeaea;
      border-radius: 2rem;
      display: block;
      width: 95%;
    }

    .components-comment-input-box {
      position: relative;
      width: 100%;
    }

    .components-comment-input-box::before {
      height: 1px;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      content: "";
      width: 100%;
      background-image: linear-gradient(0deg, #797979 50%, transparent 0);
    }

    .selecolor {
      color: #1c96fe;
    }
  }
}
</style>
