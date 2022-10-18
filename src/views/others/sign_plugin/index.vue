<template>
  <div>
    <div class="top-box">
      <div class="title">个人中心</div>
      <div class="member-box">
        <div class="left">
          <img :src="Member.avatar" alt="">
        </div>
        <div class="right">
          <p class="name">{{Member.nickname}}</p>
          <p>{{Member.name}} <span class="tag" v-if="Member.status == 1">已认证</span><span class="tag" @click="toSign" v-if="Member.status != 1">个人未认证</span></p>
          <p class="company">{{Member.company_name}} <span class="tag" v-if="Member.company_status == 1">已认证</span></p>
          <div style="margin-top: 5px;"><span class="tag" v-if="Member.company_status != 1 && Member.status == 1"  @click="toSign">企业未认证</span></div>
          <div style="margin-top: 10px;"><span class="tag" v-if="Member.company_status != 1 && Member.status != 1"  @click="toSign">企业未认证</span></div>
        </div>
      </div>
    </div>
    <div class="content set-pc-style">
      <div class="item" @click="toLists">
        <div class="img-box"><img src="../../../assets/images/sign/yht_icon_list@2x.png" alt=""></div>
        <p class="item-title">合同列表</p>
        <i class="iconfont icon-advertise-next"></i>
      </div>
      <div style="height: 3.5rem;"></div>
    </div>

  </div>
</template>

<script>
import { Toast } from 'vant';

export default {
  data() {
    return {
      Member: {},
    };
  },
  activated() {
    this.geData();
  },
  methods: {
    toSign() {
      if (this.Member.status == 1) {
        this.$router.push(this.fun.getUrl("signCompanyPlu"));
      } else {
        this.$router.push(this.fun.getUrl("personBankPlu"));
      }
    },
    toLists() {
      this.$router.push(this.fun.getUrl("contractListPlu"));
    },
    toGoodList() {
      this.$router.push(this.fun.getUrl("searchAll"));
    },
    geData() {
      $http
        .get("plugin.shop-esign.frontend.member.get-info", {}, "...").then(response => {
          if (response.result === 1) {
            this.Member = response.data;
          } else {
            Toast(response.msg);
          }
        },
        response => {
          this.$dialog.alert({message:response.msg});
        }
        );
    },
  },
  components: {}
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .top-box {
    background-image: linear-gradient(-27deg, #3679ff 0%, #7ec8ff 100%);
    height: 20rem;
    color: #fff;

    .title {
      padding: 10px 0 20px 0;
      font-size: 20px;
    }
  }

  .member-box {
    display: flex;
    margin: 0 20px;

    .left {
      flex: 0 0 4rem;
      width: 4rem;
      height: 4rem;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      text-align: left;
      margin-left: 10px;
      justify-content: center;

      .company {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      p {
        display: flex;
      }
    }

    .tag {
      background-color: rgba(255, 255, 255, 0.28);
      border-radius: 15px;
      font-size: 12px;
      padding: 2px 7px;
      margin-left: 5px;
    }

    .name {
      font-size: 16px;
    }
  }

  .content {
    overflow-y: scroll;
    position: fixed;
    width: 100%;
    height: 76%;
    background: #fff;
    bottom: 0;
    left: 0;
    border-radius: 20px 20px 0 0;
    padding: 15px;

    .file-box {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .enable {
      color: #999;
    }

    .buy {
      display: flex;
      color: #367aff;
      padding: 10px;
    }

    .buy-btn {
      color: #fff;
      background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
      border-radius: 10px;
      font-size: 12px;
      padding: 2px 15px;
      line-height: 20px;
    }

    .item {
      display: flex;
      align-self: center;
      justify-self: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;

      .item-title {
        font-weight: bold;
        flex: 1;
        text-align: left;
        display: flex;
        align-self: center;
      }

      .icon-advertise-next {
        display: flex;
        align-self: center;
      }

      .img-box {
        width: 1.75rem;
        height: 1.75rem;
        flex: 0 0 1.75rem;
        margin-right: 0.5rem;

        img {
          width: 100%;
        }
      }
    }
  }

</style>
