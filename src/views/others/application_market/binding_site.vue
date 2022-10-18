<template>
  <div class="binding-box">
    <c-title :hide="false" :text="'新增/绑定站点'">
    </c-title>

    <div class="content-box" v-if="!isBinding">
      <div class="change">
        <div class="btn blue" @click="toChange">绑定已有站点</div>
        <p>如果您已经部署安装过当前商城，请绑定已有站点</p>
        <p class="tips">注：您只能绑定一个站点，请勿绑定他人站点！</p>
      </div>

      <div class="new">
        <div class="btn red" @click="toChange('new')">创建新站点</div>
        <p>如果您未部署安装当前商城，请创建站点！</p>
      </div>
    </div>
    <div class="change" v-else>
      您已绑定过域名
    </div>

    <div class="service-box" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"><span>如有疑问请联系客服</span> <i class="iconfont icon-kefu"></i></div>

  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  data() {
    return {
      isBinding: false,
    };
  },
  activated() {
    this.checkData();
  },
  methods: {
    checkData() {
      let url = "plugin.product-market.api.client.index";
      if(this.$route.query.plugin_id === 58) {
        url = "plugin.market-sub.api.client.index";
      }
      $http
        .get(
          url,
          {},
          "获取中"
        )
        .then(response => {
          if (response.result === 1) {
            this.isBinding = false;
          } else {
            // 已经绑定过的不操作
            this.isBinding = true;
            this.$dialog.alert({ message: response.msg})
              .then(() => {
               
                this.$router.go(-1);
              }).catch(() => {});
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    toChange(str) {
      if(str === 'new') {
        this.toRouter('changeSite','replace',{},{
          isNew : 1,
          plugin_id: this.$route.query.plugin_id
        });
      }else {
        this.toRouter('changeSite','replace',{},{plugin_id: this.$route.query.plugin_id});
      }
    },
    toRouter(url, jumpType, params,  query) {
      if(jumpType === 'replace') {
        this.$router.replace(
          this.fun.getUrl(url, {
            tag: this.$route.query.tag,
            goodsId: this.$route.query.goodsId,
            optionsId: this.$route.query.optionsId,
            total: this.$route.query.total,
            id: this.diyform_id,
            form_data_id: this.form_data_id,
            cart_ids: this.$route.query.cart_ids,
            store_id: this.$route.query.store_id,
            ...params
          },{...query})
        );
      }
    },
  },
  components: { cTitle }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>

  .binding-box {
    background: #fff;
    min-height: 100vh;
  }

  .change,
  .new {
    padding: 2rem 1rem;
  }

  .change {
    margin-top: 1rem;
  }

  .btn {
    width: 9rem;
    margin: 1rem auto;
    height: 3rem;
    line-height: 3rem;
    font-size: 16px;
    background-color: #4ba4fd;
    color: #fff;
    border-radius: 10px;
  }

  .red {
    background-color: #ff5f5d;
  }

  .tips {
    color: #ff5f5d;
  }

  .service-box {
    position: fixed;
    width: 100%;
    bottom: 1rem;
    display: flex;
    justify-content: center;

    .icon-kefu {
      color: #ff5f5d;
    }

    &.pcStyle {
      width: 375px;
    }
  }
</style>
