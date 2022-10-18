<template>
  <div class="chat-main" id="chat-main">
    <c-title :hide="false" :text="chatType == 2 ? memberInfo.nickname : employeeInfo.nickname"></c-title>
    <div :style="{ height: currentReconnectNum >= maxReconnectNum ? '40px' : '0px' }"></div>
    <div class="no-connect set-pc-styleLeft" v-if="currentReconnectNum >= maxReconnectNum">
      <i class="el-icon-warning"></i>
      <span>当前网络不可用</span>
    </div>
    <div class="no-more-message" v-show="chatFinished">
      <span>没有更多消息记录啦~</span>
    </div>
    <van-pull-refresh v-model="chatLoading" @refresh="refresh()" pulling-text="释放加载更多聊天信息" loosing-text="释放加载更多聊天信息" :disabled="chatFinished">
      <div class="chat-scroll" id="chat-data" @click="opetFlag = false" :style="{ paddingBottom: opetFlag == true ? '17rem' : '3rem' }" ref="chatList">
        <div class="conversation" v-for="item in chatList" :key="item.id">
          <template v-if="item.is_system_opt">
            <div class="system-opt-message">{{ item.content }}</div>
          </template>
          <template v-else-if="item.is_backed">
            <div class="system-opt-message">
              <template v-if="chatType == 2">
                <div v-if="item.direction_type === 0">您撤回了消息</div>
                <div v-if="item.direction_type === 1">{{ memberInfo.nickname }}撤回了消息</div>
              </template>
              <template v-if="chatType == 1">
                <div v-if="item.direction_type === 0">{{ employeeInfo.nickname }}撤回了消息</div>
                <div v-if="item.direction_type === 1">您撤回了消息</div>
              </template>
            </div>
          </template>
          <template v-else-if="item._is_time">
            <div class="system-opt-message">{{ item._message_time }}</div>
          </template>
          <template v-else>
            <div class="chat-msg my-msg" v-if="(item.direction_type === 0 && chatType == 2) || (item.direction_type === 1 && chatType == 1)">
              <div class="avater">
                <template v-if="item.direction_type === 0">
                  <van-image :src="employeeInfo.avatar" width="37px" height="37px" round fit="cover"></van-image>
                </template>
                <template v-else>
                  <van-image :src="memberInfo.avatar" width="37px" height="37px" round fit="cover"></van-image>
                </template>
              </div>
              <div class="content">
                <el-popover v-model="showMoreChatOpt[item.id]" placement="bottom" trigger="click">
                  <template #reference>
                    <div class="my-info">
                      <div v-if="!item.id && !item.send_fail" class="send-msg-loading">
                        <!-- <img src="../../../assets/images/img_loading.gif" /> -->
                        <van-loading type="spinner" size="20px" />
                      </div>
                      <p class="txt">
                        <template v-if="item.content_type == 1">
                          <ChatContentPic :item="item" @loaded="chatLoaded" />
                        </template>
                        <template v-else-if="item.content_type == 2">
                          <ChatContentGoods :item="item" @loaded="chatLoaded" />
                        </template>
                        <template v-else-if="item.content_type == 3">
                          <ChatContentOrder :item="item" @loaded="chatLoaded" />
                        </template>
                        <template v-else>
                          <ChatContentTxt :item="item" @loaded="chatLoaded" />
                        </template>
                      </p>
                      <div v-if="item.send_fail">
                        <ChatContentFailed :item="item" @loaded="chatLoaded" />
                      </div>
                      <div class="arrow-r"></div>
                    </div>
                  </template>
                  <div class="chat-content-opt">
                    <div class="chat-content-opt-item" @click="backMsg(item)">撤回</div>
                  </div>
                </el-popover>
              </div>
            </div>
            <div class="chat-msg other-msg" v-else>
              <div class="avater">
                <template v-if="item.direction_type === 0">
                  <van-image :src="employeeInfo.avatar" width="37px" height="37px" round fit="cover" />
                </template>
                <template v-else>
                  <van-image :src="memberInfo.avatar" width="37px" height="37px" round fit="cover" />
                </template>
              </div>
              <div class="content">
                <!-- <div class="name">
                    {{memberInfo.nickname}}
                    <span class="content-time">
                      {{item.created_at}}
                    </span>
                </div>-->

                <div class="other-info">
                  <p class="txt">
                    <template v-if="item.content_type == 1">
                      <ChatContentPic :item="item" @loaded="chatLoaded" />
                    </template>
                    <template v-else-if="item.content_type == 2">
                      <ChatContentGoods :item="item" @loaded="chatLoaded" />
                    </template>
                    <template v-else-if="item.content_type == 3">
                      <ChatContentOrder :item="item" @loaded="chatLoaded" />
                    </template>
                    <template v-else>
                      <ChatContentTxt :item="item" @loaded="chatLoaded" />
                    </template>
                  </p>
                  <!-- <div v-if="item.send_fail">
                    <ChatContentFailed :item="item" @loaded="chatLoaded" />
                  </div> -->
                  <div class="arrow-l"></div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div v-if="show_tool_bar == 1" style="height:2.75rem;"></div>
      </div>
    </van-pull-refresh>

    <div class="sendGoods" v-if="goodsObj.show" @click="bindSendGoods">
      <div class="tips">点击发送该商品</div>
      <img :src="goodsObj.info.thumb" alt />
      <div class="price">
        <span style="font-size: 0.6rem;">￥</span>
        {{ goodsObj.info.price }}
      </div>
    </div>

    <div class="chat-footer" :style="{ bottom: opetFlag == true ? '14rem' : 0 }" :class="[fun.getPhoneEnv() == 3 ? 'pcStyle' : '']">
      <div class="show_tool_bar" v-if="show_tool_bar == 1 && chat_tool_bars.length > 0">
        <div class="chat_tool_bars">
          <div class="chat_tool_item" v-for="item in chat_tool_bars" :key="item.id" @click="handClickChatToolBars(item)">{{ item.name }}</div>
        </div>
      </div>
      <div class="chat-opt-input">
        <div class="chat-opt-input-box">
          <span class="chat-opt-input-more-icon" @click="setOpetFlag">
            <van-icon name="add" size="30px" color="#fb4a4a" />
          </span>
          <div class="inputWrapper">
            <input id="text_in" v-model="msgText" class="edit-ipt" @focus="textInputFocus" ref="inputEl" />
            <div class="chat-opt-input-emoji-icon">
              <div class="emoticon-con">
                <el-popover v-model="showEmoji" placement="top" trigger="click">
                  <div class="faces_content">
                    <span class="face-item" v-for="item in emojiList" :key="item.id" :title="item.text" @click="selectEmoji(item)">
                      <van-image :src="require('../../../assets/images/' + item.url)" />
                    </span>
                  </div>
                  <template #reference>
                    <van-icon name="smile-o" style="display: flex; align-items: center;" size="30px" color="#666" />
                  </template>
                </el-popover>
              </div>
            </div>
          </div>

          <a class="chat-opt-send-msg-btn" @click="sendMsg(0)">发送</a>
        </div>
      </div>

      <div class="opet">
        <div class="opetItem" v-if="chat_opt_setting.pic == 1">
          <van-uploader :after-read="sendImg" :before-read="beforeSendImg">
            <img class="iconImg" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/chatWindowPic.png" alt />
          </van-uploader>

          <span>图片</span>
        </div>
        <div class="opetItem" @click="showGoodsPopup" v-if="chat_opt_setting.goods == 1">
          <img class="iconImg" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/chatWindowGoods.png" alt />
          <span>商品</span>
        </div>
        <div class="opetItem" @click="showOrderPopup" v-if="chat_opt_setting.order == 1">
          <img class="iconImg" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/chatWindowOrder.png" alt />
          <span>订单</span>
        </div>
        <div class="opetItem" @click="showReplyPopup" v-if="chatType == 2 && chat_opt_setting.reply == 1">
          <img class="iconImg" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/chatWindowQuick.png" alt />
          <span>快捷回复</span>
        </div>
        <div class="opetItem" @click="showTransferPopup" v-if="chatType == 2 && chat_opt_setting.transfer == 1">
          <img class="iconImg" src="https://mini-app-img-1251768088.cos.ap-guangzhou.myqcloud.com/chatWindowTransfer.png" alt />
          <span>转接客服</span>
        </div>
      </div>

      <!-- <van-popup v-model="showMore" position="bottom">
        <div class="more-opt-con">
          <div class="more-opt-item">
            <div class="more-opt-item-icon">
              <van-uploader :after-read="sendImg"
                      :before-read="beforeSendImg"
                      :max-size="photosize"
                      @oversize="onphotosize">
                <van-icon name="photo" size="1.5rem" color="#666666" />
              </van-uploader>
            </div>
            <div class="more-opt-item-txt">图片</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showGoodsPopup">
              <van-icon name="bag" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">商品</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showOrderPopup">
              <van-icon name="column" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">订单</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showReplyPopup">
              <van-icon name="todo-list" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">快捷回复</div>
          </div>
          <div class="more-opt-item">
            <div class="more-opt-item-icon" @click="showTransferPopup">
              <van-icon name="friends" size="1.5rem" color="#666666" />
            </div>
            <div class="more-opt-item-txt">转接客服</div>
          </div>
        </div>
      </van-popup>-->
    </div>

    <van-popup v-model="goodsPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="goodsSearch.kwd" placeholder="搜索商品" />
            <i class="iconfont icon-sousuo" @click="getGoodsList"></i>
          </div>
        </div>
        <div class="list">
          <div v-for="item in goodsList" :key="item.id" class="goods-con">
            <div class="goods-img">
              <img :src="item.thumb" />
            </div>
            <div class="goods-txt">
              <div class="goods-title">{{ item.title }}</div>
              <div class="goods-price">￥{{ item.price }}</div>
            </div>
            <div class="goods-send">
              <span class="goods-send-btn" @click="selectGoods(item)">发 送</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="orderPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="orderSearch.keyword" placeholder="搜索订单" />
            <i class="iconfont icon-sousuo" @click="searchOrder"></i>
          </div>
        </div>
        <van-list v-model="orderListLoading" :finished="orderListLoadFinished" @load="getOrderList" class="list">
          <div v-for="item in orderList" :key="item.id" class="order-con">
            <div class="order-header">
              <span class="order-no"> 订单号：{{ item.order_sn }}</span>
              <span class="order-status">{{ item.status_name }}</span>
            </div>
            <div v-for="goods_item in item.has_many_order_goods" :key="goods_item.goods_id" class="order-item-con">
              <div class="order-goods-img">
                <img :src="goods_item.thumb" />
              </div>
              <div class="order-item-txt">
                <div class="order-goods-title">{{ goods_item.title }}</div>
                <div class="order-goods-price">
                  <span class="order-goods-num">x{{ goods_item.total }}</span>
                  ￥{{ goods_item.price }}
                </div>
              </div>
            </div>
            <div class="order-footer">
              <div class="totle-txt">共 {{ item.goods_total }} 件商品 实付：¥{{ item.price }}</div>
              <div>
                <span class="send-btn" @click="selectOrder(item)">发 送</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </van-popup>
    <van-popup v-model="replyPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="replySearch.kwd" placeholder="请输入标题" />
            <i class="iconfont icon-sousuo" @click="getReplyList"></i>
          </div>
        </div>
        <div class="list">
          <div v-for="item in replyList" :key="item.id" class="reply-con">
            <div class="reply-txt">
              <div class="reply-title">{{ item.title }}</div>
              <div class="reply-content">{{ item.content }}</div>
            </div>
            <div class="reply-send">
              <span class="reply-send-btn" @click="selectReply(item)">发 送</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model="transferPopupShow" position="bottom" :style="{ height: '80%' }">
      <div class="search-list-popup-con">
        <div class="search-con">
          <div class="input">
            <input type="text" v-model="transferSearch.kwd" placeholder="请输入客服昵称或手机号" />
            <i class="iconfont icon-sousuo" @click="getTransferEmployeeList"></i>
          </div>
        </div>
        <div class="list">
          <div v-for="item in transferEmployeeList" :key="item.id" class="transfer-con">
            <div class="transfer-avatar">
              <img :src="item.avatar" />
            </div>
            <div class="transfer-txt">
              <div class>{{ item.nickname }}</div>
              <div class>{{ item.has_one_member.mobile }}</div>
            </div>
            <div class="transfer-send">
              <span class="transfer-send-btn" @click="selectTransfer(item)">转 接</span>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast, PullRefresh as VanPullRefresh, Image as VanImage } from "vant";
import { emojiObjs, emojiList } from "./emoji";
import { ChatContentTxt, ChatContentPic, ChatContentGoods, ChatContentOrder, ChatContentFailed } from "./components";
import Utils from "./utils";
var canvas = document.createElement("canvas");
var context = canvas.getContext("2d");
let scrollToBottomHandler = null;

export default {
  components: {
    ChatContentTxt,
    ChatContentPic,
    ChatContentGoods,
    ChatContentOrder,
    ChatContentFailed,
    VanPullRefresh,
    VanImage
  },
  data() {
    return {
      websock: null,
      heartBeatInterval: null,
      msg_id_list: [],
      timeout: 3 * 1000, //todo 30秒一次心跳
      timeoutObj: null, //心跳心跳倒计时
      serverTimeoutObj: null, //心跳倒计时
      timeoutnum: null, //断开 重连倒计时
      isClosed: false,
      lockReconnect: false, //锁定重连状态
      maxReconnectNum: 11, //最大重连次数
      currentReconnectNum: 0, //当前重连次数
      chatList: [],
      userUid: 0,
      employeeId: 0,
      employeeInfo: {},
      memberInfo: {},
      groupId: 0,
      page: 1,
      total_page: 0,
      msgText: "",
      msgImg: "",
      photosize: 1024 * 1024 * 10,
      showEmoji: false,
      emojiList: [],
      emojisTmp: [],
      emojiObjs: {},
      //  showMore:false,
      goodsPopupShow: false,
      goodsList: [],
      goodsSearch: {
        kwd: ""
      },
      orderPopupShow: false,
      orderList: [],
      orderSearch: {
        keyword: "",
        page: 1
      },
      replyList: [],
      replySearch: {
        kwd: ""
      },
      replyPopupShow: false,
      transferSearch: {
        kwd: ""
      },
      transferPopupShow: false,
      transferEmployeeList: [],
      showMoreChatOpt: {},

      chatType: 1, //1为普通用户，2为客服，只能通过链接query参数获取
      opetFlag: false, //操作区

      goodsObj: {
        //从商品进来，该商品的相关数据
        show: false,
        info: {}
      },
      queue_id: 0, //会话ID

      //* 新增
      chatFinished: false,
      chatLoading: false,
      chatLoadedPage: 1,
      isDropDownLoad: false,
      chat_opt_setting: {},

      //* 订单
      orderListLoading: false,
      orderListLoadFinished: false,
      orderListPage: 1,

      show_tool_bar: 0,
      chat_tool_bars: []
    };
  },
  created() {
    this.emojiList = emojiList;
    this.emojiObjs = emojiObjs;
    this.chatType = this.$route.query.chatType;
    this.employeeId = parseInt(this.$route.query.employeeId);
    this.groupId = parseInt(this.$route.query.groupId);
    this.userUid = parseInt(this.$route.query.user_id);

    this.init();

    //判断是否从商品进来
    if (this.$route.query.goods_id && this.$route.query.goods_id != 0) {
      this.getGoodsDetails();
    }
    this.getReplyList();
  },
  deactivated() {
    this.lockReconnect = true;
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    this.isClosed = true;
    if (this.websock) {
      this.websock.close();
    }
    this.clearHeartBeat();
  },
  destroyed() {
    this.lockReconnect = true;
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    this.isClosed = true;
    if (this.websock) {
      this.websock.close();
    }
    //this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    handClickChatToolBars(item) {
      if (item.type == 0) {
        this.msgText = item.key_word;
        this.sendMsg(0);
      } else if (item.type == 1) {
        window.location.href = item.h5_url;
      }
    },
    chatLoaded() {
      if (this.isDropDownLoad) {
        return;
      }
      if (scrollToBottomHandler) clearTimeout(scrollToBottomHandler);
      scrollToBottomHandler = setTimeout(() => {
        this.$nextTick(() => {
          window.scrollTo(0, window.document.body.scrollHeight);
        });
      }, 300);
    },
    textInputFocus() {
      this.opetFlag = false;
      this.goodsObj.show = false;
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: "smooth"
        });
        window.setTimeout(() => {
          this.$refs["inputEl"].scrollIntoViewIfNeeded && this.$refs["inputEl"].scrollIntoViewIfNeeded();
        }, 0);
      }, 350);
    },
    setOpetFlag() {
      this.opetFlag = !this.opetFlag;
      setTimeout(() => {
        window.scrollTo(0, window.document.body.scrollHeight);
      }, 300);
    },
    init() {
      let url = "plugin.yun-chat.frontend.h5.chat.index";
      if (this.chatType == 2) url = "plugin.yun-chat.frontend.chat.index";
      $http.get(url, { group_id: this.groupId, employee_id: this.employeeId, user_uid: this.userUid }, "加载中").then(response => {
        if (response.result === 1) {
          if (response.data.employee_info) {
            this.employeeInfo = response.data.employee_info;
            this.userUid = response.data.member_info.uid;
            this.memberInfo = response.data.member_info;
            this.employeeId = response.data.employee_info.id;
            if (response.data.queue_info) {
              this.queue_id = response.data.queue_info.id;
            }
            if (response.data.queue_list) {
              let userObj = response.data.queue_list.filter(item => {
                return item.uid == this.userUid;
              })[0];
              if (userObj && userObj.id) {
                this.queue_id = userObj.id;
              }
            }
            this.initWebSocket();
            this.getChatList();
          } else {
            //todo 客服都不在线
            Toast("客服都不在线");
          }
        } else {
          Toast(response.msg);
        }
      });
    },
    getGoodsDetails() {
      let url = "plugin.yun-chat.frontend.goods.queryOne";
      let json = { id: this.$route.query.goods_id };
      $http.get(url, json).then(res => {
        if (res.result == 1) {
          this.goodsObj.info = res.data;
          this.goodsObj.show = true;
          setTimeout(() => {
            this.goodsObj.show = false;
          }, 5000);
        }
      });
    },
    bindSendGoods() {
      let goods = this.goodsObj.info;
      this.selectGoods({
        id: goods.id,
        title: goods.title,
        thumb: goods.thumb,
        price: goods.price
      });
      this.goodsObj.show = false;
    },
    refresh() {
      this.isDropDownLoad = true;
      this.getChatList();
    },
    getChatList() {
      if (this.chatFinished) {
        return;
      }
      let url = "plugin.yun-chat.frontend.h5.chat.chats";
      if (this.chatType == 2) url = "plugin.yun-chat.frontend.chat.chats";
      let json = { page: this.chatLoadedPage, queue_id: this.queue_id };
      // if (this.chatType == 1) json.employee_id = this.employeeId;
      // if (this.chatType == 2) json.user_uid = this.userUid;
      $http.get(url, json, "加载中").then(({ result, data: response, msg }) => {
        this.chatLoading = false;
        if (result === 1) {
          if (response.last_page == response.current_page || response.data.length < response.per_page) {
            this.chatFinished = true;
          }
          let chatList = JSON.parse(JSON.stringify(response.data));
          let localLastChat = this.chatList[0];
          let addTimeIndexs = [];
          let addTimeSourceDataIndex = [];
          if (chatList.length > 0) {
            chatList.reduce((previous, current, currentIndex, list) => {
              if (previous === undefined) {
                previous = list[currentIndex - 1];
              }
              if (previous) {
                const { minutes, hours, days } = Utils.getTimeDiff(current["created_at"], previous["created_at"]);
                if (minutes > 5 || hours > 1 || days > 1) {
                  addTimeIndexs.push(currentIndex + addTimeIndexs.length);
                  addTimeSourceDataIndex.push(currentIndex);
                }
              }
            });
          }

          for (let index = 0; index < addTimeIndexs.length; index++) {
            const chatIndex = addTimeIndexs[index];
            chatList.splice(chatIndex, 0, {
              _is_time: true,
              _message_time: Utils.formatDate(response.data[addTimeSourceDataIndex[index]]["created_at"], "h:i")
            });
          }

          const currentScrollY = document.body.scrollHeight;
          document.querySelector("html").style.scrollBehavior = "unset";

          this.chatList.unshift(...this.fmtChatList(chatList));
          this.chatLoadedPage++;
          if (localLastChat && chatList.length > 0) {
            const { hours, minutes, days } = Utils.getTimeDiff(localLastChat["created_at"], chatList[chatList.length - 1]["created_at"]);
            if (minutes > 5 || hours > 1 || days > 1) {
              this.chatList.unshift({
                _is_time: true,
                _message_time: Utils.formatDate(response.data[0]["created_at"], "y年m月d日 h:i:s")
              });
            }
          }
          this.$nextTick(() => {
            if (this.isDropDownLoad) {
              window.scrollTo(0, this.$refs["chatList"].clientHeight - currentScrollY);
            } else {
              window.scrollTo(0, document.body.scrollHeight);
            }
            document.querySelector("html").style.scrollBehavior = "smooth";
          });
        }
      });
    },
    getReplyList() {
      if (this.chatType == 2) {
        $http.get("plugin.yun-chat.frontend.common-reply.query", this.replySearch, "加载中").then(response => {
          if (response.result === 1) {
            this.replyList = response.data;
          } else {
            Toast(response.msg);
          }
          this.replySearch = {
            kwd: ""
          };
        });
      }
    },
    selectReply(item) {
      this.msgText = item.content;
      this.sendMsg(0);
      this.replyPopupShow = false;
    },
    showTransferPopup() {
      this.opetFlag = false;
      this.transferPopupShow = true;
    },
    getTransferEmployeeList() {
      $http.get("plugin.yun-chat.frontend.employee.queryList", this.transferSearch).then(response => {
        if (response.result === 1) {
          this.transferEmployeeList = response.data;
        } else {
          Toast(response.msg);
        }
        this.transferSearch = {
          keyword: ""
        };
      });
    },
    selectTransfer(item) {
      this.transferPopupShow = false;
      this.$dialog.confirm({ message: "确定转接给（" + item.nickname + "）对接？" }).then(() => {
        $http.get("plugin.yun-chat.frontend.chat.transfer", { employee_id: item.id, user_uid: this.userUid }).then(response => {
          if (response.result === 1) {
            Toast(response.msg);
            this.$router.push(this.fun.getUrl("chatList", {}));
          } else {
            Toast(response.msg);
          }
          this.transferSearch = {
            keyword: ""
          };
        });
      });
    },
    showGoodsPopup() {
      this.opetFlag = false;
      this.goodsPopupShow = true;
      // if(this.goodsList.length==0){
      //   this.getGoodsList();
      // }
    },
    getGoodsList() {
      $http.get("plugin.yun-chat.frontend.goods.queryList", this.goodsSearch).then(response => {
        if (response.result === 1) {
          this.goodsList = response.data;
        } else {
          Toast(response.msg);
        }
      });
    },
    selectGoods(item) {
      // 发送商品消息
      let goodsTmp = {};
      goodsTmp["id"] = item.id;
      goodsTmp["title"] = item.title;
      goodsTmp["thumb"] = item.thumb;
      goodsTmp["price"] = item.price;
      this.msgText = encodeURIComponent(JSON.stringify(goodsTmp));
      this.sendMsg(2);
      this.goodsPopupShow = false;
    },
    showOrderPopup() {
      this.opetFlag = false;
      this.orderPopupShow = true;
      // if(this.orderList.length==0){
      //   this.getOrderList();
      // }
    },
    showReplyPopup() {
      this.opetFlag = false;
      this.replyPopupShow = true;
    },
    searchOrder() {
      this.orderListPage = 1;
      this.orderListLoading = false;
      this.orderListLoadFinished = false;
      this.orderList = [];
      this.getOrderList();
    },
    getOrderList() {
      let url = "";
      let json = {};
      if (this.chatType == 1) {
        url = "order.list";
        json = this.orderSearch;
      } else if (this.chatType == 2) {
        url = "plugin.yun-chat.frontend.order-list.get-data";
        json = { user_uid: this.userUid, order_sn: this.orderSearch.keyword };
      }
      json.page = this.orderListPage;
      $http.get(url, json).then(response => {
        this.orderListLoading = false;
        if (response.result === 1) {
          if (this.chatType == 1) {
            this.orderListPage++;
            if (response.data.last_page == response.data.current_page) {
              this.orderListLoadFinished = true;
            }
            this.orderList.push(...response.data.data);
          } else if (this.chatType == 2) {
            this.orderList.push(...response.data);
          }
        } else {
          Toast(response.msg);
        }
      });
    },
    selectOrder(item) {
      // 发送订单消息
      this.msgText = encodeURIComponent(JSON.stringify(item));
      this.sendMsg(3);
      this.orderPopupShow = false;
    },
    sendMsg(content_type) {
      if (!this.msgText) {
        return;
      }
      let lastChat = this.chatList[this.chatList.length - 1];
      let addTime = false;
      if (lastChat) {
        let timeDiff = Utils.getTimeDiff(Date.now(), lastChat["created_at"]);
        if (timeDiff.minutes > 5 || timeDiff.hours > 0 || timeDiff.datys > 0) {
          addTime = true;
        }
      }
      let text = this.msgText;
      for (let i = 0; i < this.emojisTmp.length; i++) {
        text = text.replace(this.emojisTmp[i]["text"], this.emojisTmp[i]["name"]);
      }

      let json = { text: text, content_type: content_type, queue_id: this.queue_id };
      let url = "";
      let receiveTextObj;
      if (this.chatType == 1) {
        receiveTextObj = this.generateChatData(text, 1, this.getNowDateTime(), content_type);
        url = "plugin.yun-chat.frontend.h5.chat.sendMsg";
        // json.employee_id = this.employeeId;
      } else if (this.chatType == 2) {
        receiveTextObj = this.generateChatData(text, 0, this.getNowDateTime(), content_type);
        url = "plugin.yun-chat.frontend.chat.sendMsg";
        // json.user_uid = this.userUid;
      }
      console.log(receiveTextObj);
      //  this.fmtChatList(receiveTextObj);
      receiveTextObj.send_fail = 0;
      this.chatList.push(receiveTextObj);
      let msgIndex = this.chatList.length;
      console.log(receiveTextObj, msgIndex);
      // let chatListTemp = [];
      // for (let i = 0; i < this.chatList.length; i++) {
      //   chatListTemp.push(this.chatList[i]);
      // }
      // chatListTemp.push(receiveTextObj);
      // this.chatList = chatListTemp;

      //this.chatList[msgIndex-1]["send_fail"] = 0;
      $http.post(url, json).then(response => {
        if (response.result === 1) {
          // 直接获取返回的格式插入
          console.log(response.data);
          this.fmtChatList(response.data);
          this.chatList.splice(msgIndex - 1, 1, response.data);
          // this.chatList.push(response.data);
          if (addTime) {
            this.chatList.splice(msgIndex - 1, 0, {
              _is_time: true,
              _message_time: Utils.formatDate(Date.now(), "h:i")
            });
          }
          this.$nextTick(() => {
            window.scrollTo(0, window.document.body.scrollHeight);
          });
        } else {
          this.chatList.push({
            ...receiveTextObj,
            send_fail: 1
          });
          Toast(response.msg);
        }
      });

      //$(".chat-data").scrollTop(3000);
      this.msgText = "";
    },
    backMsg(item) {
      let url = "";
      if (this.chatType == 1) {
        url = "plugin.yun-chat.frontend.h5.chat.backed-msg";
      } else if (this.chatType == 2) {
        url = "plugin.yun-chat.frontend.chat.backed-msg";
      }
      $http.get(url, { id: item.id }, "加载中").then(response => {
        if (response.result === 1) {
          let chatListTemp = [];
          for (let i = 0; i < this.chatList.length; i++) {
            if (this.chatList[i]["id"] == item.id) {
              this.chatList[i]["is_backed"] = 1;
            }
            chatListTemp.push(this.chatList[i]);
          }
          this.chatList = chatListTemp;
        } else {
          Toast(response.msg);
        }
      });
    },
    goGoodsPage(item) {
      this.$router.push(this.fun.getUrl("goods", { id: item.id }));
    },
    goOrderPage(item) {
      //this.$router.push(this.fun.getUrl("goods",{id: item.id}));
    },
    beforeSendImg(e, flag) {
      this.opetFlag = false;
      return true;
    },
    sendImg(e, flag) {
      Toast.loading({
        message: "上传中",
        forbidClick: true
      });
      let fd = new FormData();

      if (flag === true) {
        fd.append("file", e); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      } else {
        fd.append("file", e.file); // 第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(this.fun.getRealUrl("upload.uploadPic"), fd, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          var responseData = response.data;
          if (responseData.result === 1) {
            That.msgText = responseData.data.img_url;
            That.sendMsg(1);
            //That.applyModel.thumb = responseData.data.img_url;
            Toast.clear();
          } else {
            Toast.clear();
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },
    selectEmoji(item) {
      this.showEmoji = false;
      let myField = document.querySelector("#text_in");
      let emoji_text = item.text;
      if (myField.selectionStart || myField.selectionStart === 0) {
        let startPos = myField.selectionStart;
        let endPos = myField.selectionEnd;
        this.msgText = myField.value.substring(0, startPos) + emoji_text + myField.value.substring(endPos, myField.value.length);
        this.$nextTick();
        myField.focus();
        myField.setSelectionRange(endPos + emoji_text.length, endPos + emoji_text.length);
      } else {
        this.msgText = emoji_text;
      }
      this.emojisTmp.push(item);
    },
    onphotosize(e) {
      this.imgPreview(e.file, 1);
    },
    imgPreview(file, callback) {
      let self = this;
      // 判断支不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片转成base64格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function() {
            // 图片原始尺寸
            var originWidth = this.width;
            var originHeight = this.height;
            // 最大尺寸限制
            var maxWidth = 1024,
              maxHeight = 1024;
            // 目标尺寸
            var targetWidth = originWidth,
              targetHeight = originHeight;
            // 图片尺寸超过1024x1024的限制
            if (originWidth > maxWidth || originHeight > maxHeight) {
              if (originWidth / originHeight > maxWidth / maxHeight) {
                // 更宽，按照宽度限定尺寸
                targetWidth = maxWidth;
                targetHeight = Math.round(maxWidth * (originHeight / originWidth));
              } else {
                targetHeight = maxHeight;
                targetWidth = Math.round(maxHeight * (originWidth / originHeight));
              }
            }

            // canvas对图片进行缩放
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传
            canvas.toBlob(function(blob) {
              // 图片ajax上传
              if (callback === 1) {
                self.onRead(blob, true);
              } else {
                self.onRead_1(blob, true);
              }
            }, file.type || "image/png");
          };
        };
      }
    },
    initWebSocket() {
      this.msg_id_list = [];
      this.clearHeartBeat();

      console.log(this.currentReconnectNum, "currentReconnectNum", this.maxReconnectNum);
      this.currentReconnectNum += 1;
      //初始化weosocket
      let url = "";
      if (this.chatType == 1) {
        url = "plugin.yun-chat.frontend.h5.chat.get-ws-setting&employee_id=" + this.employeeId;
      } else if (this.chatType == 2) {
        url = "plugin.yun-chat.frontend.chat.get-ws-setting";
      }
      $http.get(url).then(response => {
        if (response.result === 1) {
          this.chat_opt_setting = response.data.chat_opt_setting || {};
          this.show_tool_bar = response.data.show_tool_bar || 0;
          this.chat_tool_bars = response.data.chat_tool_bars || [];
          //	this.init();
          let wssParams = response.data.wss_params;
          const wsuri =
            wssParams.host +
            "?appId=" +
            wssParams.appId +
            "&signature=" +
            wssParams.signature +
            "&nonceStr=" +
            wssParams.nonceStr +
            "&timestamp=" +
            wssParams.timestamp +
            "&clientid=" +
            wssParams.clientid +
            "&agent_id=" +
            wssParams.agent_id;
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onclose = this.websocketclose;
        } else {
          this.$toast(response.msg);
        }
      });
    },
    clearHeartBeat() {
      clearInterval(this.heartBeatInterval);
      this.heartBeatInterval = null;
    },
    keepHeartBeat() {
      this.heartBeatInterval = setInterval(() => {
        // 每隔一分钟发送一个心跳包消息
        this.websock.send(JSON.stringify({ type: "ping" }));
      }, 60 * 1000);
    },
    reconnect() {
      //重新连接
      if (this.lockReconnect || this.isClosed || this.currentReconnectNum >= this.maxReconnectNum) {
        if (this.websock) {
          this.websock.close();
        }
        return;
      }
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      this.timeoutnum && clearTimeout(this.timeoutnum);
      this.timeoutnum = setTimeout(() => {
        //新连接
        this.initWebSocket();
        this.lockReconnect = false;
      }, 5000);
    },
    heartBeatStart() {
      //重置并开启心跳
      this.timeoutObj && clearTimeout(this.timeoutObj);
      this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
      this.timeoutObj = setTimeout(() => {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (this.websock.readyState == 1) {
          //如果连接正常
          this.websock.send(JSON.stringify({ type: "ping" }));
          this.keepHeartBeat();
          this.currentReconnectNum = 0; //连接成功归零
        } else {
          //否则重连
          this.reconnect();
        }
      }, this.timeout);
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      //let actions = {"type":"init","uid":this.socketBindUid};
      //this.websocketsend(JSON.stringify(actions));
      this.heartBeatStart();
    },
    websocketonerror() {
      //连接建立失败重连
      //this.initWebSocket();
      this.clearHeartBeat();
      if (!this.isClosed) {
        this.reconnect();
      }
    },
    websocketonmessage(e) {
      let chatListTemp = [];
      this.isDropDownLoad = false;
      //数据接收
      let message = JSON.parse(e.data);
      if (message.msg_id) {
        this.websock.send(JSON.stringify({ type: "msg_ack", msg_id: message.msg_id }));
        if (this.msg_id_list.indexOf(message.msg_id) > -1) {
          return;
        }
        this.msg_id_list.push(message.msg_id);
      }
      switch (message.type) {
        case "init":
          //this.bind(message.client_id);
          return;
        case "text":
          if ((this.chatType == 1 && this.employeeId == message.employee_id) || (this.chatType == 2 && this.userUid == message.uid)) {
            let directionType = message.direction_type ? message.direction_type : 0;
            let receiveTextObj;
            if (this.chatType == 1) {
              receiveTextObj = this.generateChatData(message.data, directionType, message.time, message.content_type);
            } else if (this.chatType == 2) {
              receiveTextObj = this.generateChatData(message.data, directionType, message.time, message.content_type);
            }
            receiveTextObj["id"] = parseInt(message.id);
            for (let i = 0; i < this.chatList.length; i++) {
              chatListTemp.push(this.chatList[i]);
            }
            chatListTemp.push(receiveTextObj);
            this.chatList = chatListTemp;
          } else {
            if (message.employee_id != this.employee_id) {
              if (this.websock) {
                this.websock.close();
              }
              this.employeeId = message.employee_id;
              this.chatList = [];
              this.chatFinished = false;
              this.chatLoading = false;
              this.chatLoadedPage = 1;
              this.init();
            } else {
              this.$toast("转接失败");
            }
          }
          if (this.chatType == 1) {
            $http.post("plugin.yun-chat.frontend.h5.chat.is-read", {
              chats_id: message.id
            });
          } else {
            $http.post("plugin.yun-chat.frontend.chat.is-read", {
              chats_id: message.id
            });
          }

          return;
        case "backed":
          for (let i = 0; i < this.chatList.length; i++) {
            if (this.chatList[i].id == message.data) {
              this.chatList[i]["is_backed"] = 1;
            }
            chatListTemp.push(this.chatList[i]);
          }
          this.chatList = chatListTemp;
          return;
      }
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      this.clearHeartBeat();
      if (!this.isClosed) {
        this.reconnect();
      }
      //this.initWebSocket();
    },
    generateChatData(content, direction_type, time, content_type) {
      let res = {};
      res["id"] = 0;
      if (content_type == 2 || content_type == 3) {
        res["content"] = JSON.parse(decodeURIComponent(content));
      } else if (content_type == 1) {
        res["content"] = content;
      } else if (content_type == 0) {
        res["content"] = this.replaceEmoji(content);
      }
      res["content_type"] = content_type;
      res["direction_type"] = direction_type;
      res["created_at"] = time;
      return res;
    },
    fmtChatList(chatList) {
      // 处理商品或表情消息
      if (chatList instanceof Array) {
        for (let i = 0; i < chatList.length; i++) {
          if (chatList[i]["content_type"] == 2 || chatList[i]["content_type"] == 3) {
            chatList[i]["content"] = JSON.parse(decodeURIComponent(chatList[i]["content"]));
          } else if (chatList[i]["content_type"] == 0) {
            chatList[i]["content"] = this.replaceEmoji(chatList[i]["content"]);
          }
        }
      } else if (chatList instanceof Object) {
        if (chatList["content_type"] == 2 || chatList["content_type"] == 3) {
          chatList["content"] = JSON.parse(decodeURIComponent(chatList["content"]));
        } else if (chatList["content_type"] == 0) {
          chatList["content"] = this.replaceEmoji(chatList["content"]);
        }
      }

      return chatList;
    },
    replaceEmoji(content) {
      let that = this;
      return content.replace(/face\[([^\s\[\]]+?)\]/g, function(i) {
        return '<img src="' + require("../../../assets/images/" + that.emojiObjs[i]["url"]) + '" style="width:30px;height:30px;"/>';
      });
    },
    getNowDateTime() {
      let date = new Date();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = date.getMonth() + 1;
      let strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds(); //年月日时分秒
      return currentdate;
    }
  }
};
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "./chat.scss";

.opet {
  display: grid;
  grid-template-columns: repeat(4, 3.438rem);
  grid-template-rows: repeat(auto-fill, 4.75rem);
  grid-row-gap: 1.5rem;
  justify-content: space-between;
  width: 100%;
  height: 14rem;
  padding: 1.75rem 1.656rem 0;
  background: #fff;

  .opetItem {
    display: flex;
    flex-direction: column;

    .iconImg {
      width: 3.438rem;
      height: 3.438rem;
      margin: 0;
      border-radius: 0.625rem;
    }

    span {
      font-size: 0.75rem;
      color: #4b4b4b;
      margin-top: 0.4rem;
    }
  }
}

.sendGoods {
  position: fixed;
  right: 1rem;
  bottom: 4rem;
  width: 7rem;
  height: 9.5rem;
  padding: 0.5rem;
  text-align: left;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  z-index: 10;
  .tips {
    font-size: 0.75rem;
    color: #222;
  }

  img {
    width: 6rem;
    height: 6rem;
    margin-top: 0.4rem;
    object-fit: cover;
  }

  .price {
    font-weight: bold;
    color: #f14e4e;
  }
}

.order-con {
  background: #fff;
  padding: 10px;

  .order-header {
    width: 100%;
    font-size: 14px;
    padding-top: 10px;

    .order-no {
      color: #666;
      float: left;
    }

    .order-status {
      float: right;
      color: #f15353;
    }

    &::after {
      display: table;
      content: "";
      clear: both;
    }
  }

  .order-item-con {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #ccc;

    .order-goods-img {
      width: 70px;

      img {
        width: 50px;
        height: 50px;
      }
    }

    .order-item-txt {
      flex: 1;

      .order-goods-title {
        font-size: 14px;
      }

      .order-goods-price {
        display: inline-block;
        width: 100%;
        text-align: right;
        margin-top: 10px;
        color: #fb4a4a;

        .order-goods-num {
          float: left;
        }
      }
    }
  }

  .order-footer {
    text-align: right;
    color: #666;
    line-height: 1.8;
  }
}

.no-more-message {
  padding: 10px 0;
  color: #666;
}

.faces_content {
  display: grid;
  grid-template-columns: repeat(9, 36px);
  justify-content: space-between;
  width: 100%;
}

.faces_content span {
  margin: 5px;
}

.faces_content img {
  width: 28px;
  height: 28px;
}
</style>
