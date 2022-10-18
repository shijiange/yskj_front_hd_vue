<template>
  <div id="member-all" :style="{
          backgroundColor: Params.memberbgcolor,
          backgroundImage:
            'url(' +
            (Params.memberbg == '2' ? Params.bgimg : '') +
            ')',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }">
    <div :class="
        'user_box' +
          Params.memberlevelstyle +
          Params.memberportrait
      ">
      <div class="head-box"
           style="overflow: hidden;"
           :style="{
          backgroundColor: Params.memberbgcolor,
          backgroundImage:
            'url(' +
            (Params.memberbg == '2' ? Params.bgimg : '') +
            ')',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat'
        }">
        <div class="user_img user_img_style1">
          <img :src="member_item.avatar"
               alt="头像" />
        </div>
        <ul class="user_name user_name_style1">
          <li class="name">
            <span class="name_a"
                  :style="{ color: Params.membernamecolor }">{{ member_item.nickname }}</span><span class="member_id"
                                                                                                    v-if="Params.memberID==1">会员ID:{{ member_item.uid }}</span>
          </li>
          <li class="code"
              v-if="member_item.is_agent && member_item.inviteCode && member_item.inviteCode.status">
            邀请码：{{ member_item.inviteCode.code
            }}<span v-clipboard:copy="member_item.inviteCode.code"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">复制
            </span>
          </li>
          <li v-else
              style="height: 30px;"></li>
        </ul>
      </div>

      <!--	会员等级样式一   -->
      <div class="member_grade1"
           @click="gotoMemberGrade"
           v-if="Params.memberlevel == 1 && Params.memberlevelstyle == 1
        ">
        <i class="iconfont icon-member-enter"></i>
        <span :style="{ color: Params.memberlevelcolor }">{{ Params.memberleveltype == '1'? member_item.level_name :Params.levelname }}</span>
        <i class="fa fa-angle-right"></i>
      </div>
      <!--	会员等级样式三   -->
      <div class="member_grade3"
           @click="gotoMemberGrade"
           v-if="Params.memberlevel == 1 && Params.memberlevelstyle == 3
        ">
        <div class="grade">
          <i class="iconfont icon-member-enter"></i>
          <span :style="{ color: Params.memberlevelcolor }">
            {{ Params.memberleveltype == '1'? member_item.level_name :Params.levelname }}
          </span>
        </div>
        <div class="member_btn">
          <span>点击查看</span>
          <i class="iconfont icon-member_look"></i>
        </div>
      </div>
    </div>

    <!--	会员等级样式二   -->
    <div class="member_grade2"
         v-if="
          Params.memberlevel == 1 && Params.memberlevelstyle == 2
        ">
      <i class="iconfont icon-member-enter"></i>
      <span class="member_name" :style="{ color: Params.memberlevelcolor }">{{ Params.memberleveltype == '1'? member_item.level_name :Params.levelname}}</span>
      <div class="member_btn"
           @click="gotoMemberGrade">
        <span>点击查看</span>
        <i class="iconfont icon-member_look"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";

export default {
  props: ["Params", "member_item", "isClick"],
  data() {
    return {
      name_of_withdrawal_text: ""
    };
  },
  mounted() {
    this.customizeIncome();
  },
  methods: {
    gotoMemberGrade() {
      if (this.isClick && this.Params.memberleveltype == "1") {
        this.$router.push(this.fun.getUrl("MemberGradeList"));
      } else if (this.Params.memberleveltype == "2") {
        if (!this.Params.levelname && !this.Params.isagent) {
          this.$router.push(this.fun.getUrl("ExtensionApply"));
        } else {
          this.$router.push(this.fun.getUrl("teamAgentCenter"));
        }
      } else if (this.Params.memberleveltype == "3") {
        if (!this.Params.levelname && !this.Params.isagent) {
          this.$router.push(this.fun.getUrl("ExtensionApply"));
        } else {
          this.$router.push(this.fun.getUrl("distribution"));
        }
      }
    },
    // 复制邀请码
    onCopy: function(e) {
      Toast({
        message: "复制成功",
        duration: 1000
      });
    },
    //自定义提现收入语言
    customizeIncome() {
      let mailLanguage = this.fun.initMailLanguage();
      //自定义提现字段
      this.name_of_withdrawal_text = mailLanguage.income.name_of_withdrawal;
    }
  }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  #member-all {
    .user_box11,
    .user_box12,
    .user_box13,
    .user_box21,
    .user_box22,
    .user_box23,
    .user_box31,
    .user_box32,
    .user_box33 {
      background-color: #fff;
      position: relative;
    }

    .head-box {
      padding-bottom: 10px;
    }

    .user_img {
      width: 64px;
      height: 64px;
      border-radius: 64px;
      overflow: hidden;
      background: #f2f2f2;
      border: solid 2px #ebebeb;
    }

    .user_img img {
      width: 100%;
    }

    .user_name {
      margin-left: 10px;
      margin-top: 10px;
    }

    .user_name .name {
      font-size: 16px;
      display: flex;
      display: -webkit-flex;
      text-align: center;
    }

    .name .name_a {
      line-height: 2rem;
      // flex: 0 0 90px;
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
      font-weight: bold;
      font-size: 16px;
      margin-top: 0;
    }

    .name .member_id {
      padding: 2px 10px;
      font-size: 12px;
      background-color: #f5f5f5;
      border-radius: 16px;
      margin-left: 6px;
      margin-top: 0;
      display: flex;
      align-self: center;
    }

    .user_name .code {
      font-size: 14px;
      margin-top: 10px;
      color: #8c8c8c;
      display: flex;
      display: -webkit-flex;
    }

    .code span {
      padding: 2px 10px;
      font-size: 12px;
      font-weight: normal;
      background-color: #f5f5f5;
      border-radius: 16px;
      margin-left: 6px;
      margin-top: 0;
    }

    .member_grade1 {
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      padding: 4px 10px;
      background: linear-gradient(to right, #3b3b4f, #9898a4); /* 标准的语法 */
      border-radius: 32px;
      color: #e6c785;
      font-size: 12px;
      position: absolute;
      right: 5px;
      top: 10px;
    }

    .member_grade1 .iconfont {
      font-size: 20px;
      margin-right: 4px;
      color: #e6c785;
    }

    .member_grade2 {
      width: 95%;
      margin: 0 auto;
      height: 40px;
      line-height: 40px;
      border-radius: 8px 8px 0 0;
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      -webkit-justify-content: space-between;
      align-items: center;
      -webkit-align-items: center;
      padding: 0 10px;
      background: linear-gradient(to right, #3b3b4f, #9898a4); /* 标准的语法 */
      overflow: hidden;
      position: relative;
    }

    .member_grade2 .member_name {
      color: #e6c785;
      font-size: 16px;
      font-weight: bold;
      z-index: 1;
    }

    .member_grade2 .member_btn {
      background: linear-gradient(to right, #f2e1aa, #e6c785); /* 标准的语法 */
      color: #3c3c50;
      height: 30px;
      line-height: 30px;
      padding: 0 16px;
      border-radius: 16px;
      font-size: 12px;
    }

    .member_grade2 .member_btn .icon-member_look {
      color: #3c3c50;
      font-size: 10px;
    }

    .member_grade2 .icon-member-enter {
      position: absolute;
      top: -10px;
      left: -20px;
      font-size: 156px;
      color: #333;
      opacity: 0.4;
      z-index: 0;
      transform: rotate(30deg);
      -webkit-transform: rotate(30deg);
      -moz-transform: rotate(30deg);
    }

    .member_grade3 {
      width: 100px;
      height: 79px;
      padding: 2px 8px;
      background-image: url("../../assets/images/member/grade_bg@2x.png");
      background-repeat: no-repeat;
      background-position: -6px 0;
    }

    .member_grade3 .icon-member-enter {
      font-size: 24px;
      color: #e6c785;
    }

    .member_grade3 .grade {
      margin-top: 10px;
      margin-left: 16px;
      display: flex;
      display: -webkit-flex;
      align-items: center;
      -webkit-align-items: center;
      color: #e6c785;
      font-size: 10px;
      transform: rotate(10deg);
      -webkit-transform: rotate(10deg);
      -moz-transform: rotate(10deg);
    }

    .member_grade3 .member_btn {
      margin-left: 10px;
      border-radius: 16px;
      font-size: 10px;
      border: solid 1px #e6c785;
      color: #e6c785;
      text-align: center;
      padding: 1px 0;
      width: 80px;
      background: rgba(230, 199, 133, 0.1);
      display: flex;
      display: -webkit-flex;
      justify-content: center;
      -webkit-justify-content: center;
      align-items: center;
      -webkit-align-items: center;
      transform: rotate(10deg);
      -webkit-transform: rotate(10deg);
      -moz-transform: rotate(10deg);
    }

    .member_grade3 .member_btn .icon-member_look {
      font-size: 10px;
      margin-left: 4px;
      color: #e6c785;
    }

    /* 样式一居左 */

    .user_box11 {
      .user_img_style1 {
        margin-left: 14px;
        margin-top: 20px;
        float: left;
      }

      .user_name_style1 {
        float: left;
        margin-left: 10px;
        margin-top: 28px;
      }

      .member_grade1 {
        top: 55px;
      }
    }

    /* 样式一居中 */
    .user_box12 {
      .head-box {
        padding-top: 20px;
      }

      .member_id {
        line-height: 1.7rem;
      }
      //padding-top: 20px;
      .user_img_style1 {
        margin: 0 auto 10px;
      }

      .name,
      .code {
        justify-content: center;
        -webkit-justify-content: center;
      }

      .user_name_style1 {
        margin: 0 auto;
        text-align: center;
      }

      .member_grade1 {
        top: 20px;
      }
    }

    /* 样式一居右 */
    .user_box13 {
      .user_img_style1 {
        position: absolute;
        top: 35px;
        right: 108px;
        float: left;
      }

      .user_name_style1 {
        float: left;
        margin-left: 14px;
        margin-top: 28px;
      }

      .member_grade1 {
        top: 55px;
      }
    }

    /* 样式二居左 */
    .user_box21 {
      .user_img_style1 {
        margin-left: 14px;
        margin-top: 20px;
        float: left;
      }

      .user_name_style1 {
        float: left;
        margin-left: 10px;
        margin-top: 28px;
      }

      .member_grade1 {
        top: 40px;
      }
    }

    /* 样式二居中 */
    .user_box22 {
      .head-box {
        padding-top: 20px;
      }

      .member_id {
        line-height: 1.7rem;
      }
      //padding-top: 20px;
      .user_img_style1 {
        margin: 0 auto 10px;
      }

      .name,
      .code {
        justify-content: center;
        -webkit-justify-content: center;
      }

      .user_name_style1 {
        margin: 0 auto;
        text-align: center;
      }

      .member_grade1 {
        top: 20px;
      }
    }

    /* 样式二居右 */
    .user_box23 {
      .user_img_style1 {
        position: absolute;
        top: 25px;
        right: 45px;
        float: right;
      }

      .user_name_style1 {
        float: left;
        margin-left: 25px;
        margin-top: 28px;
      }

      .member_grade1 {
        top: 40px;
      }
    }

    /* 样式三居左 */
    .user_box31 {
      .head-box {
        padding-top: 20px;
      }

      .user_img_style1 {
        margin-left: 14px;
        //margin-top: 20px;
        float: left;
      }

      .user_name_style1 {
        float: left;
        margin-left: 10px;
        //margin-top: 28px;
      }

      .member_grade1 {
        top: 40px;
      }

      .member_grade3 {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    /* 样式三居中 */

    .user_box32 {
      .head-box {
        padding-top: 20px;
      }

      .member_id {
        line-height: 1.7rem;
      }
      //padding-top: 20px;
      .user_img_style1 {
        margin: 0 auto 10px;
      }

      .user_name_style1 {
        width: 60%;
        text-align: center;
        margin: 0 auto;
      }

      .member_grade1 {
        top: 40px;
      }

      .member_grade3 {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }

    /* 样式三居右 */

    .user_box33 {
      .user_img_style1 {
        position: absolute;
        top: 20px;
        left: 186px;
        float: left;
      }

      .user_name_style1 {
        float: left;
        margin-left: 14px;
        margin-top: 28px;
      }

      .member_grade1 {
        top: 40px;
      }

      .member_grade3 {
        position: absolute;
        right: 0;
        bottom: 0;
      }
    }
  }
</style>
