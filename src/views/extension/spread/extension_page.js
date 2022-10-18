import cTitle from 'components/title';
// import { error } from 'util';
// import decode from '../../../utils/base64_decode';
export default {
  components: { cTitle },

  activated() {

    this.init();
    this.getBuyData();
    this.getMemberData();

    this.getTitle();
  },
  data() {
    return {
      tabOption: [
        "关注会员",
        "加盟店"
      ],

      currentIndex: 0,
      allMemberShow: true,

      buyMemberShow: false,

      buyList: [],

      allMember: [],

      title: "",

      //allMember more
      m_loading: false,
      m_allLoaded: false,
      m_goload: true,
      m_isLoadMore: true,
      m_page: 1,
      m_total_page: 0,

      //buyList more
      b_loading: false,
      b_allLoaded: false,
      b_goload: true,
      b_isLoadMore: true,
      b_page: 1,
      b_total_page: 0,

      //menber总数
      m_total:0,

      b_total:0


            
    };
  },
  methods: {
    awardEvent(response) {
      if (response == 1) {
        this.$router.push(this.fun.getUrl("AwardRanking"));
      } else if (response == 2) {
        this.$router.push(this.fun.getUrl("RecordOfAwards"));
      }
    },

    // toggle(index) {
    //     this.currentIndex = index;

    //     switch (this.currentIndex) {
    //         case 0:
    //             this.allMemberShow = true;
    //             this.buyMemberShow = false;
    //             break;
    //         case 1:
    //             this.allMemberShow = false;
    //             this.buyMemberShow = true;
    //             break;
    //         default:
    //             break;
    //     }
    // },

    tabChoose(tag){
      if(tag == 1){
        this.allMemberShow=true;
        this.buyMemberShow=false;
      }else if(tag == 2){
        this.allMemberShow=false;
        this.buyMemberShow=true;
      }else{
        return;
      }
    },

    init() {
      this.buyList = [];

      this.allMember = [];

      this.allMemberShow = true;

      this.buyMemberShow = false;

      this.currentIndex = 0;

      this.initData("member");
            
      this.initData("buy");
                   
    },


    getBuyData() {
      $http.get("plugin.member-return.frontend.ranking.index", { page: this.b_page }, "...").then(response => {
        if (response.result == 1) {
          this.buyList = response.data.data;

          this.buyList.forEach(e => {
            let sum = "";
            for (let i = 0; i < e.star; i++) {
              sum += "<i class='iconfont icon-extension-stars icon-custom-undefined' style='font-size: 1.25rem; color: rgb(241, 83, 83);'></i>";
            }

            e.star_count = sum;
          });
                    
          this.b_total_page=response.data.lastPage;


          this.b_total=response.data.total;

        }
      }).catch(error => {
        console.log(error);
      });
    },


    getMemberData() {
      $http.get("plugin.member-return.frontend.follow.index", { page: this.m_page }).then(response => {
        if (response.result == 1) {
          this.allMember = response.data.data;

          this.allMember.forEach(e => {

            if (this.fun.isTextEmpty(e.has_one_queue)) {
              e.star_count = "";
            } else {
              let sum = "";
              for (let i = 0; i < e.has_one_queue.star; i++) {
                sum += "<i class='iconfont icon-extension-stars icon-custom-undefined' style='font-size: 1.25rem; color: rgb(241, 83, 83);'></i>";
              }
              e.star_count = sum;

            }
          });

          this.m_total_page=response.data.lastPage;

          this.m_total=response.data.total;
                    
        }
      }).catch(error => {
        console.log(error);
      });
    },


    getMoreData(tag, page) {
      if (tag == "member") {
        if (this.m_page == this.m_total_page) {
          return;
        }

        if (this.m_page >= this.m_total_page) {
          this.m_loading = true;
          this.m_allLoaded = true;
          return;
        } else {
          this.m_page = this.m_page + 1;

          $http.get("plugin.member-return.frontend.follow.index", { page: this.m_page }, '加载中...').then(response => {
            if (response.result == 1) {
              this.m_loading = false;
              this.m_allLoaded = false;
              this.allMember = this.allMember.concat(response.data.data);
              this.allMember.forEach(e => {
                if (this.fun.isTextEmpty(e.has_one_queue)) {
                  e.star_count = "";
                } else {
                  let m_sum = "";
                  for (let i = 0; i < e.has_one_queue.star; i++) {
                    m_sum += "<i class='iconfont icon-extension-stars icon-custom-undefined' style='font-size: 1.25rem; color: rgb(241, 83, 83);'></i>";
                  }
                  e.star_count = m_sum;
                }
              });
            } else {
              this.m_page = this.m_page - 1;
              this.m_loading = true;
              this.m_allLoaded = true;
              this.m_isLoadMore = false;
              return;
            }
          }).catch(error => {
            console.log(error);
          });
        }


      } else if (tag == "buy") {
        if (this.b_page == this.b_total_page) {
          return;
        }

        if (this.b_page >= this.b_total_page) {
          this.b_loading = true;
          this.b_allLoaded = true;
          return;
        } else {
          this.b_page = this.b_page + 1;

          $http.get("plugin.member-return.frontend.ranking.index", { page: this.b_page }, '加载中...').then(response => {
            if (response.result == 1) {
              this.b_loading = false;
              this.b_allLoaded = false;
              this.buyList = this.buyList.concat(response.data.data);
              this.buyList.forEach(e => {
                if (this.fun.isTextEmpty(e.star)) {
                  e.star_count = "";
                } else {
                  let b_sum = "";
                  for (let i = 0; i < e.star; i++) {
                    b_sum += "<i class='iconfont icon-extension-stars icon-custom-undefined' style='font-size: 1.25rem; color: rgb(241, 83, 83);'></i>";
                  }
                  e.star_count = b_sum;
                }
              });
            } else {
              this.b_page = this.b_page - 1;
              this.b_loading = true;
              this.b_allLoaded = true;
              this.b_isLoadMore = false;
              return;
            }
          }).catch(error => {
            console.log(error);
          });
        }
      }
    },


    loadTop1(){
      this.initData("member");
      this.getMemberData();
      this.$refs.member_loadmore.onTopLoaded();
    },

    loadTop2(){
      this.initData("buy");
      this.getBuyData();
      this.$refs.buy_loadmore.onTopLoaded();
    },

       
    loadBottom1(){
      if (this.m_isLoadMore) {
        this.getMoreData("member",this.m_page);
        this.$refs.member_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }

    },

    loadBottom2(){
      if (this.b_isLoadMore) {
        this.getMoreData("buy",this.b_page);
        this.$refs.buy_loadmore.onBottomLoaded();
      } else {
        console.log('没有更多数据');
      }
    },

    initData(tag){
      if(tag =="member"){

        this.m_loading=false;
        this.m_allLoaded=false;
        this.m_goload=true;
        this.m_isLoadMore=true;
        this.m_page=1;
        this.m_total_page=0;
        this.allMember=[];

      }else if(tag =="buy"){

        this.b_loading=false;
        this.b_allLoaded=false;
        this.b_goload=true;
        this.b_isLoadMore=true;
        this.b_page=1;
        this.b_total_page=0;
        this.buyList=[];
      }
    },



    getTitle(){
      $http.get("plugin.member-return.frontend.set.get-name",{}).then(response =>{
        if(response.result == 1){
          console.log(response);
          this.title=response.data.p_name;
        }
      }).catch(error =>{
        console.log(error);
      });
    },


    b64Decode(input){
      var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }
      }
      output = this.utf8_decode(output);
      return output;
    
    },


    utf8_decode (utftext) { 
      var string = "";
      var i = 0;
      //var c = c1 = c2 = 0;
      var c,c2,c3;

      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        } else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        } else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      }
      return string;
    }






       















  },

  computed:{
       
  },

  filters:{
    b64Name(value){
      return this.base64decode(value);
    }
  }
};