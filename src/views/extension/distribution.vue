<template>
    <div class="distribution" id="distribution">
        <c-title :hide="false" :text="this.mailLanguage.commission&&this.mailLanguage.commission.agent?this.mailLanguage.commission.agent:'分销商'" ></c-title>
        <div class="header">
            <div class="user">
                <div class="user-head">
                    <img :src="userAvatar">
                </div>
                <div class="user-info">
                    <div data-v-30855510="" class="user-name">{{userName}}[会员ID:{{vipId}}]</div>
                    <div data-v-30855510="" class="user-other">{{ mail_distrbution_name }} {{distrbution_name}}<br> {{ $yzt('distribution.distrbution_tiem') }}：{{distrbution_tiem}}</div>
                </div>
            </div>
        </div>
        <div class="myrelationship">

            <!--<router-link  :to="{name:'myRelationship',query:{i:toi}}"-->
            <router-link :to="fun.getUrl('myRelationship',{})">

                <div class="list1" style="margin: 0;">
                    {{ $yzt('distribution.team') }}

                    <i class="fa fa-angle-right"></i>
                    <span>{{count}}人</span>
                </div>
            </router-link>
        </div>
        <div class="scale">
            <div class="list1" style="margin: 0;">
                {{ $yzt('distribution.default-rate') }}

                <!--Notification 通知   可自动关闭 -->

                <i class="fa fa-question-circle" aria-hidden="true" @click="msg"></i>

                <!--提示内容    标题：默认分销比例   内容：因商品、供应商可以独立设置佣金，您最终获得的佣金可能与此比例不同 -->
                <!--Notification 通知   结束 -->

            </div>
            <div class="list2" style="margin: 0;">
                {{ $yzt('distribution.first-level') }}
                <span>{{first_level}}%</span>
            </div>
            <div class="list2" style="margin: 0;" v-if="false">
                {{ $yzt('distribution.second-level') }}
                <span>{{second_level}}%</span>
            </div>
            <div class="list2" style="margin: 0;" v-if="false">
                {{ $yzt('distribution.third-level') }}
                <span>{{third_level}}%</span>
            </div>
        </div>

        <div class="title">
            <div class="spare"></div>
            <h3>佣金</h3>
        </div>

        <ul id="gongge">
            <li>

                <!--<router-link :to="{name:'commission',query:{i:toi}}">-->
                <router-link :to="fun.getUrl('commission',{})">
                    <i class="iconfont icon-zanwushouyi"></i>
                    <span>{{ '预计'+mail_commission_amount }}</span>
                    <br>
                    <b>{{expect}}</b>{{$i18n.t('元')}}
                </router-link>
            </li>
            <li>

                <!--<router-link :to="{name:'unsettled',query:{i:toi}}">-->
                <router-link :to="fun.getUrl('unsettled',{})">
                    <i class="iconfont icon-weitixian"></i>
                    <span>{{ '未结算'+mail_commission_amount }}</span>
                    <br>
                    <b>{{unliquidated}}</b>{{$i18n.t('元')}}
                </router-link>
            </li>
            <li>

                <!--<router-link :to="{name:'alreadySettled',query:{i:toi}}">-->
                <router-link :to="fun.getUrl('alreadySettled',{})">
                    <i class="iconfont icon-yijiesuan"></i>
                    <span>{{ '已结算'+ mail_commission_amount}}</span>
                    <br>
                    <b>{{liquidated}}</b>{{$i18n.t('元')}}
                </router-link>
            </li>
            <li>

                <!--<router-link :to="{name:'notPresent',query:{i:toi}}">-->
                <router-link :to="fun.getUrl('notPresent',{})">
                    <i class="iconfont icon-weitixian"></i>
                    <span>{{ '未提现'+ mail_commission_amount}}</span>
                    <br>
                    <b>{{not_yet_withdrawed}}</b>{{$i18n.t('元')}}
                </router-link>
            </li>
            <li>

                <!--<router-link :to="{name:'present',query:{i:toi}}">-->
                <router-link :to="fun.getUrl('present',{})">
                    <i class="iconfont icon-yitixian"></i>
                    <span>{{ '已提现'+ mail_commission_amount}}</span>
                    <br>
                    <b>{{withdrawed}}</b>{{$i18n.t('元')}}
                </router-link>

            </li>

            <li v-if="false">

                <router-link :to="fun.getUrl('manage',{})">
                    <i class="iconfont icon-yitixian"></i>
                    <span>{{ $yzt('distribution.manage') }}</span>
                    <br>
                    <b>{{manage}}</b>{{$i18n.t('元')}}
                </router-link>

            </li>

            <li>
                <router-link :to="fun.getUrl('invalid',{type:1})">
                    <i class="iconfont icon-weitixian"></i>
                    <span>{{'无效'+mail_commission_amount}}</span>
                    <br>
                    <b>{{invalid}}</b>{{$i18n.t('元')}}
                </router-link>
            </li>
        </ul>
        <div class="title">
            <div class="spare"></div>
            <h3>{{ $yzt('distribution.ordername') }}</h3>
        </div>
        <ul id="distribution-order">
            <li>
                <!--<router-link :to="{name:'distributionOrder',params:{selected:'0'},query:{i:toi}}">-->
                <router-link :to="fun.getUrl('distributionOrder',{selected:'0'})">
                    <i class="iconfont icon-caidan"></i>
                    <br>{{ $yzt('distribution.all_order') }}
                </router-link> </li>
                <li>
                    <!--<router-link :to="{name:'distributionOrder',params:{selected:'1'},query:{i:toi}}">-->
                    <router-link :to="fun.getUrl('distributionOrder',{selected:'1'})">
                        <i class="iconfont icon-weifukuan" aria-hidden="true"></i>
                        <br>{{ $yzt('distribution.no_pay_order') }}
                    </router-link>
                </li>
                <li>
                    <!--<router-link :to="{name:'distributionOrder',params:{selected:'2'},query:{i:toi}}">-->
                    <router-link :to="fun.getUrl('distributionOrder',{selected:'2'})">
                        <i class="iconfont icon-weifukuan" aria-hidden="true"></i>
                        <br>{{ $yzt('distribution.pay_order') }}
                    </router-link>
                </li>
                <li>
                    <!--<router-link :to="{name:'distributionOrder',params:{selected:'3'},query:{i:toi}}">-->
                    <router-link :to="fun.getUrl('distributionOrder',{selected:'3'})">
                        <i class="iconfont icon-wancheng2"></i>
                        <br>{{ $yzt('distribution.complate_order') }}
                    </router-link>
                </li>
        </ul>
    </div>
</template>
<script>
import distribution from './distribution_controller';
export default distribution;

</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.distribution {
  a {
    color: #000;
  }

  .header {
    height: auto;
    background: #f15353;
    background-size: 100% 100%;
    padding: 1.25rem;
    position: relative;

    .user {
      display: flex;

      .user-head {
        height: 3.25rem;
        width: 3.25rem;
        background: #fff;
        border-radius: 50%;
        border: 0.125rem solid #fff;
        box-sizing: content-box;
        overflow: hidden;

        img {
          width: 100%;
        }
      }

      .user-info {
        color: #fff;
        text-align: left;
        margin-left: 0.625rem;

        .user-name {
          font-weight: bold;
          font-size: 14px;
          line-height: 1.875rem;
        }

        .user-other {
          font-size: 12px;
          opacity: 0.5;
        }
      }
    }
  }

  .scale {
    height: auto;
    width: 100%;
    background: #fff;
    margin-top: 0.625rem;

    .list1 {
      height: 2.75rem;
      box-sizing: content-box;
      background: #fff;
      padding: 0 0.75rem;
      font-size: 14px;
      line-height: 2.75rem;
      color: #333;
      text-align: left;
      border-bottom: solid 0.0625rem #e2e2e2;

      i {
        color: #f15353;
        font-size: 1.2rem;
        float: right;
        line-height: 2.75rem;
      }
    }

    .list2 {
      height: 2.75rem;
      box-sizing: content-box;
      background: #fff;
      padding: 0 0.75rem;
      font-size: 14px;
      line-height: 2.75rem;
      color: #888;
      text-align: left;

      span {
        float: right;
      }
    }
  }

  .myrelationship {
    a {
      .list1 {
        height: 2.75rem;
        background: #fff;
        padding: 0 0.75rem;
        font-size: 15px;
        line-height: 2.75rem;
        box-sizing: content-box;
        color: #242424;
        text-align: left;

        i {
          line-height: 2.75rem;
          color: #c9c9c9;
          font-size: 1.5rem;
          float: right;
        }

        span {
          line-height: 2.75rem;
          color: #8c8c8c;
          font-size: 14px;
          float: right;
          padding-right: 0.625rem;
        }
      }
    }
  }

  .title {
    margin-top: 0.625rem;
    display: flex;
    height: 2.25rem;
    line-height: 2.25rem;
    background-color: #fff;
    padding: 0 0.625rem;
    border-bottom: solid 0.0625rem #e2e2e2;

    .spare {
      width: 0.25rem;
      height: 1rem;
      background-color: #f15353;
      margin-right: 0.375rem;
      margin-top: 0.5625rem;
      border-radius: 0.0625rem;
    }

    h3 {
      font-size: 14px;
    }
  }

  #gongge {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background: #fff;
    column-count: 3;
    padding-bottom: 0.625rem;
    padding-top: 0.625rem;

    li {
      width: 33%;
      text-align: center;
      margin-bottom: 0.625rem;
      margin-top: 0.625rem;
      font-size: 12px;

      i {
        font-size: 26px;
        color: #999;
        display: inline-block;
        margin-bottom: 0.375rem;
        width: 100%;
      }

      a span {
        color: #333;
        font-size: 12px;
      }

      b {
        color: #f15353;
        font-size: 16px;
      }
    }
  }
}

#distribution-order {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  background: #fff;
  column-count: 4;
  padding-bottom: 0.625rem;

  li {
    width: 25%;
    text-align: center;
    margin-bottom: 0.625rem;
    font-size: 12px;
    color: #666;

    i {
      font-size: 1.7rem;
      color: #999;
      margin: 0.9375rem 0 0.4375rem 0;
      display: inline-block;
    }
  }
}
</style>
