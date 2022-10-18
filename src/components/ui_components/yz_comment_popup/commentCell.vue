<!--
   一级评论子组件 提供两个插槽
  v-slot:cell-other : 右侧插槽，flex布局
  默认插槽：二级评论子组件入口
 -->
<template>
  <div>
    <div class="components-comment-list" @click.stop="replyComment">
      <div class="components-comment-main-left">
        <img :src="avatar" alt="" class="master-avatar" />
      </div>
      <div class="components-comment-main-right">
        <div class="master-main">
          <!-- 一级评论内容 -->
          <div class="master-main-left">
            <div class="master-name">{{ nickname }}</div>
            <div class="master-time">{{ time }}</div>
          </div>
          <div class="master-main-right">
            <!-- 插槽 -->
            <slot name="cell-other"></slot>
          </div>
        </div>
        <div class="master-main-content">{{ content }}</div>
        <!-- 回复列表 -->
        <div :class="{ 'reduce-style': reduceRely }">
          <slot></slot>
        </div>
        <div class="additional-button" @click.stop="getRely" v-show="reduceRely || (reply_num > 0 && slotChildren < reply_num)">
          —— 展开{{ Number(slotChildren) == 0 ? `${Number(reply_num)}条` : "更多" }}回复<i class="iconfont icon-down"></i>
        </div>
        <div class="additional-button" @click.stop="packUPRely" v-show="!reduceRely && reply_num > 0 && slotChildren >= reply_num">—— 收起<i class="iconfont icon-up"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    avatar: {
      type: String,
      default: ""
    },
    nickname: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 0
    },
    reply_num: {
      type: Number,
      default: 0
    },
    page: {
      type: Number,
      default: 5
    },
    isAuthority: {
      // false游客||其他、作者、管理员
      // 游客不可进行删除操作
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      slotChildren: 0, //计算回复数
      reduceRely: false //是否 显示“收起”评论样式
    };
  },
  inject: ["clickComment", "setAuthority"],

  activated() {},

  components: {},

  computed: {},

  mounted() {},

  methods: {
    replyComment() {
      this.setAuthority(this.isAuthority);
      let commentInputOptiones = {
        replyName: this.nickname,
        type: "reply",
        placeholder: "请输入你的回复吧",
        index: this.index,
        childIndex: 0,
        content: this.content.slice(0, 10) + "..."
      };
      this.clickComment(commentInputOptiones);
    },
    getRely() {
      if (this.reduceRely) {
        this.reduceRely = false;
        return;
      }
      this.slotChildren += this.page; //默认一页5条数据
      // if (this.$slots.default) {
      //   for (let i = 0; i < this.$slots.default.length; i++) {
      //     if (this.$slots.default[i].elm.nodeType !== 3) {
      //       this.slotChildren++; // 获得插槽数量(不为空格)
      //     }
      //   }
      // } else {
      //   this.slotChildren = 1; //让其文字显示“更多”
      // }
      this.$emit("getRely", { index: this.index }); //加载回复
    },
    packUPRely() {
      this.reduceRely = true;
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
.components-comment-list-main {
  .reduce-style {
    // height: 4.5rem;
    height: 0.5rem;
    overflow: hidden;

    .master-main-content {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
  }
}
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
.components-comment-list-main {
  flex: 1;
  overflow: scroll;

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
          display: flex;
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

  .additional-button {
    padding-top: 0.125rem;
    color: #999;
    display: flex;
    align-items: center;
  }
}

.components-comment-input {
  border: none;
  margin: 0.875rem;
  padding: 0.5rem;
  background: #eaeaea;
  border-radius: 2rem;
}

.selecolor {
  color: #1c96fe;
}
</style>
