<template>
  <div class="invitation" v-if="boxShow">
    <div class="title">
      <div class="titleLeft">关联的微贴</div>
      <div class="titleRight" @click="tapShow">
        查看更多({{ micro_communities.num }})
        <i class="fa fa-angle-right"></i>
      </div>
    </div>
    <div class="boxConten">
      <template v-for="(item, ind) in min_micr">
        <div class="leftbox" :key="ind" @click="goMicro(item.id)">
          <div class="img" v-if="item.has_many_image[0]">
            <img :src="item.has_many_image[0].url" alt="" />
          </div>
          <div class="leftTitle">
            {{ item.title }}
          </div>
          <div class="member">
            <div class="userimg" v-if="item.has_one_stick_user">
              <img :src="item.has_one_stick_user.avatar" alt="" />
            </div>
            <div class="userName" v-if="item.has_one_stick_user">{{ item.has_one_stick_user.nickname }}</div>
          </div>
          <div class="likeComment">
            <div class="like">
              <i class="iconfont icon-fontclass-dianzan colorMr"></i>
              {{ item.praise_num }}
            </div>

            <div class="comment">
              <i class="iconfont icon-fontclass-pinglun1 colorMr"></i>
              {{ item.comment_num }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <van-popup :overlay="false" get-container="#app" v-model="showInvit" position="right" :style="{ width: '100%', height: '100%', zIndex: '999' }">
      <van-nav-bar title="更多微贴" left-arrow @click-left="closeShow" :fixed="true" />
      <div class="listBox">
        <div class="leftbox" v-for="(item, ind) in micro_communities.list" :key="ind" @click="goMicro(item.id)">
          <div class="img" v-if="item.has_many_image[0]">
            <img :src="item.has_many_image[0].url" alt="" />
          </div>
          <div class="leftTitle">
            {{ item.title }}
          </div>
          <div class="member">
            <div class="userimg" v-if="item.has_one_stick_user">
              <img :src="item.has_one_stick_user.avatar" alt="" />
            </div>
            <div class="userName" v-if="item.has_one_stick_user">{{ item.has_one_stick_user.nickname }}</div>
          </div>
          <div class="likeComment">
            <div class="like">
              <i class="iconfont icon-fontclass-dianzan colorMr"></i>
              {{ item.praise_num }}
            </div>

            <div class="comment">
              <i class="iconfont icon-fontclass-pinglun1 colorMr"></i>
              {{ item.comment_num }}
            </div>
          </div>
        </div>
        <!-- 加载更多 -->
        <div v-if="page < last_page" class="none" @click="getMore">点击加载更多</div>
        <div v-else class="none">暂无更多</div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  props: ["goods_plugin"],
  data() {
    return {
      showInvit: false,
      boxShow: false,
      micro_communities: [],
      min_micr: [],
      page: 1
    };
  },
  mounted() {
    this.goodsid = this.goods_plugin.get_goods.id;
    if (this.goods_plugin.plugin && this.goods_plugin.plugin.micro_communities) {
      this.boxShow = true;
      this.min_micr = this.goods_plugin.plugin.micro_communities.list.slice(0, 2);
      this.micro_communities = this.goods_plugin.plugin.micro_communities;
    }
  },
  methods: {
    closeShow() {
      this.showInvit = false;
      this.page = 1;
      this.last_page = 1;
    },
    tapShow() {
      $http.post("plugin.micro-communities.api.goods.index", { page: this.page, goods_id: this.goodsid }, "").then(response => {
        if (response.result == 1) {
          this.showInvit = true;
          this.micro_communities.list = response.data.data;
          this.last_page = response.data.last_page;
        } else {
          Toast(response.msg);
        }
      });
    },
    getMore() {
      this.page = this.page + 1;
      $http.post("plugin.micro-communities.api.goods.index", { page: this.page, goods_id: this.goodsid }, ".").then(response => {
        if (response.result == 1) {
          this.showInvit = true;
          this.micro_communities.list = this.micro_communities.list.concat(response.data.data);
          this.last_page = response.data.last_page;
        } else {
          Toast(response.msg);
        }
      });
    },
    gotoCommentList() {
      this.$emit("RouterTo", true);
    },
    goMicro(_id) {
      console.log(_id);
      this.$router.push(
        this.fun.getUrl("microCommentDetails", {
          stickId: _id
        })
      );
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.none {
  width: 100%;
  text-align: center;
  margin: 1rem 0;
  color: #6666;
}

.listBox {
  display: flex;
  flex-wrap: wrap;
  padding: 0 0.91rem;
  padding-top: 0.63rem;
  justify-content: space-between;
  margin-top: 50px;

  .leftbox {
    margin-bottom: 0.63rem;
  }
}

.leftbox {
  width: 10.47rem;

  .likeComment {
    display: flex;
    justify-content: flex-end;
    margin-top: 0.42rem;

    .comment {
      display: flex;
      align-items: center;
      color: #666;

      .colorMr {
        color: #afafaf;
        margin-right: 0.28rem;
      }
    }

    .like {
      margin-right: 1.13rem;
      color: #666;
      display: flex;
      align-items: center;

      .colorMr {
        color: #afafaf;
        margin-right: 0.28rem;
      }
    }
  }

  .member {
    .userName {
      font-size: 0.69rem;
      color: #202020;
    }

    .userimg {
      width: 1.09rem;
      height: 1.09rem;
      background-color: #c1c1c1;
      border-radius: 50%;
      margin-right: 0.38rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    display: flex;
    align-items: center;
  }

  .img {
    width: 10.47rem;
    height: 10.47rem;
    background-color: #c1c1c1;
    border-radius: 0.31rem;
    margin-bottom: 0.75rem;

    img {
      width: 100%;
      height: 100%;
      border-radius: 0.31rem;
    }
  }

  .leftTitle {
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font-size: 0.88rem;
    color: #333;
    margin-bottom: 0.91rem;
    text-align: left;
  }
}

.invitation {
  background: #fff;
  margin-top: 1rem;

  .boxConten {
    height: 18.09rem;
    width: 100%;
    padding: 0.59rem 0.94rem 0.78rem 0.94rem;
    display: flex;
    justify-content: space-between;
  }

  .title {
    display: flex;
    padding: 0.81rem 0.94rem;
    font-size: 0.94rem;
    justify-content: space-between;
    align-items: center;

    .titleRight {
      font-size: 0.75rem;
      color: #f14e4e;

      i {
        font-size: 1rem;
      }
    }
  }
}
</style>
