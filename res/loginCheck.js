
       var domain="console.jisupeixun.com";//比对的域名 ，如果是ip不需要加端口号

        this.checkhHtml5 = function () {
            if (typeof (Worker) !== "undefined") { return true; } else { return false; }
            //        if (document.getElementById("Canvas_Tea").getContext && typeof (Worker) !== "undefined") { return true; } else { return false; }
        }

        var h5 = checkhHtml5();
        if (!h5) {
            $("body").append("<div id=\'ErrShow\' class=\'Init\'>  <div style=\' text-align:center; margin:50px auto;padding:10px;\'>    <div class=\'liveerr-ico\' style=\' background:url(/images/live_ico.png) no-repeat scroll 0 -190px; margin-bottom:20px;\'>    </div>    <p style=\'font-size:2em;\' id=\'errtxt\'>前辈,是时候让这款浏览器退隐了，换个新的尝尝鲜吧！<br />要求:IE9及以上浏览器，或使用<a href='https://www.baidu.com/s?wd=Firefox'>Firefox</a>,<a href='https://www.baidu.com/s?wd=Chrome'>Chrome</a>或<a href='https://www.baidu.com/s?wd=safari'>Safari</a>,国产浏览器请切换至极速模式！</p>  </div></div>");
        }
        //手机判断
        var browser = {
            versions: function () {
                var u = navigator.userAgent, app = navigator.appVersion;
                return {         //移动终端浏览器版本信息
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    wp: u.indexOf('IEMobile') > -1, //是否wp
                    symbianos: !!u.match(/SymbianOS.*/), //是否SymbianOS
                    webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                };
            } (),
            language: (navigator.browserLanguage || navigator.language).toLowerCase()
        }
        function fullwin() {
            //不允许iframe嵌入 
            if (window.top !== window.self) { window.top.location = window.location; }

            if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {
                if (window.location.pathname.indexOf("/app") <0 )
                window.top.location.href = "/app/login.html";
//                return false;
//                if (browser.versions.ios) {
//                    if (browser.versions.iPhone) {
//                        document.writeln("您好，尊敬的iPhone用户！");
//                    }
//                    else if (browser.versions.iPad) {
//                        document.writeln("您好，尊敬的iPad用户！");
//                    }
//                    else {
//                        document.writeln("您好，发现未知IOS系统用户");
//                    }
//                }
//                else if (browser.versions.android) {
//                    document.writeln("您好，尊敬的Android用户！软件正在下载，请手动关闭此页面。");
//                }
//                else if (browser.versions.symbianos) {
//                    document.writeln("您好，尊敬的SymbianOS用户！");
//                }
//                else if (browser.versions.wp) {
//                    document.writeln("您好，尊敬的Windows Phone用户！");
//                }
//                else {
//                    document.writeln("抱歉，软件暂时不支持您的系统！");
//                }
            } else {
                if (window.location.pathname.indexOf("/app") >= 0)
                window.top.location.href = "/login.html";
                
            }
        }
        //域名查询，跳转
        function goDomainName() {
             var domainName=window.location.hostname;//获取域名

             //自己的
             if(domainName==domain){
                //放过
             //企业的二级域名
             }else{
                var user=localStorage.getItem("userinfo");
                //如果缓存为空，跳转login
                if(user==undefined||user==null||user==""){
                    window.top.location.href = "/orgInfoLogin.html";
                }
             }
             
        }
        //查询方法
         function getAjax(url, parm, callBack, callBackError, callBackType, mode) {    
            if (callBackType == null || callBackType == "" || callBackType == undefined)
                callBackType = "json";
            if (mode == null || mode == "" || mode == undefined)
                mode = "get";
            //$.showIndicator(); //loading
          try{
              $.ajax({
                  type: mode,
                  beforeSend: function (xhr) {
        //              token = strToJson(GetlocalStorage("userinfo_token"),token);
        //              xhr.setRequestHeader("X-Session-Token",token);
                  },
                  headers: {
                      "Accept": "text/plain; charset=utf-8",
                      "Content-Type": "text/plain; charset=utf-8",
                  },
                  async:false,
                  url: url,
                  data: parm,
                  dataType: callBackType,
                  cache: false,
                  success: function (msg, status, xhr) {              
                      callBack(msg);
                  },
                  error: function (err) {
                      if(callBackError != undefined && callBackError != null && callBackError != "")
                      callBackError(err);
                      console.error("服务器访问异常：" + err.readyState);
                  }
              });

          }
          catch(error) {
            alert("请求错误,跨域权限异常！");
          }
        }
        //goDomainName();//解析域名
        //fullwin();//判断是否手机端
        
