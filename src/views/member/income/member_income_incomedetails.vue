<template>
  <div>
    <div id="incomedetailed">
      <!--<c-title :hide="false"
                                 text='收入明细'></c-title>-->
    
        <van-nav-bar
        left-arrow
        :title="`${income_name_text}明细`"
        right-text="筛选"
        @click-right="screen()"
        fixed
        @click-left="goto"
        :class="[this.fun.getPhoneEnv() == 3 ? 'pcStyle' : '']"
      />
           <div style="height: 40px;"></div>
    
            <van-pull-refresh v-model="isLoading" @refresh="loadTop" success-text="刷新成功">
                <div>
                    <!-- tab-container -->
                    <!-- <div class="times">{{item.create_month}}</div> -->
                    <router-link :to="fun.getUrl('income_details_info',{ id: item.id })" v-for=" (item,i) in datas" :key='i'>
                        <div class="tbs">
                            
                            <ul class="left">
                                <li class="item1">{{item.type_name}}</li>
                                <li class="item2">{{item.created_at}}</li>
                            </ul>
                            <div class="item3">
                                <span class="add">+{{item.amount}}</span>
                            </div>
                        </div>
                    </router-link>
                </div>
            </van-pull-refresh>
        </div>
        <van-popup v-model="popupSpecs" position="bottom" class="mint-popup-4" closeOnClickModal='true'>
            <div class="screen" v-for=" (item,i) in typeData" :key='i'>
                <ul>
                    <li @click="screenType(item.type)">
                        <a>{{item.title}}</a>
                    </li>
                </ul>
            </div>
        </van-popup>
    </div>
</template>
<script>
import member_income_incomedetails_controller from './member_income_incomedetails_controller';
export default member_income_incomedetails_controller;
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#incomedetailed {
  .mint-header {
    background: none;
    color: #666;
  }

  .is-fixed .mint-header-title {
    font-weight: bold;
  }

  .mint-header.is-fixed {
    border-bottom: 0.0625rem solid #ebebeb;
    background: #fff;
    z-index: 99;
  }

  .is-right a {
    font-size: 12px;
  }

  a {
    color: #333;
  }

  .mint-navbar {
    margin-bottom: 0.125rem;
  }

  .mint-navbar .mint-tab-item {
    padding: 0.875rem 0;
  }

  .times {
    text-align: left;
    text-indent: 0.625rem;
    line-height: 2rem;
    background: #ddd;
  }

  .tbs {
    background: #fff;
    overflow: hidden;
    display: flex;
    align-items: center;
    padding: 0.625rem 0.75rem;
    border-bottom: 0.0625rem solid #e2e2e2;

    .left {
      flex: 2;
      text-align: left;
      line-height: 1.5rem;
    }

    .item1 {
      font-size: 14px;
      color: #333;
    }

    .item2 {
      color: #8c8c8c;
    }

    .item3 {
      flex: 1;
      text-align: right;
      font-size: 14px;

      .add {
        color: #259b24;
      }

      .reduce {
        color: #f15353;
      }
    }
  }
}

.mint-popup-4 {
  background: #fff;
  width: 100%;
  height: 20rem;
  overflow: auto;

  /* position: fixed; */

  /* top: 2.5rem; */

  .screen {
    li {
      padding: 0.375rem 0;
      border-radius: 0.3125rem;
      float: left;
      background: #f5f5f5;
      font-size: 12px;
      width: 27%;
      margin: 3%;

      a {
        color: #333;
      }
    }
  }
}

.van-nav-bar,
/deep/.van-nav-bar__content {
  height: 40px;
}

/deep/.van-nav-bar__title {
  font-weight: 700;
  font-size: 14px;
  color: #666;
}

/deep/.van-nav-bar .van-icon {
  color: #666;
}

/deep/.van-nav-bar__left {
  padding: 0 0 0 10px;
}

.pcStyle {
  width: 375px;
  margin: 0 auto;
  left: 50%;
  margin-left: -187.5px;
}

/deep/.van-nav-bar__text {
  color: #666;
}
</style>
