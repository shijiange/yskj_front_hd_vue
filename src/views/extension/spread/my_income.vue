<template>
    <div id="myIncome">
        <c-title :hide="false" :text='`${income_name_text}分享`'></c-title>
        <div class="income">

                <div class="header">
                    <img :src="obj.avatar?obj.avatar:require('../../../assets/images/photo-mr.jpg')">
                </div>
                <ul class="name">
                    <h1 class="a">{{obj.nickname }}</h1>
                    <li class="b"><span>{{obj.member_level }}</span></li>
                    <li class="c"><span>ID：{{obj.member_id }}</span></li>
                    <h2 class="d">{{$i18n.t('money')}}{{obj.month_income }}</h2>
                </ul>
                <div class="profit-box">
                        <h3>本月利润</h3>
                        <ul class="profit">
                            <li class="day">
                                <ul class="left">
                                    <h4><span>{{$i18n.t('money')}}</span>&nbsp;{{obj.today_income}}</h4>
                                    <li>今日利润</li>
                                </ul>
                            </li>
                            <li class="all">
                                <ul class="right">
                                    <h4><span>{{$i18n.t('money')}}</span>&nbsp;{{obj.total_income}}</h4>
                                    <li>全部利润</li>
                                </ul>
                            </li>
                        </ul>
                </div>
                <div class="code" v-if="!fun.isTextEmpty(obj.share_qr)">
                    <img :src="obj.share_qr">
                </div>


        </div>

    </div>
</template>

<script>
import income from './my_income_controller.js';
export default income;
</script>

<style lang="scss" rel="styleSheet/scss" scoped>
#myIncome {
  background-image: url(../../../assets/images/income-bg.png);
  background-size: 23.4375rem;
  background-position-y: -2.25rem;

  .income {
    background-color: #fafafa;
    width: 18.75rem;
    margin: 2.5rem auto;
    padding-bottom: 1.25rem;
    border-radius: 0.5rem;
    box-shadow: 0 0.75rem 0.88rem 0.12rem rgba(51, 51, 51, 0.08);

    h1,
    h2,
    h3,
    h4 {
      color: #333;
    }

    .header {
      width: 3.75rem;
      height: 3.75rem;
      margin: 0 auto;
      position: relative;
      top: -1rem;
      border-radius: 1.875rem;
      border: solid 0.125rem #fff;
      background-color: #ccc;
      overflow: hidden;

      img {
        width: 100%;
      }
    }

    .name {
      color: #333;

      h1 {
        font-size: 18px;
        margin-bottom: 0.625rem;
      }

      li {
        font-size: 16px;
        line-height: 1.625rem;
      }

      h2 {
        margin-top: 1rem;
        font-size: 24px;

        span {
          font-size: 14px;
        }
      }
    }

    .profit-box {
      margin-top: 2.25rem;

      h3 {
        font-size: 16px;
      }

      .profit {
        margin-top: 1rem;
        display: flex;

        .day,
        .all {
          width: 50%;

          h4 {
            height: 1.875rem;
            line-height: 1.875rem;
            font-size: 20px;

            span {
              font-size: 14px;
            }
          }

          .left,
          .right {
            li {
              line-height: 1.875rem;
              color: #8c8c8c;
              font-size: 14px;
            }
          }
        }

        .day {
          border-right: solid 0.0625rem #ebebeb;
        }
      }
    }

    .code {
      margin: 2.25rem auto 0;
      width: 6.875rem;
      height: 6.875rem;
      background-color: #fff;
      overflow: hidden;

      img {
        width: 100%;
      }
    }
  }
}
</style>


