<template>
  <div id="lifePayIndex">
    <c-title :hide="false" text='生活缴费' tolink='paymentRecord' totext='缴费记录'></c-title>
    <ul class="plocyDetail">
      <li>
        <label><i class="iconfont icon-shuifei"></i></label>
        <div>水费
          <router-link :to="fun.getUrl('waterFee')">
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
          </router-link>
        </div>
      </li>
      <li>
        <label><i class="iconfont icon-dianfei"></i></label>
        <div>电费
          <router-link :to="fun.getUrl('electricity')">
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
          </router-link>
        </div>
      </li>
      <li>
        <label><i class="iconfont icon-ranqifei"></i></label>
        <div>燃气费
          <router-link :to="fun.getUrl('gasCosts')">
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
          </router-link>
        </div>
      </li>
      <li>
        <label><i class="iconfont icon-guhua"></i></label>
        <div>固话
          <router-link :to="fun.getUrl('fixedTelephone')">
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
          </router-link>
        </div>
      </li>
      <li>
        <label><i class="iconfont icon-kuandai"></i></label>
        <div>宽带
          <router-link :to="fun.getUrl('broadband')">
            <i class="iconfont icon-right" v-if="$store.state.service.lang=='ch'"></i>
            <i class="iconfont icon-left" v-if="$store.state.service.lang=='wei'"></i>
          </router-link>
        </div>
      </li>
    </ul>

  </div>
</template>

<script>
import cTitle from "components/title";

export default {
  components: { cTitle },
  data() {
    return {};
  }

};

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #lifePayIndex {
    background: #fff;

    li {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-flow: row;
      flex-flow: row;
      height: 3.75rem;
      line-height: 3.75rem;
      font-size: 16px;

      label {
        width: 2.0625rem;
        height: 2.0625rem;
        line-height: 2.0625rem;
        -webkit-border-radius: 50%;
        -moz-border-radius: 50%;
        border-radius: 50%;
        margin: 0.8125rem 0.9375rem;

        i {
          font-size: 1.5625rem;
          color: #fff;
        }
      }

      div {
        flex: 1;
        text-align: left;
        border-bottom: 0.0625rem solid #ebebeb;
        color: #505050;

        i {
          font-size: 1.5625rem;
          float: right;
          padding-right: 0.9375rem;
          color: #ccc;
        }
      }
    }

    li:first-child {
      label {
        background: #6fb0d5;
      }
    }

    li:nth-child(2) {
      label {
        background: #f0a85f;
      }
    }

    li:nth-child(3) {
      label {
        background: #e98488;
      }
    }

    li:nth-child(4) {
      label {
        background: #5cba8e;
      }
    }

    li:nth-child(5) {
      label {
        background: #d2a2ee;
      }

      div {
        border-bottom: none;
      }
    }
  }

</style>