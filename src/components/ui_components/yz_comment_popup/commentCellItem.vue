<!--
   一级评论子组件 提供一个插槽
  v-slot:cell-item-other : 右侧插槽，flex布局
 -->
<template>
  <div>
    <div class="components-comment-list child-list" @click.stop="replyComment">
      <div class="components-comment-main-left">
        <img :src="avatar" alt="" />
      </div>
      <div class="components-comment-main-right">
        <div class="master-main">
          <div class="master-main-left">
            <div class="master-name">{{ nickname }}</div>
            <div class="master-time">{{ time }}</div>
          </div>
          <div class="master-main-right">
            <slot name="cell-item-other"></slot>
          </div>
        </div>
        <div class="master-main-content">
          <template v-if="Responder"
            >回复<span class="selecolor">{{ Responder }}</span>
          </template>
          {{ content }}
        </div>
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
    Responder: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      default: 0
    },
    childIndex: {
      type: Number,
      default: 0
    },
    isAuthority: {
      // false游客||其他、作者、管理员
      // 游客不可进行删除操作
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
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
        type: "childReply",
        placeholder: "请输入你的回复吧",
        index: this.index,
        childIndex: this.childIndex,
        content: this.content.slice(0, 10) + "..."
      };
      this.clickComment(commentInputOptiones);
    }
  }
};
</script>
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
