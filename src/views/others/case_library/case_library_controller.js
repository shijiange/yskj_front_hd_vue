import caseLibraryMobile from "./components/case_library_mobile";
import caseLibraryPC from "./components/case_library_pc";

export default {
  data() {
    return {
      showPC: 0,
      
    };
  },
  mounted() {
  },
  activated() {
    window.scrollTo(0, 0);
    if(!this.$store.state.caseLibrary) {
      this.getDatas();
    }
    let self = this;
    self.showPC = false;
    if (!document.getElementById('tinymceJs')) {
      //避免多次引入
      const script = document.createElement('script');
      script.type = 'text/javascript';
      if (window.location.host.indexOf('localhost') > -1) {
        script.src = this.fun.getSiteRoot() + '/static/app/tinymce4.7.5/tinymce.min.js';
      } else {
        script.src = this.fun.getSiteRoot() + '/addons/yun_shop/static/app/tinymce4.7.5/tinymce.min.js';
      }
      script.id = 'tinymceJs';
      document.body.appendChild(script);
      script.onload = script.onreadystatechange = function() {
        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
          console.log('js onload');
          self.showPC = true;
        }
        script.onload = script.onreadystatechange = null; //删除事件处理函数。
      };
    } else {
      self.showPC = true;
    }
    window.addEventListener('beforeunload', e => {
      window.onbeforeunload =null;
    });
  },
  methods: {
    getDatas() {
      let that = this;
      $http.post('plugin.case-library.api.case.get-set', {}, '').then(
        response => {
          if (response.result === 1) {
            that.$store.commit('setCaseLibrary', response.data);
          } else {
            that.$dialog.alert({message:response.msg});
            
          }
        },
        function(response) {
          that.$dialog.alert({message:response.msg});
         
        }
      );
    }
  },
  computed: {},
  components: {
    caseLibraryMobile,
    caseLibraryPC
  },
};
