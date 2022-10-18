export const cpsApi = {
  data() {
    return {
      header: {},
      goodsData: [],
      isLoadMore: true,
      page: 1,

      goodsDetail: {},
      ratio_data: {},
    };
  },
  activated() {
  },
  methods: {
    getCPSLogin(flag) {
      this.page = 1;
      this.isLoadMore = true;
      this.goodsData = [];
      if(window.localStorage.getItem("CPSHeader")) {
        this.header = JSON.parse(window.localStorage.getItem("CPSHeader"));
        if((this.header.t + 60*7) > Math.round(new Date() / 1000)) {
          // CPSHeader缓存保留7分钟  过7分钟更换
          if(flag === 'list') {
            this.searchCPSGood();
          }else if(flag === 'good') {
            this.getGoodDetail();
          }else if(flag === 'link') {
            this.getCPSLink();
          }else {
            this.getCPSGood(0, this.datas.list[0].text);
          }
          return;
        }else {
          window.localStorage.removeItem("CPSHeader");
        }
      }
      $http.get("plugin.aggregation-cps.api.web.mergeLogin", {}, "加载中").then(
        response => {
          if (response.result === 1) {
            this.header = response.data.header;
            window.localStorage.setItem("CPSHeader", JSON.stringify(this.header));
            if(flag === 'list') {
              this.searchCPSGood();
            }else if(flag === 'good') {
              this.getGoodDetail();
            }else if(flag === 'link') {
              this.getCPSLink();
            }else {
              this.getCPSGood(0, this.datas.list[0].text);
            }
          } else {
            this.$dialog.alert({ message: response.msg });
          }
        });
    },
    getPDDLogin(index, platform, title, flag) {
      // platform 拼多多授权2   淘宝授权1
      $http.fetchUrl("https://v3.biyingniao.com/api/v3/user/is_union_oauth", {params: {platform: platform}, headers: this.header }, "加载中").then(response => {
        if (response.code === 0) {
          if(response.data.is_oauth) {
            if(index === 'list') {
              this.searchCPSGood();
            }else if(index === 'good') {
              this.getGoodDetail();
            }else {
              this.getCPSGood(index, title, flag);
            }
          }else {
            if(platform == 2) {
              window.location.href = response.data.oauth_url_info.url;
            }else {
              window.location.href = response.data.oauth_url.url;
            }

          }
        }else if(response.code === 30004) {
          this.getCPSLogin(index, platform, title, flag);
        }
      });
    },
    getCPSGood(index, title, flag) {
      // 装修组件使用
      if(!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false;
      if(flag !== 'more') {
        this.show_page = false;
        this.show_text = '加载中...';
      }
      let url = "https://v3.biyingniao.com/api/v3/goods/pdd/search";
      if(this.datas.list[index].is_minApp == 2) {
        url = "https://v3.biyingniao.com/api/v3/goods/jd/search";
      }else if(this.datas.list[index].is_minApp == 3) {
        url = "https://v3.biyingniao.com/api/v3/goods/tb/search";
      }
      $http.fetchUrl(url, {params: {keyword: this.datas.list[index].is_minApp == 1 ? title : title || '百货', page: this.page}, headers: this.header }, "加载中").then(
        response => {
          if (response.code === 0) {
            if(this.page === 1) {
              this.getRatio();
            }
            this.isLoadMore = response.data.has_next;
            if(flag !== 'more') {
              this.goodsData = response.data.data || [];
            }else {
              this.goodsData = this.goodsData.concat(response.data.data || []);
            }
            this.show_page = true;
          }else if(response.code === 30009 || response.code === 30007 || response.code === 10000){
            // 需要登录授权
            this.isLoadMore = true;
            if(this.datas.list[index].is_minApp == 1) {
              this.getPDDLogin(index, 2 , title, flag);
            }else if(this.datas.list[index].is_minApp == 3) {
              this.getPDDLogin(index, 1, title, flag);
            }
          }else if(response.code === 30004) {
            // 签名过期
            this.getCPSLogin(index);
          } else {
            this.isLoadMore = true;
            this.show_page = false;
            this.show_text = '数据报错';
            this.$dialog.alert({ message: response.message });
          }
        });
    },
    searchCPSGood() {
      // 搜索页使用
      if(!this.isLoadMore) {
        return;
      }
      this.isLoadMore = false;
      let url = "https://v3.biyingniao.com/api/v3/goods/pdd/search";
      if(this.searchActive === 'jd') {
        url = "https://v3.biyingniao.com/api/v3/goods/jd/search";
      }else if(this.searchActive === 'tb') {
        url = "https://v3.biyingniao.com/api/v3/goods/tb/search";
      }

      let json = {keyword: this.searchActive === 'pdd' ? this.searchKey : this.searchKey || '百货', page: this.page};

      // !this.searchKey 特色物料
      if(!this.searchKey && this.channel_type) {
        json = {channel_type: this.channel_type, page: this.page};
        url = "https://v3.biyingniao.com/api/v3/goods/pdd/recommend";
        if(this.searchActive === 'jd') {
          url = "https://v3.biyingniao.com/api/v3/goods/jd/jf";
        }
      }
      if(this.searchActive === 'tb' && !this.searchKey && this.material_id) {
        url = "https://v3.biyingniao.com/api/v3/goods/tb/matter";
        json = {material_id: this.material_id, page: this.page};
      }

      if(this.searchKey) {
        this.channel_type_name = "搜索";
      }else if(this.$route.query.channel_type_name) {
        this.channel_type_name = `${this.$route.query.channel_type_name}${this.searchActive === 'jd' ? '-京东': this.searchActive === 'tb' ? '-淘宝' : '-拼多多'}` || "商品列表";
      }
      this.fun.setWXTitle(this.channel_type_name);
      this.fun.wxShare(
        "",
        {},
        {
          title: this.channel_type_name
        }
      );

      $http.fetchUrl(url, {params: json, headers: this.header }, "加载中").then(
        response => {
          if (response.code === 0) {
            if(this.page === 1) {
              this.getRatio();
            }
            this.page += 1;
            this.isLoadMore = response.data.has_next;
            this.goodsData = this.goodsData.concat(response.data.data || []);
          }else if(response.code === 30009 || response.code === 30007  || response.code === 10000){
            // 需要登录授权
            this.isLoadMore = true;
            if(this.searchActive === 'pdd') {
              this.getPDDLogin('list', 2);
            }else if(this.searchActive === 'jd') {
              this.getCPSLogin('list');
            }else if(this.searchActive === 'tb') {
              this.getPDDLogin('list', 1);
            }
          }else if(response.code === 30004) {
            // 签名过期
            this.getCPSLogin('list');
          } else {
            this.isLoadMore = true;
            this.$dialog.alert({ message: response.message });
          }
        });
    },
    getGoodDetail() {
      // 商品详情页使用
      $http.fetchUrl("https://v3.biyingniao.com/api/v3/goods/detail", {params: {
        item_id: this.good.item_id,
        platform_id: this.good.platform_id,
        activity_id: this.good.activity_id
      }, headers: this.header }, "加载中").then(
        response => {
          if (response.code === 0) {
            this.goodsDetail = response.data || {};
            this.fun.wxShare(
              "",
              { mid: this.fun.getKeyByMid() },
              {
                title: this.goodsDetail.title,
                imgUrl: this.goodsDetail.cover_image,
                description: this.goodsDetail.title
              }
            );
            this.getRatio();
          }else if(response.code === 30009 || response.code === 30007 || response.code === 10000){
            // 需要登录授权
            if(response.code === 30007) {
              this.getCPSLogin('good');
            }else {
              this.getPDDLogin('good', this.good.platform_id);
            }
          }else if(response.code === 30004) {
            // 签名过期
            this.getCPSLogin('good');
          } else {
            this.$dialog.alert({ message: response.message });
          }
        });
    },
    getCPSLink() {
      // 推广取链
      $http.fetchUrl("https://v3.biyingniao.com/api/v3/popularize/cps", {params: {
        id: this.id,
        phone: this.phone,
      }, headers: this.header }, "加载中").then(
        response => {
          if (response.code === 0) {
            window.location.href = response.data.click_url;
          } else {
            this.$dialog.alert({ message: response.message });
          }
        });
    },
    getRatio() {
      if(this.ratio_data && this.ratio_data.ratio) {
        return;
      }
      // discount_price*tk_rate/100*0.78 * 0.97*ratio/100
      $http.get("plugin.aggregation-cps.api.setting.index").then((response) => {
        if (response.result == 1) {
          this.ratio_data = response.data;
          this.ratioCommissionAmount = (this.goodsDetail.discount_price * (this.goodsDetail.tk_rate/100) * 0.78 * 0.97 * (this.ratio_data.ratio/100)).toFixed(2);
          this.shareCommissionAmount = (this.goodsDetail.discount_price * (this.goodsDetail.tk_rate/100) * 0.78 * 0.97 * (this.ratio_data.agent_ratio/100)).toFixed(2);
        }
      });
    },
  }
};
