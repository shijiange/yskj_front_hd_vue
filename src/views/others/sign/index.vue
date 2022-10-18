<template>
  <div class="page" id="signLunch">
    <c-title text="合同中心"></c-title>

    <div class="header" v-if="showPage">
      <div class="face">
        <img :src="details.avatar" alt="" />
      </div>
      <div class="header-box">
        <div class="nickname">{{ details.nickname }}</div>
        <div class="desc" @click="toSign">
          <div class="name">{{ details.name }}</div>
          <div class="label">{{ details.status == 1 ? "已认证" : "个人未认证" }}</div>
        </div>
        <div class="desc" @click="toSign">
          <div class="name">{{ details.company_name }}</div>
          <div class="label">{{ details.company_status == 1 ? "已认证" : "企业未认证" }}</div>
        </div>
      </div>
    </div>

    <div class="container myContract">
      <div class="container-title">我的合同</div>
      <div class="container-box">
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 0 })">
          <div class="num">{{ details.all_count }}</div>
          <div class="desc">全部合同</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 3 })">
          <div class="num">{{ details.self_no_sign }}</div>
          <div class="desc">待我签署</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 1 })">
          <div class="num">{{ details.self_signed }}</div>
          <div class="desc">我已签署</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 2 })">
          <div class="num">{{ details.finish_count }}</div>
          <div class="desc">已完成</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractList', {}, { status: 4 })">
          <div class="num">{{ details.over_time_count }}</div>
          <div class="desc">已超时</div>
        </div>
      </div>
    </div>

    <div class="container companyContract" v-if="details.is_legal == 1">
      <div class="container-title">公司合同</div>
      <div class="container-box">
        <div class="container-flex" @click="gotoPages('companyContractList', {}, { status: 0 })">
          <div class="num">{{ details.all_company_contract }}</div>
          <div class="desc">全部合同</div>
        </div>
        <div class="container-flex" @click="gotoPages('companyContractList', {}, { status: 1 })">
          <div class="num">{{ details.all_company_contract_ing }}</div>
          <div class="desc">签署中</div>
        </div>
        <div class="container-flex" @click="gotoPages('companyContractList', {}, { status: 2 })">
          <div class="num">{{ details.all_company_contract_finish }}</div>
          <div class="desc">已完成</div>
        </div>
        <div class="container-flex" @click="gotoPages('companyContractList', {}, { status: 4 })">
          <div class="num">{{ details.all_company_contract_over_time }}</div>
          <div class="desc">已超时</div>
        </div>
      </div>
    </div>

    <div class="container contractBill">
      <div class="container-title">合同账单</div>
      <div class="fixed-btn" @click="gotoPages('searchAll')">购买合同</div>
      <div class="container-box">
        <div class="container-flex" @click="gotoPages('contractBills')">
          <div class="num">{{ details.contract_num_sum }}</div>
          <div class="desc">购买数量</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractBills')">
          <div class="num">{{ details.use_num_sum }}</div>
          <div class="desc">已使用数量</div>
        </div>
        <div class="container-flex" @click="gotoPages('contractBills')">
          <div class="num">{{ details.rest_num_sum }}</div>
          <div class="desc">可使用数量</div>
        </div>
      </div>
    </div>

    <div class="container staffManagement" v-if="false">
      <div class="container-title">员工管理</div>
      <div class="fixed-btn" @click="gotoPages('addStaff')">添加员工</div>
      <transition-group tag="div" appear class="container-box staffManagement-box">
        <div class="container-flex staffManagement-flex" v-for="(item, index) in workerList" :key="item.id">
          <div class="face" v-if="item.has_one_member">
            <img :src="item.has_one_member.avatar_image" alt="" />
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="label" v-if="item.role_id == 1">法人</div>
          <div class="label staff" v-if="item.role_id == 2">员工</div>
          <div class="close" v-if="item.role_id != 1" @click="deleteWorker(item, index)">
            <i class="iconfont icon-close11"></i>
          </div>
        </div>
        <div class="container-flex staffManagement-flex" @click="gotoPages('staffManagement')" v-if="workerList.length >= 10" :key="'a11'">
          <i class="iconfont icon-jk_haibao" style="font-size: 23px;"></i>
          <div class="name">查看更多</div>
        </div>
      </transition-group>
    </div>

    <div class="container myTemplate" v-if="(details.is_legal == 1 || (details.is_legal == 0 && details.company_status == 1)) && templateList.length > 0">
      <div class="container-title">我的模板</div>
      <div class="myTemplate-box">
        <div class="myTemplate-flex" v-for="item in templateList" :key="item.id">
          <div class="number">{{ item.id }}</div>
          <div class="title">{{ item.name }}</div>
          <div class="sendBtn" @click="gotoPages('signSeeTemplate', {}, { tid: item.id })">发起签署</div>
        </div>
      </div>
    </div>
    <div style="height: 2rem;"></div>
  </div>
</template>

<script>
import { scrollMixin } from "../../../utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      showPage: false,
      details: {},
      // workerList: [],
      templateList: [],
      cid: "",

      page: 1, //分页数，当前页数
      isLoadMore: true, //判断是否要加载更多的标志
      total_page: 0 //总页数
    };
  },
  activated() {
    if (this.$route.query.cid) {
      this.cid = this.$route.query.cid;
    } else if (window.localStorage.getItem("sign_company_cid")) {
      this.cid = window.localStorage.getItem("sign_company_cid");
    }
    this.getDetails();
    // this.getWorkerList(); 数据加在getDetails
  },
  methods: {
    initData() {
      this.page = 1;
      this.isLoadMore = true;
      this.total_page = 0;
    },
    toSign() {
      if (this.details.status != 1) {
        this.$router.push(this.fun.getUrl("personBank"));
      } else if (this.details.status == 1 && this.details.company_status != 1) {
        this.$router.push(this.fun.getUrl("signCompany"));
      }
    },
    gotoPages(url, params = {}, query = {}) {
      this.$router.push(this.fun.getUrl(url, params, query));
    },
    getDetails() {
      this.showPage = false;
      $http.get("plugin.yun-sign.frontend.h5.member.get-info", { cid: this.cid }, "loading").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        this.details = res.data;
        // this.workerList = res.data.work_list;
        if (this.details.is_legal == 1 || (this.details.is_legal == 0 && this.details.company_status == 1)) {
          // 判断是否法人
          this.getTemplateList();
        }
        this.showPage = true;
      });
    },
    // getWorkerList() {
    //   $http.get("plugin.yun-sign.frontend.h5.worker.get-list").then(res => {
    //     if (res.result != 1) {
    //       return this.$toast(res.msg);
    //     }
    //     this.workerList = res.data.data;
    //   });
    // },

    //加载模版数据
    getTemplateList() {
      this.initData();
      $http.get("plugin.yun-sign.frontend.h5.template.getList").then(res => {
        if (res.result != 1) {
          return this.$toast(res.msg);
        }
        this.isLoadMore = true;
        this.templateList = res.data.list.data;
        this.total_page = res.data.list.last_page;
      });
    },
    //加载更多模版数据
    getMoreData() {
      if (this.details.is_legal != 1) {
        return;
      }
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        this.isLoadMore = false;
      } else {
        this.page += 1;
        $http
          .get("plugin.yun-sign.frontend.h5.template.getList", {
            page: this.page
          })
          .then(res => {
            this.isLoadMore = true;
            if (res.result === 1) {
              let nextPageData = res.data.list.data;
              this.templateList = this.templateList.concat(nextPageData);
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
              console.log(res.msg);
            }
          });
      }
    }

    // deleteWorker(item, index) {
    //   this.$dialog
    //     .confirm({
    //       message: "确定删除吗？"
    //     })
    //     .then(() => {
    //       $http
    //         .get("plugin.yun-sign.frontend.h5.worker.del-worker", {
    //           id: item.id
    //         },"")
    //         .then(res => {
    //           if (res.result != 1) {
    //             return this.$toast(res.msg);
    //           }
    //           this.workerList.splice(index, 1);
    //         });
    //     })
    //     .catch(() => {});
    // }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./common.scss";

#signLunch {
  .header {
    display: flex;
    width: 23.438rem;
    padding: 1.531rem 0.938rem 2.531rem;
    background-image: url("https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/sign_index_header_bg.png");
    background-size: cover;
    background-repeat: no-repeat;

    .face {
      width: 3.125rem;
      height: 3.125rem;
      border-radius: 50%;

      img {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: 50%;
      }
    }

    .header-box {
      display: flex;
      flex-direction: column;
      padding-left: 0.625rem;
      text-align: left;

      .nickname {
        margin-bottom: 0.2rem;
        font-size: 1rem;
        color: #fff;
      }

      .desc {
        display: flex;
        align-items: center;
        margin-top: 0.2rem;
        font-size: 0.75rem;
        color: #fff;

        .label {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.15rem 0.4rem;
          line-height: 1rem;
          margin-left: 0.594rem;
          background-color: #0c73c6;
          border-radius: 0.547rem;
          font-size: 0.625rem;
          color: #fff;
        }
      }
    }
  }

  .container {
    .fixed-btn {
      position: absolute;
      top: 0.6rem;
      right: 0.75rem;
      width: 3.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 1.406rem;
      font-size: 0.625rem;
      color: #fa761d;
      border-radius: 0.188rem;
      border: solid 0.063rem #fa761d;
    }

    .container-box {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;

      .container-flex {
        .num {
          font-weight: bold;
          font-size: 0.875rem;
          color: #282828;
        }

        .desc {
          margin-top: 0.425rem;
          font-size: 0.688rem;
          color: #4f4f4f;
        }
      }
    }
  }

  .myContract {
    margin-top: -1.5rem;
  }

  .companyContract {
    margin-top: 0.625rem;
  }

  .contractBill {
    margin-top: 0.625rem;
  }

  .staffManagement {
    margin-top: 0.625rem;

    .staffManagement-box {
      justify-content: flex-start;
      overflow: scroll;
      padding-bottom: 0.2rem;

      .staffManagement-flex {
        position: relative;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 6.313rem;
        height: 7.5rem;
        margin-right: 0.625rem;
        background-color: #fff;
        box-shadow: 0 0.063rem 0.25rem 0.025rem rgba(211, 211, 211, 0.66);
        border-radius: 0.313rem;

        .face {
          width: 3.438rem;
          height: 3.438rem;
          margin-top: 1rem;

          img {
            width: 3.438rem;
            height: 3.438rem;
            border-radius: 0.188rem;
          }
        }

        .name {
          margin-top: 0.4rem;
          font-size: 0.813rem;
          color: #4f4f4f;
        }

        .label {
          position: absolute;
          top: 0;
          left: 0;
          width: 2.5rem;
          height: 1.063rem;
          font-size: 0.688rem;
          color: #fff;
          background-color: #ffaa01;
          border-radius: 0.313rem 0 0.313rem 0;

          &.staff {
            background-color: #a8c5fd;
          }
        }

        .close {
          position: absolute;
          top: 0;
          right: 0;
          display: flex;
          width: 0.844rem;
          height: 0.844rem;
          background-color: #dfe0e5;
          border-radius: 0 0.313rem 0 0.313rem;

          i {
            color: #fff;
            font-size: 0.625rem;
          }
        }
      }
    }
  }

  .myTemplate {
    margin-top: 0.625rem;

    .myTemplate-box {
      padding-top: 0.5rem;

      .myTemplate-flex {
        display: flex;
        align-items: center;
        height: 3.125rem;
        padding: 0 0.3rem;
        overflow: hidden;

        .number {
          font-size: 0.813rem;
          color: #fa761d;
        }

        .title {
          flex: 1;
          text-align: left;
          margin-left: 1rem;
          font-size: 0.813rem;
          color: #272727;
        }

        .sendBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 4.063rem;
          height: 1.5rem;
          font-size: 0.688rem;
          color: #fff;
          background-color: #198bfb;
          border-radius: 0.188rem;
        }
      }
    }
  }
}

.v-leave {
  opacity: 1;
  width: 6.313rem;
}

.v-leave-active {
  /* 用3s的时间过渡从隐藏开始到隐藏结束 */
  opacity: 0;
  width: 0 !important;
  transition: all 0.5s;
}
</style>
