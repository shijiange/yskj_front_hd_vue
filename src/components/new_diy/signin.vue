<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>

    <div v-if="!show" style="height: 50px; background: white; font-size: 16px; line-height: 50px;"> 请先开启签到插件 </div>

    <!--签到静态-->
    <div class="signIn" v-if="datas.sign_style == 1 && show">
      <div class="signBox" style="position: relative;">
        <img :src="datas.preview_image? datas.preview_image: emptyImage"  class="bg-img" alt="">
        <div class="left">
          <div class="left_conten">
            <div class="left_one">已经连续{{signdata.sign_name || '签到'}}天数：<span class="adone" >{{signdata.cumulative_number}}</span></div>
            <div class="left_two" v-if="datas.show_prize">今日{{signdata.sign_name || '签到'}}奖励</div>
            <div class="list" v-if="datas.show_prize">
              <div class="list_lis" v-if="signdata.award_point > 0">
                <span>+{{signdata.award_point}}</span>
                <span>{{integral || '积分'}}</span>
              </div>
              <div class="list_lis" v-if="signdata.award_coupon_num > 0">
                <span>+{{signdata.award_coupon_num}}张</span>
                <span>优惠券</span>
              </div>
              <div class="list_lis" v-if="signdata.award_love_min || signdata.award_love_max">
                <span v-if="signdata.get_love">+ {{signdata.get_love}}</span>
                <span v-else>+{{signdata.award_love_min ? signdata.award_love_min : ''}} {{signdata.award_love_min && signdata.award_love_max ? '~' :''}} {{signdata.award_love_max ? signdata.award_love_max: ''}}</span>
                <span>{{signdata.love_name || '爱心值'}}</span>
              </div>
            </div>
            <div class="btn" v-if="signdata.sign_status">
              <span>已{{signdata.sign_name || '签到'}}</span>
            </div>
            <div class="btn" @click="signnow" v-if="!signdata.sign_status">
              <span>立即{{signdata.sign_name || '签到'}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div class="signIn" v-if="datas.sign_style == 2 && show">
      <!-- 在这里写签到静态 -->
      <div class="signBox_one" style="position: relative;">
        <img :src="datas.preview_image? datas.preview_image: emptyImage" class="bg-img" alt="">
        <div class="left">
          <div class="left_conten">
            <div class="left_one">已经连续{{signdata.sign_name || '签到'}}天数：<span class="adone" >{{signdata.cumulative_number}}</span></div>
            <div class="left_two" v-if="datas.show_prize">今日{{signdata.sign_name || '签到'}}奖励</div>
            <div class="list" v-if="datas.show_prize">
              <div class="list_lis" v-if="signdata.award_point > 0">
                <span>+{{signdata.award_point}}</span>
                <span>{{integral || '积分'}}</span>
              </div>
              <div class="list_lis" v-if="signdata.award_coupon_num > 0">
                <span>+{{signdata.award_coupon_num}}张</span>
                <span>优惠券</span>
              </div>
              <div class="list_lis" v-if="signdata.award_love_min || signdata.award_love_max">
                <!--没签到前显示最小值~最大值   签到后显示实际数量-->
                <span v-if="signdata.get_love">+ {{signdata.get_love}}</span>
                <span v-else>+{{signdata.award_love_min ? signdata.award_love_min : ''}} {{signdata.award_love_min && signdata.award_love_max ? '~' :''}} {{signdata.award_love_max ? signdata.award_love_max: ''}}</span>
                <span>{{signdata.love_name || '爱心值'}}</span>
              </div>
            </div>
            <div class="btn" v-if="signdata.sign_status">
              <span>已{{signdata.sign_name || '签到'}}</span>
            </div>
            <div class="btn" @click="signnow" v-if="!signdata.sign_status">
              <span>立即{{signdata.sign_name || '签到'}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import emptyImage from "../../assets/images/new_diy/banner.png";

// 自定义样式
const css = function () {
  const {
    margin_top,
    margin_bottom,
    margin_left,
    margin_right,
    font_size,
    font_color,
    button_size,
    button_style,
    button_bg_color,
    button_color,
    prize_font_size,
    prize_font_color,
  } = this.datas;

  return `
        .component-${this.id} .signIn {
            margin-top: ${margin_top}px;
            margin-bottom: ${margin_bottom}px;
            margin-left: ${margin_left}px;
            margin-right: ${margin_right}px;
        }

        .component-${this.id} .left_two, .component-${this.id} .list {
        	 font-size: ${prize_font_size}px;
            color: ${prize_font_color};
        }

        .component-${this.id} .signIn .left_one {
            font-size: ${font_size}px;
            color: ${font_color};
        }

        .component-${this.id} .signIn .btn span{
        		font-weight: ${button_style.includes('1')?'bold':''};
            font-style: ${button_style.includes('2')?'italic':''};
        		background-color: ${button_bg_color};
            font-size: ${button_size}px;
            color: ${button_color};
        }

    `;
};

export default {
  data(){
    return{
      emptyImage,
      show: true,
      clickTag: false,
      signdata: {},
      integral: ""
    };
  },
  props: ['id', 'datas', 'styles'],
  computed: {
    css() {
      return '<style>' + css.call(this) + '</style>';
    },
    className() {
      const name = ['component-wrapper', `component-${this.id}`];
      return name;
    },
  },
  mounted() {
    if(this.datas.params) {
      this.show = true;
      this.signdata = this.datas.params;
    }else {
      this.show = false;
    }
    this.integral = window.localStorage.getItem("integral");
  },
  methods: {
    signnow() {
      if (this.clickTag) {
        //防止快速点击
        return;
      }
      this.clickTag = true;
      $http.get('plugin.sign.Frontend.Modules.Sign.Controllers.sign.sign').then(res => {
        if (res.result == 1) {
          // this.signdata.cumulative_number = this.signdata.cumulative_number + 1;
          // this.signdata.sign_status = true;
          // setTimeout(function() {
          //   this.clickTag = false;
          // }, 1000);
          let reslink = res.data.success_url;
          this.getNum(reslink,res.msg);
          // this.$dialog.alert({ message: res.msg})
          //   .then(() => {
          //     if(reslink) {
          //       setTimeout(function() {
          //         window.location.href = reslink;
          //       }, 1000);
          //     }
          //   }).catch(() => {});
        } else {
          Toast(res.msg);
          setTimeout(function() {
            this.clickTag = false;
          }, 1000);
        }
      });
    },
    getNum(reslink,msg){
      //获取本次签到奖励
      $http.get('plugin.decorate.frotend.decorate-api.get-sign').then(res => {
        if (res.result == 1) {
          this.signdata = res.data;
          setTimeout(function() {
            this.clickTag = false;
          }, 1000);
          this.$dialog.alert({ message: msg})
            .then(() => {
              if(reslink && location.href != reslink) {
                setTimeout(function() {
                  window.location.href = reslink;
                }, 1000);
              }
            }).catch(() => {});
        } else {
          Toast(res.msg);
          setTimeout(function() {
            this.clickTag = false;
          }, 1000);
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  // 默认
  * {
    list-style-type: none;
  }

  .component-wrapper {
    width: 100%;
  }

  .signIn {
    display: flex;
  }

  .bg-img {
    width: 100%;
    height: 100%;
    display: block;
    min-height: 200px;
  }

  .signBox {
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    /* border-radius: 9.5px; */
    .left {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 140px;
      min-height: 200px;
      background-color: rgba(122, 122, 122, 0.5);
      overflow: hidden;

      /* border-radius: 9.5px 0 0 9.5px; */
      display: flex;
      align-items: center;

      .left_conten {
        width: 140px;
        padding: 19px 10.5px 9.5px 10.5px;

        .left_two {
          margin-top: 18px;
        }

        .btn {
          text-align: center;
          line-height: 25px;
          margin-top: 14px;

          span {
            padding: 6.5px 17.5px 5.5px 17.5px;
            border-radius: 12.5px;
          }
        }

        .list {
          display: flex;
          justify-content: space-between;
          margin-left: 3.5px;
          margin-top: 13px;

          .list_lis {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            span {
              display: inline-block;
              line-height: 1.2;
            }
          }
        }
      }
    }
  }

  .signBox_one {
    width: 100%;

    .left {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      min-height: 200px;
      width: 100%;
      background-color: rgba(122, 122, 122, 0.3);
      overflow: hidden;
      display: flex;
      justify-content: center;

      .left_conten {
        width: 200px;
        padding: 19px 10.5px 9.5px 10.5px;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .left_one {
          text-align: center;
        }

        .left_two {
          margin-top: 18px;
          text-align: center;
        }

        .btn {
          text-align: center;
          line-height: 25px;
          margin-top: 13.5px;

          span {
            padding: 6.5px 17.5px 5.5px 17.5px;
            border-radius: 12.5px;
          }
        }

        .list {
          display: flex;
          justify-content: center;
          margin-left: 3.5px;
          margin-top: 13px;

          .list_lis {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 0 8px;

            span {
              display: inline-block;
              line-height: 1.2;
            }
          }
        }
      }
    }
  }
</style>
