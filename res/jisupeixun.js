
//*************************************************
//全局界面切换监听
//*************************************************

var javaserver = "http://api.jisupeixun.com";//"http://180.76.156.234:9187";
//var javaserver = "http://192.168.1.148:8080";
var javafile = "http://file.jisupeixun.com";//文件上传接口
var systemTitle="极速培训";
var domain="http://console.jisupeixun.com"; // 题目练习地址

var sysUserInfo={};
var allorgid="";
var allgroupid="";
var allroleid="";
var allorgname="";
var allgroupname="";
var allrolename="";
var playerHeight = 200;

// 生成uuid
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
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

try{$.noConflict();}catch(e){}
$(document).on("pageInit", function(e, id, $page) {
  //abc();
  try{
    bPlayer.close();  //此处主要是为了防止视频还在后台播放，所以此处加上关闭
    //GetConnectionType();
  }catch(e){ }
    //企业微信隐藏header属性
    if(isWeiXin()){
        $("header").remove();
        $("#exitLogin").remove();
        $("#lable_color").remove();
        $(".bar-header-secondary").css("top","0px !important");
        $(".pull-to-refresh-content").css("top","0px !important");
        $("#kechengContent").css("top","0px !important");
        $("#courseContent").css("top","2.2rem !important");
        $(".xiaoxi").hide();
        $(".yejianmoshi").hide();

    }else{
         $("#wxAdd").remove();
         $("#closeFileupload").remove();
        var userInfo=strToJson(GetlocalStorage("userinfo"));
        if(!isNull(userInfo)){
            document.title = userInfo.organization_Name;
            systemTitle =  userInfo.organization_Name;
        }else{
            $("title").html("极速培训");
        }
    }
    var myhash = window.location.hash; //获得#后的内容
     if(myhash!=""&&myhash!="login"&&myhash!=null){
          stuInfo();
     }
    //退出登录  exitLogin
    $(document).on('click','#exitLogin', function () {
       localStorage.setItem("userinfo", "");
       localStorage.setItem("userinfo_token", "");
       window.location.href ="../login.html";
    });
   //刷新后在资料
   if(myhash =="#ziliao"){
        $(".title").html("资料");
        $(".tab-item").removeClass("active");
        $(myhash+"_m").addClass("active");
        ziliaoinit();

        setTimeout(function(){ if(browser.versions.ios){
            jQuery(".ios-is-show").show();
            jQuery("#zhiliaoadd").hide();
        }else{
            jQuery("#zhiliaoadd").show();
            jQuery(".ios-is-show").hide();
        }},100);
   }
   //刷新后在任务
  else if(myhash =="#renwu"  || id == "renwu"){
        $(".tab-item").removeClass("active");
        $("#xuexi_m").addClass("active");
        $("title").html("任务");
        renwuinit();
   }
   //刷新后在个人
   else if(myhash =="#stuInfo"  || id == "stuInfo"){
        $(".title").html("个人中心");
   //刷新后在公开课
   }else if(myhash == "#course" || id == "course"){
        $(".title").html("公开课");
        getPublicCourse(true);
        $("#xuexi_m").addClass("active");
    //刷新后在首页
   }else if(myhash == "#xuexi" || id == "xuexi"){
        $("title").html("首页");
        $("#xuexi_m").addClass("active");
   }
 });

//****************************************************/

$("#renwu_m").click(function(){
    $("title").html("任务");
});
$("#xuexi_m").click(function(){
    $("title").html("首页");
});
$("#ziliao_m").click(function(){
    $("title").html("资料");
});
$("#ziliao_m2").click(function(){
    $("#ziliao_m").click();
});
$("#stuInfo_m").click(function(){
    $("title").html("个人中心");
});
$("#manage_m").click(function(){
    $("title").html("管理");
});


$("#course_m").click(function(){
    $("title").html("公开课");
    $("#publicCourseName").val("");
    goPublicCourse();
});
$("#course_make").click(function(){
    $(".title").html("课件录制");
    //window.location.href = "../ckt/ckt.html?callback=http://api.jisupeixun.com/Kapi/AddEditURLCollection&type=0&key="+guid()+"&fid=0&fpath=/&upOrgId="+getUserInfo().organization_ID+"&upUserId="+getUserInfo().user_ID+"&upUserName="+getUserInfo().user_Name+"#/index";
    api.openWin({
        name: 'coursemake',
        animation:{
            type:"flip",                //动画类型（详见动画类型常量）
            subType:"from_right",       //动画子类型（详见动画子类型常量）
            duration:300                //动画过渡时间，默认300毫秒
        },
        url: "../ckt/ckt.html?callback=http://api.jisupeixun.com/Kapi/AddEditURLCollection&type=0&key="+guid()+"&fid=0&fpath=/&upOrgId="+getUserInfo().organization_ID+"&uid="+getUserInfo().user_ID+"&upUserName="+getUserInfo().user_Name+"#/index",
        pageParam: {
            name: '课程录制'
        }
    });
});

//判断是否是企业微信
function isWeiXin(){
    var resource=GetlocalStorage("resource");
    if(resource&&(resource==2||resource=="2")){
        return true;
    }else{
        return false;
    }
}
//绑定基本信息
function stuInfo(){
    var userInfo=getUserInfo();
    //男
    if(userInfo.user_Sex!=undefined&&userInfo.user_Sex==1){
        $("#usersex").html("<i class='iconfont icon-unie71c' style='color: #39f'></i>");
    //女
    }else if(userInfo.user_Sex!=undefined&&userInfo.user_Sex==0){
        $("#usersex").html("<i class='iconfont icon-unie71a' style='color: #fe5d81'></i>");
    }
     $("#userimg").attr("src",userInfo.user_Img);
     $("#uname").html(userInfo.username);
     $("#orgname").html(userInfo.organization_Name);
     $("#userno").html("编号："+userInfo.user_No);
     getTotleInfo(userInfo);
}
//请求用户的总信息
function getTotleInfo(userinfo){
     getAjax(javaserver + "/exampaper/stuTotleInfo", { orgid: userinfo.organization_ID, userid: userinfo.user_ID,org_Id:userinfo.allorgid,role_Id:userinfo.allroleid,user_groupId:userinfo.allgroupid }, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0 && data.data != null) {
               $("#totleStudyTime").html(data.data.totleStudyTime.toFixed(2));
                $("#totleStudyCourse").html(data.data.totleStudyCourse);
                $("#totleExam").html(data.data.totleExam);
            }
        });

}
 // 格式话时间
    Date.prototype.format = function(fmt) {
         var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
         for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
             }
         }
        return fmt;
    }
//监听浏览器返回  修改title
//后退事件
$(window).on('popstate', function () {
    try{
      bPlayer.stop();
      bPlayer.hide();
      bPlayer.close();
      bPlayer.hide();
    }catch(e){}
    var myhash = window.location.hash; //获得#后的内容
     if(isWeiXin()){
           if(myhash =="#ziliao"||myhash=="ziliao"){
                $("title").html("资料");
           }else if(myhash =="#renwu"  || myhash == "renwu"){
                $("title").html("任务");
           }else if(myhash =="#stuInfo"  || myhash == "stuInfo"){
                $("title").html("个人中心");
           }else if(myhash == "#course" || myhash == "course"){
                $("title").html("公开课");
           }else if(myhash == "#xuexi" || myhash == "xuexi"){
                $("title").html("首页");
           }else if(myhash == "#history" || myhash == "history"){
                $("title").html("历史考试");
           }else if(myhash == "#collection" || myhash == "collection"){
                $("title").html("课程收藏");
           }
     }else if(myhash =="#ziliao"||myhash=="ziliao"){
        $("#ziliao_yulan").find("video").remove();
        try{
          bPlayer.close();
        }catch(e){}
     }
});
//**********************************************************************
//登录界面
//**********************************************************************
$(document).on("pageInit", "#login", function (e, id, $page) {
    sysUserInfo=strToJson(GetlocalStorage("userinfo"));
    var t=GetlocalStorage("userinfo_token");
    var token = strToJson(GetlocalStorage("userinfo_token"));
    if(sysUserInfo!=null&&sysUserInfo!=""&&sysUserInfo!=undefined&&token!=null&&token!=""&&token!=undefined){
         //登录(*防止学员用户已更换组织架构，缓存数据不对)
        //login(sysUserInfo.user_Account,sysUserInfo.user_Pwd);
        getParam();
        $("#username").val(sysUserInfo.user_Account);
        $("#userpwd").val(sysUserInfo.user_Pwd);
        document.title = sysUserInfo.organization_Name;
        if(sysUserInfo.powerLV == "99"){  //学员身份隐藏管理功能
            $("#manage_m").hide();
        }
        //window.location.href = "html/home.html#xuexi";
        GetADBanerAndStartImg();
    }
    //登录按钮
    $(document).on('click', '#login_btn', function () {
        var useraccount = $("#username").val();
        var userpwd = $("#userpwd").val();
        //登录
        login(useraccount,userpwd);
    });
    var isPlayer = false;
     function login(username,pwd){
        localStorage.setItem("resource", "0");
        if(isPlayer)
          return;
        isPlayer = true;
        error_login('登录中','#0894ec');
        getAjax(javaserver + "/ApiUser/login",{ useraccount: username, userpwd: pwd },function (users) {
            isPlayer = false;
            users = strToJson(users);
            //用户登录错误次数 >5 <10 显示验证码 ，>10 锁定帐号
            // errorcode  0登录成功 11账号被锁定1小时 12账户或密码有错误 13该用户已经登录 5连接不上数据库 14验证码错误
            //                    console.log(users.name);
            if (users.errorcode == "11") {
                error_login("账号被锁定1小时");
                //$.alert("账号被锁定1小时！");
            } else if (users.errorcode == "13") {
                error_login("该用户已经登录");
                //$.alert("该用户已经登录！");
            } else if (users.errorcode == "5") {
                error_login("连接不上数据库");
               // $.alert("连接不上数据库！");
            } else if (users.errorcode == "14") {
                error_login("验证码错误");
                //$.alert("验证码错误！");
            } else if (users.errorcode == "6") {
                 error_login("系统错误");
                //$.alert("系统错误！");
            } else if (users.errorcode == "28") {
                error_login(users.errormsg)
                //$.alert(users.errormsg);
            } else if (users.errorcode == "12") {
                if (users.errnum <= 1) {
                    //验证帐号是否存在、
                    getAjax(javaserver + "/ApiUser/isAccount", { useraccount: username }, function (retData) {
                        if (retData.errorcode == "4") {
                             error_login("帐号不存在，请重新输入");
                        } else {
                             error_login("账号或密码错误, 请重新输入");
                        }
                    });
                } else {
                    error_login("账号或密码错误, 请重新输入");
                }
            } else if (users.errorcode == "0") {
                error_login('登录完成','#0894ec');
                SetlocalStorage("userinfo_token", users.token);
                if (users.data.userstate == "0") {
                    getAjax(javaserver + "/PersonnelManagement/PersonnelGetKey", { user_ID: users.data.userId }, function (retobj) {
                        retobj = strToJson(retobj);
                        if (retobj.errorcode == 0) {
                            retobj.data.userId = retobj.data.user_ID;
                            retobj.data.username = retobj.data.user_Name;
                            if (retobj.data.user_Img == "" || retobj.data.user_Img == null || retobj.data.user_Img == undefined) {
                                retobj.data.user_Img = "res/img/avatar.png";
                            }
                            sysUserInfo = retobj.data;
                        }
                        getParam();
                        //id
                        retobj.data.allorgid = allorgid;
                        retobj.data.allgroupid = allgroupid;
                        retobj.data.allroleid = allroleid;
                        //名称
                        retobj.data.allorgname = allorgname;
                        retobj.data.allgroupname = allgroupname;
                        retobj.data.allrolename = allrolename;
                        //放入缓存
                        SetlocalStorage("userinfo", JSON.stringify(retobj.data));
                        SetlocalStorage("UserEnterpriseOrgID", sysUserInfo.organization_ID);  //主要用户读取广告的时候用到企业id
                        document.title = sysUserInfo.organization_Name;
                        window.location.href = "html/home.html";
                    });
                } else if (users.data.userstate == "1") {
                     error_login("帐号已冻结");
                } else if (users.data.userstate == "2") {
                    error_login("账号已锁定");
                }
            }
        });
        }
});

//系统扫一扫功能，扫码
function saoyisao(){
  var FNScanner = api.require('FNScanner');
   FNScanner.openScanner({
       autorotation: true
   }, function(ret, err) {
       if (ret) {
          var FNobj = strToJson(ret);
          if(FNobj.eventType == "cameraError"){
            $.toast("访问摄像头失败");
            FNScanner.closeView();
          }else if(FNobj.eventType == "albumError"){
            $.toast("访问相册失败");
            FNScanner.closeView();
          }else if(FNobj.eventType == "fail"){
            $.toast("扫码失败,请重试！");
            FNScanner.closeView();
          }else if(FNobj.eventType == "success"){
            var hrefUrl = FNobj.content;
            api.openFrame({
                name: 'ComonFrame',
                slidBackEnabled:true,
                vScrollBarEnabled:true,
                animation:{
                    type:"push",                //动画类型（详见动画类型常量）
                    subType:"from_right",       //动画子类型（详见动画子类型常量）
                    duration:300                //动画过渡时间，默认300毫秒
                },
                progress:{
                  type:"page",                //加载进度效果类型，默认值为 default，取值范围为 default|page，default 等同于 showProgress 参数效果；为 page 时，进度效果为仿浏览器类型，固定在页面的顶部
                  title:"",               //type 为 default 时显示的加载框标题
                  text:"正在加载",
                  color:"#39f"                //type 为 page 时进度条的颜色，默认值为 #45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
                },
                url: '../html/manager/CommonHtml.html',
                pageParam: {
                    name: '扫码结果',
                    resultUrl:hrefUrl
                }
            });
          }
       } else {
       }
   });
}
function nofunction(){
    $.toast('暂未开放！');
}
//**********************************************************************
//首页的加载
//**********************************************************************

$(document).on("pageInit", "#xuexi", function (e, id, $page,window) {
  try{
    bPlayer.close();
  }catch(e){}
  $("#homeAdArr").html(GetlocalStorage("HomeAddStr"));
  try{
  var swiper = new Swiper('.swiper-container', {
      pagination: {
        el: '.swiper-pagination',
      },
      paginationClickable: true,
      speed: 1000,
      loop: true,
      observeParents:true,
      autoplayDisableOnInteraction : false,
      autoplay:true
  });}catch(e){}
    sysUserInfo=getUserInfo();
    if(sysUserInfo.powerLV == "99"){  //学员身份隐藏管理功能
        $("#manage_m").hide();
    }
    //请求过期任务提醒
    getAjax(javaserver + "/exampaper/getSevenArrange",
                   { orgid: sysUserInfo.organization_ID,
                   userid: sysUserInfo.user_ID,
                   org_Id:sysUserInfo.allorgid,
                   role_Id:sysUserInfo.allroleid,
                   user_groupId:sysUserInfo.allgroupid }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                var d1=new Date(data.datas[i].endDate).getDay();
                                //任务
                                if(data.datas[i].messageType==1)
                                block+="<li><a href='#renwu'><div><img  src='"+data.datas[i].arrange.img+"' onerror='javascript:this.src=\"../images/train/fengmian098.png\"' height=70  /><span class='tishi fjinji'>星期"+ "日一二三四五六".charAt(d1)+"过期</span><span class='ckm'>"+data.datas[i].typeName+"<br /></span><span class='ckjz'>截止日期"+data.datas[i].endDate+"</span></div></a></li>";
                                //线下  课程
                                else
//                                block+="<li><a href='#renwu' class='item-link item-content'><div class='item-media'>星期" + "日一二三四五六".charAt(d1)+"</div><div class='item-inner'><div class='item-title-row'><div class='item-title'>线下地址："+data.datas[i].typeName+"</div></div><div class='item-text'>线下结束时间："+data.datas[i].endDate+"</div></div></a></li>";
                                block+="<li><div onClick='openKe_collection(" + JSON.stringify(data.datas[i].courseId) + ")'> <img  src='"+data.datas[i].courseInfo.course_img+"' onerror='javascript:this.src=\"/images/train/fengmian000.gif\"' height=70  /><span class='tishi jinji'>星期"+ "日一二三四五六".charAt(d1)+"过期</span><span class='ckm'>"+data.datas[i].typeName+"<br /></span><span class='ckjz'>截止日期"+data.datas[i].endDate+"</span></div></li>";
                           }
                                if(block!=""){
                                        $(".lishi").show();
                                        $("#tixingTask").html(block);
                                 }else{
                                        $("#tixingTask").html("<center style='   margin-left: -15px;'><img src='../res/img/knownull.png'><br/>暂无数据</center>");
                                 }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
   //请求最近学习的前三个课程记录
   getAjax(javaserver + "/exampaper/studyCourseTopThree",{userid: sysUserInfo.user_ID }, function (data) {
        data = strToJson(data);
        if (data.errorcode == 0 ) {
            var block="";
           for(var i=0;i<data.datas.length;i++){
                block+="<div class='lishi_div' onClick='openKe_collection(" + JSON.stringify(data.datas[i].courseId)+","+null+","+ JSON.stringify(data.datas[i].arrangeId)+ ")'><div class='shuqian-down'>";
                //已完成
                if(data.datas[i].learningProgress=="100.00%"){
                    block+="<span class='shuqian  end' ></span><span class='shuqiantext'>已完成</span>";
                //未开始
                }else if(data.datas[i].learningProgress=="00.00%"){
                    block+="<span class='shuqian  start' ></span><span class='shuqiantext'>未开始</span>";
                //进行中
                }else{
                    block+="<span class='shuqian  ing' ></span><span class='shuqiantext'>进行中</span>";
                }
                if(data.datas[i].courseImg.indexOf("/images/train") >= 0){
                block+="</div><img  src='.."+data.datas[i].courseImg+"' height=124  width=220 /><span class='cstitle'>"+data.datas[i].courseName+"（"+(data.datas[i].arrangeId&&data.datas[i].arrangeId==1?'公开课':'任务')+"）</span></div>";
              }else {
                {
                  block+="</div><img  src='"+data.datas[i].courseImg+"' height=124  width=220 /><span class='cstitle'>"+data.datas[i].courseName+"（"+(data.datas[i].arrangeId&&data.datas[i].arrangeId==1?'公开课':'任务')+"）</span></div>";
                }
              }
           }
                if(block!=""){
                        $(".lishi").show();
                        $("#historyStudy").html(block);
                 }else{
                        $(".lishi").hide();
                 }
        }  else {
            $.toast('请求错误！');
        }
   });
});

//登录错误显示
function error_login(msg,color){
    $("#login_btn").html(msg);
    //$("#login_btn").css("background-color",color?color:"rgb(241, 104, 107)");
}
//**********************************************************************
//打开任务列表是触发
//**********************************************************************
function renwuinit() {
    var pageIndex=1;
    var pageSize=10;
    var nowState=1;//当前查询状态
        //任务缺省图
        var renwunull="<dl style='height:100%;width:100%;position: absolute;margin-top: 25%;color:#cecece;'><dd style='text-align:center;margin:0'><img src='../res/img/none.png' style='width: 50%;'></dd><dt style='text-align: center;'>暂无数据</dt></dl>";
        $.showIndicator();//loading
        //所有的任务集合
        var allrenwu={};
     //查询全部
      getrenwuList(1,1, pageIndex, pageSize);
      //刷新
      $("#renwushuaxin").click(function(){
              // 加载完毕需要重置
              getrenwuList(nowState,1);
              $.pullToRefreshDone('.renwu');
              $.toast('刷新成功！');
              console.log("刷新任务");
      });
      //进行中
      $(document).on('click', '#renwu_jxz', function () {
            initPage(3);
           $("#renwu_all").removeClass("active")
            $("#renwu_wks").removeClass("active")
            $("#renwu_jxz").addClass("active")
            $("#renwu_ywce").removeClass("active")
      });
     //未开始
       $(document).on('click','#renwu_wks', function () {
           initPage(2);
             $("#renwu_all").removeClass("active")
            $("#renwu_jxz").removeClass("active")
            $("#renwu_wks").addClass("active")
            $("#renwu_ywce").removeClass("active")
     });
     //已完成
       $(document).on('click','#renwu_ywce', function () {
            initPage(4);
            $("#renwu_all").removeClass("active")
            $("#renwu_jxz").removeClass("active")
            $("#renwu_wks").removeClass("active")
            $("#renwu_ywce").addClass("active")
     });
      //全部
       $(document).on('click','#renwu_all', function () {
            initPage(1);
            $("#renwu_ywce").removeClass("active");
            $("#renwu_jxz").removeClass("active");
            $("#renwu_wks").removeClass("active");
            $("#renwu_all").addClass("active");
     });
     //任务名称筛选
        $('#search').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
            var key = e.which; //e.which是按键的值
            if (key == 13) {
                initPage(1);//筛选全部
                $("#renwu_ywce").removeClass("active");
                $("#renwu_jxz").removeClass("active");
                $("#renwu_wks").removeClass("active");
                $("#renwu_all").addClass("active");
            }
        });

  /*********************************初始化分页查询**************************************/
  function initPage(state){
       $.showIndicator();//loading
      nowState=state;
      pageIndex=1;
      pageSize=10;
      getrenwuList(state,1, pageIndex, pageSize);
  }
   /*********************************分页查询**************************************/
   $(document).on('click','#stageLoadMore', function () {
        $.showIndicator();//loading
        pageIndex=parseInt($("#stagePageIndex").html())+1;
        getrenwuList(nowState,2, pageIndex, pageSize);
   });

};

//**********************************************************************
//打开任务详情界面触发
//**********************************************************************
$(document).on("pageInit", "#renwu_info", function (e, id, $page) {
    sysoUserInfo = getUserInfo(); //用户信息
    var renwuObj = strToJson(GetlocalStorage("renwuobj"));
    if(renwuObj==null){
        return;
    }
    var arrangeId = renwuObj.id//任务id
    var completeStr = "";
    //获取单个任务的已完成课程、试卷、的id
    getAjax(javaserver + "/stage/findOneProgress", { arrangeId: arrangeId, userId: sysoUserInfo.user_ID }, function (data) {
        data = strToJson(data);
        if (data.errorcode == 0 && data.data != null) {
            var block = "";
            completeStr = data.data.json_details;
        }
    });
    if(renwuObj.name.length>12){
        $(".title").html(renwuObj.name.substr(0,12)+"...");
    }else{
        $(".title").html(renwuObj.name);
    }

    var block = "";
    renwuObj.arragetype = strToJson(renwuObj.arragetype);
    //遍历阶段
    for (var i = 0; i < renwuObj.arragetype.length; i++) {
        var item=renwuObj.arragetype[i];
        block += "  <div class='content-block-title'>第" + item.key + "阶段</div><div class='list'>";
        //课程
        for (var c= 0; c < item.kscList.length; c++) {
                    //已完成
                    if (completeStr != null && completeStr != "" && (completeStr.indexOf(item.kscList[c].course_Id) != -1 || completeStr == item.kscList[c].course_Id)) {
                        block += "<a href='#' onClick='openKe_collection(" + JSON.stringify(item.kscList[c].course_Id) + ","+null+",\"" + arrangeId + "\")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + item.kscList[c].course_img + "' alt='' onerror='javascript:this.src=\"/app/framework/img/fengmian001.gif\"' height=200></div><div class='card-content'><div class='card-content-inner'><p>" + item.kscList[c].course_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 课程</span><span class='link'><i class='iconfont icon-listtable'>" + item.kscList[c].course_Sum + "章</i> </span></div></div></a>";
                    } else {
                        block += "<a href='#' onClick='openKe_collection(" + JSON.stringify(item.kscList[c].course_Id) + ","+null+",\"" + arrangeId + "\")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + item.kscList[c].course_img + "' alt='' onerror='javascript:this.src=\"../../res/img/fengmian001.gif\"' height=200></div><div class='card-content'><div class='card-content-inner'><p>" + item.kscList[c].course_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 课程</span><span class='link'><i class='iconfont icon-listtable'>" + item.kscList[c].course_Sum + "章</i> </span></div></div></a>";
                    }
        }
        //试卷
        for (var s = 0; s < item.kseList.length; s++) {
                if (completeStr != null && completeStr != "" && (completeStr.indexOf(item.kseList[s].paperId) != -1 || completeStr == data.datas[i].paperId)) {
                        block += "<a href='#' onClick='openSj(" + JSON.stringify(item.kseList[s]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='./../res/img/examnull.png'  alt='' ></div><div class='card-content'><div class='card-content-inner'><p>" + item.kseList[s].paperName + "</p></div></div><div class='card-footer' style='display:none;'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 已学</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                } else {
                        block += "<a href='#' onClick='openSj(" + JSON.stringify(item.kseList[s]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='../../res/img/examnull.png'  alt='' ></div><div class='card-content'><div class='card-content-inner'><p>" + item.kseList[s].paperName + "</p></div></div><div class='card-footer' style='display:none;'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 已学</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                }
        }
        //遍历知识架构
        for (var t = 0; t < item.kssList.length; t++) {
                    item.kssList[t].completeStr=completeStr;
                    //把知识架构放入对象  前端拼接
                    if (completeStr != null && completeStr != "" && (completeStr.indexOf(item.kssList[t].knowledge_Id) != -1 || completeStr == item.kssList[t].knowledge_Id)) {
                        block += "<a href='#' onClick='openRenwuKnow(" + JSON.stringify(item.kssList[t]) + ",\""+arrangeId+"\")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'> <svg class='icon' aria-hidden='true' style='margin-top:7px;'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='"+item.kssList[t].ico+"'></use></svg></div><div class='card-content'><div class='card-content-inner'><p>" + item.kssList[t].knowledge_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 题库练习</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                    }else{
                        block += "<a href='#' onClick='openRenwuKnow(" + JSON.stringify(item.kssList[t]) + ",\""+arrangeId+"\")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'> <svg class='icon' aria-hidden='true' style='margin-top:7px;'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='"+item.kssList[t].ico+"'></use></svg></div><div class='card-content'><div class='card-content-inner'><p>" + item.kssList[t].knowledge_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 题库练习</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                    }
        }
        block += "  </div>";
        $("#content_xq").append(block);
    }
});
//**********************************************************************
//打开分类详情界面触发0----进入分类
//**********************************************************************
$(document).on("pageInit", "#renwu_know", function (e, id, $page) {
    sysoUserInfo = getUserInfo(); //用户信息
    var arrangeId=QueryString("arrangeId");
    var item = strToJson(GetlocalStorage("knowobj"));
    if(item==null){
        return;
    }
    var block="";
    //有课程1
    if(item.know_select_course!=undefined&&item.know_select_course){
                block = "  <div class='content-block-title'>包含课程</div><div class='list' id='index_course'> 加载中。。。</div>";
                $("#content_kn").append(block);
                findInKnow(item,"1");
     }
     //有试卷2
    if(item.know_select_exam!=undefined&&item.know_select_exam){
                block = "  <div class='content-block-title'>包含试卷</div><div class='list' id='index_paper'>加载中。。。 </div>";
                $("#content_kn").append(block);
                findInKnow(item,"2");
    }
     //有题库
    if(item.know_select_que!=undefined&&item.know_select_que){
        block = "  <div class='content-block-title'>包含题库</div><div class='list'> </div>";
        //把知识架构放入对象  前端拼接
        if (item.completeStr != null && item.completeStr != "" && (item.completeStr.indexOf(item.knowledge_Id) != -1 || item.completeStr == item.knowledge_Id)) {
            block += "<a href='#' onClick='openTi(" + JSON.stringify(item) + ")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='/images/train/quenull.png' alt='' onerror='javascript:this.src=\"/images/train/quenull.png\"'></div><div class='card-content'><div class='card-content-inner'><p>" + item.knowledge_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 题库练习</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
        }else{
            block += "<a href='#' onClick='openTi(" + JSON.stringify(item) + ")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='/images/train/quenull.png' alt='' onerror='javascript:this.src=\"/images/train/quenull.png\"'></div><div class='card-content'><div class='card-content-inner'><p>" + item.knowledge_Name + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 题库练习</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
        }
         block += "</div>";
         $("#content_kn").append(block);
    }
    if(item.knowledge_Name.length>12){
        $(".title").html(item.knowledge_Name.substr(0,12)+"...");
    }else{
        $(".title").html(item.knowledge_Name);
    }
    //查询知识架构下的课程，试卷，题库
    function findInKnow(item, state) {
        $.showIndicator(); //loading
        getAjax(javaserver + "/stage/findArrangeStage", { knowledgeids: item.knowledge_Id, state: state }, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0) {
                //追加课程
                if(state=="1"){
                    var knowblock = "";
                        //课程
                        for (var i= 0; i < data.datas.length; i++) {
                                    //已完成
                                    if (item.completeStr != null && item.completeStr != "" && (item.completeStr.indexOf(data.datas[i].courseId) != -1 || item.completeStr == data.datas[i].courseId)) {
                                        knowblock += "<a href='#' onClick='openKe_collection("  + JSON.stringify(data.datas[i].courseId)+","+null+","+ JSON.stringify(arrangeId)+ ")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + data.datas[i].courseImg + "' alt='' onerror='javascript:this.src=\"/app/framework/img/fengmian001.gif\"' height=200></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].courseName + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 课程</span><span class='link'><i class='iconfont icon-listtable'>" + data.datas[i].courseSum + "章</i> </span></div></div></a>";
                                    } else {
                                        knowblock += "<a href='#' onClick='openKe_collection("  + JSON.stringify(data.datas[i].courseId)+","+null+","+ JSON.stringify(arrangeId)+ ")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='" + data.datas[i].courseImg + "' alt='' onerror='javascript:this.src=\"/app/framework/img/fengmian001.gif\"' height=200></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[i].courseName + "</p></div></div><div class='card-footer'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 课程</span><span class='link'><i class='iconfont icon-listtable'>" + data.datas[i].courseSum + "章</i> </span></div></div></a>";
                                    }
                        }
                        if(knowblock.length>0){
                            $("#index_course").html(knowblock);
                        }else{
                            $("#index_course").html("<center>无课程</center>");
                        }
                }else{
                     var knowblock = "";
                     //试卷
                        for (var s = 0; s < data.datas.length; s++) {
                                if (item.completeStr != null && item.completeStr != "" && (item.completeStr.indexOf(data.datas[s].paperId) != -1 || item.completeStr == data.datas[s].paperId)) {
                                        knowblock += "<a href='#' onClick='openSj(" + JSON.stringify(data.datas[s]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div class='shuqian-down'><span class='shuqian end'></span><span class='shuqiantext'>已完成</span></div><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='/app/framework/img/examnull.png'  alt='' ></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[s].paperName + "</p></div></div><div class='card-footer' style='display:none;'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 已学</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                                } else {
                                        knowblock += "<a href='#' onClick='openSj(" + JSON.stringify(data.datas[s]) + ",\"" + arrangeId + "\")'><div class='card color-default'><div style='' valign='bottom' class='card-header color-white no-border no-padding'><img class='card-cover' src='/app/framework/img/examnull.png'  alt='' ></div><div class='card-content'><div class='card-content-inner'><p>" + data.datas[s].paperName + "</p></div></div><div class='card-footer' style='display:none;'><span class='link'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i> 已学</span><span class='link'><i class='iconfont icon-listtable'></i> </span></div></div></a>";
                                }
                        }
                        if(knowblock.length>0){
                            $("#index_paper").html(knowblock);
                        }else{
                            $("#index_paper").html("<center>无试卷</center>");
                        }
                }
            }
            $.hideIndicator();
        });
    }
});



 //后退
function renwu_info_black(){
    $.showIndicator(); //loading
    $.router.back("../../home.html#renwu");
    $(".title").html("任务");
}
 //后退
function renwu_detail_black(){
    $.showIndicator(); //loading
    console.log("课程播放界面后退");
    try{bPlayer.close();}catch(e){}
    $.router.back("../peixun/info.html?arrangeId="+QueryString("arrangeId"));
}
//直播后退事件
function live_detail_black(){
    $.showIndicator(); //loading
    console.log("直播界面后退");
    try{bPlayer.close();}catch(e){}
    $.router.back("../peixun/detail.html?arrangeId="+QueryString("arrangeId"));
}

//**********************************************************************
//打开文件列表是触发
//**********************************************************************
function ziliaoinit() {
    $.showIndicator();//loading
    $("#zhiliaoback").hide();
    var fid = 0;
    var fpath = "/"; // 文件父级路径 带自己名称的
    var fidorg=0;
    //分页
    var pageIndex=1;
    var pageIndexorg=1;
    var pageSize=20;
    var pageSizeorg=20;

    var pageCount=0;
    var pageCountorg = 0;

    //面包屑路径
    var path="";
    sysUserInfo=getUserInfo();
    getfilelist(0,'','','',2,pageSize,pageIndex,true);
    $.hideIndicator();//隐藏loading

   //文件名称筛选
    $('#searchFileName').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
        var key = e.which; //e.which是按键的值
        if (key == 13) {
            $.showIndicator();//loading
            pageSize=20;
            pageIndex=1;
            var fileName=$("#searchFileName").val();
            //如果在共享文件里
            if(intoOrg){
                getorglist(2,"",fileName);
            }else{
                getfilelist(0,3,"","desc",2,pageSize,pageIndex,false,fileName);
            }


        }
    });


    //多选框 选中事件
  $(document).on("click","#filelist input", function(){
        $("#SosoShow").hide();
         //如果选中个数为0，隐藏删除和重命名按钮
        var length = $("input[type='checkbox']:checked").length;
           //如果是选中状态
        if($(this).is(":checked")){
            $("#deleteblock").show();
        }else{
           if(length<=0){
                $("#deleteblock").hide();
            }
        }
        //多选隐藏重命名
        if(length==1){
            $("#renamefile").show();
          $(".col-50").css("width","46%");
        }else{
            $("#renamefile").hide();
            $(".col-50").css("width","100%");
        }
  });
  //删除的单击事件
  $(document).on("click", "#deletefile", function () {
      var delId = "";
      $($("input[type='checkbox']:checked")).each(function () {
          delId += this.value + ',';    //遍历被选中CheckBox元素的集合 得到Value值
      });
      console.log("删除的id:" + delId);
      $.confirm("确认删除文件？", function () {
          $.showIndicator(); //loading
          //删除文件请求
          getAjax(javaserver + "/Kapi/delfile",
                { userId: sysUserInfo.user_ID,
                    fileid: delId,
                    confirmdel: 1, //学员端删除关系
                    orgId: sysUserInfo.organization_ID
                }, function (data) {
                    data = strToJson(data);
                    if (data.errorcode == 0) {
                        $.toast('删除成功！');
                        $("#deleteblock").hide();
                        if (fid == 0 || fid == undefined || fid === "") {
                            getfilelist(fid, "", "", "", 2, pageSize, pageIndex, true);
                        } else {
                            getfilelist(fid, "", "", "", 2, pageSize, 1);
                        }
                        return true;
                    } else if (data.errorcode == 34) {
                        $.toast('有关联数据！');
                        $("#deleteblock").hide();
                    } else {
                        $.toast('请求错误！');
                        $("#deleteblock").hide();
                        return false;
                    }
                });
          $.hideIndicator();
      });
  });
    //重命名的单击事件
   $(document).on("click","#renamefile", function(){
        var fileId=$("input[type='checkbox']:checked").val();//修改的id
        var name=$("input[type='checkbox']:checked").prev().children().get(0).innerText;//原来的名称
        $.prompt('请输入文件的名字','', function (value) {
           if(name!=value){
                   //文件重命名请求
                  getAjax(javaserver+"/Kapi/UpFileName",
                  {upUserId:sysUserInfo.user_ID,
                  fileName:value,
                  upId:fileId,
                  fid:fid,
                  upOrgId:sysUserInfo.organization_ID},function(data){
                   data=strToJson(data);
                    if (data.errorcode==0) {
                        $.toast('修改成功！');
                        $("#deleteblock").hide();
                          if(fid==0||fid==undefined||fid===""){
                                  getfilelist(fid,"","","",2,pageSize,pageIndex,true);
                         }else{
                              getfilelist(fid,"","","",2,pageSize,1);
                         }
                         return true;
                     } else if (data.errorcode == 29) {
                         $("#deleteblock").hide();
                          $.toast('当前目录已存在此名称！');
                          return false;
                    }else{
                          $.toast('请求错误！');
                          $("#deleteblock").hide();
                          return true;
                    }

                    });
              }
          }, null, name);
   });
  var backId = "";
  var parentid = 0;
  //查询父级文件下的子文件
  $(document).on("click", "#filelist a", function () {
      $("#deleteblock").hide(); //隐藏上边删除和重命名按钮
      $.showIndicator(); //loading
      pageIndex = 1;
      pageSize = 20;
      parentid = $(this).attr("data");
      var type = $(this).attr("other");
      fpath = $(this).attr("fpath");
      fid = $(this).attr("fid"); //给全局变量fid赋值
      if (type == "folder") {
          //如果在企业文件夹下
          if (intoOrg) {
              getorglist(2, parentid); //查询企业共享文件夹下的文件
              $(".ios-is-show").hide();
              $("#zhiliaoadd").hide();//隐藏添加
              // $(".title").html($(this).html()); //改变title的名字
          } else {
              getfilelist(parentid, "", "", "", 2, pageSize, pageIndex);
              var filename=$(this).html();
              if(filename.length>12){
                  filename=filename.substr(0,12)+"...";
              }
              $(".title").html(filename); //改变title的名字
              if(browser.versions.ios){
                  $(".ios-is-show").show();
              }else{
                  $("#zhiliaoadd").show();
              }
          }
          $("#zhiliaoback").show(); //显示返回键
          $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
          $("#ios-create").removeClass("pull-left").addClass("pull-right");
      }
      $.hideIndicator();
  });
  $(document).on("click", "#zhiliaoshuaxin", function () {
         if(intoOrg){
             if(fid=="main"){
                 getorglist(2,"");
             }else{
                 getorglist(2,fid);
             }
         //普通查询
         }else{
           if(fid=="main")fid=0;
           if(fid==0||fid==""||fid==undefined||fid=="0"){
             getfilelist(fid,"","","",2,pageSize,1,true);
           }else{
             getfilelist(fid,"","","",2,pageSize,1);
           }
         }
          $.toast('刷新成功！');
           //$.pullToRefreshDone('.ziliao');
    });
  //返回上一级
  $(document).on("click", "#zhiliaoback", function () {
      $("#deleteblock").hide();
      $.showIndicator(); //loading
      var pid = "";
      //非企业文件夹返回
      if (!intoOrg&&fid!="main") {
          if (fid != 0 && fid != "0" && fid != null && fid != null && fid != undefined && fid != "share") {
              getAjax(javaserver + "/Kapi/findfileById", { upId: fid }, function (data) {
                  $.hideIndicator();
                  data = strToJson(data);
                  fid = data.data.fid; //返回上级时 ，上级（父级）的父级id  ——再次返回用
                  pid = data.data.upId; //返回上级时，上级（父级）的id  ——根据父id  查询文件
                  if(data.data.fileName.length>12){
                      $(".title").html(data.data.fileName.substr(0,12)+"...");
                  }else{
                      $(".title").html(data.data.fileName);
                  }

                   if (fid == "share" && intoOrg) {
                      $(".title").html("共享文件");
                      getorglist(2, ""); //查询企业共享文件夹下的文件
                      fid = 0;
                  } else if (fid == "main" && !intoOrg) {
                      intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                      getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                      $(".title").html("资料");
                      $("#zhiliaoback").hide();
                  } else if (fid != "share" && fid != 0 && fid != "0" && fid != "main" && intoOrg) {
                      getorglist(2, fid);
                      fid = 0;
                      $(".title").html("共享文件");
                  } else if ((fid == 0 || fid == "0") && intoOrg) {
                      $(".title").html("共享文件");
                      getorglist(2, ""); //查询企业共享文件夹下的文件
                      fid = "main";
                  }  else {
                      //如果是0层，需要显示出企业文件夹
                      if (pid == 0 || pid == "0" || pid == undefined||pid=="") {
                          $("#zhiliaoback").hide();
                          intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                          getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                          $(".title").html("资料");
                      } else {
                          $("#zhiliaoback").show();
                          $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
                          $("#ios-create").removeClass("pull-left").addClass("pull-right");
                          getfilelist(pid, "", "", "", 2, pageSize, 1);
                      }
                  }

                 // $.hideIndicator();
              });
          }else if(fid==0||fid=="0"){
               $("#zhiliaoback").hide();
               intoOrg = false; //0层，保证绝对没有=在企业文件夹下
               getfilelist(pid, "", "", "", 2, pageSize, 1, true);
               $(".title").html("资料");
          }
      }else{
           if (fid == "share" && intoOrg) {
                      $(".title").html("共享文件");
                      getorglist(2, ""); //查询企业共享文件夹下的文件
                      fid = 0;
                  } else if (fid == "main" && intoOrg) {
                      intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                      getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                      $(".title").html("资料");
                      $("#zhiliaoback").hide();
                  } else if (fid != "share" && fid != 0 && fid != "0" && fid != "main" && intoOrg) {
                      getorglist(2, fid);
                      fid = 0;
                      $(".title").html("共享文件");
                  } else if ((fid == 0 || fid == "0") && intoOrg) {
                      $(".title").html("共享文件");
                      getorglist(2, ""); //查询企业共享文件夹下的文件
                      fid = "main";
                  }  else {
                      //如果是0层，需要显示出企业文件夹
                      if (pid == 0 || pid == "0" || pid == undefined||pid=="") {
                          $("#zhiliaoback").hide();
                          intoOrg = false; //0层，保证绝对没有=在企业文件夹下
                          getfilelist(pid, "", "", "", 2, pageSize, 1, true);
                          $(".title").html("资料");
                      } else {
                          $("#zhiliaoback").show();
                          $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
                          $("#ios-create").removeClass("pull-left").addClass("pull-right");
                          getfilelist(pid, "", "", "", 2, pageSize, 1);
                      }
                  }
      }
       //如果在企业文件夹下，隐藏创建按钮
        if(intoOrg){
            if(browser.versions.ios){
                $(".ios-is-show").hide();
            }else{
                $("#zhiliaoadd").hide();
            }
        }else{
            if(browser.versions.ios){
                $(".ios-is-show").show();
            }else{
                $("#zhiliaoadd").show();
            }
        }
      $("#zhiliaoshuaxin").show();
      $("#ios-create").addClass("pull-left").removeClass("pull-right");
     $.hideIndicator();
  });

  //分页
  $(document).on('click', '#loadMore', function () {
      pageIndex=parseInt( $("#filepage").html())+1;
      getfilelist(fid,"","","",1,pageSize,pageIndex);
  });
  // 清除文件
  function clearFile() {
      if (document.getElementById('fileIosId').outerHTML) {
          document.getElementById('fileIosId').outerHTML = document.getElementById('fileIosId').outerHTML;
      } else { // FF(包括3.5)
          document.getElementById('fileIosId').val = "";
      }
      document.getElementById('fileIosId').select();
  }
  // ios 上传
  $(document).on('change','#fileIosId',function(){
      // 生成统一的文件id
      var file_id = guid();
      console.log("文件id"+file_id,"企业id"+ sysUserInfo.organization_ID,"用户id"+sysUserInfo.user_ID,"用户名称"+sysUserInfo.user_Name,"企业名称"+sysUserInfo.organization_Name,"staus:状态1","optype 1 2上传还是更新","state 2","fid"+fid,"fpath"+fpath);
      $.toast("开始文件上传请不要离开！");
      var file=document.getElementById('fileIosId').files[0];//获取文件流
      var fileName = file.name; //获取文件名
      console.log(file);
      if ((file.size / 1024 / 1024) > 30) {
          alert("请您上传30M，以内的文件");
          clearFile();
          return;
      }
      var fileParams = {
          upid:file_id,
          orgid:sysUserInfo.organization_ID,
          stattus:2,
          fid:fid,
          fpath:fpath,
          username:sysUserInfo.user_Name,
          orgname:sysUserInfo.organization_Name,
          userid:sysUserInfo.user_ID,
          optype:1,
          state:2
      }
      // 请求业务服务器存储配置文件
      var formData = new FormData();
  	formData.append('upid', fileParams.upid);
  	formData.append('orgid', fileParams.orgid);
      $.showIndicator();
      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000;
      //http://192.168.1.148:8085/file/uploadCover
      xhr.open("POST", javaserver+"/Kapi/sendout");
      xhr.onload = function (e) {
          if (this.status == 200 || this.status == 304) {
              var resServer = strToJson(this.responseText);
              // 请求文件服务器
              if(resServer.errorcode == 0){
                  var fdFile = new FormData();
                  fdFile.append("file",document.getElementById('fileIosId').files[0]);
                  fdFile.append("orgid",fileParams.orgid);
                  fdFile.append("userid",fileParams.userid);
                  fdFile.append("upid",fileParams.upid);
                  fdFile.append("status",2);
                  fdFile.append("fid",fileParams.fid);
                  fdFile.append("fpath",fileParams.fpath);
                  fdFile.append("username",fileParams.username);
                  fdFile.append("orgname",fileParams.orgname);
                  fdFile.append("optype",1)
                  fdFile.append("state",2)
                   fileParams.file =  document.getElementById('fileIosId').files[0];
                  $.ajax({
                      type: "post",
                        url: javafile+"/Md5File/fileUpload",
                        data: fdFile,
                        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
                        cache: false,
                        processData: false,
                        contentType: false,
                        success: function (msg, status, xhr) {
                         console.log(strToJson(msg));
                          // 重新获取一下文件
                          if(fid == 0 || fid == "0"){
                              getfilelist(fid,"","","desc","",20,1,true,"");
                          }else{
                              getfilelist(fid,"","","desc","",20,1,false,"");
                          }

                          clearFile();
                        }});
              }

          }
      }
      xhr.send(formData);
  });
  var intoOrg = false;
  //是否进入了企业文件夹
    //企业文件夹的单击事件
  $(document).on('click', '#orgfile', function () {
      intoOrg = true;
      $(".title").html("共享文件");
      $('.ios-is-show').hide();
      $("#zhiliaoadd").hide();//隐藏添加
      $("#zhiliaoback").show();
      $("#zhiliaoshuaxin").hide();//文件夹内隐藏刷新按钮
      $("#ios-create").removeClass("pull-left").addClass("pull-right");
      fid = "main";
      getorglist(2, ""); //fid等于null，查询企业共享文件，不等于null，查询文件夹下的文件
  });
  //企业文件的分页下拉
  $(document).on('infinite', '#orgfile',function() {
        setTimeout(function() {
         pageIndexorg=pageIndexorg+1;
         //当前页小于总页数
         if(pageIndexorg<=pageCountorg){
                //触发向下滚动，查询新数据
               getorglist(2,"");
        }
        }, 1000);
  });
  function getorglist(optype,filefid,name){
       $.showIndicator();//loading
        //文件缺省图
        var wenjiannull="<dl style='height:100%;width:100%;position: absolute;margin-top: 25%;color:#cecece;'><dd style='text-align:center;margin:0'><img src='../res/img/knownull.png' style='width: 50%;'></dd><dt style='text-align: center;'>暂无数据</dt></dl>";
        //获取共享文件
        getAjax(javaserver + "/Kapi/getSharelist",
            { userid: sysUserInfo.user_ID,
                searchText:name,
                fid: filefid,
                orgid: sysUserInfo.organization_ID,
                xid: sysUserInfo.allorgid + sysUserInfo.allroleid + sysUserInfo.allgroupid + sysUserInfo.user_ID, //权限id
                pageSize: pageSizeorg,
                pageIndex: pageIndexorg
            }, function (data) {
                $.hideIndicator();
                data = strToJson(data);
                if (data.errorcode == 0 && data.datas != null&&data.datas.length>0) {
                    var block = "";
                    //遍历文件
                    for (var i = 0; i < data.datas.length; i++) {
                        //查询子集
                        if (data.datas[i].fileType == "folder") {
                            if (fid == "main" ) {
                                block += "<li ><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.datas[i].upId + " other=" + data.datas[i].fileType + " fid=share>" + data.datas[i].fileName + "</a></div></div></label></li>";
                            } else {
                                block += "<li ><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.datas[i].upId + " other=" + data.datas[i].fileType + " fid=" + data.datas[i].fid  + ">" + data.datas[i].fileName + "</a></div></div></label></li>";
                            }

                            //预览
                        } else {
                            block += "<li ><label class='label-checkbox item-content'><div class='item-media' onclick='openfile(" + JSON.stringify(data.datas[i]) + ")'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a onclick='openfile(" + JSON.stringify(data.datas[i]) + ")' class='item-link'>" + data.datas[i].fileName + "</a></div></div></label></li>";
                        }
                    }
                    if (optype == 1) {
                        $("#filelist").append(block);
                        //总页数
                        pageCountorg = data.pageCount;
                        //隐藏分页
                        if (pageCount <= pageIndex) {
                            $(".infinite-scroll-preloader").remove();
                        }
                    } else {
                        $("#filelist").html(block);
                        //隐藏分页
                        if (data.numCount <= pageSize) {
                            $(".infinite-scroll-preloader").remove();
                        }
                    }
                    //没有共享文件
                } else if (data.errorcode == 32 || (data.errorcode == 0 && data.datas.length <= 0)) {
                    $("#filelist").html(wenjiannull);
                    $(".infinite-scroll-preloader").remove();
                }
            });
      }
      //排序
      $(document).on('click','#wenjian_paixu', function () {
        var buttons1 = [
          {
            text: '按文件名升序',
            onClick: function() {
            if(fid==0||fid==undefined||fid==""){
                  getfilelist(fid,1,"","",2,pageSize,pageIndex,true);
            }else{
                  getfilelist(fid,1,"","",2,pageSize,pageIndex);
            }
            }
          },
          {
            text: '按文件名降序',
            onClick: function() {
            if(fid==0||fid==undefined||fid==""){
                  getfilelist(fid,1,"","desc",2,pageSize,pageIndex,true);
            }else{
                  getfilelist(fid,1,"","desc",2,pageSize,pageIndex);
            }

            }
          },
          {
            text: '按文件上传时间倒序',
            onClick: function(){
               if(fid==0||fid==undefined||fid==""){
                  getfilelist(fid,3,"","desc",2,pageSize,pageIndex,true);
               }else{
                  getfilelist(fid,3,"","desc",2,pageSize,pageIndex);
               }
            }
          },
          {
            text: '按文件大小倒序',
            onClick: function() {
               if(fid==0||fid==undefined||fid==""){
                  getfilelist(fid,4,"","desc",2,pageSize,pageIndex,true);
               }else{
                  getfilelist(fid,4,"","desc",2,pageSize,pageIndex)
               }
            }
          }
        ];
        var buttons2 = [
          {
            text: '取消',
            bg: 'danger'
          }
        ];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    });
    //***********************************************************************************************
    //                                      操作表
    //***********************************************************************************************
    $(document).on('click','#ios-create',function(){
           $.prompt('请输入文件夹的名字','', function (value) {
                     addfolder(value,parentid);
                },null,'新建文件夹');
            $(".modal-inner input").attr("placeholder","新建文件夹");
    			if($(".modal-inner input").val()=="新建文件夹"){
    				$(".modal-inner input").val("");
    			}
    });

    $(document).on('click','.create-actions', function () {
        var buttons1 = [
          {
            text: '上传文件',
            bold: true,
            color: 'danger',
            onClick: function () {
              console.log(browser.versions.ios);
              if(browser.versions.ios){
                  $("#fileIosId").click();
              }else{fileOnload($(".title").html(), parentid, fpath);}
            }
          },
          {
            text: '创建文件夹',
            onClick: function() {
                $.prompt('请输入文件夹的名字','', function (value) {
                   addfolder(value,parentid);
              },null,'新建文件夹');
              $(".modal-inner input").attr("placeholder","新建文件夹");
              if($(".modal-inner input").val()=="新建文件夹"){
                $(".modal-inner input").val("");
              }
            }
          }
        ];
        var buttons2 = [
          {
            text: '取消',
            bg: 'danger'
          }
        ];
        var groups = [buttons1, buttons2];
        $.actions(groups);
    });
    //**********************************************************************************
    //                               文件预览
    //**********************************************************************************
    $(document).on("pageInit", "#ziliao_yulan", function (e, id, $page) {
        $.showIndicator(); //loading
        //var upId = QueryString("upId")
        //getAjax(javaserver + "/Kapi/findfileById", { upId: upId }, function (data) {
        //    data = strToJson(data);
        //    if (data.errorcode == 0 && data.data != null) {
                //可转码文件
          abc();
          //  }
        //});
        $.hideIndicator();
    });
    //标签筛选
    $(document).on('click', '.biaoqian li', function () {
        $.showIndicator(); //loading
        var pageIndex = 1;
        var pageSize = 20;
        var tag = $(this).children(".ng-binding").get(0).attributes.data.nodeValue;
        var color = $(this).get(0).innerText;
        console.log("当前选中颜色" + color);
        //移除遮盖层
        $(".modal-in").removeClass("modal-in");
        $(".popup-tag").addClass("modal-out");
        $(".modal-overlay-visible").remove();
        var lable_block = "";
        if (tag == "01c9cfcb-ffec-4778-be6f-31e633czo33a") {
            lable_block = "hongse";
        } else if (tag == "01c9cfcb-ffec-4778-abcd-31e6321zo33b") {
            lable_block = "chengse";
        } else if (tag == "01c9cfcb-ffec-3208-abcd-31e633czo33c") {
            lable_block = "huangsese";
        } else if (tag == "01c1259cb-ffec-4778-abcd-31e633czo33d") {
            lable_block = "lvse";
        } else if (tag == "05bae156-9d94-482b-a120-86e694e40abe") {
            lable_block = "lanse";
        } else if (tag == "078cbeeb-f78f-312e-9de0-9efe1ee766af") {
            lable_block = "zise";
        } else if (tag == "08283666-15b4-4135-b0aa-3ecfdeed6e7g") {
            lable_block = "huise";
        } else if (tag == "0") {
            lable_block = "toumingquanbu";
        } else {
            $("#lable_color").html("<i class='iconfont icon-xueyuanpinglun'></i> 标签");
            //查询方法
            getfilelist(0, "", "", "", 2, pageSize, pageIndex, true);
        }
        if (lable_block != null && lable_block != "") {
            //$("#lable_color").html("<div style='height:30px;width:100%;display: block;clear: both;'><div class='knowledgebiaoqianyuan'><svg class='icon' aria-hidden='true'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-biaoqian" + lable_block + "'></use></svg><div title='" + color + "' class='ng-binding' data='" + tag + "'>" + color + "</div></div></div> ");
            $("#lable_color").html("<svg style='height:30px;width:30px;vertical-align: middle;' aria-hidden='true'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#icon-biaoqian" + lable_block + "'></use></svg> " + color);
            //查询方法
            getfilelist("", "", tag, "", 2, pageSize, pageIndex, false);
        }
        $.hideIndicator();
    });
    //***********************************************************************************
    //                               人员资料
    //***********************************************************************************
    $(document).on('click','.left-alert-text', function () {
        $.alert("暂未开放 敬请期待","提示");
    });
    //***********************************************************************************
    //                               添加文件夹
    //***********************************************************************************
    function addfolder(value,thisfid){
        $.showIndicator();//loading
        sysUserInfo=getUserInfo();
        //创建文件夹
        getAjax(javaserver + "/Kapi/CreateFolder",
            {
                upUserId: sysUserInfo.user_ID,
                fid: thisfid,
                upOrgId: sysUserInfo.organization_ID,
                fileName: value,
                filepath: fpath != null && fpath ? fpath : "/",
                userName: sysUserInfo.user_Name
            }, function (data) {
                $.hideIndicator();
                data = strToJson(data);
                // 处理父级路径
                var dataFpath = data.data.filepath;
                if (dataFpath == undefined || dataFpath == null || dataFpath == "" || dataFpath == "/") {
                    dataFpath = "/" + data.data.fileName;
                } else {
                    dataFpath = data.data.filepath + "/" + data.data.fileName;
                }
                if (data.errorcode == 0 && data.data != null) {
                    $("#filelist").append("<li><label class='label-checkbox item-content'><div class='item-media'><img src='../../res/fileicon/folder_56.png'  onerror='javascript:this.src=\"../../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.data.upId + " fpath=" + dataFpath + " other=folder fid=" + data.data.fid + ">" + data.data.fileName + "</a></div><input type='checkbox' name='my-radio' value='" + data.data.upId + "'><div class='item-media'><i class='icon icon-form-checkbox'></i></div></div></label></li>");
                    $.toast('创建成功！');
                } else if (data.errorcode == 29) {
                    $.toast('已存在同名文件！');
                } else {
                    $.toast('请求错误！');
                }
            }, function () {
                $.hideIndicator();
                $.toast('请求错误！');
            });
    }

};
// ziliaoinit方法体结束


function openTag() {
    $.popup('.popup-tag');
    $(".popup-tag").css("display","block");
    sysUserInfo = getUserInfo();
    var tagId = "";
    //请求个人标签
    getAjax(javaserver + "/Kapi/gettaglist",
      { userid: sysUserInfo.user_ID, orgid: sysUserInfo.organization_ID }, function (data) {
          data = strToJson(data);
          if (data.errorcode == 0 && data.datas.length > 0) {

              //处理查询的标签与原来的标签绑定事件
              //外层遍历已查询到的标签
              for (var i = 0; i < data.datas.length; i++) {
                  //内层遍历赋值
                  $($(".biaoqian .ng-binding")).each(function () {
                      tagId = $(this).attr("data");   //遍历被选中CheckBox元素的集合 得到Value值
                      //把比对上tagid的名称替换成查询出来的名称
                      if (data.datas[i].tagid == tagId) {
                          //data.datas[i].tagname
                          $(this).get(0).innerText = data.datas[i].tagname;
                      }
                  });
              }
          } else if (data.errorcode == 0 && data.datas.length <= 0) {
              //直接放过
              console.log("进入");
          } else {
              $.toast('请求错误！');
          }
      });
};

//***********************************************************************************//
                              //文件上传开始
//***********************************************************************************
//fileOnload("资料");

function fileOnload(title, fid, fpath) {
    $('#popup-file-close').attr('onClick', 'closeFilePanel("' + title + '")');
    $('.title').html("上传文件列表");
    $.popup('.popup-file');
    if(fid == undefined || fid == null || fid == "")
    fid =0;
    if(fpath == undefined || fpath == null || fpath == "")
    fpath = "/";
    fileInit(fid,fpath); // 文件上传初始化
    console.log("hello file");

}
/*******************************文件搜索*********************************************/
function showSoInupt(index){
    //显示搜索框
    if(index==1){
         $("#SosoShow").show();
         $("#searchFileName").focus();
    }else{
         $("#SosoShow").hide();
         getfilelist(0, "", "", "", 2, 20,1, true);
    }
}

var chunkSize = 1024 * 1024*10;    //以后端的约定  分片的大小
// 获取用户信息
var sysUserInfo = strToJson(GetlocalStorage("userinfo"));
var uploadParams = {}; //上传参数
var $htmlUploadListBody = $('#htmlUploadListBody'); // 上传列表
//var $countUpFileNum = $("#countUpFileNum"); //上传的总文件数
var countUpFile = []; // 一共上传中的文件 id 文件id name 文件名 size 文件大小 fpath 父级目录 state 文件状态 type 文件类型
//var $successUpFileNum = $("#successUpFileNum"); // 上传完成了文件数
// 初始化参数
function fileInit(fid,fpath) {
    sysUserInfo = strToJson(GetlocalStorage("userinfo"));
    $htmlUploadListBody = $('#htmlUploadListBody'); // 上传列表
    uploadParams = {     //请求参数
        upid: "",       // 文件id 可空
        status: 4,     // 文件状态 0成功 1转码失败 2上传中 3上传失败
        fid: fid == 0 ? 0 : fid,        // 文件父级id
        fpath: fpath == null?"/":fpath,      // 文件父级地址
        filename: "",       // 文件名称
        filetype: "",       //文件类型
        size: "",           // 文件大小
        optype: 1,   // 文件上传
        orgid: sysUserInfo.organization_ID,            // 企业id
        orgname: sysUserInfo.organization_Name,        // 企业名称
        userid: sysUserInfo.user_ID,                    // 用户id
        username: sysUserInfo.user_Name               //  用户名称
    }
    fileTosast("");
    $.showIndicator();
    // 获取这个人之前上传的数据
    getAjax(javafile + "/Md5File/findRedissFile", { userid: sysUserInfo.user_ID }, function (response) {
        $.hideIndicator();
        $htmlUploadListBody.html("");
        if (response.errorcode == 0) {
            response.datas.forEach(function (item, ind) { // 路径需要处理
                //处理参数
                item.id = null; //队列id
                item.upId = item.upid;  //文件id
                item.fileType = item.filetype;  //文件类型
                item.fileName = item.filename;  // 文件名称
                item.fileSize = item.size; // 文件大小
                item.filepath = item.fpath; //文件地址
                addFileHtml(item); //生成html
            });
            countUpFile = response.datas;
        }
    },"","json");
}
// 打开选择文件初始化请求参数
function openUploadFile() {
    //fileTosast("打开");
    // 调用单击事件
    document.getElementById("uploadInfoBtn").childNodes[1].childNodes[1].click();
}

// HOOK 这个必须要再uploader实例化前面
WebUploader.Uploader.register({
    'before-send-file': 'beforeSendFile',
    'before-send': 'beforeSend'
}, {
    //add-file(files): File对象或者File数组	用来向队列中添加文件。
    //before-send-file	(file) file : 对象    在文件发送之前request，此时还没有分片（如果配置了分片的话），可以用来做文件整体md5验证。
    //before-send(block)	block: 分片对象	   在分片发送之前request，可以用来做分片验证，如果此分片已经上传成功了，可返回一个rejected promise来跳过此分片上传
    //after-send-file(file): File对象	在所有分片都上传完毕后，且没有错误后request，用来做分片验证，此时如果promise被reject，当前文件上传会触发错误。
    beforeSendFile: function (file) {
        console.log("beforeSendFile");
        // Deferred对象在钩子回掉函数中经常要用到，用来处理需要等待的异步操作。
        var task = new jQuery.Deferred();
        // 根据文件内容来查询MD5
        uploader.md5File(file).progress(function (percentage) {   // 及时显示进度
            fileTosast("正在加入队列" + file.name + "..." + parseInt(percentage * 100));
            console.log('计算md5进度:', percentage);
            getProgressBar(file, percentage, "MD5");
        }).then(function (val) { // 完成
            console.log('md5 result:', val);
            fileTosast("");
            file.md5 = val;
            // 模拟用户id
            // file.uid = new Date().getTime() + "_" + Math.random() * 100;
            file.uid = WebUploader.Base.guid();
            // 创建文件对象
            // 第一次发出请求要数据库 文件对象 如果是实时的需要添加钩子（*）
            uploadParams.filename = file.name;  //文件名称
            uploadParams.size = (file.size / 1024); // 文件大小
            uploadParams.filetype = file.ext;   //文件类型
            uploadParams.md5 = val;
            getAjax(javaserver + "/Kapi/upfiles", uploadParams, function (response) {
                countUpFile.forEach(function (item, index) {
                    if (item.upId == file.id) {
                        countUpFile.splice(index, 1);
                    }
                });
                $("#"+file.id).remove();
                //计算进度
                console.log("文件对象获取：" + response);         // 30 更新子版本
                // 不存在
                var responseIsExist = true;
                if (response.errorcode == "0") {
                    //文件唯一id赋值
                    file.upId = response.data.upId;
                } else if (response.errorcode == "30") {
                    //更新文件
                    file.upId = response.data.id;
                }
                // 判断文件是否存在
                countUpFile.forEach(function (item, index) {
                    if (item.upId == response.data.upId) {
                        responseIsExist = false;
                    }
                });
                if (responseIsExist) {
                    var obj = response.data;
                    obj.md5 = val;
                    if (response.errorcode == "0") { // 获取对象成功

                        //处理参数
                        obj.id = file.id; //文件队列中id
                        obj.status = 4; //文件上传状态
                        obj.optype = 1; //文件上传
                        addFileHtml(obj); //生成html
                        // 添加文件
                        addFile(obj, true);
                    } else if (response.errorcode == "30") { // 暂时复杂  更新子版本
                        //处理参数
                        obj.upId = obj.id;  //文件id
                        obj.id = file.id // 文件队列中id
                        obj.fileType = obj.Extended;  //文件类型
                        obj.fileName = obj.Name;  // 文件名称
                        obj.fileSize = obj.Size; // 文件大小
                        obj.filepath = ""; //文件地址
                        obj.status = 4; // 文件上传状态
                        obj.optype = 2; //更新文件
                        addFileHtml(obj); //生成html
                        // 添加文件
                        addFile(obj, true);

                    }else if (response.errorcode == "39") {    // 文件空间超出最大限制
                       $.prompt('存储空间超过最大限制','', function (value) {
                        },null,'警告');
                        task.reject();
                    }
                }
                // 进行md5判断
                getAjax(javafile + "/Md5File/checkFileMd5", { userid: sysUserInfo.user_ID, md5: file.md5 }, function (data) {
                    // 返回的状态码
                    status = data.errorcode;
                    console.log(data.errormsg);
                    task.resolve();
                    if (status == 101) {
                        // 文件不存在，那就正常流程
                    } else if (status == 100) {
                        // 忽略上传过程，直接标识上传成功；文件已经上传
                        uploader.skipFile(file);
                        file.pass = true;
                    } else if (status == 102) {
                        // 部分已经上传到服务器了，但是差几个模块。
                        console.log(data.datas);
                        file.missChunks = data.datas;
                    }
                }, function () {  //上传失败
                    task.reject();
                    // 参数二不传则为暂停上传
                    //uploader.removeFile(file, true);
                    $('#' + file.upId + ' .jindu').html('<div onclick="fileRetry()"><i class="iconfont" style="color: red" >&#xe6b9;</i> 上传中断</div> ');
                }, "json", "post");

            }, function () {
                task.reject();
                console.log("文件异常");
                fileTosast("文件异常");
                // 参数二不传则为暂停上传
                uploader.removeFile(file, true);

            },"json");
            // 日志
            console.log("beforeSendFile", file, uploader);
        });
        return jQuery.when(task);
    },
    beforeSend: function (block) {
        console.log("block")
        var task = new jQuery.Deferred();
        var file = block.file;
        var missChunks = file.missChunks;
        var blockChunk = block.chunk;
        console.log("当前分块：" + blockChunk);
        console.log("missChunks:" + missChunks);
        if (missChunks !== null && missChunks !== undefined && missChunks !== '') {
            var flag = true; //验证分片是否完成上传了。
            for (var i = 0; i < missChunks.length; i++) {
                if (blockChunk == missChunks[i]) {
                    console.log(file.name + ":" + blockChunk + ":还没上传，现在上传去吧。");
                    flag = false;
                    break;
                }
            }
            if (flag) {
                task.reject();
            } else {
                task.resolve();
            }
        } else {
            task.resolve();
        }
        // 返回回调方法
        return jQuery.when(task);
    }
});
// 实例化
var uploader = WebUploader.create({
    pick: {
        id: '#uploadInfoBtn',
        label: '点击选择文件'
    },
    formData: {
        uid: 0,
        md5: '',
        chunkSize: chunkSize
    },
    //dnd: '#dndArea',  // 指定接受拖拽上传的容器
    //paste: '#uploader',   //指定复制粘贴的容器
    swf: 'webuploader/js/Uploader.swf',
    chunked: true, //分片上传
    chunkSize: chunkSize, // 字节 1M分块
    threads: 3, //当前为3个线程同时请求到达
    chunkRetry:5, // 自动重连5次
    server: javafile + '/Md5File/fileUpload', //上传的路径
    auto: true, // 是否自动上传
    // duplicate : true, //去重， 根据文件名字、文件大小和最后修改时间来生成hash Key.
    disableGlobalDnd: true,// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
    fileNumLimit: 1024,     // 队列最大限制总数量
    fileSizeLimit: 1024 * 1024 * 1024 * 1024,    // 200 M队列总大小
    fileSingleSizeLimit: 1024 * 1024 * 1024 * 1024   // 50 M 单个文件大小限制
});
// 当有文件被添加进队列的时候
uploader.on('fileQueued', function (file) {
    fileTosast("正在加入队列" + file.name);
    // 第一次发出请求要数据库 文件对象 如果是实时的需要添加钩子（*）
    uploadParams.filename = file.name;  //文件名称
    uploadParams.size = (file.size / 1024); // 文件大小
    uploadParams.filetype = file.ext;   //文件类型
    var obj = {};
    //处理参数
    obj.upId = file.id;  //文件id
    obj.id = file.id // 文件队列中id
    obj.fileType = file.ext;  //文件类型
    obj.fileName = file.name;  // 文件名称
    obj.fileSize = (file.size / 1024); // 文件大小
    obj.filepath = ""; //文件地址
    obj.status = 4; // 文件上传状态
    obj.optype = 1; //新增文件
    addFileHtml(obj); //生成html
});
//当文件被删除队列的时候触发
uploader.on('fileDequeued', function (file) {
    console.log(file);

});
//当某个文件的分块在发送前触发，主要用来询问是否要添加附带参数，大文件在开起分片上传的前提下此事件可能会触发多次。
uploader.onUploadBeforeSend = function (obj, data) {
    console.log("onUploadBeforeSend");
    var file = obj.file;
    console.log(obj);
    data.md5 = file.md5 || ''; //会出现空值需要看一下
    data.uid = file.uid;
    var dataBaseFileObj = getOneFileObj(file);
    if (dataBaseFileObj == null) {
        console.log("文件丢失");
        return;
    }
    data.orgid = sysUserInfo.organization_ID;     // 企业id
    data.orgname = sysUserInfo.organization_Name;     // 企业名称
    data.userid = sysUserInfo.user_ID;   // 用户id
    data.username = sysUserInfo.user_Name;  //  用户名称
    data.status = 2;
    data.optype = 1;    // 操作类型
    data.upid = dataBaseFileObj.upId;
    data.ziid = dataBaseFileObj.fileid;    // 子表id
    data.fid = dataBaseFileObj.fid; // 父级id
    data.fpath = dataBaseFileObj.filepath;  // 父级路径

};
// 上传中
uploader.on('uploadProgress', function (file, percentage) {
    getProgressBar(file, percentage,"上传");
});
// 上传成功返回结果
uploader.on('uploadSuccess', function (file) {
    var text = '已上传';
    if (file.pass) {
        text = "文件秒传功能，文件已上传。"
    }
    updataFile(file, 0);
    uploader.removeFile(file, true);
    //$('#' + file.id).find('p.state').text(text);
    console.log('uploadSuccess chenggong', file);
    jQuery('#' + file.upId + ' .jindu').html('<i class="iconfont" style="color: green">&#xe772;</i>成功 ');

});
// 上传失败
uploader.on('uploadError', function (file, reason) {
    console.log('uploadError shibai', file, reason);
    if (reason == "abort") {
        jQuery('#' + file.upId + ' .jindu').html('<div onclick="fileRetry()"><i class="iconfont" style="color: red" >&#xe6b9;</i> 中断</div> ');
        return;
    }
    updataFile(file, 3);
    uploader.removeFile(file, true);
    jQuery('#' + file.upId + ' .jindu').html('<i class="iconfont" style="color: red">&#xe6b9;</i> 失败 ' + reason);
    //$('#' + file.id).find('p.state').text('上传出错');
});
// 上传完成
uploader.on('uploadComplete', function (file) {
    console.log('uploadComplete wancheng', file);
    // 隐藏进度条
    fadeOutProgress(file);
    fileTosast(""); //清空消息
    //$successUpFileNum.html(parseInt($successUpFileNum.html()) + 1);
    // 计算进度
    //allProgress();
    //$('#' + file.id + ' .jindu').html('<i class="iconfont" style="color: #39f">&#xe781;</i> 正在转化');
    // fadeOutProgress(file, 'FILE');
});






/**
重试上传
@file 出错文件
*/
function fileRetry() {
    uploader.retry();
}

/**
*  生成进度条封装方法
* @param file 文件
* @param percentage 进度值
* @param titleName 标题名
*/
function getProgressBar(file, percentage, titleName) {
    var $li = jQuery('#' + file.upId); // 当前文件
    var $td = jQuery('#' + file.upId + ' .jindu');
    var $childProgress = $li.find('.progress');   //进度条
    var $childProgressflag = $td.find('#' + file.upId + '-progress-bar');   //进度条
    var $childProgressText = $td.find('#' + file.upId + 'progress-text'); // 进度内容
    // 避免重复创建 进度条
    if (!$childProgressflag.length) {
        $td.html("");
        $childProgressflag = jQuery('<div id="' + file.upId + '-progress"><span id="' + file.upId + 'progress-text">0%</span><br /><span class="progress" style="display:none;"><span style="width: 0%" class="progress-bar" id="' + file.upId + '-progress-bar"></span></span></div>').appendTo($td).find('#' + file.upId + '-progress-bar');
    }
    // 进度计算
    var progressPercentage = (percentage * 100).toFixed(2) + '%';
    // 修改进度条的样式
    $childProgress.css('width', progressPercentage);
    // 填充进度条的文字
    $childProgressText.html(titleName + ":" + parseInt(percentage * 100));
}


/**
* 隐藏进度条
* @param file 文件对象
*/
function fadeOutProgress(file, id_Prefix) {
    jQuery('#' + file.upId).find('.progress').css('width', '0%'); // 当前文件
    //$('#' + file.upId + '-progress').fadeOut();
}
/**
   隐藏删除按钮
*/
function hideDelBtn(file) {
    var $tr = $('#' + file.upId);
    var $td = $tr.find(".delete");
    $td.hide(); // 隐藏
}
/**
    查找第一上传后的文件对象
    @file
*/
function getOneFileObj(file ) {
    var obj = null;
    countUpFile.forEach(function (item, ind) {
        if (item.upId == file.upId) {
            obj = item;
        }
    });
    return obj;
}
/**
    生成html
*/
function addFileHtml(item) {
    var statusHtml = "等待";
    switch (parseInt(item.status)) {
        case 4: //等待上传
        statusHtml = '等待';
        break;
        case 3: //失败
        statusHtml = '<i class="iconfont" style="color: red" >&#xe6b9;</i> 失败';
        break;
        case 2: //正在进行中
        statusHtml = '<i class="iconfont" style="color: red" >&#xe6b9;</i> 未完';
        break;
        case 1: // 转换失败
        statusHtml = '<i class="iconfont" style="color: red" >&#xe6b9;</i> 失败';
        break;
        case 0: //成功
        statusHtml = '<i class="iconfont" style="color: green">&#xe772;</i>成功';
        break;

    }
$htmlUploadListBody.append('<li class="card-header item-content" id="' + item.upId + '">' +
        '<div class="progress"></div>'+
        '<div style="text-align: center;width:35%;"><marquee direction="right">' + (item.optype == 1 ? '新增' : '更新') + item.fileName + '</marquee></div>' +
        '<div style="text-align: center;width:15%">' + getFileSize(item.fileSize) + '</div>' +
        '<div style="text-align: center;width:20%">' + (item.filepath == null || item.filepath == '/' ? "/" : item.filepath) + '</div>' +
        '<div style="text-align: center;width:25%" class="jindu">'+statusHtml+'</div> ' +
        '<div style="text-align: center;width:5%" class="xuanzhuan-45" onclick=\'delSelectFileObj('+JSON.stringify(item)+')\'>+</div>' +
    '</li>');
}
/**
  添加文件记录进度
  @ file 文件对象
  @ flag 是否更新进度
*/
function addFile(file,flag){
    var isExist = false;
    // 判断文件是否存在
    countUpFile.forEach(function(item,index){
        if(item.upId == file.upId){
            isExist == true;
            return;
        }
    });
    //id 文件id name 文件名 size 文件大小 fpath 父级目录 state 文件状态 0传输完毕 1传输中 type 文件类型
    countUpFile.push(file);
    //消息提醒
    fileTosast("开始上传"+file.fileName);
    //allProgress();
}
/**
    文件更新 状态只有完成
*/
function updataFile(file, flag) {
    var index = 0;
    countUpFile.forEach(function (item, ind) {
        if (item.upId == file.upId) {
            index = ind;
        }
    });
    countUpFile[index].status = flag; // 文件状态
    //allProgress();  //更新进度
}
/**
队列中移除文件
@ id 文件队列id
@ upId 文件对象id
*/
function delSelectFileObj(fileobj) {
    if (fileobj.id != null && fileobj.id != "null") {   //重新上传 删除的时候这个为空值
        console.log(fileobj.id);
        // 参数二不传则为暂停上传
        try {
            uploader.removeFile(fileobj.id, true);
        } catch (e) { }
    }
    // 删除页面上的元素
    $("#" + fileobj.upId).remove();
    //计算进度
    countUpFile.forEach(function (item, index) {
        if (item.upId == fileobj.upId) {
            countUpFile.splice(index, 1);
        }
    });
    var redisparams = {};
    redisparams.upId = fileobj.upId;
    redisparams.status = fileobj.status;
    redisparams.md5 = fileobj.md5;
    redisparams.userid = fileobj.userid;
    redisparams.optype = fileobj.optype;
    // 清楚redis的数据
    getAjax(javaserver + "/Kapi/delcachefiles", redisparams, function (data) {
        if (data.errorcode != "0") {
            $.toast('删除失败！');
        }
    }, function () {  //上传失败
    }, "json", "post");
    //allProgress();
}


/**
总进度计算
*/
function allProgress() {
    $successUpFileNum.html(0);  //初始化完成数
    // 总文件数
    $countUpFileNum.html(countUpFile.length);
    countUpFile.forEach(function(item,index){
        if (item.status == 0) {
            // 上传完毕文件数
            $successUpFileNum.html(parseInt($successUpFileNum.html()) + 1);
        }
    });
    var allProgressNum = parseInt($successUpFileNum.html()) / parseInt($countUpFileNum.html());
    jQuery('#all-progress-bar').css('width', (allProgressNum * 100).toFixed(2) + '%');
}

//关闭文件上传
function closeFilePanel(title){
    $('.title').html(title);
    $.closeModal('.popup-file');
}
//左侧打开文件上传
$(document).on('click','#open-file', function () {
    // 关闭左侧
    $.closePanel();
    // 弹出上传层 上传到根目录
    fileOnload($(".title").html(),0,null);
});

// 文件提示
function fileTosast(msg){
    var $fileMsg = jQuery('.fileMsg');
    var $fileMsgTxt = jQuery('.fileMsgTxt');
    var $uploadFileText = jQuery("#uploadFileText");
    if (msg == undefined || msg == null || msg == "") {
        $uploadFileText.html("选择上传文件");
        //$fileMsg.hide();
    } else {
        //$fileMsg.show();
        $uploadFileText.html(msg);
        $fileMsgTxt.html(msg);
    }

}





/***************************************************************************/
//个人信息保存
/**************************************************************************/
function saveStuInfo(){
   //对电子邮件的验证
var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
var mobile=/^((1[345789]{1}))+\d{9}$/;

    sysUserInfo=getUserInfo();
    //赋值
    sysUserInfo.email=$("#userEmail").val();
    sysUserInfo.phone=$("#userPhone").val();
    sysUserInfo.identifyCard=$("#idcard").val();
	$("#errmsg").html("&nbsp;");

if(sysUserInfo.email==""){
	$("#errmsg").html("邮箱地址不能为空！");
	$("#userEmail").focus();
	return;
}else if(sysUserInfo.phone==""){
	$("#errmsg").html("手机号码不能为空！");
	$("#userPhone").focus();
	return;
}else if(sysUserInfo.identifyCard==""){
	$("#errmsg").html("身份证号不能为空！");
	$("#idcard").focus();
	return;
}else{
	if(!myreg.test(sysUserInfo.email)){
		$("#errmsg").html("邮箱地址格式错误！");
		$("#userEmail").focus();
		return;
	}else if(!mobile.test(sysUserInfo.phone)){
		$("#errmsg").html("手机号码格式错误！");
		$("#userPhone").focus();
		return;
	}else if(!/^\d{17}(\d|x)$/i.test(sysUserInfo.identifyCard)){
		$("#errmsg").html("身份证号格式错误！");
		$("#idcard").focus();
		return;
	}
  $.showIndicator(); //loading
}


    //请求
    getAjax(javaserver + "/exampaper/updateStuInfo",
                    { userid: sysUserInfo.user_ID, //用户id
                      email: sysUserInfo.email,//用户email
                      identifyCard:sysUserInfo.identifyCard,//用户身份证号
                      phone:sysUserInfo.phone//用户电话
                       }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            $.toast('修改成功！');
                             //修改成功，则放入缓存
                             SetlocalStorage("userinfo",sysUserInfo);
                        }  else {
                            $.toast('请求错误！');
                        }
       });
}
/***************************************************************************/
//考试历史的加载事件
/**************************************************************************/
$(document).on("pageInit", "#historyExam", function(e, id, $page) {
    if(isWeiXin()){
            $("title").html("历史考试");
     }
    var pageIndex=1;
    var pageSize=20;
    //登录用户
    sysUserInfo=getUserInfo();
    //请求,第一次加载  替换页面
    historyExam(1,pageSize,pageIndex);

})

 //分页
   function getMoreHistory(){
        var pageIndex=$("#pageIndex").html();
        pageIndex=parseInt(pageIndex)+1;
      //  console.log("每页条数："+pageSize);
        console.log("当前第几页："+pageIndex);

        //这里条数（每页20条，给死了）
        historyExam(2,20,pageIndex);//追加
   }
   //查询考试历史，调出来
   //optype   1,替换，2拼接
   /******************************************查询方法开始*************************************************/
   function historyExam(optype,pageSize,pageIndex){
   sysUserInfo=getUserInfo();
    //请求
    getAjax(javaserver + "/exampaper/historyPaper",
                    { userid: sysUserInfo.user_ID, //用户id
                      pageIndex: pageIndex,
                      pageSize:pageSize
                       }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                data.datas[i].exampaper.scoreId=data.datas[i].scoreId;
                                block+="<li><a href='#' onclick='openSj("+JSON.stringify(data.datas[i])+",99)' class='item-link item-content'><div class='item-inner'><div class='item-title-row'><div class='item-title'>"+data.datas[i].paperName+"</div></div><div class='item-subtitle'>得分：<b style='color: #fe5945'>"+data.datas[i].score+"</b>分</div><div class='item-text'>考试时间："+data.datas[i].scoreTime+"</div></div></a></li>";
                           }
                           //替换
                           if(optype==1){

                                 if(block!=""){
                                        $("#historyList").html(block);
                                        $("#moreHis").show();
                                 }else{
                                        $("#lishinodate").show();
                                        $("#moreHis").hide();
                                 }
                           //拼接
                           }else{
                                if(block!=""){
                                        $("#historyList").append(block);
                                 }else{
                                        //没有数据可获取了
                                        $("#moreHis").hide();
                                 }
                           }
                           //把当前页给页面
                          $("#pageIndex").html(pageIndex);

                            //如果总条数小于等于每页显示条数
                          //隐藏加载更多，
                           if(pageIndex>=data.pageCount){
                                 $("#moreHis").hide();
                          }else{
                                $("#moreHis").show();
                          }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
   }
   /******************************************查询方法结束*************************************************/
   $(document).on("pageInit", "#studentInfo", function (e, id, $page) {
    if(isWeiXin()){
            $("title").html("个人信息");
            $("#idcard").parent().parent().parent().parent().remove();
     }
     sysUserInfo=getUserInfo();
    //个人中心信息
   $("#userImg").attr("src",sysUserInfo.user_Img);
   $("#userEmail").val(sysUserInfo.email);
   $("#userPhone").val(sysUserInfo.phone);
   $("#idcard").val(sysUserInfo.identifyCard);
   $("#userName").html(sysUserInfo.username);
   $("#userNo").html(sysUserInfo.user_No);

   //学员组织架构信息
   $("#userOrg").html(sysUserInfo.allorgname==""?"暂无":sysUserInfo.allorgname);
   $("#userGroup").html(sysUserInfo.allgroupname==""?"暂无":sysUserInfo.allgroupname);
   $("#userRole").html(sysUserInfo.allrolename==""?"暂无":sysUserInfo.allrolename);
})
//*************************************跳转公开课************************************/
function goPublicCourse(){
    if(isWeiXin()){
            $("title").html("公开课");
     }else{
            $(".title").html("公开课");
    }
    var courseName=$('#publicCourseName').val();
    $("#publicCourseNameParams").val(courseName);
    getPublicCourse(true);
}
//文件名称筛选
$('#publicCourseNameParams').keypress(function (e) { //这里给function一个事件参数命名为e，叫event也行，随意的，e就是IE窗口发生的事件。
    var key = e.which; //e.which是按键的值
    if (key == 13) {
        goPublicCourse();
    }
});
/***************************************************************************/
// 公开课加载事件
/**************************************************************************/
// 筛选类型
var publicType = [{ name: '视频', flag: false, value: 1 },
        { name: '文件', flag: false, value: 2 },
        { name: '试卷', flag: false, value: 3 },
        { name: '线下', flag: false, value: 4 },
        { name: '题库', flag: false, value: 5 },
        { name: '直播', flag: false, value: 6 },
        { name: '图文', flag: false, value: 8 }];
$(document).on("pageInit", "#course", function(e, id, $page) {
    // 当前页
    var pageIndex = 1;
    // 每页显示的条数
    var pageSize = 10;
    // 筛选类型
    var publicTypeHtml = "";
    for (var i = 0; i < publicType.length; i++) {
        publicTypeHtml += "<span class=\"shaixuan\" onClick='publicCourseType("+JSON.stringify(publicType[i])+",this)'>"+publicType[i].name+"</span>";
    }
    $('#publicType').append(publicTypeHtml);
    // 登录用户
    sysUserInfo = getUserInfo();

    getKnowledgeList("",0);
});
var publicCourseParams = {
    orgid:"",
    knowledgeids:"",
    searchText:"",
    searchType:3,
    cstype:"",
    pageIndex:1,
    pageSize:10
}

// 公开课总数
var publicCourseCount = 0;
// 公开课完整html
var courseHtml = "";
// 公开课内容更html
var courseContext = "";
// loading
var publicCourseLoading = false;
// 获取公开课
function getPublicCourse(flag){
    sysUserInfo=getUserInfo();
    publicCourseParams.orgid = sysUserInfo.organization_ID;
    publicCourseParams.userid = sysUserInfo.user_ID;
    var txtName = $('#publicCourseNameParams')[0].value;
    if(!isNull(txtName)){
        // 公开课完整html
        courseHtml = "";
        // 公开课内容更html
        courseContext = "";
        publicCourseParams.searchText = txtName;
    }else{
        publicCourseParams.searchText = "";
    }
    if(publicCourseLoading){
        $.toast('正在请求数据');
    }
    publicCourseLoading = true;
    getAjax(javaserver + "/course/findOpen",publicCourseParams,function(response){
        publicCourseLoading = false;
        $('#courseContent').html("");

        if(response.errorcode == "0"){
            if(flag){
                // 公开课完整html
                courseHtml = "";
                // 公开课内容更html
                courseContext = "";
            }
            for (var i = 0; i < response.datas.length; i++) {
                //console.log(response.datas[i]);
                var courseimgMid = response.datas[i].course_img;
                if(courseimgMid.indexOf("/images/train") >= 0){
                  courseimgMid = ".." + response.datas[i].course_img;
                }
                courseContext +='<div class="col-50">'+
                             '  <div class="card color-default" style="margin: .5rem 0">'+
                            '      <a href="#" onClick=\'openKe_collection("'+response.datas[i].course_Id+'")\'>'+
                            '          <div  style="background: #eee;height: 120px;" valign="bottom" class="card-header color-white no-border no-padding" >'+
                            '              <img class="card-cover" src="'+courseimgMid+'" alt="" onerror="javascript:this.src=\"../res/img/fengmian001.gif\"" style="max-width: 100%;margin: 0 auto;width:auto;height: 120px;">'+
                            '          </div>'+
                            '           <div class="card-content">'+
                            '               <div class="card-content-inner">'+
                            '                   <p>'+
                            response.datas[i].course_Name.replace(/<\/?[^>]*>/g,'')+'</p>'+
                            '                   <p class="color-gray">'+
                            '                           <i class="iconfont">&#xe6ce;</i>包含'+response.datas[i].sectionSum+'节课'+
                            '                   </p>'+
                            '               </div>'+
                            '           </div>'+
                            '       </a>'+
                            '       <div class="card-footer">'+
                            '           <span class="link"><i class="iconfont">&#xe91b;</i>'+response.datas[i].viewCount+'</span> '+
                            //收藏
                            '           <span class="link" onClick=\'collCourse('+JSON.stringify(response.datas[i]).replace(/<\/?[^>]*>/g,'')+',this)\'>'+(response.datas[i].collections?'<i class="iconfont">&#xe72f;</i>':'<i class="iconfont">&#xe748;</i>')+
                            '<span>'+(isNull(response.datas[i].collectionCount) || response.datas[i].collectionCount < 0?0:response.datas[i].collectionCount)+'</span></span>'+
                            '       </div>'+
                            '   </div>'+
                            '</div>';
            }
            // 没有任何数据
            if(courseContext  == ""){
                courseHtml = '<div style="text-align:center;"><img src="../res/img/none.png" style="width: 50%;margin-top: 20%;"><div>暂无数据</div></div>';
            }else{
                courseHtml = '<div class="row">'+courseContext+'</div>';
            }
            $('#courseContent').append(courseHtml);
            // 获取展现出来的个数
            var contextNum = $('#courseContent>div').find('.col-50').length;
            if(contextNum < response.numCount){
                // 判断加载更多是否存在
                if(!document.getElementById('moreHis')){
                    $('#courseContent').append('<div style="margin: 1rem auto;padding-bottom: 2.5rem;" id="moreHis" onClick=\'nextPublicCourse('+JSON.stringify(publicCourseParams)+')\'><center>点击加载更多('+contextNum+'/'+response.numCount+')</center></div>');
                }
            }else{ // 没有更多了
                $('#moreHis').remove();
            }
            publicCourseCount = response.numCount;
        }else{
             $.toast('公开课信息获取失败！');
        }
    },"","json");
}
// 下一页
function nextPublicCourse(params){
    params.pageIndex ++;
    publicCourseParams = params;
    getPublicCourse()
}
// 排序
function publicCourseSort(int,text){
    // 关闭层
    $.closeModal('.corseSort');
    // 排序文字
    $('#publicCourseText').html(text);
    publicCourseParams.searchType = int;
    publicCourseParams.pageIndex = 1;

    // 清空课程名称搜索
    $('#publicCourseNameParams')[0].value = "";
    publicCourseParams.searchText = "";
    // 知识分类清空
    $("#"+publicCourseParams.knowledgeids).removeClass('active');
    publicCourseParams.knowledgeids = "";
    getPublicCourse(true);
}
// 选择类型
function publicCourseType(item,obj){
    if(item.flag){
        item.flag = false;
        $(obj).removeClass('active');
    }else{
        item.flag = true;
        $(obj).addClass('active');
    }
    $(obj).attr('onClick','publicCourseType('+JSON.stringify(item)+',this)');
    var paramsText = "";
    for (var i = 0; i < publicType.length; i++) {
        if(publicType[i].value == item.value){
            publicType[i].flag = item.flag;
            if(item.flag){
                paramsText+=item.value+",";
            }
        }else{
            if(publicType[i].flag){
                paramsText+=publicType[i].value+",";
            }
        }
    }
    // 筛选类型
    publicCourseParams.cstype = paramsText;
    publicCourseParams.pageIndex = 1;
    // 发送请求
    getPublicCourse(true);
}
// 获取知识分类
var knowledgeList = [];
var knowHtml = $('#knowList');
knowHtml.html('');
// 知识库id  索引
function getKnowledgeList(know,index){
    sysUserInfo = getUserInfo();
    var knowledgeParams = {
        userId: sysUserInfo.user_ID,
        startDate: "",    // 起始时间
        endDate: "", // 结束时间
        searchName: "", //搜索内容
        knowledge_Id: know, // 子集搜索
        orgId: sysUserInfo.organization_ID,   // 企业id
        org_Name: sysUserInfo.organization_Name,   // 企业id
        powerLV: 2 //登录人的系统角色
    }
    // 遍历数据
    for (var i = knowledgeList.length; i > index; i--) {
        $('#P'+i).remove();
    }
    // 清除
    if(isNull(know)){
       publicCourseParams.knowledgeids = "";
    }else{
       $("#"+publicCourseParams.knowledgeids).removeClass('active');
       if(publicCourseParams.knowledgeids == know){
           publicCourseParams.knowledgeids = "";
       }else{
           publicCourseParams.knowledgeids = know;
           $("#"+publicCourseParams.knowledgeids).addClass('active');
       }
    }
    getPublicCourse(true);
    // 删除数据
    knowledgeList.splice(index,knowledgeList.length-index);
    getAjax(javaserver + "/knowledge/findKnowledgeList",knowledgeParams,function(response){
        if(response.errorcode == 0){
            var knowObj = response.datas;
            if(!isNull(knowObj) && knowObj.length >0){
                knowledgeList.push(knowObj);
                var itemHtml = "<p id='P"+knowledgeList.length+"'>第"+knowledgeList.length+"分类:</br>";
                for (var knowItem = 0; knowItem < knowObj.length; knowItem++) {
                    itemHtml+= '<span class="shaixuan" id="'+knowObj[knowItem].knowledge_Id+'" onClick="getKnowledgeList(\''+knowObj[knowItem].knowledge_Id+'\','+knowledgeList.length+',this)">'+knowObj[knowItem].knowledge_Name+'</span>'
                }
                itemHtml += "</p>";
                knowHtml.append(itemHtml);
            }
        }else{
            $.toast('请求失败');
        }
    },"","json");
}


// 收藏/取消
function collCourse(item,obj){
    if(publicCourseLoading){
        $.toast('正在提交');
        return;
    }
    sysUserInfo=getUserInfo();
    var collParams = {
        collectionsId:"",
        courseName:item.course_Name,
        userId:sysUserInfo.user_ID,
        courseId: item.course_Id
    };
    if(item.hasOwnProperty('collections')){ // 存在说明取消收藏
        collParams.collectionsId =  item.collections.id;
    }
    publicCourseLoading = true;
    getAjax(javaserver + "/course/modifyCollectionCourse",collParams,function(response){
        publicCourseLoading = false;
        if(response.errorcode == 0){
            if(item.hasOwnProperty('collections')){ // 存在说明取消收藏
                delete item.collections;
                if(isNull(item.collectionCount) || item.collectionCount <= 0){
                    item.collectionCount = 0;
                }else{
                    item.collectionCount--;
                }
                obj.innerHTML='<i class="iconfont">&#xe748;</i>'+item.collectionCount;
            }else{ // 取消收藏
                item.collections = {id: response.data}
                if(isNull(item.collectionCount) || item.collectionCount <= 0){
                    item.collectionCount = 1;
                }else{
                    item.collectionCount++;
                }
                obj.innerHTML='<i class="iconfont">&#xe72f;</i>'+item.collectionCount;
            }
            console.log(item,obj.childNodes[1].innerText);
            // 赋值
            $(obj).attr('onClick',"collCourse("+JSON.stringify(item)+",this)");
            obj.childNodes[1].innerText = item.collectionCount;
        }else{
            $.toast('提交失败！');
        }
    },'','json');
}
// 公开课判空事件
function isNull(text){
    if(text==null||text==undefined||text==""){
        return true;
    }else{
        return false;
    }

}

/***************************************************************************/
//课程收藏的加载事件
/**************************************************************************/
$(document).on("pageInit", "#courseCollection", function(e, id, $page) {
    if(isWeiXin()){
            $("title").html("课程收藏");
     }
    var pageIndex=1;
    var pageSize=20;
    //登录用户
    sysUserInfo=getUserInfo();
    //请求,第一次加载  替换页面
    courseCollection(1,pageSize,pageIndex);

})

 //分页
   function getMoreCollection(){
        var pageIndex=$("#pageIndex").html();
        pageIndex=parseInt(pageIndex)+1;
      //  console.log("每页条数："+pageSize);
        console.log("当前第几页："+pageIndex);

        //这里条数（每页20条，给死了）
        courseCollection(2,20,pageIndex);//追加
   }
   //查询考试历史，调出来
   //optype   1,替换，2拼接
   /******************************************查询方法开始*************************************************/
   function courseCollection(optype,pageSize,pageIndex){
   sysUserInfo=getUserInfo();
    //请求
    getAjax(javaserver + "/exampaper/courseCollection",
                   { userid: sysUserInfo.user_ID, //用户id
                       orgid: sysUserInfo.organization_ID,
                      pageIndex: pageIndex,
                      pageSize:pageSize
                       }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                //如果最后修改日期为null，吧创建日期给他
                                if(data.datas[i].upd_Date==undefined||data.datas[i].upd_Date==null){
                                    data.datas[i].upd_Date=data.datas[i].create_Date
                                }
                                if(data.datas[i].course_img.indexOf("http://") <= 0){
                                block+="<a href='#' onClick='openKe_collection(" + JSON.stringify(data.datas[i].course_Id) + ","+null+","+ JSON.stringify((data.datas[i].course_Detailed&&data.datas[i].course_Detailed)?data.datas[i].course_Detailed:null)+ ")' class='item-link item-content'><div class='item-media'><img src='../.."+data.datas[i].course_img+"'  style='width: 5rem;height:3rem;'></div><div class='item-inner'><div class='item-title-row'><div class='item-title' style='width:10rem;'>"+data.datas[i].course_Name+"</div></div><div class='item-text'>课程最后更新时间："+data.datas[i].upd_Date+"</div></div></a></li>";
                              }else {
                                {
                                  block+="<a href='#' onClick='openKe_collection(" + JSON.stringify(data.datas[i].course_Id) + ","+null+","+ JSON.stringify((data.datas[i].course_Detailed&&data.datas[i].course_Detailed)?data.datas[i].course_Detailed:null)+ ")' class='item-link item-content'><div class='item-media'><img src='"+data.datas[i].course_img+"'  style='width: 5rem;height:3rem;'></div><div class='item-inner'><div class='item-title-row'><div class='item-title' style='width:10rem;'>"+data.datas[i].course_Name+"</div></div><div class='item-text'>课程最后更新时间："+data.datas[i].upd_Date+"</div></div></a></li>";
                                }
                              }
                           }
                           //替换
                           if(optype==1){

                                 if(block!=""){
                                        $("#courseCollecList").html(block);
                                        $("#moreCollec").show();
                                 }else{
                                        $("#shoucangnodate").show();
                                        $("#moreCollec").hide();
                                 }
                           //拼接
                           }else{
                                if(block!=""){
                                        $("#courseCollecList").append(block);
                                 }else{
                                        //没有数据可获取了
                                        $("#moreCollec").hide();
                                 }
                           }
                           //把当前页给页面
                          $("#pageIndex").html(pageIndex);
                          //如果总条数小于等于每页显示条数
                          //隐藏加载更多，
                          if(pageIndex>=data.pageCount){
                                 $("#moreCollec").hide();
                          }else{
                                $("#moreCollec").show();
                          }
                        }  else {
                            $.toast('请求错误！');
                        }
   });
   }
   /******************************************查询方法结束*************************************************/
/***************************************************************************/
//任务过期提醒的加载事件
/**************************************************************************/
$(document).on("pageInit", "#geren_tixing", function(e, id, $page) {

sysUserInfo=getUserInfo();
    //请求
    getAjax(javaserver + "/exampaper/getSevenArrange",
                   { orgid: sysUserInfo.organization_ID,
                   userid: sysUserInfo.user_ID,
                   org_Id:sysUserInfo.allorgid,
                   role_Id:sysUserInfo.allroleid,
                   user_groupId:sysUserInfo.allgroupid }, function (data) {
                        data = strToJson(data);
                        if (data.errorcode == 0 ) {
                            var block="";
                           for(var i=0;i<data.datas.length;i++){
                                var d1=new Date(data.datas[i].endDate).getDay();;
                                if(data.datas[i].messageType==1)
                                block+="<li><a href='#renwu' class='item-link item-content'><div class='item-media'>星期" + "日一二三四五六".charAt(d1)+"</div><div class='item-inner'><div class='item-title-row'><div class='item-title'>任务名称："+data.datas[i].typeName+"</div></div><div class='item-text'>任务结束时间："+data.datas[i].endDate+"</div></div></a></li>";
                                else
                                block+="<li><a href='#renwu' class='item-link item-content'><div class='item-media'>星期" + "日一二三四五六".charAt(d1)+"</div><div class='item-inner'><div class='item-title-row'><div class='item-title'>线下地址："+data.datas[i].typeName+"</div></div><div class='item-text'>线下结束时间："+data.datas[i].endDate+"</div></div></a></li>";
                           }

                                if(block!=""){
                                        $("#tixingList").html(block);
                                 }else{
                                        $("#tixingList").html("<div>暂无数据</div>");
                                 }
                        }  else {
                            $.toast('请求错误！');
                        }
   });

})

/**********直播界面初始化***********/
$(document).on("pageInit", "#livedetail", function(e, id, $page) {
    sysUserInfo=getUserInfo();
    var livedata = GetlocalStorage("LiveBroadcast_Info");
    //var roomPwd =livedata.content.liveobj.roomid;
    var liveName = livedata.CSNAME;
    var liveStartTime = livedata.CSSTIME;  //直播开始时间
    $("#livename").text(liveName);  //直播名称
    var liveInfoObj = livedata.liveObj;
    var roomid = liveInfoObj.roomid;
    var rtmpUrl = liveInfoObj.playrmtpurl;
    var luzhi_url = liveInfoObj.luzhi_url; //回放地址
    BaiDuPlayer.play("","", rtmpUrl);
    flashvars = {
        rooid: "",
        rid: roomid,
        rtmpVideo: '',
        name: sysUserInfo.user_Name,
        user_img: sysUserInfo.user_Img,
        id: sysUserInfo.user_ID,
        type: 1,
        record: 'false',
        bookname: "fff",
        data: livedata.CSSTIME,  //直播开始时间
        createuserName: sysUserInfo.createUserName,
        teacherid: "",
        ms: "v"    //v 声音 s 视频
    };
    setTimeout(function(){
    Messaging.initMsg(flashvars);
    }, 3000);

});

/**********人员管理界面初始化start***********/
/** 人员列表初始化 **/
$(document).on("pageInit", "#usermanager", function(e, id, $page) {
    $("title").html("人员管理");
    //登录用户
    sysUserInfo=getUserInfo();
    //请求,第一次加载  替换页面
    if(sysUserInfo.powerLV != "99"){
      ManagerGetUserList(1, 20);
    }else {
      $("#userlistnodate").html("<p style='color:red;'>您暂无权限！</p>");
    }
});
//加载更多
function GetMoreUser(){
  var pageIndex=$("#pageIndex").html();
  pageIndex=parseInt(pageIndex)+1;
  ManagerGetUserList(pageIndex, 20);
}
///获取人员列表
function ManagerGetUserList(pageIndex, pageSize, flag){
  getAjax(javaserver + "/PersonnelManagement/PersonnelGetList", {userId:sysUserInfo.user_ID, powerLV:sysUserInfo.powerLV, organization_ID: sysUserInfo.organization_ID,pageIndex:pageIndex, pageSize:pageSize, }, function (data) {
      data = strToJson(data);
      if (data.errorcode == 0 && data.datas.length > 0) {
          var block = "";
          for (var i = 0; i < data.datas.length; i++) {
              block+="<li class=\'item-content\' data='"+data.datas[i].user_ID+"'><div class=\'item-media\' style='width:100%;'><img src=\'"+data.datas[i].user_Img+"\'</div><div class=\'item-inner\'><div class=\'item-title\' style='margin-left:0.5rem;'>"+data.datas[i].user_Name+"</div><div class=\"item-after\"></div><a href=\"userdetail.html?userid="+data.datas[i].user_ID+"\" class=\"item-after item-link\" style='padding:0rem 0.2rem;'><i class=\"icon iconfont icon-shangyiye2-copy\"></i></a></div></li>";
          }
          if(flag == true){
            $("#usermanagerlist").html(block);
          }else {
            $("#usermanagerlist").append(block);
          }

          $("#userlistAllCount").text("共" + data.numCount + "人");
          $("#userlistAllCount").show();
          $("#pageIndex").html(pageIndex);
          //隐藏分页
          if(pageIndex>=data.pageCount){
              $("#moreuserbtn").hide();
          }else{
              $("#moreuserbtn").show();
          }
      }else {
          $.toast('人员加载失败');
      }
  });
}
/** 人员添加编辑初始化 **/
$(document).on("pageInit", "#useraddeditform", function(e, id, $page) {
    $("title").html("添加/编辑人员");
    //登录用户
    sysUserInfo=getUserInfo();
    //请求,第一次加载  替换页面
    if(sysUserInfo.powerLV != "99"){
      var userinfoO = GetlocalStorage("ManagerUserIfno");
      if(userinfoO != null){
        $(".username").val(userinfoO.user_Name);
        $(".useraccount").val(userinfoO.user_Account);
        $(".userpwd").val(userinfoO.user_Pwd);
        $(".useremail").val(userinfoO.email);
        $(".userphone").val(userinfoO.phone);
        //alert(userinfoO.user_Img);
      }
    }else {
      $(".userform").html("<p style='color:red;'>您暂无权限！</p>");
    }
});
function userdetailback(){
   SetlocalStorage("ManagerUserIfno", "");
   $.router.back("userlist.html");
}
//添加人员
function  adduserSave(){
    var id= QueryString("userid");
    if($(".username").val() == ""){
      $.toast("姓名不能为空!");
      return false;
    }else if($(".useraccount").val() == "") {
      $.toast("登陆账号不能为空!");
      return false;
    }else if($(".userpwd").val() == "") {
      $.toast("密码不能为空!");
      return false;
    }else if($(".userpwd").val().length < 6) {
      $.toast("密码长度需要大于6");
      return false;
    }
    var userobj = {};
    if(id == null){
      id = guid();
    }
    userobj = {
      "user_ID":QueryString("userid"),
      "organization_ID":sysUserInfo.organization_ID,
      "organization_Name":sysUserInfo.organization_Name,
      "user_Account":$(".useraccount").val(),
      "user_Pwd":$(".userpwd").val(),
      "powerLV":"99",
      "user_Name":$(".username").val(),
      "email":$(".useremail").val(),
      "phone":$(".userphone").val(),
      "createUserId":sysUserInfo.user_ID,
      "createUserName":sysUserInfo.user_Name,
      "createUserName":sysUserInfo.user_Name,
      "user_Img":GetlocalStorage("ManagerUserIfno").user_Img
    };
    var userOrgList = [{
      "organization_ID":sysUserInfo.organization_ID,
      "organization_Name":sysUserInfo.organization_Name
    }];
    var userLogList = [{
      "logText":$(".userremark").val()+""
    }];
    getAjax(javaserver + "/PersonnelManagement/PersonnelAddEdit", {loginUserId:sysUserInfo.user_ID, data:JSON.stringify(userobj), userOrgList: userOrgList, userLogList: userLogList}, function (data) {
        if(strToJson(data).errorcode == "0"){
          SetlocalStorage("ManagerUserIfno", "");
          $.toast("操作成功");
          $.router.back("userlist.html");
          ManagerGetUserList(1, 20, true);
        }
    });
}
/** 人员详细界面初始化 **/
$(document).on("pageInit", "#userdetailF", function(e, id, $page) {
    $("title").html("人员详细");
    var ManagerUserIfno = {};
    if(QueryString("userid") != null){
      getAjax(javaserver + "/PersonnelManagement/PersonnelGetKey", {user_ID:QueryString("userid")}, function (data) {
          if(strToJson(data).errorcode == "0"){
            var userobj = strToJson(data).data;
            ManagerUserIfno = JSON.stringify(strToJson(data).data);
            for(var item in userobj){
                if(item == "state"){
                    if(userobj[item] == "0"){
                      $("." + item).text("正常");
                      $("." + item).css("color", "#6fc743");
                    }else{
                      $("." + item).text("锁定");
                      $("." + item).css("color", "#fd5555");
                    }
                }else if(item == "user_Pwd"){
                    $("." + item).text("******");
                }else{
                  $("." + item).text(userobj[item]);
                }
            }
          }
      });
    }else {
        $.toast("信息错误");
    }
    //绑定编辑按钮
    $("#useredit").click(function(){
      SetlocalStorage("ManagerUserIfno", ManagerUserIfno);
      $.router.loadPage("userform.html?userid=" + QueryString("userid"));
    });
    //绑定删除按钮
    $(".userdetaildelete").click(function(){
      $.confirm("确定是否要删除此人信息？", function () {
          getAjax(javaserver + "/PersonnelManagement/PersonnelDel", {userId:QueryString("userid")}, function (data) {
              if(strToJson(data).errorcode == "0"){
                $.toast("删除成功!");
                $.router.loadPage("userlist.html");
              }else{
                $.toast("删除失败,请重试!");
              }
          });
      });
    });
});
/**********人员管理界面初始化end***********/
/** 公共页面初始化start **/
$(document).on("pageInit", "#CommonsPage", function(e, id, $page) {
  $.showPreloader();
  apiready = function () {
    var resultUrl = api["pageParam"]["resultUrl"]; //需要跳转的地址
    $("#CommoniframeId").attr("src", resultUrl);
    $(".title").html(resultUrl);
    $(".title").css("left", "25%");
    var iframe = document.getElementById('CommoniframeId');
    //监听iframe中页面是否加载完成
    iframe.addEventListener( "load", function(){
         //代码能执行到这里说明已经载入成功完毕了
      $(".title").html(iframe.contentWindow.document.getElementsByTagName("title")[0].innerHTML);
      $(".title").css("left", "0px");
      $.hidePreloader();
      this.removeEventListener( "load", arguments.call, false);  //移除监听
   }, false);
  }
});
//返回关闭Frame
function  CloseComHtml() {
  api.closeFrame({
    name: 'ComonFrame'
});
}
/** 公共页面初始化End **/
/** 课程管理页面初始化Start **/
$(document).on("pageInit", "#coursemanager", function(e, id, $page) {
  GetCourseList(1, "", "desc");
  //排序条件
  $(document).on('click','#course_paixu', function () {
    var buttons1 = [
      {
        text: '课件名称',
        onClick: function() {
          GetCourseList(1, "", "desc");
        }
      },
      {
        text: '课件创建时间倒序',
        onClick: function() {
          GetCourseList(1, "searchType:'1'", "desc");
        }
      },
      {
        text: '课件修改时间倒序',
        onClick: function(){
           GetCourseList(1, "searchType:'4'", "desc");
        }
      }
    ];
    var buttons2 = [
      {
        text: '取消',
        bg: 'danger'
      }
    ];
    var groups = [buttons1, buttons2];
    $.actions(groups);
  });
});

function GetCourseList(pageIndex, params, orderby){
  sysUserInfo=getUserInfo();
  var canshu ={userid:sysUserInfo.user_ID,
      orgid:sysUserInfo.organization_ID,
      powerLV:sysUserInfo.powerLV,
      searchType:"1",  //1.文件名称2.文件大小3.文件上传时间4.文件修改时间
      pageIndex:pageIndex,
      pageSize:15,
      orderby:orderby,
      screenType:"4" //筛选类型(1.录入时间查询 2.教师查询 3.操作人查询 4.课程名称)
    };
  if(params == ""){
    canshu.searchType = "1";
  }
  else{
    canshu.screenType = params.split(":")[1];
  }
  $.showIndicator(); //loading
  getAjax(javaserver + "/course/findCourseinfo",canshu,function(data){
        var courseArr = strToJson(data);
        var courseListStr = "";
        if(courseArr.errorcode == "0"){
          for(var i = 0; i < courseArr.datas.length; i++){
            courseListStr += "<li>";
            courseListStr += "        <a href=\"#\" class=\"item-link item-content\">";
            var courseimg = courseArr.datas[i].course_img;
            if(courseimg.indexOf("http://") < 0){
              courseimg = javafile + courseimg;
            }
            courseListStr += "          <div class=\"item-media\"><img src=\""+courseimg+"\" style='width: 4rem;'></div>";
            courseListStr += "          <div class=\"item-inner\">";
            courseListStr += "            <div class=\"item-title-row\">";
            courseListStr += "              <div class=\"item-title\">"+courseArr.datas[i].course_Name+"</div>";
            courseListStr += "            </div>";
            courseListStr += "            <div class=\"item-subtitle\"><i class=\"iconfont icon-jiedian1\"></i>"+courseArr.datas[i].course_Sum+"小结<span style='padding:0 0.5rem;'>|</span><i class=\"iconfont icon-anli_renshu_1\"></i>"+courseArr.datas[i].viewCount+"人浏览</div>";
            courseListStr += "            <div class=\"item-text\"><i class=\"iconfont icon-ren\"></i>"+courseArr.datas[i].create_Name+"<span style='padding:0 0.5rem;'>|</span><i class=\"iconfont icon-shijianaini\"></i>"+courseArr.datas[i].create_Date.split(" ")[0]+"</div>";
            courseListStr += "          </div>";
            courseListStr += "        </a>";
            courseListStr += "      </li>";
          }
          $("#pageIndex").html(courseArr.pageIndex);
          if(courseListStr == ""){ //表示没有数据
            $("#courselistnodate").show();
          }else {
            if(pageIndex == "1"){
              $("#coursemanagerlist").html(courseListStr);
            }else {
              $("#coursemanagerlist").append(courseListStr);
            }
            if(pageIndex < courseArr.pageIndex){
              $("#moreuserbtn").show();
            }
          }
        }
        $.hideIndicator(); //闅愯棌loading
  });
}
//加载更多课程
function GetMoreCourse(){
  var pageIndex = parseInt($("#pageIndex").html()) + 1;
  GetCourseList(pageIndex, "", "desc");
}

//课程文本框搜索
function CourseSearchInput(index){
    //显示搜索框
    if(index==1){
         $("#courseserch").show();
         $("#searchCourseName").focus();
    }else{
         $("#courseserch").hide();
    }
}
//课程列表返回
function courselistback(){
  $.showIndicator(); //loading
  $.router.loadPage("../../home.html#stuInfo");
  $(".title").html("管理");
}
/** 课程管理页面初始化End **/
/** 课程添加页面初始化Start **/
$(document).on("pageInit", "#courseaddeditform", function(e, id, $page) {
    sysUserInfo=getUserInfo();
    changcourseimg();
    //初始化课件分类，便于绑定picker
    getAjax(javaserver + "/knowledge/findKnowledgeList", {userId:sysUserInfo.user_ID,
        orgId:sysUserInfo.organization_ID,
        powerLV:sysUserInfo.powerLV
      },function(data){
        data = strToJson(data);
        var CtypeStr = "";
        if(data.errorcode == "0"){
          for(var i = 0; i<data.datas.length;i++){
            CtypeStr+="<option value=\""+data.datas[i].knowledge_Id+"\">"+data.datas[i].knowledge_Name+"</option>";
          }
          $(".coursetype").append(CtypeStr);
        }
    });
    AddChaper(null);  //初始化章节
    AddNodules(null);  //初始化小结
});

function IsOpenCourse(){
  if($(".isopensourse").val() == "0"){
    $(".isopensourse").val("1");
  }else {
    $(".isopensourse").val("0");
  }
}
//添加课程下一步上一步
function changedivshow(flag){
  if(flag=="1"){
    $("#courseaddeditone").hide();
    $("#courseaddedittwo").show();
  }else{
    $("#courseaddeditone").show();
    $("#courseaddedittwo").hide();
  }
}
//取消添加课程
function coursedetailcancel(){
  $.confirm("确定取消添加课程吗?", function () {
    $.router.loadPage({
      url: "courselist.html",
      noAnimation: true,
      replace: true
    });
  });
}
//随机改变课程封面
function changcourseimg(){
   var imgNum = Math.round(Math.random() * 7);
   $(".courseimg").attr("src", domain + "/images/train/fengmian00" + imgNum + ".gif");
}
//上传课程封面
function fileupcourseimg(){
  api.getPicture({
    sourceType: 'library',
    encodingType: 'jpg',
    mediaValue: 'pic',
    destinationType: 'base64',
    allowEdit: true,
    quality: 80,
    //targetWidth: 300,
    //targetHeight: 100,
    saveToPhotoAlbum: false
}, function(ret, err) {
    if (ret) {
        $.showIndicator();
        var imgurl = strToJson(ret).base64Data;
        var form=document.forms[0];
        var formData = new FormData(form);   //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数
        //convertBase64UrlToBlob函数是将base64编码转换为Blob
        formData.append("file",convertBase64UrlToBlob(imgurl), "file_"+Date.parse(new Date())+".jpg");
        formData.append("state","1");
        formData.append("userid",sysUserInfo.user_ID);
        $.ajax({
          url : javafile + "/file/uploadCover",
          type : "POST",
          data : formData,
          dataType:"json",
          processData : false,         // 告诉jQuery不要去处理发送的数据
          contentType : false,        // 告诉jQuery不要去设置Content-Type请求头
          success:function(data){
            setTimeout(function () {
                $.hideIndicator();$.showIndicator();
            }, 10);
              $(".courseimg").attr("src", data.errormsg);
          },
          xhr:function(){            //在jquery函数中直接使用ajax的XMLHttpRequest对象
              var xhr = new XMLHttpRequest();
              xhr.upload.addEventListener("progress", function(evt){
                  if (evt.lengthComputable) {
                      var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                      //console.log("正在提交."+percentComplete.toString() + '%');        //在控制台打印上传进度
                  }
              }, false);
              return xhr;
          }
        });
    } else {
        setTimeout(function () {
            $.hideIndicator();
        }, 10);
        if(err.msg.indexOf("canceled") < 0){
          $.toast("上传失败");
        }
    }
});
}
//修改章节名称、修改小结名称
function ChangeChapterName(obj) {
  $.prompt('请填写章节名称','', function (value) {
      $(obj).parent().find("span").text(value);
  });
}
//删除章节
function Deletechapter(obj){
  $.confirm('确定删除该章节吗?', function () {
      $(obj).parent().parent().remove();
      $.toast("删除成功");
  });
}
//删除章节下的小结
function Deletenodulesli(obj){
  $.confirm('确定删除该小节吗?', function () {
      $(obj).parent().parent().parent().remove();
      $.toast("删除成功");
  });
}
//修改小结的类型
function changenodulestypebtn(obj) {
  var propoverHtml = "";
  var id = $(obj).attr("id");
  propoverHtml += "<div class=\'popover corsetypeset\' id=\'corsetypeset\'>";
  propoverHtml += "     <div class=\'popover-angle no-top\'></div>";
  propoverHtml += "     <div class=\'popover-inner\'>";
  propoverHtml += "           <div class=\'list-block\'>";
  propoverHtml += "               <ul>";
  propoverHtml += "                  <li><a href=\'#\' class=\'list-button item-link\' onClick=\'changenodulestype(this,0,\""+id+"\")\'><i class=\'icon iconfont icon-shipin\'></i>视频</a></li>";
  propoverHtml += "                  <li><a href=\'#\' class=\'list-button item-link\' onClick=\'changenodulestype(this,1,\""+id+"\")\'><i class=\'icon iconfont icon-zhishi\'></i>文档</a></li>";
  propoverHtml += "                  <li><a href=\'#\' class=\'list-button item-link\' onClick=\'changenodulestype(this,2,\""+id+"\")\'><i class=\'icon iconfont icon-kaoshixinxi\'></i>图文</a></li>";
  propoverHtml += "                  <li><a href=\'#\' class=\'list-button item-link\' onClick=\'changenodulestype(this,3,\""+id+"\")\'><i class=\'icon iconfont icon-my-zhibo-copy\'></i>直播</a></li>";
  propoverHtml += "                  <li><a href=\'#\' class=\'list-button item-link\' onClick=\'changenodulestype(this,4,\""+id+"\")\'><i class=\'icon iconfont icon-shuju\'></i>线下</a></li>";
  propoverHtml += "                  <li><a href=\'#\' class=\'list-button item-link\' onClick=\'changenodulestype(this,5,\""+id+"\")\'><i class=\'icon iconfont icon-exampaper\'></i>试卷</a></li>";
  propoverHtml += "               </ul>";
  propoverHtml += "           </div>";
  propoverHtml += "       </div>";
  propoverHtml += " </div>";
  $.popover(propoverHtml, $(obj));
}
//修改小结类型，并且找到对应的对象
function changenodulestype(obj,type, id) {
  $("#" + id).html($(obj).html());
}
//添加章节
function AddChaper(obj){
  var chaperHtml = "";
  var zhangjieid = guid();
  chaperHtml += "<div class=\'card cardli\' data='"+zhangjieid+"' id='"+zhangjieid+"'>";
  chaperHtml += "           <div class=\"card-header\"><i class=\"icon iconfont icon-bianji\" onclick=\"ChangeChapterName(this)\"></i><span>章节名称</span><i class=\"icon iconfont icon-guanbi pull-right\" onclick=\"Deletechapter(this)\"></i></div>";
  chaperHtml += "                <div class=\'card-content\'>";
  chaperHtml += "                  <div class=\'list-block\'>";
  chaperHtml += "                    <ul>";
  // chaperHtml += "                      <li>";
  // chaperHtml += "                        <a href=\'#\' class=\'item-link item-content\' style=\'height: 0.75rem;min-height: 1.75rem;padding:0 0.75rem\'>";
  // chaperHtml += "                          <div class=\'item-inner\' style=\'font-size: 14px;\'>";
  // chaperHtml += "                            <div class=\'item-title\'>链接 1</div>";
  // chaperHtml += "                          </div>";
  // chaperHtml += "                        </a>";
  // chaperHtml += "                      </li>";
  chaperHtml += "                    </ul>";
  chaperHtml += "                  </div>";
  chaperHtml += "                </div>";
  chaperHtml += "                <div class=\'card-footer\' style=\'padding: 0.2rem 0.75rem;min-height: 0.5rem;display: block;text-align: center;\' onclick=\'AddNodules(this)\'><i class=\'icon iconfont icon-jia1\'></i>添加小节</div>";
  chaperHtml += "              </div>";
  if(obj != null){
    console.log(obj);
    $(obj).before(chaperHtml);
  }else {
    $("#courseinfomian").html(chaperHtml);
    $("#courseinfomian").append("<div class=\"content-block\" style=\"margin:0;\">");
    $("#courseinfomian").append("   <a href=\"#\" class=\"button\" onclick=\"AddChaper(this)\"><i class=\"icon iconfont icon-jia1\"></i>添加章节</a>");
    $("#courseinfomian").append("</div>");
  }
}
//添加小结
function AddNodules(obj) {
  var chapterid = guid();
  var noduleHtml = "";
  noduleHtml += "<li data='"+chapterid+"' id='"+chapterid+"'>";
  noduleHtml += "     <a href=\'#\' class=\'item-link item-content\' style=\'height: 0.75rem;min-height: 1.75rem;padding:0 0.75rem\'>";
  noduleHtml += "       <div class=\'item-inner nodule-item-inner\' style=\'font-size: 14px;\'>";
  noduleHtml += "          <div class=\'item-title\'><span class=\"chaptertitle\">点击选择文件</span><i class=\'icon iconfont icon-bianji\' onclick=\'courseGetvidoAndfile(\""+chapterid+"\")\'><label class=\"chapterobj\" style=\"display:none;\"></label></i></div>";
  noduleHtml += "          <div class=\'item-after\'>";
  noduleHtml += "              <div id=\'chaptertype\'><i class=\'icon iconfont icon-shezhi\'></i>设置</span></div>";
  noduleHtml += "                 <i class=\'icon iconfont icon-guanbi pull-right nodulesli\' onclick=\'Deletenodulesli(this)\'></i>";
  noduleHtml += "              </div>";
  noduleHtml += "          </div>";
  noduleHtml += "     </a>";
  noduleHtml += "</li>";
  if(obj != null){
    $(obj).parent().find("ul").append(noduleHtml);
  }else {
    $("#courseinfomian .card").eq(0).find("ul").html(noduleHtml);
  }
}
//设置小结内容  id为小姐的id
var xiaojieassignmentid = "";
function  courseGetvidoAndfile(id){
  $.popup('.popup-zhishiku');
  xiaojieassignmentid = id;
  GetvidoAndfiles(1, 15, 2);
  GetvidoAndfiles(1, 15, 1);
}
function GetMoreC_shipin(){
  var pageIndex=$("#C_shipinpageIndex").html();
  pageIndex=parseInt(pageIndex)+1;
  GetvidoAndfiles(pageIndex, 15, "2");
}
function GetMoreC_wendang(){
  var pageIndex=$("#C_wendangpageIndex").html();
  pageIndex=parseInt(pageIndex)+1;
  GetvidoAndfiles(pageIndex, 15, "1");
}

//从知识库中筛选文件  id要插入的地方  type 1 文档  2视频
function GetvidoAndfiles(pageIndex,pageSize,type){
  var id = xiaojieassignmentid;
  getAjax(javaserver + "/course/queryFileType", {userid:sysUserInfo.user_ID,fid:0,orgid:sysUserInfo.organization_ID,pageIndex:pageIndex,pageSize:pageSize,type:type,powerLV:sysUserInfo.powerLV}, function(rs){
    rs = strToJson(rs);
    if(rs.errorcode == "0"){
      if(rs.datas.length > 0){
        var wendangStr = "";
        for(var i = 0; i < rs.datas.length; i++){
          var clickevents = "";
          var typeimgurl = "";
          var isclosepopup = "";
          if(rs.datas[i].fileType == "folder"){
              clickevents = "courseopenfolder(this)";
              typeimgurl = "../../../images/train/folder_56.png";
          }else if(rs.datas[i].fileType == "docx" || rs.datas[i].fileType == "doc") {
              clickevents = "ObtainKnowObj(\""+id+"\",this, \""+type+"\")";
              typeimgurl = "../../../images/train/word_56.png";
              isclosepopup = "close-popup";
          }else if(rs.datas[i].fileType == "xls" || rs.datas[i].fileType == "xlsx") {
              clickevents = "ObtainKnowObj(\""+id+"\",this, \""+type+"\")";
              typeimgurl = "../../../images/train/excel_56.png";
              isclosepopup = "close-popup";
          }else if(rs.datas[i].fileType == "flv" || rs.datas[i].fileType == "mp4") {
              clickevents = "ObtainKnowObj(\""+id+"\",this, \""+type+"\")";
              typeimgurl = "../../../images/train/wmw_56.png";
              isclosepopup = "close-popup";
          }else if(rs.datas[i].fileType == "ckt") {
              clickevents = "ObtainKnowObj(\""+id+"\",this, \""+type+"\")";
              typeimgurl = "../../../images/train/ckt_56.png";
              isclosepopup = "close-popup";
          }else if(rs.datas[i].fileType == "ppt" || rs.datas[i].fileType == "pptx") {
              clickevents = "ObtainKnowObj(\""+id+"\",this, \""+type+"\")";
              typeimgurl = "../../../images/train/ppt_56.png";
              isclosepopup = "close-popup";
          }else if(rs.datas[i].fileType == "pdf") {
              clickevents = "ObtainKnowObj(\""+id+"\",this, \""+type+"\")";
              typeimgurl = "../../../images/train/pdf_56.png";
              isclosepopup = "close-popup";
          }
          wendangStr += "<li onclick='"+clickevents+"' class='"+isclosepopup+"'>";
          wendangStr += "  <span style='display:none;'>"+ JSON.stringify(rs.datas[i])+"</span>";
          wendangStr += "  <a href=\'#\' class=\'item-link item-content\'>";
          wendangStr += "      <div class=\'item-media\'><img src='"+typeimgurl+"' width=\"40\"></div>";
          wendangStr += "      <div class=\'item-inner\'>";
          wendangStr += "        <div class=\'item-title\'>"+rs.datas[i].fileName+"</div>";
          wendangStr += "      </div>";
          wendangStr += "  </a>";
          wendangStr += "</li>";
        }
         if(type == "1" || type == 1){  //type 1 文档  2视频
           if(pageIndex == "1"){
             $("#c_wendanglist").html(wendangStr);
           }else {
             $("#c_wendanglist").append(wendangStr);
           }
           if(pageIndex>=rs.pageCount){
              $("#wendangmoreuserbtn").hide();
           }else{
              $("#wendangmoreuserbtn").show();
           }
           $("#C_wendangpageIndex").html(pageIndex);
         }else{
           if(pageIndex == "1"){
             $("#c_shipinlist").html(wendangStr);
           }else {
             $("#c_shipinlist").append(wendangStr);
           }
           if(pageIndex>=rs.pageCount){
              $("#shipinmoreuserbtn").hide();
           }else{
              $("#shipinmoreuserbtn").show();
           }
           $("#C_shipinpageIndex").html(pageIndex);
         }
      }
    }
  });
}
///选择文件
function ObtainKnowObj(id,obj, type){
  var xiaojieObj = $(obj).find("span").html();
  var fileName = strToJson(xiaojieObj).fileName;
  var fileext = fileName.substring(fileName.lastIndexOf('.') + 1);
  $("#" + id).find(".chaptertitle").text(fileName.substring(0,fileName.lastIndexOf('.')));
  if(fileext == "docx" || fileext == "doc") {
      $("#" + id).find(".item-after").find("div").html("<i class=\"icon iconfont icon-intro\"></i>文档");
  }else if(fileext == "xls" || fileext == "xlsx") {
      $("#" + id).find(".item-after").find("div").html("<i class=\"icon iconfont icon-shipin4\"></i>视频");
  }
  $("#" + id).find(".chapterobj").html(xiaojieObj);
  if(type == "1"){
    $("#" + id).find(".chapterobj").attr("type", "2");
  }else if(type == "2"){
    $("#" + id).find(".chapterobj").attr("type", "1");
  }
}
//保存课件信息
function savecourseform(){
  var courseId = QueryString("courseId");
  var courseName = $(".coursename").val();
  var courseDetailed = $(".courseintro").val();
  var courseSum = 0;
  var sectionNum = 0;
  var knowledgeId = "";
  if($(".coursetype").val() != "error"){
    knowledgeId = $(".coursetype").val();
  }
  var courseImg = $(".courseimg").attr("src");
  var  detailedJSON = "";//课程章节JOSN
  var lecturer = $(".courseteacher").val();
  var orgid = sysUserInfo.organization_ID;
  var orgname = sysUserInfo.organization_Name;
  var userid = sysUserInfo.user_ID;
  var username = sysUserInfo.user_Name;
  var isOpen =- $(".isopensourse").val();
  var knowledgeJSON = ""; //知识结构json
  var courseinfoRemark = $(".courseinfoRemark").val();
  $(".cardli").each(function(index, obj){
    var chid = $(obj).attr("data");;
    var chapter = $(obj).find(".card-header").find("span").text();
    var content = [];
    $(obj).find("li").each(function (i, item) {
      var CSID = $(obj).attr("data");
      var CSNAME = $(obj).find(".item-title").text();
      var CSTYPE = $(obj).find(".chapterobj").attr("type");
      var stypeicon = "";
      var stypename = "";
      if(CSTYPE == "1"){
        stypeicon = "#icon-shipin4";
        stypename = "视频";
      }else if(CSTYPE == "2"){
        stypeicon = "#icon-intro";
        stypename = "文档";
      }
    });
  });
}


/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : 'image/png'});
}
/** 课程添加页面初始化End  **/
/** 成绩管理页面初始化Start **/
$(document).on("pageInit", "#resultmanager", function(e, id, $page) {
  sysUserInfo=getUserInfo();
  //初始化课件分类，便于绑定picker
  GetExamPaperList(1, 15, 1, "desc");
})
//获取试卷列表 排序的字段（1.试卷名称 2.上传时间 3 通过率 4 题目 数）
function GetExamPaperList(pageIndex, pageSize, orderfiled, orderby){
  getAjax(javaserver + "/paper/findByPaperPageSelectAndTrim", {pageIndex:pageIndex,pageSize:pageSize,userid:sysUserInfo.user_ID,
      orgid:sysUserInfo.organization_ID,
      powerLV:sysUserInfo.powerLV,
      orderBy:orderby,
      orderbyfield:orderfiled
    },function(data){
      data = strToJson(data);
      var CtypeStr = "";
      if(data.errorcode == "0"){
        for(var i = 0; i<data.datas.length;i++){
          CtypeStr += "<li data='"+data.datas[i].paper_id+"'>";
          CtypeStr += "        <a href=\'#\' class=\'item-link item-content\'>";
          CtypeStr += "          <div class=\'item-inner\'>";
          CtypeStr += "            <div class=\'item-title-row\'>";
          CtypeStr += "              <div class=\'item-title\'>"+data.datas[i].paperName+"</div>";
          var IsRadom = "正常卷";
          if(data.datas[i].paper_Random == "0"){
            IsRadom = "随机卷";
          }
          CtypeStr += "              <div class=\'item-after\'>"+IsRadom+"</div>";
          CtypeStr += "            </div>";
          var passingNum = data.datas[i].paperNumber.paperThroughput_rate;
          CtypeStr += "            <div class=\'item-subtitle\'>通过率:"+passingNum+"</div>";
          CtypeStr += "          </div>";
          CtypeStr += "        </a>";
          CtypeStr += "      </li>";

        }
        $("#resultmanagerlist").append(CtypeStr);
      }
      if(pageIndex>=data.pageCount){
         $("#moreuserbtn").hide();
      }else{
         $("#moreuserbtn").show();
      }
      $("#pageIndex").html(pageIndex);
  });
}
function GetMoreResult(){
  var pageIndex=$("#pageIndex").html();
  pageIndex=parseInt(pageIndex)+1;
  GetExamPaperList(pageIndex, 15, 1, "desc");
}
/** 成绩管理页面初始化End **/



/******************************************查询方法结束*************************************************/
//====================公共方法===========================
/*获取格式化后文件大小*/
function getFileSize(byteSize) {
    if (byteSize != undefined) {
        if (byteSize === 0) return '0 KB';
        var k = 1024; // or 1000
        sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        i = Math.floor(Math.log(byteSize) / Math.log(k));
        if (i > 0) {
            return (byteSize / Math.pow(k, i)).toFixed(0) + ' ' + sizes[i];
        } else {
            var num = Math.round(byteSize * 100) / 100;
            if (num <= 0) {
                return '0.01 ' + sizes[0];
            }
            return num + ' ' + sizes[0];
        }
    }
}
// 获取广告banner以及启动页图片
function GetADBanerAndStartImg(){
  var orgid = GetlocalStorage("UserEnterpriseOrgID");
  if(orgid != undefined){
    getAjax(javaserver + "/advertisement/findAppAdvert",{orgid: orgid, number:5}, function (data) {
            data = strToJson(data);
            var huanyingad = ""; //欢迎页img url
            var adStr = "";
            if(data.errorcode == "0"){
              $.each(data.datas, function (i, item) {
                if(item.advertisementPosition == "1"){ //欢迎页
                  huanyingad = item.advertisementPath;
                }else{
                  adStr += "<div class=\"swiper-slide\"><div class=\"swiper-zoom-container\"><img src=\""+item.advertisementPath+"\" alt=\""+item.advertisementName+"\"></div></div>";
                }
              });
              SetlocalStorage("HomeAddStr", adStr);
              if(huanyingad != ""){
                $(".qydongyeimg").css("background-image", "url('" + huanyingad + "')");
                $(".huanyingad").text(getUserInfo().organization_Name);
                $(".qidongyediv").show();
                var adtime = window.setTimeout(function(){
                  $(".qidongyediv").css("display", "none");
                  window.location.href = "html/home.html";
                }, 5000);
              }else {
                  window.location.href = "html/home.html";
              }
            }
        }, function (err) {
            $.hideIndicator();
            $.toast('请求错误!');
        }, "json", "post", false);
  }
}
//***********************************************************************************
//                              遍历参数
//***********************************************************************************
function getParam(){
    //所有的部门id
    for(var i=0;i<sysUserInfo.userOrgList.length;i++){
        allorgid+=sysUserInfo.userOrgList[i].organization_ID+",";
        allorgname=allorgname.length>0?allorgname+","+sysUserInfo.userOrgList[i].organization_Name:sysUserInfo.userOrgList[i].organization_Name;
    }
    //所有的角色id
    for(var i=0;i<sysUserInfo.userRoleList.length;i++){
        allroleid+=sysUserInfo.userRoleList[i].roles_ID+",";
        // allrolename+=sysUserInfo.userRoleList[i].roles_Name+",";
          allrolename=allrolename.length>0?allrolename+","+sysUserInfo.userRoleList[i].roles_Name:sysUserInfo.userRoleList[i].roles_Name;
    }
    //所有的用户组id
    for(var i=0;i<sysUserInfo.userGroupList.length;i++){
        allgroupid+=sysUserInfo.userGroupList[i].userGroup_ID+",";
       // allgroupname+=sysUserInfo.userGroupList[i].userGroup_Name+",";
         allgroupname=allgroupname.length>0?allgroupname+","+sysUserInfo.userGroupList[i].userGroup_Name:sysUserInfo.userGroupList[i].userGroup_Name;
    }
}
//***********************************************************************************
//                              字符串转json
//***********************************************************************************
function strToJson(str){
    //如果本来就是对象，强转会异常
   try {
         if(str!=null&&str!=""&&str!=undefined){
            return JSON.parse(str);
        }else{
            return null;
        }
    } catch (e) {
        return str;
    }
}
//**********************************************************************
//                              全局方法系列
//**********************************************************************

//夜间模式
var $dark = $("#dark-switch").on("change", function() {
  $(document.body)[$dark.is(":checked") ? "addClass" : "removeClass"]("theme-dark");
});

$.init();//加载组件


//**********************************************************************
//全局异步请求数据
//**********************************************************************
function getAjax(url, parm, callBack, callBackError, callBackType, mode,istongbu) {
    var token = "userinfo_token is none";
    if (callBackType == null || callBackType == "" || callBackType == undefined)
        callBackType = "text";
    if (mode == null || mode == "" || mode == undefined)
        mode = "get";
    if (istongbu!=undefined&&!istongbu){
        istongbu =false;
  	}else{
  		  istongbu =true;
  	}
  try{
      $.ajax({
          type: mode,
          beforeSend: function (xhr) {
             if(!QueryString("courseId")){
                  token = strToJson(GetlocalStorage("userinfo_token"),token);
                  xhr.setRequestHeader("X-Session-Token",token);
              }
          },
          //手机端需要加上token验证
          headers: {
              //"Accept": "text/plain; charset=utf-8",
              //"Content-Type": "text/plain; charset=utf-8",
              "Accept": "application/json, text/javascript, */*; charset=utf-8",
              "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
          async:istongbu,
          url: url,
          data: parm,
          dataType: callBackType,
          cache: false,
          success: function (msg, status, xhr) {
            pedding=false;
              callBack(msg);
               $.hideIndicator(); //隐藏loading
          },
          error: function (err) {
              $.hideIndicator(); //loading
              if(callBackError != undefined && callBackError != null && callBackError != "")
              callBackError(err);
              // $.alert(err);
              console.log('请求服务器错误！');
              pedding=false;
              console.error("服务器访问异常：" + err.readyState);
          }
      });

  }
  catch(error) {
    $.alert("请求错误,请刷新重试！");
    console.log(url);
    $.hideIndicator();
  }
}

//*************************任务的查询单独取出来，方便再次调用*********************************
function getrenwuList(state,optype, pageIndex, pageSize){
//  debugger;
  var name=$("#search").val();
      sysUserInfo=getUserInfo();
          //默认登录进来就请求任务列表
          //请求所有任务
          getAjax(javaserver+"/stage/findStudentStage",
          { name:name,
              orgID:sysUserInfo.organization_ID,
              user_id:sysUserInfo.user_ID,
              org_Id:sysUserInfo.allorgid,
              role_Id:sysUserInfo.allroleid,
              user_groupId:sysUserInfo.allgroupid,
              pageSize:pageSize,
              pageIndex:pageIndex,
              state:state},
          function (data) {
               data=strToJson(data);
                  if (data.errorcode==0&&data.numCount>0&&data.datas.length>0) {
                      //当前所有的任务
                      allrenwu=data;
                      //任务列表
                      var renwu="";
                       for(var i = 0; i<data.datas.length; i++){
                           //进度标识
                          var center="";
                          //单独把string 拿出来转一下（否则比较不了）
                          var coursecout=data.datas[i].courser_count;
                          //已完成
                          if(data.datas[i].completeCount>=coursecout){
                              center="<div class='item-after'><i class='iconfont icon-shenhetongguo' style='color:#339966'></i></div>";
                          //进行中
                          }else if(data.datas[i].completeCount<coursecout&&data.datas[i].completeCount>0){
                              center="<div class='item-after'><i class='iconfont icon-icon27' title='学习中' style='color:#39f'></i></div>";
                          }
                          //追加的任务列表
                          //renwu+="<li> <a href='../html/peixun/info.html?arrangeId="+data.datas[i].id+"' class='item-link item-content'> <div class='item-inner'><div class='item-title'>"+data.datas[i].name+"</div>"+center+" </div></a> </li>";
                          renwu+="<li> <a onclick='openRenwuDetail("+JSON.stringify(data.datas[i])+")'  target='_black' class='item-link item-content'> <div class='item-inner'><div class='item-title'>"+data.datas[i].name+"</div>"+center+" </div>  </a> </li>";
                      }
                      //给页面附上列表
                      if(optype==1){
                          $(".renwulist").html(renwu);
                      }else{
                          $(".renwulist").append(renwu);
                      }
                      if(pageIndex>=data.pageCount){
                          $("#stageLoadMore").hide();
                      }else{
                          $("#stageLoadMore").show();
                      }
                      if(state==1){
                          $("#renwu_all").html("全部<span class='badge'>"+data.numCount+"</span>");
                          $("#renwu_wks").html("未开始");
                          $("#renwu_jxz").html("进行中");
                          $("#renwu_ywce").html("已完成");
                      }else if(state==2){
                          $("#renwu_all").html("全部");
                          $("#renwu_wks").html("未开始<span class='badge'>"+data.numCount+"</span>");
                          $("#renwu_jxz").html("进行中");
                          $("#renwu_ywce").html("已完成");
                      }else if(state==3){
                          $("#renwu_all").html("全部");
                          $("#renwu_wks").html("未开始");
                          $("#renwu_jxz").html("进行中<span class='badge'>"+data.numCount+"</span>");
                          $("#renwu_ywce").html("已完成");
                      }else if(state==4){
                          $("#renwu_all").html("全部");
                          $("#renwu_wks").html("未开始");
                          $("#renwu_jxz").html("进行中");
                          $("#renwu_ywce").html("已完成<span class='badge'>"+data.numCount+"</span>");
                      }

                  }else if(data.errorcode==0&&(data.numCount==0||data.datas.length<=0)){
                      if(optype==1){
                      //    $(".renwulist").html(renwunull);
                      }else{
                          $("#stageLoadMore").hide();
                      }
                  }
                  $("#stagePageIndex").html(pageIndex);
                  $.hideIndicator();
        });

}
 //查询文件列表
 //fid  父id
 //type     排序条件
 //tagid     标签
 //orderby   排序
 //optype   1.追加html，2.替换html
 //pageSize   每页条数
 //pageIndex   当前页数
 //needOrg    是否显示企业文件夹
  function getfilelist(fid,type,tagid,orderby,optype,pageSize,pageIndex,needOrg,name){

     //文件缺省图
    var wenjiannull="<dl style='height:100%;width:100%;position: absolute;margin-top: 25%;color:#cecece;'><dd style='text-align:center;margin:0'><img src='../res/img/knownull.png' style='width: 50%;'></dd><dt style='text-align: center;'>暂无数据</dt></dl>";
    //var name=$("#search").val();
    sysUserInfo=getUserInfo();
    //获取文件
    getAjax(javaserver + "/Kapi/getuserfile",
        { userid: sysUserInfo.user_ID,
            fid: fid,
            orgid: sysUserInfo.organization_ID,
            searchText: name,
            searchType: type,
            tagid: tagid,
            orderby: orderby,
            pageSize: pageSize,
            pageIndex: pageIndex,
            fileType: "",
            powerLV: 99
        }, function (data) {
            data = strToJson(data);
            if (data.errorcode == 0 && data.datas.length > 0) {


                //是否显示企业文件夹
                if (needOrg != undefined && needOrg) {
                    block = "<li id='orgfile'><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/fenxiang_folder_56.png' /></div><div class='item-inner'><a class='item-link' fid=0><div class='item-title'>共享文件</div></a></div></label></li>";
                } else {
                    block = "";
                }
                //遍历文件
                for (var i = 0; i < data.datas.length; i++) {
                    // 处理父级路径
                    var dataFpath = data.datas[i].filepath;
                    if (dataFpath == undefined || dataFpath == null || dataFpath == "" || dataFpath == "/") {
                        dataFpath = "/" + data.datas[i].fileName;
                    } else {
                        dataFpath = data.datas[i].filepath + "/" + data.datas[i].fileName;
                    }
                    //查询子集
                    if (data.datas[i].fileType == "folder") {
                        block += "<li ><label class='label-checkbox item-content'><div class='item-media' ><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a href='#' class='item-link' data=" + data.datas[i].upId + " other=" + data.datas[i].fileType + " fpath=" + dataFpath + " fid=" + data.datas[i].fid + ">" + data.datas[i].fileName + "</a></div><input type='checkbox' name='my-radio' value='" + data.datas[i].upId + "'><div class='item-media'><i class='icon icon-form-checkbox'></i></div></div></label></li>";
                        //预览
                    } else {
                        block += "<li ><label class='label-checkbox item-content'><div class='item-media' onclick='openfile(" + JSON.stringify(data.datas[i]) + ")'><img src='../res/fileicon/" + data.datas[i].fileType + "_56.png'  onerror='javascript:this.src=\"../res/fileicon/qita_56.png\"'/></div><div class='item-inner'><div class='item-title'><a onclick='openfile(" + JSON.stringify(data.datas[i]) + ")' class='item-link'>" + data.datas[i].fileName + "</a></div><input type='checkbox' name='my-radio' value='" + data.datas[i].upId + "'><div class='item-media'><i class='icon icon-form-checkbox'></i></div></div></label></li>";
                    }
                }
                //追加html   （分页）
                if (optype == 1) {
                    $("#filelist").append(block);
                    //总页数
                    pageCount = data.pageCount;
                    //隐藏分页
                    if (pageCount <= pageIndex) {
                        $("#loadMore").hide();
                    }
                    //替换html  （刷新，排序，搜索）
                } else {
                    $("#filelist").html(block);
                    //隐藏分页
                    if (data.pageCount <= pageIndex) {
                        $("#loadMore").hide();
                    }
                }
                $.hideIndicator(); //隐藏loading
                //如果查询的数据为空
            } else if (data.errorcode == 0 && data.datas.length <= 0) {
                if (optype == 2) {
                    if ((fid == 0 || fid == "0") && needOrg) {
                        $("#filelist").html("<li id='orgfile'><label class='label-checkbox item-content'><div class='item-media'><img src='../res/fileicon/fenxiang_folder_56.png' /></div><div class='item-inner'><a class='item-link' fid=0><div class='item-title'>企业共享</div></a></div></label></li>");
                    } else {
                        $("#filelist").html(wenjiannull);
                    }
                }
                $("#loadMore").hide();
                $.hideIndicator(); //隐藏loading
            } else {
                $.hideIndicator(); //隐藏loading
                $("#loadMore").hide();
            }
            $("#filepage").html(pageIndex)
            $.hideIndicator(); //隐藏loading
        });
  }



  //获取缓存用户信息，如果为空，跳转登录页
  function getUserInfo(){
    var sysUserInfo=strToJson(GetlocalStorage("userinfo"));
    if(sysUserInfo==null||sysUserInfo==undefined||sysUserInfo==""){
        window.location.href ="/app/login.html";
    }else{
        return sysUserInfo;
    }
  }
  function GetlocalStorage(name) {
    // / <summary>
    // / 获得本地数据
    // / </summary>
    if (window.localStorage) {
        // 获取token
        if(name == "userinfo_token"){
            return getToKen();
        }
        //获取本地缓存
        var value = localStorage.getItem(name);
        if (value != null&&value!=""&&value!=undefined) {
                //如果获取的值已经是对象，强转会报错，直接返回
               try {
                   return JSON.parse(value);
               } catch (e) {
                    return value;
              }
       } else {
              return value;
         }

    } else {
       $.toast("您的浏览器不支持本系统，或开启了隐身模式");
    }
}
// 获取token
function getToKen (){
    var localtoken={};
    try{
        var localtoken = JSON.parse(localStorage.getItem("userinfo_token"));
    }catch(e){
        return null;
    }
    var exp = 1000 * 60 * 60 * 24; // 过期时间 1 天
    if (localtoken == undefined || localtoken == null || localtoken == "") {
        localtoken = "";
    } else if (!localtoken.hasOwnProperty('outTime') || !localtoken.hasOwnProperty('token')) {
        localtoken = "";
    } else if (localtoken.hasOwnProperty('outTime') && parseInt(new Date().getTime() - exp) > new Date(localtoken.outTime).getTime()) {
        localtoken = "";
    } else if (localtoken.hasOwnProperty('token')) {
        localtoken = localtoken.token.toString();
    }
    return localtoken;
}
function SetlocalStorage(name, obj) {
    // / <summary>
    // / 重写本地数据
    // / </summary>
    if (window.localStorage) {

        try {
            if(name == "userinfo_token"){
                var tokenObj = { token: obj, outTime: "" };
                tokenObj.outTime = new Date().getTime();
                localStorage.setItem("userinfo_token", JSON.stringify(tokenObj));
            }else{
                //localStorage.setItem(name, JSON.stringify(obj));
                localStorage.setItem(name, obj);
            }
        }
        catch (oException) {
            if (oException.name  == 'QuotaExceededError') {
                $.toast("超出本地存储限额！");
                //如果历史信息不重要了，可清空后再设置
                localStorage.clear();
                if(name == "userinfo_token"){
                    var tokenObj = { token: obj, outTime: "" };
                    tokenObj.outTime = new Date().getTime();
                    localStorage.setItem("userinfo_token", JSON.stringify(tokenObj));
                }else{
                    //localStorage.setItem(name, JSON.stringify(obj));
                    localStorage.setItem(name, obj);
                }
            }
        }
    } else {
       $.toast("您的浏览器不支持本系统，或开启了隐身模式");
    }
}
function QueryString(fieldName) {
    /// <summary>
    ///   获得URL GET参数
    /// </summary>
    /// <param name="fieldName" type="String">
    ///   参数名
    /// </param>
    /// <returns type="void" />如果不存在返回NULL
    var reg = new RegExp("(^|&)" + fieldName.toLowerCase() + "=([^&]*)(&|$)", "i");
    var r = window.location.search.toLowerCase().substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
function goto(url) {
    $.router.loadPage(url);
}


//获取手机当前的网络状态
function GetConnectionType(){
  var connectionT = winapi.connectionType;
  if(connectionT == "none"){  //无网络链接
    $.toast('当前网络不可用，请检查网络设置！');
  }
}
//打开任务详情
function openRenwuDetail(stringjson) {
    //console.log("预览文件");
    SetlocalStorage("renwuobj", JSON.stringify(stringjson));
    $.router.loadPage("../html/peixun/info.html");
}
//打开文件预览
function openfile(stringjson) {
    SetlocalStorage("fileobj", JSON.stringify(stringjson));
    var dangqianUrl = window.location.href;
    var lastH = dangqianUrl.substring(dangqianUrl.lastIndexOf('/') + 1, dangqianUrl.lastIndexOf('.'));
    if(lastH != "home"){
      $.router.loadPage("../../html/wenjian/yulan.html");
    }else {
      $.router.loadPage("wenjian/yulan.html");
    }
}
function openfile1(path) {
  bPlayer = api.require('bPlayer');  //实例化百度播放器
  bPlayer.open({
        rect: {
            x: 0,
            y: 38,
            w: 0,
            h: 0,
        },
        path: path,//mima.replace('\\', '/'),
        autoPlay: true
    }, function(ret, err) {
        if (ret) {
          bPlayer.full();
          bPlayer.addEventListener({name : ['all','click','playbackState']}, function(ret) {
            var EventType = eval(ret);
            if(EventType.eventType == "click"){
              bPlayer.close();
             }
           });
        }
  });
}

function abc(){
  var data = {data:GetlocalStorage("fileobj")};
  console.log(JSON.stringify(data));
  if (data.data != null) {  //data.errorcode == 0 &&
        if (data.data.fileType==undefined){
            data.data.fileType=data.data.filepreview.substr(data.data.filepreview.lastIndexOf(".")+1).replace("'", "");
        }
        console.log(data.data.filepreview);
        if (data.data.fileType == "pdf" || data.data.fileType == "docx" || data.data.fileType == "doc" || data.data.fileType == "xls" || data.data.fileType == "xlsx" || data.data.fileType == "ppt" || data.data.fileType == "pptx") {
            $(".content_yulan").html("<iframe src='http://file.jisupeixun.com/resources/pdf2/officeshow/web/viewer.html?file=?file=" + base64encode(encodeURI(data.data.filepreview)) + "' style='width:100%;border:0;height:100%;position:absolute;' ></iframe>");
            //console.log("<iframe src='http://file.jisupeixun.com/resources/pdf2/officeshow/web/viewer.html?file=?file=" + base64encode(encodeURI(data.data.filepreview)) + "' style='width:100%;border:0;height:100%;position:absolute;' ></iframe>");
        } else if (data.data.fileType == "txt") {
            $(".content_yulan").html("<iframe src='" + data.data.filepreview + "' style='width:100%;border:0' ></iframe>");
        } else if (data.data.fileType == "mp4") {
            //$(".content_yulan").html("<video controls autoplay style='width:100%'><source src='" + data.data.filepreview + "'  type='video/mp4' ></video>  ");
            //文件预览引入播放器
            console.log("文件预览引入播放器");
            bPlayer = api.require('bPlayer');  //实例化百度播放器
            bPlayer.open({
                  rect: {
                      x: 0,
                      y: 38,
                      w: 0,
                      h: 0,
                  },
                  path: data.data.filepreview,//mima.replace('\\', '/'),
                  autoPlay: true
              }, function(ret, err) {
                  if (ret) {
                    bPlayer.setRect({
                              rect:{
                              x: 0,
                              y: 50,
                              w: winapi.winWidth,
                              h: 200,
                                    },
                        });
                        /*****添加播放器的监听事件********/
                        BDPlayerLoader();
                  }
            });
        } else if (data.data.fileType == "mp3") {
            $(".content_yulan").html("<video controls autoplay style='width:100%'><source src='" + data.data.filepreview + "'  type='audio/mpeg' ></video>  ");
        } else if (data.data.fileType == "jpg" || data.data.fileType == "png" || data.data.fileType == "gif" || data.data.fileType == "bmp" || data.data.fileType == "wbmp" || data.data.fileType == "jpeg"
                             || data.data.fileType == "JPEG" || data.data.fileType == "GIF" || data.data.fileType == "WBMP" || data.data.fileType == "PNG") {
            $(".content_yulan").html(" <div ><img id='fileimg'  src='" + data.data.filepreview + "'   style='width:100%' /></div> ");
        } else {
            //$(".content_yulan").html(" <div style='text-align: center;margin-top: 60%;color: #CCC;font-size: 20px;' >文件不支持预览！</div> ");
            $(".content_yulan").html(" <div ><img id='fileimg'  src='" + data.data.filepreview + "'   style='width:100%' /></div> ");
        }
    }
}
function CloseBaiDuplayer(){
try {
  console.log("干掉播放器，你就是王者，凸(艹皿艹 )");
  bPlayer.close();
} catch (e) {
console.log(e);
} finally {

}
}


//发言
function AddFaYan(){
  var data = JSON.stringify({
       dataType: 'MESSAGE',
       dataContent: $("#fayantxt").val(),
       username: flashvars.name,
       userid: flashvars.id,
       livetiem: new Date().getTime(),
       usertype: flashvars.type,
       userimg:flashvars.user_img
   });
   Messaging.publish(flashvars.rid, data);
   $("#fayantxt").val("");
}
