<template>
  <div id="signMission">
    <c-title :hide="false" :text="'文件信息'">
    </c-title>

    <div v-show="!showPage">
      <loading :show="true"></loading>
    </div>

    <div v-show="showPage">
      <div class="item-box">
        <p class="title">文件主题</p>
        <p class="title" style="border: none;">{{contract_info.name}}</p>
      </div>
      <div class="item-box">
        <p class="title">文件</p>
        <div class="file-box">
          <img class="img" src="../../../assets/images/sign/yq_sign_wenjian@2x.png" alt="">
          <span class="name">{{contract_info.contract_doc_name}}</span>
          <div class="right"><span>{{sign_status == 1? '已签': '待签'}}</span> <i class="iconfont icon-advertise-next"></i></div>
        </div>
      </div>

      <div class="item-box" v-if="contract_info.contract_attach_img && contract_info.contract_attach_img.length > 0">
        <p class="title">附件</p>
        <div class="file-box" v-for="(item, index) in contract_info.contract_attach_img" :key="index"  @click="openAttach(item)">
          <img class="img" src="../../../assets/images/sign/yq_sign_wenjian@2x.png" alt="">
          <span class="name">{{item.file_name}}</span>
          <div class="right"><span>查看</span> <i class="iconfont icon-advertise-next"></i></div>
        </div>
      </div>

      <div class="item-box">
        <p class="title">签署方</p>
        <div class="sign-person">
          <div class="person" v-for="user in roles_list" :key="user.id">
            <div class="left">
              <p class="company">{{user.company_name}}</p>
              <p><span style="font-weight: bold; margin-right: 0.5rem;">{{user.name}}</span><span class="tag">{{user.sign_status == 1?'已签':'未签'}}</span></p>
            </div>
            <div class="right" v-clipboard:copy="user.sign_short_url"  v-clipboard:success="onCopy"  v-clipboard:error="onError" >复制</div>
          </div>
        </div>
      </div>

      <div class="item-box">
        <p class="title">文件时间流</p>
        <div class="file-time">
          <van-steps direction="vertical" active-color="#38f" :active="active">
            <van-step v-for="time in contract_logs" :key="time.id">
              <h3>{{time.status_desc}}</h3>
              <p>{{time.created_at}}</p>
            </van-step>
          </van-steps>
        </div>
      </div>
      <div style="height: 3.5rem;"></div>

      <div class="btn" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
        <p class="sure" style="text-align: center;" @click="toBack">返回</p>
      </div>
    </div>

  </div>
</template>

<script>
import cTitle from "components/title";
import { Toast } from 'vant';
import loading from "components/loading";

export default {
  data() {
    return {
      showPage: false,
      active: 0,
      sign_status: 0,
      contract_info: {},
      contract_logs: [],
      roles_list: []
    };
  },
  activated() {
    this.contract_id = this.$route.params.id;
    this.getData();
  },
  methods: {
    openAttach(item) {
      window.open(item.file_url);
    },
    toBack() {
      this.$router.go(-1);
    },
    onCopy: function(e) {
      Toast("复制成功");
    },
    onError: function(e) {
      Toast("复制失败");
    },
    getData() {
      this.showPage = false;
      $http.post("plugin.yun-sign.frontend.h5.contract.detail-step4", {contract_id: this.contract_id}, 'loading').then(response => {
        if (response.result === 1) {
          this.showPage = true;
          this.sign_status = response.data.sign_status;
          this.contract_info = response.data.contract_info;
          this.contract_logs = response.data.contract_logs;
          this.roles_list = response.data.roles_list;
          this.active = this.contract_logs.length-1;
        } else {
          this.$dialog.alert({message:response.msg});
        }
      }).catch(err => {
        console.log(err);
      });
    },
  },
  components: { cTitle,loading }
};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #signMission {
    text-align: left;
  }

  .item-box {
    background: #fff;
    padding: 1rem;
    margin-bottom: 0.6rem;

    .title {
      font-weight: bold;
      font-size: 15px;
      border-bottom: 1px solid #eee;
      margin-bottom: 0.3rem;
      padding-bottom: 0.3rem;
    }
  }

  .file-box {
    display: flex;

    .img {
      width: 1rem;
      height: 1rem;
      flex: 0 0 1rem;
      align-self: center;
      margin-right: 0.5rem;
    }

    .name {
      flex: 1;
      word-break: break-all;
    }

    .right {
      align-self: center;
      flex: 0 0 3.3rem;
      display: flex;
    }

    .icon-advertise-next {
      font-size: 20px;
    }
  }

  .person {
    display: flex;
    margin-bottom: 0.5rem;

    .left {
      flex: 1;
    }

    .company {
      font-weight: bold;
      padding-bottom: 0.3rem;
    }

    .tag {
      background-color: #377aff;
      border-radius: 15px;
      color: #fff;
      padding: 0.15rem 0.6rem;
      font-size: 12px;
    }

    .right {
      flex: 0 0 2.5rem;
      align-self: center;
      color: #666;
      font-size: 15px;
    }
  }

  .btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;

    .sure {
      font-size: 18px;
      line-height: 2.25rem;
      width: 80%;
      margin: 10px auto;
      height: 2.25rem;
      background-image: linear-gradient(0deg, #377aff 0%, #679aff 100%);
      border-radius: 20px;
      color: #fff;
    }
  }

  .pcStyle {
    width: 375px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
