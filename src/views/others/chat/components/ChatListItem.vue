<template>
  <div class="item-box">
    <div class="item-img">
      <van-image :src="item.avatar" width="40px" height="40px" round fit="cover"></van-image>
    </div>
    <div class="item-cont">
      <div class="item-cont-top">
        <span class="item-nickname">{{ item.nickname }}</span>
        <span class="item-time">{{ item.updated_at }}</span>
      </div>
      <div class="item-footer">
        <div class="item-last-msg">{{ item.last_chat_content }}</div>
        <div class="item-unread" v-show="unReadCount">{{ unReadCount }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { Image as VanImage } from "vant";
export default {
  props: ["item"],
  computed: {
    unReadCount() {
      if (this.item['un_read_num'] == 0) {
        return 0;
      }
      if (this.item['un_read_num'] > 99) {
        return "99+";
      }
      return this.item['un_read_num'];
    }
  },
  components: {
    VanImage
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.item-box {
  display: flex;
  align-items: center;
  height: 3.75rem;
  padding: 0.625rem 0.906rem 0.625rem 0.938rem;
}

.item-img {
  width: 2.5rem;
  height: 2.5rem;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.item-cont {
  flex: 1;
  height: 2.6rem;
  padding-left: 0.781rem;
  overflow: hidden;

  .item-cont-top {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 1.375rem;

    .item-nickname {
      font-size: 1rem;
      letter-spacing: 0.05rem;
      color: #333;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .item-time {
      flex-shrink: 0;
      font-size: 0.75rem;
      color: #999;
    }
  }

  .item-last-msg {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #999;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.item-footer a {
  color: #366092;
}

.item-unread {
  padding: 0 0.375rem;
  line-height: 1.125rem;
  height: 1.125rem;
  font-size: 0.75rem;
  color: white;
  background-color: red;
  border-radius: 1.125rem;
  transform: scale(0.65);
}
</style>