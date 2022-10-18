import cTitle from "components/title";
import { Toast } from 'vant';
import { scrollMixin } from "utils/mixin";

export default {
  mixins: [scrollMixin], //加载更多
  data() {
    return {
      voiceList: [],
      selectedNum: null, //选中的商品索引
      sliderTime: 0,
      songStop: false,
      isNOInfo: false, //是否商品列表为空，用于控制显示空数据图标
      audio: {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      },

      //more
      isLoadMore: true,
      page: 1,
      total_page: 0,
      isLoading:false
    };
  },
  activated() {
    this.initData();
    this.getData();
  },
  methods: {
    initData() {
      this.voiceList = [];
      this.songStop = false;
      this.isNOInfo = false;
      this.sliderTime = 0;
      this.selectedNum = null;

      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.audio = {
        // 该字段是音频是否处于播放状态的属性
        playing: false,
        // 音频当前播放时长
        currentTime: 0,
        // 音频最大播放时长
        maxTime: 0,
        minTime: 0,
        step: 0.1
      };
    },
    failGood() {
      Toast({
        message: "该商品已失效！",
        duration: 800
      });
      return;
    },
    //获取数据
    getData() {
      const that = this;
      that.isLoadMore = false;
      that.page = 1;
      $http.get("plugin.voice-goods.api.voice-goods.getVoiceList", {}, "").then(
        function(response) {
          if (response.result === 1) {
            that.isLoadMore = true;
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.voiceList = response.data.data;
            if (that.fun.isTextEmpty(that.voiceList)) {
              that.isNOInfo = true;
            }
            this.isLoading = false;
          } else {
            Toast(response.msg);
            that.isNOInfo = true;
            this.isLoading = false;
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    select(ind, src) {
      if (this.selectedNum == ind) {
        if (this.songStop) {
          this.$refs.audios.play(); //继续播放
          this.songStop = false;
          return;
        } else {
          this.$refs.audios.pause();
          this.songStop = true;
          return;
        }
      } else {
        this.selectedNum = ind;
        this.$refs.audios.src = src; //选择其他音频
        if (this.$refs.audios.paused) {
          this.$refs.audios.play();
          return;
        }
      }
    },
    playAmr(src) {
      this.$refs.audios.src = src;
      this.$refs.audios.play();
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      // this.readyState = this.$refs.audios.readyState;
      this.audio.maxTime = parseInt(res.target.duration);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      let that = this;
      this.audio.currentTime = res.target.currentTime;
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
      this.$refs.audios.onended = function() {
        that.songStop = false;
        that.selectedNum = null;
      };
    },
    gotoDetail(_id) {
      // this.$router.push(this.fun.getUrl("VoiceGood", { id: _id }));
      this.$router.push(this.fun.getUrl("goods", { id: _id }));
    },
    //获取更多数据
    getMoreData() {
      const that = this;
      that.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        $http
          .get(
            "plugin.voice-goods.api.voice-goods.getVoiceList",
            {
              page: that.page
            },
            ""
          )
          .then(
            function(response) {
              that.isLoadMore = true;
              if (response.result === 1) {
                var myData = response.data.data;
                that.voiceList = that.voiceList.concat(myData); //数组拼接
              } else {
                that.page = that.page - 1;
                that.isLoadMore = false;
                return;
              }
            },
            function(response) {
              // error callback
              console.log(response.msg);
            }
          );
      }
    },
    //下拉刷新
    loadTop() {
      this.$refs.audios.src = "";
      this.initData();
      this.getData();
      // this.$refs.loadmore.onTopLoaded();
    }
  },
  filters: {
    //截取标题长度
    sliceString: function(value) {
      let wigth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
      value = value.toString();
      if (value.length > 22 && wigth >= 375) {
        return value.substring(0, 26) + "...";
      } else if (value.length > 22 && wigth < 375) {
        return value.substring(0, 22) + "..."; //适配小屏手机
      } else {
        return value;
      }
    }
  },
  components: { cTitle }
};
