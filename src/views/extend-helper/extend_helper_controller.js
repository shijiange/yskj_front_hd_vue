import cTitle from 'components/title';
import { Toast } from 'vant';
export default {
  data() {
    return {
      datas: [],
      keyword: '',
      loading: false,
      allLoaded: false,
      goload: true,
      isLoadMore: true,
      page: 1,
      total_page: 0,
      show: false,
      form: {
        type: '1',
        content_url: '',
        name: '',
        phone: '',
        goods_id: '',
        share_title: '',
        share_desc: '',
        share_img: ''
      },
      banner: '',
      imageUrl: '',
      id: '1',
      arr: {},
      link: [
        {
          text: '商城首页',
          id: '1'
        },
        {
          text: '商品分类',
          id: '2'
        },
        {
          text: '商品',
          id: '3'
        }
      ]
    };
  },
  activated() {
    window.scrollTo(0,0);
    this.initData();
    this.getData();
  },
  methods: {
    enterSearch(event) {
      if (event.keyCode === 13) {
        //如果按的是enter键
        event.preventDefault();
        this.Search();
      }
    },
    initData() {
      this.datas = [];
      this.keyword = '';
      this.loading = false;
      this.allLoaded = false;
      this.goload = true;
      this.isLoadMore = true;
      this.page = 1;
      this.total_page = 0;
      this.show = false;
      this.form = {
        type: '1',
        content_url: '',
        name: '',
        phone: '',
        goods_id: '',
        share_title: '',
        share_desc: '',
        share_img: ''
      };
      this.id = '1';
      this.arr = {};
    },
    toRecord() {
      this.$router.push(this.fun.getUrl('extendRecord'));
    },
    SearchMore() {
      this.isLoadMore = false; // 防止多次请求分页数据
      if (this.page >= this.total_page) {
        return;
      } else {
        this.page = this.page + 1;
        let json = {
          keyword: this.keyword,
          page: this.page
        };
        $http.get('plugin.promotion-assistant.api.goods.get-goods-list', json, '加载中').then(
          response => {
            this.isLoadMore = true;
            if (response.result === 1) {
              var myData = response.data.data;
              this.datas = this.datas.concat(myData); //数组拼接
            } else {
              this.page = this.page - 1;
              this.isLoadMore = false;
            }
          },
          function(response) {
            // error callback
          }
        );
      }
    },
    Search() {
      this.$nextTick(() => {
        document.getElementById('listWrap').scrollTop = '0px';
      });
      this.page = 1;
      let that = this;
      let json = {
        keyword: this.keyword,
        page: this.page
      };
      $http.get('plugin.promotion-assistant.api.goods.get-goods-list', json, ' ').then(
        response => {
          if (response.result === 1) {
            that.total_page = response.data.last_page;
            if (!that.total_page) {
              that.total_page = 0;
            }
            that.datas = response.data.data;
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    addconnect() {
      if (this.form.type == '1' || this.form.type == '2') {
        delete this.form.goods_id;
      }
      let that = this;
      $http.post('plugin.promotion-assistant.api.assistant.add', { data: this.form }, ' ').then(
        response => {
          if (response.result === 1) {
            that.$dialog.alert({message:response.msg});
            that.$router.push(that.fun.getUrl("popularAssistant",{id: response.data.id}));
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    getData() {
      let that = this;
      $http.get('plugin.promotion-assistant.api.assistant.get-setting', {}, ' ').then(
        response => {
          if (response.result === 1) {
            that.banner = response.data.banner;
            that.plugin_name = response.data.plugin_name;
            that.fun.setWXTitle(that.plugin_name);
          } else {
            Toast(response.msg);
          }
        },
        function(response) {
          console.log(response);
        }
      );
    },
    removeImg_1: function() {
      this.form.share_img = '';
    },
    /*vant图片上传*/
    onRead(e, flag) {
      let url = this.fun.getRealUrl('upload.uploadPic', {});
      Toast.loading({
        message: '上传中',
        forbidClick: true,
      });
      // if (flag !== true) {
      //   if (e.file.size > this.photosize) {
      //     this.imgPreview(e.file, 1);
      //     return false;
      //   }
      // }
      let fd = new FormData();
      if (flag === true) {
        fd.append('file', e);
      } else {
        fd.append('file', e.file); //第一个参数字符串可以填任意命名，第二个根据对象属性来找到file
      }
      var That = this;
      axios
        .post(url, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(response => {
          var responseData = response.data;

          if (responseData.result == 1) {
            Toast.clear();
            if (flag === true) {
              That.form.share_img = responseData.data.img_url;
            } else {
              That.form.share_img = responseData.data.img_url;
            }
          } else {
            Toast(responseData.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeId(item) {
      this.id = item.id;
      this.form.type = item.id;
    },
    closePop() {
      this.show = false;
      this.form.goods_id = this.arr.id;
      document.getElementById('listWrap').removeEventListener('scroll', function() {});
    },
    addGood() {
      this.show = true;
      let that = this;
      this.$nextTick(() => {
        let listWrap=document.getElementById('listWrap');
        listWrap.addEventListener('scroll', function() {
          if (listWrap.scrollHeight - listWrap.scrollTop === listWrap.clientHeight) {
            if (that.isLoadMore) {
              that.SearchMore();
            }
          }
        });
      });
      this.Search();
    },
    deleteGood() {
      this.arr = {};
    }
  },
  components: { cTitle }
};
