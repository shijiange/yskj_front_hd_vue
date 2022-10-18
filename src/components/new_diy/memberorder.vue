<template>
  <div :class="className">
    <!-- style -->
    <div v-html="css"></div>
    <div class="html-box">
      <div v-if="datas.list <= 0" style="font-weight: bold; font-size: 18px; line-height: 50px; text-align: center;">
        请添加订单列表
      </div>

      <div id="new_orderlist">
        <!--只有一个订单的样式 -->
        <template v-if="datas.list.length == 1 && datas.show_tab">
          <router-link v-if="datas.list[0].uikey === 'U_memberorder'" :to="fun.getUrl('orderlist', { status: '0' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberorderhotel'" :to="fun.getUrl('hotelOrderlist', { status: '0', orderType: 'hotel' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberorderrelease'" :to="fun.getUrl('lease_toyOrderlist', { status: '0', orderType: 'lease_toy' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberordergroup'" :to="fun.getUrl('GroupOrderlist', { status: '0', orderType: 'groups' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberordergrab'" :to="fun.getUrl('orderlist', { status: '0', orderType: 'grabGroup' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberorderlive_install'" :to="fun.getUrl('installationSeverMemberHome', {}, { status: 0 })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberorderlive_install_worker'" :to="fun.getUrl('installationSeverHome', {}, { status: 1 })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberordercps'" :to="fun.getUrl('cpsCouponList', {}, { status: 0 })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberordernew_group'" :to="fun.getUrl('orderlist', { status: 0, orderType: 'groupWork' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
          <router-link v-if="datas.list[0].uikey === 'U_memberorder_ys'" :to="fun.getUrl('orderlist', { status: 0, orderType: 'ysSystem' })">
            <div class="ordertltie">
              <div class="spare"></div>
              <div class="ordername">{{ datas.list[0].name || datas.list[0].component }}</div>
              <div class="">
                <i class="iconfont icon-member_right"></i>
              </div>
            </div>
          </router-link>
        </template>

        <ul class="tab_list" v-if="datas.list.length > 1 && datas.show_tab">
          <!--多个订单的样式切换-->
          <van-tabs
            :before-change="clickOrderTab"
            v-model="active"
            swipeable
            :ellipsis="false"
            :background="datas.tab_bg_color"
            :title-active-color="datas.tab_active_color"
            :color="datas.tab_active_color"
            :title-inactive-color="datas.tab_color"
            id="tab"
          >
            <van-tab :title="item.name || item.component" v-for="(item, i) in datas.list" :name="i" :key="i" class="tabChild"></van-tab>
          </van-tabs>
        </ul>

        <template v-for="(order, index) in datas.list">
          <div class="order_all" v-if="order.uikey === 'U_memberorder' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="item.id == 4 ? fun.getUrl('aftersaleslist') : fun.getUrl('orderlist', { status: item.id.toString() })" @click.native="trackOrder(item)">
                <div class="badge" v-if="U_memberorder[item.id - 1] && U_memberorder[item.id - 1].value != 0">{{ U_memberorder[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberorderhotel' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="fun.getUrl('hotelOrderlist', { status: item.id.toString(), orderType: 'hotel' })">
                <div class="badge" v-if="U_memberorderhotel[item.id - 1] && U_memberorderhotel[item.id - 1].value != 0">{{ U_memberorderhotel[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberorderrelease' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="fun.getUrl('lease_toyOrderlist', { status: item.id.toString(), orderType: 'lease_toy' })">
                <div class="badge" v-if="U_memberorderrelease[item.id - 1] && U_memberorderrelease[item.id - 1].value != 0">{{ U_memberorderrelease[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberordergroup' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="item.id == 5 ? fun.getUrl('aftersaleslist', {}, { goodtype: 'groups' }) : fun.getUrl('GroupOrderlist', { status: item.id.toString(), orderType: 'groups' })">
                <div class="badge" v-if="U_memberordergroup[item.id - 1] && U_memberordergroup[item.id - 1].value != 0">{{ U_memberordergroup[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberordergrab' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="item.id == 4 ? fun.getUrl('aftersaleslist', {}, { goodtype: 'grab' }) : fun.getUrl('orderlist', { status: item.id.toString(), orderType: 'grabGroup' })">
                <div class="badge" v-if="U_memberordergrab[item.id - 1] && U_memberordergrab[item.id - 1].value != 0">{{ U_memberordergrab[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberorderlive_install' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="fun.getUrl('installationSeverMemberHome', {}, { status: item.id })">
                <div class="badge" v-if="U_memberorderlive_install[item.id - 1] && U_memberorderlive_install[item.id - 1].value != 0">{{ U_memberorderlive_install[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberorderlive_install_worker' && active == index" :key="index">
            <div class="order_pub" v-foor="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="item.id == -1 ? fun.getUrl('installationSeverHome', {}, { status: 1 }) : fun.getUrl('installationSeverHome', {}, { status: item.id + 2 })">
                <div class="badge" v-if="U_memberorderlive_install_worker[item.id] && U_memberorderlive_install_worker[item.id].value != 0">{{ U_memberorderlive_install_worker[item.id].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberordercps' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="item.id == 3 ? fun.getUrl('cpsCouponList') : fun.getUrl('cpsOrderList', {}, { status: item.id })">
                <div class="badge" v-if="U_memberordercps[item.id + 1] && U_memberordercps[item.id + 1].value != 0">{{ U_memberordercps[item.id + 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
          <div class="order_all" v-if="order.uikey === 'U_memberordernew_group' && active == index" :key="index">
            <div class="order_pub" v-for="(item, i) in order.datas.list.value" :key="i">
              <router-link :to="item.id == 4 ? fun.getUrl('aftersaleslist') : fun.getUrl('orderlist', { status: item.id.toString(), orderType: 'groupWork' })">
                <div class="badge" v-if="U_memberordernew_group[item.id - 1] && U_memberordernew_group[item.id - 1].value != 0">{{ U_memberordernew_group[item.id - 1].value }}</div>
                <img class="order_img" :src="item.image || emptyImage" alt="" />
                <span>{{ item.text }}</span>
              </router-link>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import emptyImage from "@/assets/images/new_diy/image.png";
// 自定义样式
const css = function() {
  if (this.datas.preview_color) {
    const { preview_color, text_color, tab_bg_color, tab_color, tab_active_color } = this.datas;

    return `
      .component-${this.id} .html-box {
          background-color: ${preview_color.color};
          background-image: url(${preview_color.isColor == 2 ? preview_color.image : ""});
          background-size: 100% 100%;
          background-position: center;
          background-repeat: no-repeat;
      }

      .component-${this.id} .order_all .order_pub{
          color: ${text_color};
      }

      .component-${this.id} .ordertltie {
          background-color: ${tab_bg_color};
      }

      .component-${this.id} .spare {
          background-color: ${tab_active_color};
      }

      .component-${this.id} .ordername {
          color: ${tab_color};
      }

      .component-${this.id}  .nav-bgimage{
          background-color: ${tab_bg_color};
          color: ${tab_color};
      }

      .component-${this.id}  .nav-bgimage .nav-selected{
          color: ${tab_active_color};
          border-bottom: 2px solid ${tab_active_color};
      }
  `;
  }
};

export default {
  props: ["id", "datas", "member_order", "Order"],
  data() {
    return {
      emptyImage,
      active: "",
      U_memberorder: [
        { label: "waitPay", value: 0 },
        { label: "waitSend", value: 0 },
        { label: "waitReceive", value: 0 },
        { label: "waitrRefund", value: 0 }
      ],
      U_memberorderhotel: [
        { label: "waitPay", value: 0 },
        { label: "waitSure", value: 0 },
        { label: "waitEnter", value: 0 },
        { label: "waitCheckOut", value: 0 }
      ],
      U_memberorderrelease: [
        { label: "waitPay", value: 0 },
        { label: "waitSend", value: 0 },
        { label: "waitReceive", value: 0 },
        { label: "waitrRefund", value: 0 }
      ],
      U_memberordergroup: [
        { label: "", value: 0 },
        { label: "waitPay", value: 0 },
        { label: "waitSend", value: 0 },
        { label: "waitReceive", value: 0 },
        { label: "waitrRefund", value: 0 }
      ],
      U_memberordergrab: [
        { label: "waitPay", value: 0 },
        { label: "waitSend", value: 0 },
        { label: "waitReceive", value: 0 },
        { label: "waitrRefund", value: 0 }
      ],
      U_memberorderlive_install: [
        { status: 0, value: 0 },
        { status: 1, value: 0 },
        { status: 2, value: 0 },
        { status: 3, value: 0 },
        { status: 5, value: 0 }
      ],
      U_memberorderlive_install_worker: [
        { status: 0, value: 0 },
        { status: 1, value: 0 },
        { status: 2, value: 0 },
        { status: 3, value: 0 },
        { status: 5, value: 0 }
      ],
      U_memberordercps: [
        { status: -1, value: 0 },
        { status: 0, value: 0 },
        { status: 1, value: 0 },
        { status: 2, value: 0 }
      ],
      U_memberordernew_group: [
        { label: "waitPay", value: 0 },
        { label: "waitSend", value: 0 },
        { label: "waitReceive", value: 0 },
        { label: "waitrRefund", value: 0 }
      ]
    };
  },
  computed: {
    css() {
      return "<style>" + css.call(this) + "</style>";
    },
    className() {
      const name = ["component-wrapper", `component-${this.id}`];
      return name;
    }
  },
  mounted() {
    //console.log('datas.list.length:'+this.datas.list.length);
    if (this.member_order.order) {
      // 0 待付款 1待发货 2待收货 3完成
      this.member_order.order.map(item => {
        if (item.status == 0) {
          this.U_memberorder[0].value = item.total;
        } else if (item.status == 1) {
          this.U_memberorder[1].value = item.total;
        } else if (item.status == 2) {
          this.U_memberorder[2].value = item.total;
        } else if (item.status == 11) {
          this.U_memberorder[3].value = item.total;
        }
      });
    }

    if (this.member_order.hotel_order) {
      //酒店
      this.member_order.hotel_order.forEach(item => {
        if (item.status == 0) {
          this.U_memberorderhotel[0].value = item.total;
        } else if (item.status == 1) {
          this.U_memberorderhotel[1].value = item.total;
        } else if (item.status == 2) {
          this.U_memberorderhotel[2].value = item.total;
        } else if (item.status == 11) {
          this.U_memberorderhotel[3].value = item.total;
        }
      });
    }

    if (this.member_order.lease_order) {
      //租赁
      this.member_order.lease_order.map(item => {
        if (item.status == "0") {
          this.U_memberorderrelease[0].value = item.total;
        } else if (item.status == "1") {
          this.U_memberorderrelease[1].value = item.total;
        } else if (item.status == "2") {
          this.U_memberorderrelease[2].value = item.total;
        } else if (item.status == "3") {
          this.U_memberorderrelease[3].value = item.total;
        }
      });
    }

    if (this.member_order.fight_groups_order) {
      // 拼团 0未付款 1已支付待发货，2已发货待收货，3已完成，11 售后列表
      this.member_order.fight_groups_order.forEach(item => {
        if (item.status == 0) {
          this.U_memberordergroup[1].value = item.total;
        } else if (item.status == 1) {
          this.U_memberordergroup[2].value = item.total;
        } else if (item.status == 2) {
          this.U_memberordergroup[3].value = item.total;
        } else if (item.status == 11) {
          this.U_memberordergroup[4].value = item.total;
        }
      });
    }

    if (this.member_order.snatch_regiment_order) {
      // 抢团
      this.member_order.snatch_regiment_order.forEach(item => {
        if (item.status == 0) {
          this.U_memberordergrab[0].value = item.total;
        } else if (item.status == 1) {
          this.U_memberordergrab[1].value = item.total;
        } else if (item.status == 2) {
          this.U_memberordergrab[2].value = item.total;
        } else if (item.status == 11) {
          this.U_memberordergrab[3].value = item.total;
        }
      });
    }

    if (this.member_order.live_install_order) {
      // 上门安装订单
      this.member_order.live_install_order.forEach(item => {
        if (item.status == 0) {
          this.U_memberorderlive_install[0].value = item.total;
        } else if (item.status == 1) {
          this.U_memberorderlive_install[1].value = item.total;
        } else if (item.status == 2) {
          this.U_memberorderlive_install[2].value = item.total;
        } else if (item.status == 3) {
          this.U_memberorderlive_install[4].value = item.total;
        }
      });
    }

    if (this.member_order.live_install_work_order) {
      // 上门安装师傅订单
      this.member_order.live_install_work_order.forEach(item => {
        if (item.status == 2) {
          this.U_memberorderlive_install_worker[0].value = item.total;
        } else if (item.status == 3) {
          this.U_memberorderlive_install_worker[1].value = item.total;
        } else if (item.status == 4) {
          this.U_memberorderlive_install_worker[2].value = item.total;
        } else if (item.status == 6) {
          this.U_memberorderlive_install_worker[4].value = item.total;
        }
      });
    } else {
      if (this.datas.list && Array.isArray(this.datas.list)) {
        this.datas.list = this.datas.list.filter(item => {
          return item.uikey != "U_memberorderlive_install_worker";
        });
      }
    }

    if (this.member_order.aggregation_cps_order) {
      // CPS订单
      this.member_order.aggregation_cps_order.forEach(item => {
        if (item.status == 1) {
          this.U_memberordercps[2].value = item.total;
        } else if (item.status == 2) {
          this.U_memberordercps[3].value = item.total;
        } else if (item.status == -1) {
          this.U_memberordercps[0].value = item.total;
        }
      });
    }

    if (this.member_order.group_work_order) {
      // 0 待付款 1待发货 2待收货 3完成
      this.member_order.group_work_order.map(item => {
        if (item.status == 0) {
          this.U_memberordernew_group[0].value = item.total;
        } else if (item.status == 1) {
          this.U_memberordernew_group[1].value = item.total;
        } else if (item.status == 2) {
          this.U_memberordernew_group[2].value = item.total;
        } else if (item.status == 11) {
          this.U_memberordernew_group[3].value = item.total;
        }
      });
    }
  },
  watch: {
    member_order: {
      handler(newValue, oldValue) {
        if (this.member_order.order) {
          this.member_order.order.map(item => {
            if (item.status == 0) {
              this.U_memberorder[0].value = item.total;
            } else if (item.status == 1) {
              this.U_memberorder[1].value = item.total;
            } else if (item.status == 2) {
              this.U_memberorder[2].value = item.total;
            } else if (item.status == 11) {
              this.U_memberorder[3].value = item.total;
            }
          });
        }

        if (this.member_order.hotel_order) {
          this.member_order.hotel_order.forEach(item => {
            if (item.status == 0) {
              this.U_memberorderhotel[0].value = item.total;
            } else if (item.status == 1) {
              this.U_memberorderhotel[1].value = item.total;
            } else if (item.status == 2) {
              this.U_memberorderhotel[2].value = item.total;
            } else if (item.status == 11) {
              this.U_memberorderhotel[3].value = item.total;
            }
          });
        }

        if (this.member_order.lease_order) {
          this.member_order.lease_order.map(item => {
            if (item.status == "0") {
              this.U_memberorderrelease[0].value = item.total;
            } else if (item.status == "1") {
              this.U_memberorderrelease[1].value = item.total;
            } else if (item.status == "2") {
              this.U_memberorderrelease[2].value = item.total;
            } else if (item.status == "3") {
              this.U_memberorderrelease[3].value = item.total;
            }
          });
        }

        if (this.member_order.fight_groups_order) {
          this.member_order.fight_groups_order.forEach(item => {
            if (item.status == 0) {
              this.U_memberordergroup[1].value = item.total;
            } else if (item.status == 1) {
              this.U_memberordergroup[2].value = item.total;
            } else if (item.status == 2) {
              this.U_memberordergroup[3].value = item.total;
            } else if (item.status == 11) {
              this.U_memberordergroup[4].value = item.total;
            }
          });
        }

        if (this.member_order.snatch_regiment_order) {
          this.member_order.snatch_regiment_order.forEach(item => {
            if (item.status == 0) {
              this.U_memberordergrab[0].value = item.total;
            } else if (item.status == 1) {
              this.U_memberordergrab[1].value = item.total;
            } else if (item.status == 2) {
              this.U_memberordergrab[2].value = item.total;
            } else if (item.status == 11) {
              this.U_memberordergrab[3].value = item.total;
            }
          });
        }

        if (this.member_order.live_install_order) {
          // 上门安装订单
          this.member_order.live_install_order.forEach(item => {
            if (item.status == 0) {
              this.U_memberorderlive_install[0].value = item.total;
            } else if (item.status == 1) {
              this.U_memberorderlive_install[1].value = item.total;
            } else if (item.status == 2) {
              this.U_memberorderlive_install[2].value = item.total;
            } else if (item.status == 3) {
              this.U_memberorderlive_install[4].value = item.total;
            }
          });
        }

        if (this.member_order.live_install_work_order) {
          // 上门安装师傅订单
          this.member_order.live_install_work_order.forEach(item => {
            if (item.status == 2) {
              this.U_memberorderlive_install_worker[0].value = item.total;
            } else if (item.status == 3) {
              this.U_memberorderlive_install_worker[1].value = item.total;
            } else if (item.status == 4) {
              this.U_memberorderlive_install_worker[2].value = item.total;
            } else if (item.status == 6) {
              this.U_memberorderlive_install_worker[4].value = item.total;
            }
          });
        }

        if (this.member_order.aggregation_cps_order) {
          // CPS订单
          this.member_order.aggregation_cps_order.forEach(item => {
            if (item.status == 1) {
              this.U_memberordercps[2].value = item.total;
            } else if (item.status == 2) {
              this.U_memberordercps[3].value = item.total;
            } else if (item.status == -1) {
              this.U_memberordercps[0].value = item.total;
            }
          });
        }

        if (this.member_order.group_work_order) {
          this.member_order.group_work_order.map(item => {
            if (item.status == 0) {
              this.U_memberordernew_group[0].value = item.total;
            } else if (item.status == 1) {
              this.U_memberordernew_group[1].value = item.total;
            } else if (item.status == 2) {
              this.U_memberordernew_group[2].value = item.total;
            } else if (item.status == 11) {
              this.U_memberordernew_group[3].value = item.total;
            }
          });
        }
      },
      deep: true
    }
  },
  methods: {
    trackOrder(item){
      //console.log('item.text:'+item.text);
      zhuge.track('我的-点击线上订单选项',{
        '选项名称':item.text
      });
    },
    clickOrderTab(e) {
      if (this.datas.list[e].uikey == "U_memberorder_ys") {
        this.$router.push(this.fun.getUrl("orderlist", { orderType: "ysSystem", status: "0" }));
        return false;
      }
      // 返回 Promise 来执行异步逻辑
      return new Promise(resolve => {
        // 在 resolve 函数中返回 true 或 false
        resolve(true);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
// 默认
.component-wrapper {
  width: 100%;
}

.html-box {
  min-height: 30px;
}

.badge {
  position: absolute;
  left: 56%;
  top: 0.125rem;
  background-color: #fff;
  border-radius: 0.625rem;
  color: #f15353;
  line-height: 0.875rem;
  font-size: 12px;
  padding: 0 0.2rem;
  border: solid 1px #f15353;
}

.ordertltie {
  text-align: left;
  width: 100%;
  height: 40px;
  // border-bottom: 1px solid #ebebeb;
  box-sizing: border-box;
  position: relative;
  display: flex;
  padding: 0 14px;
  align-items: center;

  .spare {
    width: 4px;
    height: 16px;
    border-radius: 1px;

    /* background-color: #f15353; */
    // margin-top: 12px;
    margin-right: 6px;
  }

  i {
    line-height: 40px;
    color: #c9c9c9;
    font-size: 20px;
    float: right;
    position: absolute;
    right: 14px;
    top: 0;
  }

  .ordername {
    float: left;
    line-height: 40px;
    font-size: 16px;

    /* color: #333; */
    font-weight: bold;
  }
}

.order_all {
  padding: 10px 0;
  color: #333;
  display: flex;
  justify-content: space-around;
}

.order_img {
  width: 36px;
  height: 36px;
  display: block;
  margin: 0 auto;
}

.order_pub {
  display: flex;
  flex-direction: column;
  padding-top: 2px;
  text-align: center;
  position: relative;
  font-size: 12px;
  width: 25%;
  word-break: break-all;

  i {
    font-size: 24px;
    color: #999;
    margin: 0 auto;
  }
}
</style>
