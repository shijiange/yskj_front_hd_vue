<!-- 测肤结果 -->
<template>
  <div>
    <div id="skin_result">
      <c-title :hide="false" :text="'测肤结果'"></c-title>
      <div class="m-afresh">
        <div class="m-afresh-btn" @click.stop="gotoUrl('skinHome', {}, {})">再测一次</div>
      </div>
      <div class="m-result main-bg">
        <div class="m-result-top ">
          <div class="m-r-t-left">
            <img :src="resultData.report.member.avatar_image" alt="" />
            <div class="name">{{ resultData.report.member.nickname }}</div>
          </div>
          <div class="m-r-t-right" @click.stop="getposter">
            <i class="iconfont icon-fontclass-fenxiang2222"></i>
            分享图片
          </div>
        </div>
        <div class="m-result-center">
          <div class="m-result-left">
            <van-circle v-model="currentRate" :rate="resultData.report.composite_score" size="100px" stroke-width="100" layer-color="#f8f8f8" color="#fe5a73">
              <template #default>
                <div class="score-box">{{ resultData.report.composite_score }}</div>
              </template></van-circle
            >
            <div class="m-result-l-title">综合评分</div>
          </div>
          <div class="m-result-right">
            <div class="m-r-r-chilid" v-if="resultData.report.reportDetailTop.skinType">
              {{ resultData.report.reportDetailTop.skinType.target_name }}
              <div class="r-chilid-text">{{ resultData.report.reportDetailTop.skinType.value_desc }}</div>
            </div>
            <div class="m-r-r-chilid" v-if="resultData.report.reportDetailTop.skinColor">
              {{ resultData.report.reportDetailTop.skinColor.target_name }}
              <div class="r-chilid-text">{{ resultData.report.reportDetailTop.skinColor.value_desc }}</div>
            </div>
            <div class="m-r-r-chilid" v-if="resultData.report.reportDetailTop.skinAge">
              {{ resultData.report.reportDetailTop.skinAge.target_name }}
              <div class="r-chilid-text">{{ resultData.report.reportDetailTop.skinAge.value + "岁" }}</div>
            </div>
          </div>
        </div>
        <div class="m-result-bottom">
          <div class="m-r-b-l">您已击败{{ resultData.beat }}%的用户</div>
          <div class="m-r-b-r" @click="show = true">查看质检图片</div>
        </div>
        <div class="m-result-rank">NO:{{ resultData.report.id }}</div>
      </div>
      <div class="warn-text">提示：本报告由专业第三方AI皮肤分析结果得出，仅供参考！</div>
      <div class="skin-question main-bg">
        <template v-if="!fun.isTextEmpty(resultData.question)">
          <div class="skin-title">主要问题</div>
          <div class="skin-question-chlid">
            <div class="small-btn" v-for="(item, i) in resultData.question" :key="i">{{ item }}</div>
          </div>
        </template>
        <template v-if="resultData.report && !fun.isTextEmpty(resultData.report.reportDetail)">
          <div class="skin-title">程度指数</div>
          <div class="skin-index" v-for="item in resultData.report.reportDetail" :key="item.key">
            <div class="skin-index-list">
              <div class="skin-list-name">{{ item.target_name }}</div>
              <skin-circle :datas="item"></skin-circle>
            </div>
          </div>
        </template>
        <div class="skin-all-btn" @click.stop="gotoUrl('AllResult', { id: $route.params.id }, {})">
          查看完整质检报告
        </div>
      </div>

      <div class="skin-strategy main-bg" v-if="!fun.isTextEmpty(resultData.article)">
        <div class="skin-title">护肤攻略</div>
        <div class="skin-strategy-list" v-for="item in resultData.article" :key="item.id">
          <div class="skin-strategy-list-top">
            <div class="skin-strategy-list-title">{{ item.title }}</div>
            <div class="skin-strategy-list-btn" @click.stop="gotoUrl('articleContent', { id: item.id }, {})">
              查看更多
            </div>
          </div>
          <div class="skin-strategy-content">{{ item.desc }}</div>
        </div>
      </div>

      <div class="main-bg skin-counselor" v-if="!fun.isTextEmpty(resultData.adviser)">
        <div class="skin-title">护肤顾问</div>
        <div class="counselor-list" v-for="item in resultData.adviser" :key="item.uid" @click.stop="gotoUrl('BusinessCard', {}, { mark: 'card', mark_id: item.business_card.id })">
          <img :src="item.avatar_image" alt="" />
          <div class="counselor-list-main">
            <div class="counselor-nickname">
              <div class="counselor-nickname-text">昵称：{{ item.nickname }}</div>
              <i class="iconfont icon-fontclass-mingpian" v-if="resultData.business_card && item.business_card && item.business_card.id"></i>
            </div>
            <div class="counselor-name" v-show="!fun.isTextEmpty(item.realname)">姓名：{{ item.realname }}</div>
          </div>
          <div class="counselor-contact">
            <a :href="'tel:' + item.mobile" style="color: #000;" @click.stop><i class="iconfont icon-zx_map_tel" v-show="!fun.isTextEmpty(item.mobile)"></i></a>

            <div class="line" v-show="!fun.isTextEmpty(item.yz_member.wechat)"></div>
            <i class="iconfont icon-all_wechat" v-show="!fun.isTextEmpty(item.yz_member.wechat)" @click.stop="handleToggle(item)"></i>
          </div>
        </div>
      </div>

      <div class="skin-goods main-bg">
        <div class="skin-title">推荐商品</div>
        <template v-if="!fun.isTextEmpty(label)">
          <van-tabs v-model="activeLabel" @change="changeLabel">
            <van-tab v-for="item in label" :title="item.label_name" :key="item.id"><em style="color: #fff;">.</em></van-tab>
          </van-tabs>
        </template>
        <div class="goods-list" v-for="item in resultData.goods" :key="item.id" @click.stop="gotoUrl('goods', { id: item.id }, {})">
          <img :src="item.thumb" alt="" />
          <div class="goods-info">
            <div class="good-title">{{ item.title }}</div>
            <div class="good-effect">
              <div class="good-effect-child" v-for="(child, index) in item.label" :key="index"><template v-if="index != 0">|</template>{{ child.label_name }}</div>
            </div>
            <div class="goods-price">
              <div class="market_price">
                <template v-if="item.market_price * 100 != 0 && item.market_price != item.price">{{ fun.getMarketPrice() }}：{{ $i18n.t("money") }}{{ item.market_price }}</template>
              </div>
              <div class="prices">
                现价：
                <div class="prices-color">{{ $i18n.t("money") }}{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
        <p v-show="fun.isTextEmpty(resultData.goods) && !$store.state.isloadding" class="blank">暂无推荐</p>
        <p v-show="fun.isTextEmpty(resultData.goods) && $store.state.isloadding" class="blank">正在加载中.....</p>
      </div>
      <van-image-preview v-model="show" :images="images"> </van-image-preview>
      <!--海报部分-->
      <div id="ewm" ref="hook" @click="openQrCode('none')" @touchmove.stop v-show="isShowPoster">
        <div class="pic" :style="{ left: loadingImg ? '50%' : '-100%' }">
          <div class="diy_poster" id="code_box">
            <img :src="posterData.background" alt="" class="ewm_bgImg" />
            <div
              class="diy_poster_child"
              v-for="(item, index) in posterData.style_data"
              :key="index"
              :style="{
                width: `${item.width / 16}rem`,
                height: `${item.height / 16}rem`,
                left: `${item.left / 16}rem`,
                top: `${item.top / 16}rem`
              }"
            >
              <p v-if="item.type == 'nickname'" :style="{ color: `${item.color}`, fontSize: `${item.size / 16}rem` }">
                {{ item.src }}
              </p>
              <div class="m-result-left" v-else-if="item.type == 'score'" style="width: 100%; height: 100%; margin: 0;">
                <canvas id="circlecanvas" :class="item.src.toString()" :width="item.width * 2" :height="item.width * 2" :style="{ color: item.color }">
                  <p>you browser not support canvas!</p>
                </canvas>
              </div>
              <div class="m-result-right" v-else-if="item.type == 'result'">
                <div class="m-r-r-chilid" v-for="child in item.src" :key="child.id" :style="{ color: item.font_color, fontSize: `${item.size / 16}rem`, backgroundColor: item.color }">
                  {{ child.target.target_name }}
                  <div :style="{ color: item.font_color, fontSize: `${item.size / 16}rem` }" class="r-chilid-text">
                    {{ child.value_desc ? child.value_desc : child.value }}
                  </div>
                </div>
              </div>
              <img :src="item.src" alt="" :style="{ width: `${item.width / 16}rem`, height: `${item.height / 16}rem` }" v-else />
            </div>
          </div>
          <div class="diy_poster-show" v-show="!loadingImg" style="background-color: transparent;">
            <img style="width: 100%; height: 100%;" id="thecanvas" />
          </div>
        </div>
      </div>
      <van-overlay :show="isShowPoster" @click="isShowPoster = false" />
    </div>
    <!-- 复制微信号弹窗组件 -->
    <modal v-if="showModal" :title="mdTitle" :tips="mdTips" :value="mdValue" @onClose="handleToggle"></modal>

    <!--海报部分end-->
  </div>
</template>

<script>
import cTitle from "components/title";
import Modal from "components/modal";
import skinCircle from "./skin_circle";
import { Toast } from "vant";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      dataURL: null,
      activeLabel: 0,
      label: [],
      show: false,
      images: [],
      currentRate: 0,
      resultData: {
        report: {
          member: {},
          reportDetailTop: {},
          reportDetail: {}
        }
      },
      posterData: {},
      //微信弹窗
      showModal: false, // 控制弹窗显示
      mdTitle: "", // 弹窗标题
      mdTips: " ", // 弹窗底部提示
      mdValue: "", // 弹窗内容，电话或者微信号
      mdType: "Wechat", // 目前只有微信, 可暂时不传

      loadingImg: true,
      isShowPoster: false
    };
  },

  mounted() {
    this.getData();
  },
  deactivated() {
    window.scrollTo(0, 0);
  },
  components: {
    cTitle,
    skinCircle,
    Modal
  },

  computed: {},

  methods: {
    circleM() {
      var canvas = document.getElementById("circlecanvas"), //获取canvas元素
        context = canvas.getContext("2d"), //获取画图环境，指明为2d
        centerX = canvas.width / 2, //Canvas中心点x轴坐标
        centerY = canvas.height / 2, //Canvas中心点y轴坐标
        rad = (Math.PI * 2) / 100, //将360度分成100份，那么每一份就是rad度
        n = Number(canvas.className),
        // speed = 0.1, //加载的快慢就靠它了 （没用到）
        color = canvas.style.color;
      context.clearRect(0, 0, canvas.width, canvas.height);
      //绘制白色外圈start
      context.save();
      context.beginPath();
      context.strokeStyle = "#f8f8f8";
      context.lineWidth = 18;
      context.arc(centerX, centerY, 100, 0, Math.PI * 2, false);
      context.stroke();
      context.closePath();
      context.restore();
      //绘制白色外圈  end
      //百分比文字绘制
      context.save();
      context.fillStyle = color;
      context.font = "70px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(`${n}`, centerX, centerY);
      context.restore();
      //百分比文字绘制
      context.save();
      context.fillStyle = color;
      context.font = "24px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText("分", centerX + 68, centerY - 20);
      context.restore();
      //绘制蓝色外圈  start
      console.log(canvas.width, canvas.height);
      context.save();
      context.beginPath();
      context.strokeStyle = color;
      context.lineWidth = 18;
      context.arc(centerX, centerY, 100, -Math.PI / 2, -Math.PI / 2 + n * rad, false);
      context.stroke();
      context.restore();
      //绘制蓝色外圈  end
    },
    changeLabel() {
      //切换商品标签
      this.resultData.goods = [];
      $http.get("plugin.skin-check.api.skin-check.label-goods", { label_id: this.label[this.activeLabel].id }, "...").then(
        response => {
          if (response.result === 1) {
            return (this.resultData.goods = response.data);
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    getposter() {
      if (!this.fun.isTextEmpty(this.dataURL)) {
        this.isShowPoster = true;
        return;
      }
      // 问题：截图不全；原因：滚轮滑动造成的，主要是html2canvas是根据body进行截图，若内容高度高于body时，就会出现这样的问题(大概意思就是有滚动条时造成的)
      // 解决方案：(在生成截图前，先把滚动条置顶)
      window.pageYOffset = 0;
      window.pageXOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      Toast.loading({
        message: "正在生成海报",
        forbidClick: true
      });
      this.loadingImg = true;
      $http.get("plugin.skin-check.api.skin-check.poster", { report_id: this.$route.params.id }, "...").then(
        response => {
          if (response.result === 1) {
            this.posterData = response.data;
            this.isShowPoster = true;
            setTimeout(() => {
              this.circleM();
              this.saveImg();
            }, 1000);
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    saveImg() {
      //转化成图片
      var content = document.getElementById("code_box");
      const that = this;
      html2canvas(content, {
        useCORS: true,
        tainttest: true, //检测每张图片都已经加载完成
        height: content.offsetHeight, //注意 下面解决当页面滚动之后生成图片出现白边问题
        width: content.offsetWidth,
        scrolly: 0,
        scrollx: 0,
        backgroundColor: null // 解决生成的图片有白边
      })
        .then(canvas => {
          Toast.clear();
          that.dataURL = canvas.toDataURL("image/png"); //创建base64图片
          document.getElementById("thecanvas").setAttribute("src", that.dataURL);
          that.loadingImg = false;
        })
        .catch(error => {
          Toast.clear();
          console.log(error);
        });
    },
    getData() {
      $http.get("plugin.skin-check.api.skin-check.check-report", { report_id: this.$route.params.id }, "...").then(
        response => {
          if (response.result === 1) {
            this.resultData = response.data;
            this.label = response.data.label || [];
            this.images.push(response.data.report.check_img_src);
            this.fun.wxShare(
              "",
              {},
              {
                link: `${this.fun.getSiteRoot()}/addons/yun_shop/?menu#/skin/Share/${this.$route.params.id}?i=${this.fun.getKeyByI()}`
              }
            );
          } else {
            Toast(response.msg);
          }
        },
        response => {}
      );
    },
    gotoUrl(name, params, query) {
      if (name == "BusinessCard") {
        if (this.resultData.business_card == 1) {
          this.$router.push(this.fun.getUrl(name, params, query));
        }
        return;
      } else {
        this.$router.push(this.fun.getUrl(name, params, query));
      }
    },
    // 控制弹窗显示的方法
    handleToggle: function(item) {
      this.showModal = !this.showModal;
      if (item) {
        this.mdTitle = item.nickname + "的微信号";
        this.mdTips = "点击复制客户微信,通过微信添加朋友可加客户好友!";
        this.mdValue = item.yz_member.wechat.toString();
      }
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
#skin_result {
  padding: 0 0.875rem 70px;
  background: -moz-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #ffbec8), color-stop(25%, #fff));
  background: -webkit-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -o-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: -ms-linear-gradient(top, #ffbec8 0%, #fff 25%);
  background: linear-gradient(to bottom, #ffbec8 0%, #fff 25%);

  .m-afresh {
    height: 3rem;
    line-height: 3rem;
    display: flex;
    flex-direction: row-reverse;

    .m-afresh-btn {
      color: #333;
      font-weight: bold;
      font-size: 1rem;
    }
  }

  .main-bg {
    margin-bottom: 1rem;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 #ffbec8;
    border-radius: 0.625rem;
    padding: 0 0.875rem;
  }

  .skin-title {
    height: 3rem;
    line-height: 3rem;
    color: #333;
    font-size: 1rem;
    text-align: left;
    font-weight: bold;
  }

  .m-result {
    width: 100%;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;

    .m-result-top,
    .m-result-center,
    .m-result-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .m-r-t-left {
        flex: 1;
        display: flex;
        line-height: 2.5rem;
        overflow: hidden;

        img {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 100%;
          overflow: hidden;
          margin: 0;
        }

        .name {
          flex: 1;
          text-align: left;
          margin-left: 0.5rem;
          font-size: 1rem;
          font-weight: bold;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }

      .m-r-t-right {
        width: 5.875rem;
        height: 2rem;
        line-height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #fe5a73;
        color: #fe5a73;
        font-size: 0.875rem;
        border-radius: 3rem;

        i {
          font-size: 1.5rem;
        }
      }

      .m-r-b-r {
        width: 6.25rem;
        height: 1.875rem;
        line-height: 1.875rem;
        color: #fff;
        background-color: #fe5a73;
        font-size: 0.75rem;
        border-radius: 1rem;
      }
    }

    .m-result-center {
      margin: 1.5rem 0;

      .m-result-l-title {
        color: #666;
        font-size: 0.75rem;
      }
    }

    .m-result-rank {
      text-align: right;
      color: #666;
      font-size: 0.75rem;
      margin-top: 1.125rem;
    }
  }

  .m-result-left {
    margin: 0 1rem;
    width: 6.25rem;
    height: 6.25rem;

    /deep/.van-circle {
      width: 100% !important;
      height: 100% !important;
    }

    /deep/.van-circle__text {
      font-size: 28px;
      color: #fe5a73;
      font-weight: bold;
      position: relative;
    }

    /deep/.van-circle__text::before {
      position: absolute;
      content: "分";
      display: block;
      right: 12px;
      top: -5px;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .score-box {
    font-size: 30px;
    color: #fe5a73;
    font-weight: 700;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    padding: 0 4px;
    top: 50%;
    left: 50%;
    position: absolute;
    letter-spacing: -1px;

    &::before {
      position: absolute;
      content: "分";
      display: block;
      right: -8px;
      top: 0;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .m-result-right {
    display: flex;
    flex-direction: column;

    .m-r-r-chilid {
      // width: 8.75rem;
      width: 100%;
      height: 2.25rem;
      line-height: 2.25rem;
      background-color: #fff1f3;
      border-radius: 2rem;
      overflow: hidden;
      display: flex;
      margin-bottom: 0.375rem;
      padding: 0 1rem;
      font-size: 0.75rem;
      flex-shrink: 0;

      .r-chilid-text {
        text-align: left;
        font-size: 1rem;
        color: #333;
        font-weight: bold;
        margin-left: 0.5rem;
        overflow: hidden; /* 超出部分隐藏 */
        text-overflow: ellipsis; /* 超出部分显示省略号 */
        white-space: nowrap; /* 规定段落中的文本不进行换行 */
        flex: 1;
      }
    }
  }

  .warn-text {
    font-size: 0.75rem;
    color: #666;
    text-align: left;
    margin: 0.625rem 0 0.875rem;
  }

  .skin-question {
    padding: 0 0.875rem 0.875rem;

    .skin-question-chlid {
      display: flex;
      flex-wrap: wrap;

      .small-btn {
        padding: 0 0.875rem;
        height: 1.5rem;
        line-height: 1.5rem;
        background-color: #fff1e6;
        border-radius: 1rem;
        border: solid 1px #fe9d56;
        color: #fe9d56;
        font-size: 0.75rem;
        margin: 0 0.625rem 0.625rem 0;
      }
    }

    .skin-index {
      .skin-index-list {
        display: flex;
        align-items: center;

        .skin-list-name {
          width: 5rem;
          text-align: left;
          margin-right: 0.5rem;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }
      }
    }

    .skin-all-btn {
      margin: 1.875rem auto 0;
      height: 1.875rem;
      background-color: #fe5a73;
      border-radius: 1rem;
      line-height: 1.875rem;
      width: 10rem;
      color: #fff;
      display: block;
    }
  }

  .skin-strategy {
    padding: 0 0.875rem;
    text-align: left;

    .skin-strategy-list {
      padding-bottom: 0.875rem;
      border-bottom: 1px solid #f2f2f2;

      .skin-strategy-list-top {
        display: flex;
        justify-content: space-between;
        height: 2rem;
        line-height: 2rem;

        .skin-strategy-list-title {
          flex: 1;
          font-weight: bold;
          color: #333;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        .skin-strategy-list-btn {
          font-size: 0.75rem;
          color: #fe5a73;
        }
      }

      .skin-strategy-content {
        color: #666;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }

    .skin-strategy-list:last-child {
      border: 0;
    }
  }

  .skin-counselor {
    .counselor-list {
      display: flex;
      align-items: center;
      padding-bottom: 0.875rem;

      img {
        width: 3.125rem;
        height: 3.125rem;
        border-radius: 50%;
        flex-shrink: 0;
        margin-right: 0.875rem;
      }

      .counselor-list-main {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        color: #333;
        font-size: 1rem;
        text-align: left;
        justify-content: space-between;

        .counselor-nickname {
          font-weight: bold;
          display: flex;
          align-items: center;

          .counselor-nickname-text {
            max-width: 65%;
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 超出部分显示省略号 */
            white-space: nowrap; /* 规定段落中的文本不进行换行 */
          }

          i {
            font-size: 1.5rem;
            color: #4380ac;
          }
        }
      }

      .counselor-contact {
        display: flex;

        i {
          font-size: 1.5rem;
        }

        .icon-zx_map_tel {
          color: #fe5a73;
        }

        .icon-all_wechat {
          color: #0fce1c;
        }

        .line {
          width: 1px;
          background: #dfdfdf;
          margin: 0 0.875rem;
        }
      }
    }
  }

  .skin-goods {
    display: flex;
    flex-direction: column;
    padding-bottom: 0.5rem;

    .goods-list {
      display: flex;
      text-align: left;
      margin-bottom: 0.5rem;

      img {
        width: 5.125rem;
        height: 5.125rem;
        flex-shrink: 0;
        border-radius: 0.375rem;
        margin: 0 0.5rem 0 0;
      }

      .goods-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .good-title {
          font-weight: bold;
          font-size: 0.875rem;
          line-height: 1.125rem;
          color: #333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .good-effect {
          display: flex;
          color: #fe9d56;
          font-size: 0.75rem;
        }

        .goods-price {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;

          .market_price {
            text-decoration: line-through;
            color: #666;
          }

          .prices {
            display: flex;
            align-items: center;
            font-weight: bold;
            color: #333;

            .prices-color {
              color: #fe5a73;
            }
          }
        }
      }
    }
  }

  .blank {
    padding: 2rem 0;
    text-align: center;
    color: #999;
  }

  #ewm {
    width: 100%;
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    background: rgba(140, 140, 140, 0.72);
    z-index: 100;

    .pic_warn {
      background: #fff;
      color: #000;
      border-radius: 0.625rem;
      width: 14rem;
      height: 2.5rem;
      line-height: 2.5rem;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
    }

    .pic {
      width: 19.875rem;
      height: 31.375rem;
      // background: #fff;
      border-radius: 0.625rem;
      overflow: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      // transform: translate(-50%, -50%);
      margin: -15.6875rem 0 0 -9.9375rem;

      .ewm_bgImg {
        position: absolute;
        width: 100%;
        // height: 100%;
        height: auto;
        top: 0;
        left: 0;
      }

      .title {
        padding: 0.625rem;
        border-bottom: 0.0625rem solid #ebebeb;

        img {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 50%;
          display: inline-block;
          vertical-align: middle;

          .set a {
            color: #fff;
            font-size: 24px;
          }

          #ewm {
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            background: rgba(140, 140, 140, 0.72);
            z-index: 100;
            display: none;
            padding-top: 14%;

            .pic {
              width: 70%;
              margin: auto;
              background: #fff;
              border-radius: 0.625rem;
              overflow: hidden;

              .title {
                padding: 0.625rem;
                border-bottom: 0.0625rem solid #ebebeb;

                img {
                  height: 2.5rem;
                  width: 2.5rem;
                  border-radius: 50%;
                  display: inline-block;
                  vertical-align: middle;
                }

                span {
                  margin-left: 0.875rem;
                  vertical-align: middle;
                  font-size: 16px;
                }
              }

              .ewm {
                z-index: 140;

                img {
                  width: 50%;
                  display: block;
                  float: right;
                }
              }
            }

            img {
              width: 100%;
              display: block;
            }
          }
        }
      }
    }

    .diy_poster {
      position: relative;
      // background: #fff;
      background-size: 100% 100%;
      width: 19.875rem;
      height: 31.375rem;

      .diy_poster_child {
        position: absolute;

        p {
          width: 100%;
          text-align: left;
          overflow: hidden; /* 超出部分隐藏 */
          text-overflow: ellipsis; /* 超出部分显示省略号 */
          white-space: nowrap; /* 规定段落中的文本不进行换行 */
        }

        canvas {
          width: 100% !important;
          height: 100% !important;
        }
      }
    }

    .diy_poster-show {
      position: fixed;
      background-size: 100% 100%;
      width: 15.625rem;
      height: 24.625rem;
      top: 50%;
      left: 50%;
      margin-left: -7.8125rem;
      margin-top: -12.3125rem;
    }

    img {
      width: 100%;
      display: block;
      height: 100%;
    }
  }
}
</style>
