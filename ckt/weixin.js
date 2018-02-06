var activeIndex = 0;//当前正在编辑的页码索引
var ckturl ="http://ckt.edu-paas.com/wk/";
var networkType ="wifi";//网络类型2g，3g，4g，wifi
var kecheng ={};//当前课程对象
$(document).ready(function () {
  $(".camera-area").fileUpload({
         "url": "http://ke.edu-paas.com/Up/Wkup",
         "file": "myFile"
  });
    if(true){
        if(QueryString("key") != null)
        {

            if(QueryString("callback") != null)
            {
                $("#savebtn").show();
            }

            //查询当前课程记录并绑定课程界面
            $.get(ckturl+"getjson",{key:QueryString("key")},function(data){

                if (data.length > 0) {
                   kecheng = JSON.parse(decodeURIComponent(data));
                   var khtml="";
                   console.log(kecheng);
                   for(var i=0;i<kecheng.length;i++){
                        var wavl = 0;
                        if(kecheng[i].hasOwnProperty("wavs")){//判断是否有音频了
                            wavl = kecheng[i].wavs.length;
                        }
                        khtml +="<div class=\"swiper-slide\"><div class=\"swiper-zoom-container\"><img data-src=\""+kecheng[i].url+"\"  class=\"swiper-lazy\"></div><div class=\"swiper-lazy-preloader\"></div><div class=\"yinpin\" onclick='getadieolist()'><span>)</span><span>)</span><span style=\"font-size:21px;\">)</span><div class=\"yinnumber\" id=\"yinnumber\">"+wavl+"</div></div></div>";
                   }
                   $("#kejian").html(khtml);
                   newswiper();
                   $("#loadingdiv").hide();
                }
                else{
                    $("#loadingtext").html("<font color=red>内容错误，请先在PC界面操作！</font>");
                }
            });
        }
        else{
            $("#loadingtext").html("<font color=red>参数错误！</font>");
        }
    }
    else{
        $("#loadingtext").html("<font color=red>请使用微信访问本功能！</font>");
    }


})
//录音按钮
var caozuo ="0";//0为开始录音，1为结束录音
var jishi =null;//计时器
var shitingluyin = "";//试听录音ID
var shitingluyintxt ="";
var luyinlenght = 0;
function luyin(){
if(kecheng.length <= 0){
  api.toast({
      msg: '请先课件素材再进行录音！',
      duration: 2000,
      location: 'bottom'
  });
  return false;
}
    if(caozuo == "0")
    {
        luyinlenght = 0;
        $(".lyjs").html("00:00");
        api.startRecord();//微信录音

        var time=0;
        jishi = setInterval(function(){
            time++;
            if(time <=60){
                luyinlenght = time;
                $(".lyjs").html("00:"+(time>=10?time:"0"+time));
            }
            else{
                window.clearInterval(jishi);
            }
        },1000);
        $(".jieshu").css("opacity","0");
        $(".mic_luyin_red").attr("class", "mic_luyin_red_zt");
        caozuo= "1";
    }
    else
    {
        //停止录音
        api.stopRecord(
          function(ret, err) {
    if (ret) {
        var path = ret.path;
        shitingluyin = path;
        var duration = ret.duration;//录音时长
      //  alert(path);  alert(duration);
    }
});

        $(".mic_luyin_red_zt").attr("class", "mic_luyin_red");
        window.clearInterval(jishi);
        caozuo= "0";
        $(".jieshu").css("opacity","1");
    }
}
function shiting(){
    //播放本地录音（试听）
api.startPlay({
    path: shitingluyin
}, function(ret, err) {
    if (ret) {
      //  alert('播放完成');
    } else {
        alert(JSON.stringify(err));
    }
});
}
function wanchengluyin(){
    //完成录音
    var serverId = "";
	//alert(shitingluyin);
     //上传录音
  api.ajax({
    url: 'http://ke.edu-paas.com/up/luyinup',
    method: 'post',
    data: {
        values: {
            name: 'haha'
        },
        files: {
            file: shitingluyin
        }
    }
}, function(ret, err) {
    if (ret) {
      //api.alert({ msg: JSON.stringify(ret) });


        if(true)
        {
          if(kecheng != null && kecheng.length > 0){
              if(!kecheng[activeIndex].hasOwnProperty("wavs"))
              {
                   kecheng[activeIndex].wavs = [];
              }
              var wavobj = ret[0];
              wavobj.wavtime = luyinlenght;//将录音时长赋值
              kecheng[activeIndex].wavs.push(wavobj);
              $(".swiper-slide").eq(activeIndex).find("#yinnumber").html(kecheng[activeIndex].wavs.length);
              gengxin();
          }else {
            $.toast("请先上传文件再进行录音！");
          }

        }
    } else {
        api.alert({ msg: JSON.stringify(err) });
    }
});


   $(".lyjs").html("00:00");
   $(".jieshu").css("opacity","0");

}
/*//停止播放
wx.stopVoice({
    localId: '' // 需要停止的音频的本地ID，由stopRecord接口获得
});
//播放完毕
wx.onVoicePlayEnd({
    success: function (res) {
        var localId = res.localId; // 返回音频的本地ID
    }
});
*/
function delshow(){
     $("#delshow").show();
}
function delhide(){
    $("#delshow").hide();
    $("#yinpin").hide();
}
function remside(){
   delhide();

    kecheng.splice(activeIndex,1);
    mySwiper.removeSlide(activeIndex); //移除第一个

    gengxin();
}
function getadieolist(){
//alert(JSON.stringify(kecheng[activeIndex].wavs));
    $("#yinpin").show();
    var yinpinlist ="";
    if(kecheng[activeIndex].wavs.length >0){
        for(var i=0;i<kecheng[activeIndex].wavs.length;i++)
        {
          //alert(JSON.stringify(kecheng[activeIndex].wavs[i]));
            yinpinlist +="<div class=\"yinpinlist\" id=\"wav_"+activeIndex+"_"+i+"\"><audio src=\""+kecheng[activeIndex].wavs[i].wavurl+"\" controls=\"controls\"></audio><span class=\"delbtn\" onclick='delwav("+activeIndex+","+i+")'>删除</span></div>";
        }
    }
    else{
        yinpinlist ="<center>暂无音频</center>";
    }
    $("#yinpinlist").html(yinpinlist);
}
function delwav(kindex,wavindex){
    $("#wav_"+kindex+"_"+wavindex+"").remove();
    console.log(kindex+","+wavindex,kecheng);
    kecheng[kindex].wavs.splice(wavindex,1);
    $(".swiper-slide").eq(kindex).find("#yinnumber").html(kecheng[kindex].wavs.length);
    gengxin();

}
function gengxin(){
    //更新课程
    $.post(ckturl+"setjson",{key:QueryString("key"),json:encodeURIComponent(JSON.stringify(kecheng))},
          function(data){
                    if(data = "ok"){
                            var $toast = $('#toast');
                            $toast.show(100);
                            setTimeout(function () {
                                $toast.hide(100);
                            }, 2000);

                        }
                        else{
                            alert(data);
                        }
    });
}
function over(){
    //结束编辑
    wx.closeWindow();
}
function saveshow(){
    $("#savediv").show();
    document.getElementById('wkname').focus();
}
function saveback(){
    $("#savediv").hide();
}
function savekec(){
     var Wk_name = $("#wkname").val();
     if(Wk_name == ""){
        alert("课件名不能为空");
        return;
     }

    var Wk_id = QueryString("key");
    var Wk_userid = QueryString("uid");
    var Wk_json = encodeURIComponent(JSON.stringify(kecheng));
    var Wk_img = kecheng[0].url;
    var Wk_class = "";

            //console.info($scope.Wk_name + "|" + $scope.Wk_class + "|" + $rootScope.QueryString("key") + "|" + $rootScope.QueryString("uid") + "|" + encodeURIComponent(JSON.stringify($rootScope.kecheng)) + "|" + $rootScope.kecheng[0].url);

    var canshu1 = { Wk_name: Wk_name, Wk_userid: Wk_userid, Wk_json: Wk_json, Wk_img: Wk_img, Wk_class: Wk_class };
    if (Wk_id != null) {
        canshu1.Wk_id = Wk_id;
    }
$.post(ckturl+'up',canshu1,function(data){
        if (data > 0) {
             //将课程保存到知识库
   var huidiao =  QueryString("callback");
       if (huidiao != null)
       {
             var lujing = unescape(QueryString("callback"));
                            //upId 文件id(修改才有)
                            var canshu = {};
                            canshu.fileName = $("#wkname").val();
                            canshu.fileurlonly = ckturl+"" + Wk_userid + "/" + Wk_id + ".html";
                            canshu.source = "ckt"; //标识我的是课件


                            //讲参数全部追加回去
                            var url = location.search; //获取url中"?"符后的字串
                            var str = url.substr(1);
                            var strs = str.split("&");
                                                                        for (var i = 0; i < strs.length; i++) {
                            var pname = strs[i].split("=")[0];
                            var pvalue = strs[i].split("=")[1];
                            if (pname != "callback" && pname != "type" && pname != "uid") {
                                canshu[pname] = decodeURI(decodeURI(pvalue));

                            }
                            if (pname == "type") {
                                if (pvalue == 1 || pvalue == "1") {
                                    canshu.upId = Wk_id;
                                }
                            }
                        }

                            //console.log(canshu);

                            //回调应用端
                        $.ajax({
                            url: lujing,
                            cache:false,
                            data: canshu,
                            success: function(response){
                            //console.log(response);
                            var $toast = $('#toast');
                            $toast.show(100);
                            setTimeout(function () {
                                $toast.hide(100);
                            }, 2000);

                            //操作成功后如何关闭窗口，并且打开课程LIST
                            window.location = ckturl + Wk_userid + "/" + Wk_id + ".html";

                        },
                        error:function(response){
                           alert("错误:"+response.statusText);

                        }
                       });

       }
       else
       {
           alert("缺少参数，请在PC端保存");
       }

   }else{
        alert("保存失败"+data);
   }
 });

}
var mySwiper;//对象
//初始化内容浏览器
function newswiper(){
        //启动内容浏览器
	    mySwiper = new Swiper ('.swiper-container', {
	    // 如果需要分页器
	    pagination: {
	      el: '.swiper-pagination',
	      type: 'fraction',
	    },

	    // 如果需要前进后退按钮
	    navigation: {
	      nextEl: '.swiper-button-next',
	      prevEl: '.swiper-button-prev',
	    },

	    //启动延迟加载
	    lazy: {
		    loadPrevNext: true,
		},
		//开启调焦
	    zoom : true,

	    on:{
		    slideChangeTransitionEnd: function(){
		      activeIndex = this.activeIndex;//切换结束时，告诉我现在是第几个slide
		    },
		},
	})
}

/**
*工具 || 获得URL GET参数
*/
function QueryString(fieldName) {
    /// <summary>
    ///   获得URL GET参数
    /// </summary>
    /// <param name="fieldName" type="String">
    ///   参数名
    /// </param>
    /// <returns type="void" />如果不存在返回NULL
    var reg = new RegExp("(^|&)" + fieldName.toLowerCase() + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
