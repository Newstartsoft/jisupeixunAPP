function saveluxiang() {
    //保存教学记录_提交画线记录
    $.post("/Server/HttpRequest.ashx", { action: "saveluxiang", talkId: talkId, zbtiem: zbtiem, r: Math.random() }, function (data) {
        console.log("提交教学记录_画线记录:" + data); //保存画线记录
    });
}


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


function onbeforeunload_handler() {
    //清除cookie
    //__CookieUtil.set('YUNBA_CUSTOMID_COOKIE_' + $("#talkId").val(), "", -1);
    eduCanvas.tijiaoedu();
    saveluxiang();
    var isIE = document.all ? true : false;
    if (isIE) {//IE浏览器
        var n = window.event.screenX - window.screenLeft;
        var b = n > document.documentElement.scrollWidth - 20;
        var bb = window.event.clientX > document.body.clientWidth;
        if (b && window.event.clientY < 0 || window.event.altKey) {
            console.log("是关闭而非刷新");
        } else {
            console.log("是刷新而非关闭");
        }
    } else {//火狐浏览器
        if (document.documentElement.scrollWidth != 0) {
            console.log("是刷新而非关闭1");
        } else {
            console.log("是关闭而非刷新1");
        }
    }
    //关闭 1 麦克风   2 摄像头
    if (isvideo == 1) { closelive(2); }
    if (isvoice == 1) { closelive(1); }
    var warning = "确认退出?";
    return warning;
}

function onunload_handler() {
    var warning = "谢谢光临";
    console.log(warning);
    alert(warning);
}

function onscroll_handler() {
    var wh = $(window).height(); //窗体高度
    var ww = $(window).width(); //窗体高度
    var sh = $(document).scrollTop();
    if (ww <= 1170 && sh > 100) {
        $(".ppt_groupbtn").hide();
    } else {
        $(".ppt_groupbtn").show();
    }
}

 function getlainfo() {
	$("#txt_Notice").hide();
    //广告和公告
    $.get("/Server/HttpRequest.ashx", { action: "get_lainfo", talkId: talkId, r: Math.random() }, function (date) {
		//console.log("广告和公告：" + date);
        if (date != null && date != "") {
			var lainfo = eval("(" + date + ")");
				if (lainfo.mes!= null && lainfo.mes != "") {
					$("#zhiyimain").html(lainfo.mes.La_Notice); //公告
		            $("#txt_Notice").val(lainfo.mes.La_Notice);
					if(lainfo.mes.La_AdverImg!=null&&lainfo.mes.La_AdverImg!=""){
						$(".lml_stu img").attr('src', lainfo.mes.La_AdverImg); //公告图片
					}
				        // La_AdverSrc             //公告地址
				}else{
					$("#zhiyimain").html("");
					$("#txt_Notice").html("");
				}
		}
	});
}

//放大、缩小
function Los(obj) {
	proportion = obj;
    $("#prop").val(proportion);
    eduCanvas.LargeOrSmall('Canvas_Tea', 'liveCenter', proportion);
}

//输出日志
function livelog(msg) {
	console.log(msg);
}

//清屏
function qingping1() { $(".chat-messages").html(""); $("#gongjuboxshezhi").hide(); }

///<summary>
///操作系统浏览器数据写入和读取
///</summary>
var sysResource = new function () {
    ///<summary>
    ///获得本地浏览器localStorage数据
    ///</summary>
    this.GetlocalStorage = function (name) {
        if (window.localStorage) {
            var value = localStorage.getItem(name);
            if (value != null && value != "" && value != undefined) {
                return JSON.parse(value);
            } else {
                return value;
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    ///<summary>
    ///重写本地浏览器localStorage数据
    ///</summary>
    this.SetlocalStorage = function (name, obj) {
        if (window.localStorage) {
            try {
                localStorage.setItem(name, JSON.stringify(obj));
            }
            catch (oException) {
                if (oException.name == 'QuotaExceededError') {
                    console.log('超出本地存储限额！');
                    //如果历史信息不重要了，可清空后再设置
                    localStorage.clear();
                    localStorage.setItem(name, JSON.stringify(obj));
                }
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    ///<summary>
    ///模糊删除本地localStorage数据
    ///</summary>
    this.DellocalStorage = function (name) {
        if (window.localStorage) {
            for (var i = 0; i < localStorage.length; i++) {
                //key(i)获得相应的键
                var keystr = localStorage.key(i);
                if (keystr.indexOf(name) >= 0) {
                    sysResource.SetlocalStorage(keystr, null);
                }
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    ///<summary>
    ///获得本地浏览器SessionStorage数据
    ///</summary>
    this.GetsessionStorage = function (name) {
        if (window.sessionStorage) {
            var value = sessionStorage.getItem(name);
            if (value != undefined && value != null && value != "undefined" && value != "") {
                return JSON.parse(value);
            } else {
                return value;
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }

    /// <summary>
    /// 重写本地浏览器SessionStorage数据
    /// </summary>
    this.SetsessionStorage = function (name, obj) {
        if (window.sessionStorage) {
            if (obj == "" || obj == undefined || obj == null) {
                sessionStorage.setItem(name, obj);
            } else {
                sessionStorage.setItem(name, JSON.stringify(obj));
            }
        } else {
            layer.alert('您需要升级浏览器才能够进行直播', { icon: 0, title: '系统提示' });
        }
    }
}

///<summary>
///操作系统浏览器相关配置
///</summary>
var sysConfig = new function () {
    ///<summary>
    ///判断浏览器是否支持H5
    ///</summary>
    this.checkhHtml5 = function () {
        //        if (typeof (Worker) !== "undefined") {  return true; } else { return false; }
        if (document.getElementById("Canvas_Tea").getContext && typeof (Worker) !== "undefined") { return true; } else { return false; }
    }

    ///<summary>
    ///获取背景图片大小在白板显示
    ///</summary>
    this.GetImgSize = function (imgid, filePath) {
        /*
        var img = document.createElement("img"); //添加 img
        img.setAttribute("id", "newImg"); //设置 img 属性，如 id
        img.src = filePath; //设置 img 图片地址
        w = img.width;
        h = img.height;
        if (w != 0 && h != 0 && w >= h) {
        $("#" + imgid + "").css("background-size", "100% auto");
        } else {
        $("#" + imgid + "").css("background-size", "auto 100%");
        }*/
        var realWidth; //真实的宽度
        var realHeight; //真实的高度
        //这里做下说明，$("<img/>")这里是创建一个临时的img标签，类似js创建一个new Image()对象！
        $("<img/>").attr("src", filePath).load(function () {
            /*
            如果要获取图片的真实的宽度和高度有三点必须注意
            1、需要创建一个image对象：如这里的$("<img/>")
            2、指定图片的src路径
            3、一定要在图片加载完成后执行如.load()函数里执行
            */
            realWidth = this.width;
            realHeight = this.height;
            //如果真实的宽度大于浏览器的宽度就按照100%显示
            if (realWidth > realHeight) {
                //$(img).css("width", "100%").css("height", "auto");
                if (parseFloat(realHeight / realWidth).toFixed(2) > 0.75) {
                    $("#" + imgid + "").css("background-size", "auto 100%");
                } else {
                    $("#" + imgid + "").css("background-size", "100% auto");
                }
            } else {//如果小于浏览器的宽度按照原尺寸显示
                //$(img).css("width", realWidth + 'px').css("height", realHeight + 'px');
                $("#" + imgid + "").css("background-size", "auto 100%");
            }
        });
    }

    ///<summary>
    ///日期计算
    ///</summary>
    this.dateAdd = function (strInterval, Number, dtTmp) {
        if (dtTmp == null || dtTmp == "") {
            dtTmp = new Date();
        }
        switch (strInterval) {
            case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
            case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
            case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
            case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
            case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    }

    ///<summary>
    ///获取URL传参数
    ///</summary>
    this.QueryString = function (fieldName) {
        var reg = new RegExp("(^|&)" + fieldName.toLowerCase() + "=([^&]*)(&|$)", "i");
        var r = window.location.search.toLowerCase().substr(1).match(reg);
        if (r != null) return unescape(r[2]); return "";
    }

    ///<summary>
    ///随机产生用户ID
    ///</summary>
    this.GetUserId = function () {
        var data = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var result = "";
        for (var i = 0; i < 6; i++) { //产生20位就使i<20
            r = Math.floor(Math.random() * 36); //16为数组里面数据的数量，目的是以此当下标取数组data里的值！
            result += data[r]; //输出20次随机数的同时，让rrr加20次，就是20位的随机字符串了。
        }
        return result;
    }

    this.StartCanvasLive = function () {
        var messageStr1 = "cmd:";
        messageStr1 += "startlive";
        var data1 = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr1,
            username: flashvars.name,
            livetiem: zbtiem,
            usertype: flashvars.type,
            userid: flashvars.id
        });

        if (txt != undefined) {
            //保存教学记录_提交画线记录
            $.post("/Server/HttpRequest.ashx", { action: "saveredis_savelive", talkId2: "zhibo_jiaoxue_" + talkId, jsonstr2: "zhibo_" + talkId + "_" + fileguid + "_" + pagenum + "," + zbtiem, fileguid: fileguid, talkId: talkId, pagenum: pagenum, jsonstr: "" }, function (data) {
                console.log("提交教学记录_画线记录:" + data); //保存画线记录
                sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, txt); //保存画线记录
            });
        }
        Messaging.publish(CHATROOM_TOPIC, data1);
    }


    ///<summary>
    ///结束直播
    ///</summary>
    this.OverLive = function () {

		liveVideo.saveliveconfig();
		eduCanvas.tijiaoedu();
		saveluxiang();

        layer.confirm('确定要结束直播吗？', {
            btn: ['确定', '取消'] //按钮
        }, function () {
            zbflag = false;
            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: "结束",
                fileNames: "",
                pagenum: "",
                fxpathMax: "",
                option: null
            };

            var livestate = "";
            var messageStr1 = "cmd:";
            istext = 0;
            isvideo = 0;
            isvoice = 0;
            livestate = "1_0";
            messageStr1 += "overlive";
            $(".video-jiaohuan").show();

			 $.post("/Server/Manager.ashx?r=" + Math.random() + "", { param: "savelivestate", roomid: talkId, state: "2", resurl: decodeURI(sysConfig.QueryString("resurl")) }, function (data) {
                    if (data != undefined && data != null) {
                    }
                });

            //修改学员直播流的地址（关闭推流）
            //            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: userid, delmark: 0, r: Math.random() }, function (data_upd) {
            //                console.log(data_upd);
            //                //layer.alert(data_upd);
            //            });

            var data1 = JSON.stringify({
                dataType: 'MESSAGE',
                dataContent: messageStr1,
                username: flashvars.name,
                livetiem: zbtiem,
                usertype: flashvars.type,
                userid: flashvars.id
            });

            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: livestate
            };


            Messaging.publish(CHATROOM_TOPIC, data1);
            eduCanvas.saveluzhi(objstr);
            sysResource.SetlocalStorage("overlive_" + $("#talkId").val(), "1");
            loginwindow.showerr("直播已结束");

            layer.msg('', { time: 1 });
        }, function () {
            //layer.msg('取消');
        });
    }

	 ///<summary>
    ///结束直播 (手机直播)
    ///</summary>
    this.OverLive2 = function () {
            zbflag = false;
            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: "结束",
                fileNames: "",
                pagenum: "",
                fxpathMax: "",
                option: null
            };

            var livestate = "";
            var messageStr1 = "cmd:";
            istext = 0;
            isvideo = 0;
            isvoice = 0;
            livestate = "1_0";
            messageStr1 += "overlive";
            $(".video-jiaohuan").show();

			 $.post("/Server/Manager.ashx?r=" + Math.random() + "", { param: "savelivestate", roomid: talkId, state: "2" }, function (data) {
                    if (data != undefined && data != null) {
                    }
                });

            //修改学员直播流的地址（关闭推流）
            //            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: userid, delmark: 0, r: Math.random() }, function (data_upd) {
            //                console.log(data_upd);
            //                //layer.alert(data_upd);
            //            });

            var data1 = JSON.stringify({
                dataType: 'MESSAGE',
                dataContent: messageStr1,
                username: flashvars.name,
                livetiem: zbtiem,
                usertype: flashvars.type,
                userid: flashvars.id
            });

            var objstr = {
                id: timestamp,
                type: "1",
                title: zbtiem,
                dis: livestate
            };

            liveVideo.saveliveconfig();
            Messaging.publish(CHATROOM_TOPIC, data1);
            eduCanvas.saveluzhi(objstr);
            sysResource.SetlocalStorage("overlive_" + $("#talkId").val(), "1");

    }

    ///<summary>
    ///关闭选项卡
    ///</summary>
    this.CloseWebPage = function () {
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
                window.opener = null;
                window.close();
            } else {
                window.open('', '_top');
                window.top.close();
            }
        }
        else if (navigator.userAgent.indexOf("Firefox") > 0) {
            window.location.href = 'about:blank ';
        } else {
            window.opener = null;
            window.open('', '_self', '');
            window.close();
        }
    }

    ///<summary>
    ///直播计时器
    ///</summary>
    this.zhibotime = function () {
        zbtiem++;
        //超过4小时的部分重新计费
        if (zbtiem >= livetime) {
            //        jifeiNum++;
            livetime = livetime + (60 * 60);
            //扣费
            $.post("/server/httprequest.ashx", { action: "livedebit", username: flashvars.id, roomid: $("#talkId").val() }, function (data) {
                console.log("扣费记录:" + data);
            });
        }
        var hht = 0, mmt = 0, sst = 0;
        var hh = "00", mm = "00", ss = "00";
        if (zbtiem < 60) {
            if ((zbtiem + "").length == 1) { ss = "0" + zbtiem; } else { ss = zbtiem; }
        } else if (zbtiem >= 60 && zbtiem < 3600) {
            mmt = parseInt(zbtiem / 60);
            if ((mmt + "").length == 1) { mm = "0" + mmt; } else { mm = mmt; }
            sst = zbtiem - (mmt * 60);
            if ((sst + "").length == 1) { ss = "0" + sst; } else { ss = sst; }

        } else if (zbtiem >= 3600) {
            hht = parseInt(zbtiem / 3600);
            if ((hht + "").length == 1) { hh = "0" + hht; } else { hh = hht; }
            mmt = parseInt((zbtiem - (hht * 3600)) / 60);
            if ((mmt + "").length == 1) { mm = "0" + mmt; } else { mm = mmt; }
            sst = (zbtiem - (hht * 3600) - (mmt * 60));
            if ((sst + "").length == 1) { ss = "0" + sst; } else { ss = sst; }
        }
        $("#zbtiem").html(hh + ":" + mm + ":" + ss);

        //直播倒计时4小时 最后15分钟提示
        if (zbtiem <= 4 * 60 * 60 && zbtiem >= 3 * 60 * 60 + 45 * 60) {
            $("#livetishi").show();
            $("#livetime").show();
            //900

            var mmt_1 = 0, sst_1 = 0, zongt = 900;
            var mm_1 = "00", ss_1 = "00";
            if (zongt > 0) {
                mmt_1 = parseInt(zongt / 60);
                if ((mmt_1 + "").length == 1) { mm_1 = "0" + mmt_1; } else { mm_1 = mmt_1; }
                sst_1 = zongt - mmt_1 * 60;
                if ((sst_1 + "").length == 1) { ss_1 = "0" + sst_1; } else { ss_1 = sst_1; }
                $("#livetishi").html(mm_1 + ":" + ss_1);
            }
        } else {
            $("#livetishi").hide();
            $("#livetime").hide();
        }
        if (zbflag) { setTimeout(sysConfig.zhibotime, 1000); }
    }


    this.CurentTime = function () {
        var now = new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        var se = now.getSeconds();
        var clock = "     ";
        if (hh < 10)
            clock += "0";
        clock += hh + ":";
        if (mm < 10)
            clock += '0';
        clock += mm + ":";
        if (se < 10)
            clock += '0';
        clock += se;
        return (clock);
    }

    //画笔颜色
    this.GetColor = function (e) {
        $("#divyanse").hide();
        color = e;
    }

    this.RightMenu = function (element) {
        context.init({ preventDoubleContext: false });
        context.attach(element, [
        //{ header: 'Compressed Menu' }, //菜单中的标题
		    {text: '清屏', action: function (e) {
		        e.preventDefault();
		        $("#chat-messages").html("");
		    }
		},
        //{ text: 'View Page Info', href: '#' }, //普通选项
        //{ divider: true }, //横线
	    ]);
    }
}

///<summary>
///视频相关 推流 和 拉流
///</summary>
var liveVideo = new function () {

    ///<summary>
    ///视频播放拉流
    ///</summary>
    this.playVideo = function (userid, fileUrl, hlsurl, w, h) {
        console.log("rtmpurl:" + fileUrl + "hlsurl:" + hlsurl);
        try {

// if (browser.versions.mobile || browser.versions.ios || browser.versions.android || browser.versions.symbianos || browser.versions.wp) {//手机访问
//	if (window.orientation == 180 || window.orientation == 0) {}//竖屏

	 	if ((window.orientation == 180 || window.orientation == 0 || window.orientation == 90 || window.orientation == -90)&&(livetype==1 || livetype==3)) {//横屏
//if(livetype==1 || livetype==3){
            if (!w) { w = "100%"; }
            if (!h) { h = "100%"; }
			fileUrl = hlsurl;
//			alert(fileUrl);
			//}
			if (sysConfig.QueryString("uid") != "" && sysConfig.QueryString("uid") != null){


			}else{
				$(".appvideostop").show();
				$("#"+userid+"").html("<audio src=\""+fileUrl+"\" id=\"audio1\" controls=\"controls\"></audio>");
			}
//alert($("#"+userid+"").html());
 }else{
	 $(".appvideostop").hide();
            if (!w) { w = "220"; }
            if (!h) { h = "160"; }


            var player = cyberplayer(userid).setup({
                width: w,
                height: h,
                stretching: "uniform",
                file: fileUrl,
                autostart: true,
                repeat: false,
                volume: 100,
        controls: true,
        isLive: true,
                rtmp: {
                    reconnecttime: 10,
                    bufferlength: 1
                },
                //                minBufferLength: 1,
                fallbackfile: hlsurl,
                ak: "46f1d86bc6564883bc805c3c6d2c03e7" // 公有云平台注册即可获得accessKey
            });
			}
        } catch (e) {
            console.error('视频播放异常：' + e);
        }
    }

    ///<summary>
    ///视频播放推流
    ///</summary>
    this.pushVideo = function (flashvars, videid) {
        try {
            var params = { wmode: 'transparent' };
            //        bgcolor: '#FFF', allowFullScreen: true, allowScriptAccess: 'always',
            //        var video = [flashvars.f + '->video/mp4'];
            //        CKobject.embed('/js/Live/video.swf', videid, new_vid, '100%', "100%", false, flashvars, video, params);
            var attributes = {};
            swfobject.embedSWF("/js/Live/video.swf", videid, "100%", "100%", "9.0.0", "/js/Live/expressInstall.swf", flashvars, params, attributes);
        } catch (e) {
            console.error('直播推流异常：' + e);
        }
    }

    ///<summary>
    ///关闭 1 麦克风   2 摄像头
    ///</summary>
    this.closelive = function (str) {
        console.log('关闭麦克风或摄像头：' + str);
        var livestate = "";
        var messageStr1 = "cmd:";
        if (str == 1) {
            isvoice = 0;
			isvideo = 0;
            livestate = "1_0";
            messageStr1 += "colsemkf";
            $(".video-jiaohuan").show();
            if (roleId == 0) {
                teach_video = "1_1_0";
            } else {
                stu_video = "0_1_0";
            }
        } else if (str == 2) {
            isvoice = 0;
			            isvideo = 0;
            livestate = "2_0";
            messageStr1 += "colsesxt";
            if (roleId == 0) {
                teach_video = "1_2_0";
            } else {
                stu_video = "0_2_0";
            }
        }

        var data1 = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr1,
            username: flashvars.name,
            livetiem: zbtiem,
            usertype: flashvars.type,
            userid: flashvars.id
        });

        var objstr = {
            id: timestamp,
            type: "1",
            title: zbtiem,
            dis: livestate
        };
        eduCanvas.saveluzhi(objstr);
        liveVideo.saveliveconfig();

        //修改学员直播流的地址
        $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: flashvars.id, delmark: 0, r: Math.random() }, function (data_upd) {
            console.log(data_upd);
            Messaging.publish(CHATROOM_TOPIC, data1);
        });

    }

    ///<summary>
    ///启动  1 麦克风   2 摄像头
    ///</summary>
    this.startlive = function (str) {
        console.log('启动麦克风或摄像头：' + str);
        var livestate = "";
        var messageStr2 = "cmd:";
        if (str == 1) {
            isvideo = 1;
            livestate = "1_1";
            messageStr2 += "startmkf";
            if (roleId == 0) {
                teach_video = "1_1_1";
            } else {
                stu_video = "0_1_1";
            }
        } else if (str == 2) {
            isvoice = 1;
            livestate = "2_1";
            messageStr2 += "startsxt";
            if (roleId == 0) {
                teach_video = "1_2_1";
            } else {
                stu_video = "0_2_1";
            }
        }
        var data2 = JSON.stringify({
            dataType: 'MESSAGE',
            dataContent: messageStr2,
            username: flashvars.name,
            userid: flashvars.id,
            usertype: flashvars.type,
            livetiem: zbtiem
        });

        var objstr = {
            id: timestamp,
            type: "1",
            title: zbtiem,
            dis: livestate
        };
        eduCanvas.saveluzhi(objstr);

        liveVideo.saveliveconfig();
        /*
        //获取教师播放地址
        $.post("/Server/Manager.ashx", { param: "getpushurl", roomid: $("#talkId").val(), litype: 1 }, function (data_1) {
        if (data_1 != undefined && data_1 != null) {
        var liveinfo_1 = eval("(" + data_1 + ")");
        var upd_userid = "";
        if (liveinfo_1.mes != null && liveinfo_1.mes.length > 0) { upd_userid = liveinfo_1.mes[0].Userid; } else { upd_userid = userid; }
        if (upd_userid != userid) {
        //修改教师直播信息
        $.post("/Server/Manager.ashx", { param: "updpushurl2", roomid: $("#talkId").val(), uid: userid, delmark: 1, uname: flashvars.name, r: Math.random() }, function (data_upd) {
        console.log(data_upd);
        publish(CHATROOM_TOPIC, data2);
        //layer.alert(data_upd);
        });
        } else {
        //修改学员直播流的地址
        $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: upd_userid, delmark: 1, r: Math.random() }, function (data_upd) {
        console.log(data_upd);
        publish(CHATROOM_TOPIC, data2);
        //layer.alert(data_upd);
        });
        }
        }
        });*/
        if (flashvars.type == 0) {
            //修改教师直播信息
            $.post("/Server/Manager.ashx", { param: "updpushurl2", roomid: $("#talkId").val(), uid: flashvars.id, delmark: 1, uname: flashvars.name, r: Math.random() }, function (data_upd) {
                console.log(data_upd);
                Messaging.publish(CHATROOM_TOPIC, data2);
            });
        } else {
            $.post("/Server/Manager.ashx", { param: "updpushurl", roomid: $("#talkId").val(), uid: flashvars.id, delmark: 1, r: Math.random() }, function (data_upd) {
                console.log(data_upd);
                Messaging.publish(CHATROOM_TOPIC, data2);
                //layer.alert(data_upd);
            });
        }
        //        publish(CHATROOM_TOPIC, data2);
        //此处需要修改falsh，开始直播时候捕获当天的推流地址
    }

    ///<summary>
    ///视频直播警告
    ///</summary>
    this.runloglive = function (logtext) {
        console.log("视频直播警告：" + logtext);
    }

    //保存直播相关配置【禁言、视频、语音】
    this.saveliveconfig = function () {

        $.post("/Server/HttpRequest.ashx", { action: "getconfig", talkId: talkId, r: Math.random() }, function (data_config) {
            if (data_config != null && data_config != "" && data_config != "-1") {
                var abc = eval("(" + data_config + ")");
                /*istext = abc.istext;
                isvideo = abc.isvideo;
                isvoice = abc.isvoice;*/
                if (roleId == 0) {
                    stu_video = abc.stuvideo;
                } else {
                    teach_video = abc.teachvideo;
                }
                var config = JSON.stringify({ istext: istext, isvideo: isvideo, isvoice: isvoice, stuvideo: stu_video, teachvideo: teach_video }); // 关闭/开启 【禁言、视频、语音】  0关闭 1开启
				console.log(config);
                //提交画线记录
                $.post("/Server/HttpRequest.ashx", { action: "saveconfig", talkId: talkId, jsonstr: config }, function (data) {
                    sysResource.SetlocalStorage("liveconfig_" + talkId, config); //保存直播相关配置
                    console.log("保存直播相关配置1:" + data);
                });
            } else {
                var config = JSON.stringify({ istext: istext, isvideo: isvideo, isvoice: isvoice, stuvideo: stu_video, teachvideo: teach_video }); // 关闭/开启 【禁言、视频、语音】  0关闭 1开启
				console.log(config);
                //提交画线记录
                $.post("/Server/HttpRequest.ashx", { action: "saveconfig", talkId: talkId, jsonstr: config }, function (data) {
                    sysResource.SetlocalStorage("liveconfig_" + talkId, config); //保存直播相关配置
                    console.log("保存直播相关配置2:" + data);
                });
            }
        });
    }
}



///<summary>
///页面加载
///</summary>
var sysHtml = new function () {

    ///<summary>
    ///标签初始化Click事件
    ///</summary>
    this.initClick = function () {
        // 发送消息
        $('.btn-send-msg').click(function () {
			if($('.chatroom-input').attr('disabled')=="disabled"){
			}else{
	            Messaging.sendMessage();
			}
        });

        //课程交流
        $("#ketang").click(function () {
            $("#zaixian").removeClass("a_home");
            $("#ketang").addClass("a_home");
            $("#talkContent").css("display", "block");
            $("#guanli").css("display", "none");
        })

        //在线人员
        $("#zaixian").click(function () {
            $("#ketang").removeClass("a_home");
            $("#zaixian").addClass("a_home");
            $("#talkContent").css("display", "none");
            $("#guanli").css("display", "block");
        });

    }

    this.uppage = function () {
        if (pagenum > 0) {
            pagenum--;
            fanye(pagenum);
        } else {
            layer.msg("没有上一页了！", { skin: 'demo-class' });
        }
    }
    this.downpage = function () {
        if (pagenum < pagecount - 1) {
            pagenum++;
            fanye(pagenum);
        } else {
            layer.msg("最后一页了！", { skin: 'demo-class' });
        }
    }

}

///<summary>
///加载教学记录
///</summary>
var liveRecord = new function () {

    //教学记录
    this.initload = function (zttiStr) {
        try {
            var zbtiem1 = zttiStr.split(",");
            if (zbtiem1[1] != null) {
				if (zbtiem == 0) {
					zbtiem = zbtiem1[1];
					start_live();
					sysConfig.zhibotime();
				 }
				 			  daojishi();
			 }else{
			  daojishi();
			 }

			 //续接上次直播的时间

            var zttiJson = sysResource.GetlocalStorage(zbtiem1[0]);
            if (zttiJson != null) {
                var abc = eval(zttiJson);
                if (abc.length > 0) {
                    pagenum = abc[0].id.pagenum;
                    fxpathMax = abc[0].id.fxpathMax;
                    try {
                        fileNames = eval(abc[0].id.fileNames);
                        fxpathMax2 = "";
						pagecount=fileNames.length;
                    } catch (e) {
                        fileNames = abc[0].id.fileNames;
                        fxpathMax2 = fxpathMax + fileNames;
						pagecount=1;
                    }
                    var arrayztti_1 = zttiStr.split(',')[0].split('_');
                    pagenum = arrayztti_1[3];
                    fileguid = arrayztti_1[2];

                    liveRecord.loadCanvas(abc);
                    $(".countPages").html(pagecount);
                    $(".numPages").html(parseInt(pagenum) + 1);
                }
            } else {
                var arrayztti = zttiStr.split(',')[0].split('_');
                pagenum = arrayztti[3];
                fileguid = arrayztti[2];
                $.post("/Server/HttpRequest.ashx", { action: "getlive", fileguid: fileguid, talkId: talkId, pagenum: pagenum }, function (data) {
                    if (data != null && data != "" && data != "[]" && eval(data)[0] != undefined) {
                        $("#divfilelist").hide();
                        xy = new Array();
                        var abc = eval(data); //视频规矩还原
                        if (abc.length > 0) {
                            fxpathMax = abc[0].id.fxpathMax;
                            try {
                                fileNames = eval(abc[0].id.fileNames);
                                fxpathMax2 = "";
						pagecount=1;
                            } catch (e) {
                                fileNames = abc[0].id.fileNames;
                                fxpathMax2 = fxpathMax + fileNames;
														pagecount=1;
                            }
                            liveRecord.loadCanvas(abc);
                            sysResource.SetlocalStorage("zhibo_" + talkId + "_" + fileguid + "_" + pagenum, data); //保存画线记录
                            $(".countPages").html(pagecount);
                            $(".numPages").html(parseInt(pagenum) + 1);
                        }
                    }
                });
            }
        } catch (e) {
            console.error("教学记录加载异常：" + e);
        }
    }



	this.loadImg = function (data) {

        $(".swiper-wrapper").html("");
        var html = "";
        filename = eval(data.filenames.replace('""', '"'));
        try {
            if (filename[0].length > 1) {
                for (var i = 0; i < filename.length; i++) {
                    if (i == data.pagenum) {
                        html += "<div class=\"swiper-slide swiper-slide-active\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpathMax + filename[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                "</div>";
                    } else {
                        html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpathMax + filename[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div>" +
                                "</div>";
                    }
                }
                pagecount = filename.length;
            } else {
                html += "<div class=\"swiper-slide swiper-slide-active\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpath + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                "</div>";
                pagecount = 1;
            }
        } catch (e) {
            html += "<div class=\"swiper-slide swiper-slide-active\" style=\"width: 100%; height: 100%;\">" +
                                    "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                        "<img src=\"" + data.fxpath + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                    "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                "</div>";
            pagecount = 1;
        }
        $(".swiper-wrapper").html(html);
		tea = document.getElementById("Canvas_Tea"); //画板
			ctx = document.getElementById("Canvas_Tea").getContext("2d");
            if (bodyWidth - 10 >= 1900) {
                tea.width = 1040;
                tea.height = 780;
                init = 1.3;
            } else {
                //                console.log("页面加载时 boardBox的宽" + $("#boardBox").width() + "高" + $("#boardBox").height());
                tea.width = 800;
                tea.height = 600;
                init = 1;
            }
    }

    //加载白板信息（线条、背景图片）
    this.loadCanvas = function (abc) {
        try {
            //-----------------------------更新---------------------------

            var htmlTemp = $(".swiper-wrapper").html(); // 页面初始化时 外层div的内容
            $(".swiper-wrapper").html(""); //清空div内容
            var html = "";
            try {
                fileNames = eval(abc[0].id.fileNames);
                for (var i = 0; i < abc[0].id.fileNames.length; i++) {//读取记录
                    if (i == 0) {
                        html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                                               "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                                               "<img src=\"" + fxpathMax + fileNames[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                                               "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                                               "</div>";
                    } else {
                        html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                                                "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                                                "<img src=\"" + fxpathMax + fileNames[i] + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                                                "</div>" +
                                                                "</div>";
                    }

                }
                pagecount = abc[0].id.fileNames.length;
            } catch (e) {
                fileNames = abc[0].id.fileNames;
                fxpathMax2 = fxpathMax + fileNames;
                html += "<div class=\"swiper-slide\" style=\"width: 100%; height: 100%;\">" +
                                                               "<div class=\"swiper-zoom-container\" style=\"width: 100%; height: 100%; position: absolute;top: 0; left: 0\">" +
                                                               "<img src=\"" + fxpathMax2 + "\" class=\"swiper-lazy swiper-lazy-loaded\" style=\"\" />" +
                                                               "</div><canvas id=\"Canvas_Tea\"></canvas>" +
                                                               "</div>";
                pagecount = 1;
            }

            if (html == "") {//如果记录为空，把之前的内容还赋值给原来的div
                html = htmlTemp;
                $(".swiper-wrapper").html(html);
                Zs();
            } else {
                $(".swiper-wrapper").html(html);
            }
            tea = document.getElementById("Canvas_Tea"); //画板
			ctx = document.getElementById("Canvas_Tea").getContext("2d");
            if (bodyWidth - 10 >= 1900) {
                tea.width = 1040;
                tea.height = 780;
                init = 1.3;
            } else {
                //                console.log("页面加载时 boardBox的宽" + $("#boardBox").width() + "高" + $("#boardBox").height());
                tea.width = 800;
                tea.height = 600;
                init = 1;
            }
            var option1 = new Array(); //画笔描点集合
            for (var ii = 0; ii < abc.length; ii++) {
                if (abc[ii].id != null) {
                    var jsoninfo = abc[ii].id.option;
                    if (jsoninfo != undefined && jsoninfo.length > 0) {
                        //console.log("测试-----",jsoninfo);
                        Array.prototype.push.apply(option1, eval(jsoninfo));
                    }
                }
            }
            if (option1.length > 0) {
                eduCanvas.drowDTX(option1, 0, init);
            } //开始还原描点记录
        } catch (e) {
            console.error("加载白板信息异常：" + e);
        }
    }

    //教学记录
    this.GetLiveRecord = function () {
        var RecordStr = sysResource.GetlocalStorage("zhibo_teach_" + talkId);
        $.post("/Server/HttpRequest.ashx", { action: "getredis", talkId2: "zhibo_jiaoxue_" + talkId, r: Math.random() }, function (data) {

            if (RecordStr != undefined && RecordStr != null && RecordStr != "" && RecordStr != "undefined" && (data == "" || RecordStr == data)) {
                RecordStr = RecordStr.replace("%2c", ",");
                var zttiStr_1 = RecordStr.split(",")[0];
                fileguid = zttiStr_1[0].split('_')[2];
                pagenum = zttiStr_1[0].split('_')[3];
                liveRecord.initload(RecordStr);
                if (flashvars.type == 1) { $("#livestate").val("直播中");  }
            } else {
                RecordStr = data; //获取教学记录
                if (data.length!=undefined &&data.length>0&& RecordStr != null && RecordStr != "") {
		            data = data.replace("%2c", ",");
                    RecordStr = RecordStr.replace("%2c", ",");
                    if (flashvars.type == 0) {
                        sysResource.SetlocalStorage("zhibo_teach_" + talkId, RecordStr);
                    }
                    var zttiStr_1 = RecordStr.split(",")[0];
                    fileguid = zttiStr_1.split('_')[2];
                    pagenum = zttiStr_1.split('_')[3];
                    liveRecord.initload(RecordStr);
                    if (flashvars.type == 1) { $("#livestate").val("直播中");  }
                  } else {
                    daojishi();
                }
            }
        });
    }
}

$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        var initdis = $("#Init").css("display");
        var maindis = $("#Main").css("display");
        if (initdis == "none" && maindis == "block") {
                if (istext == 0) {
                    Messaging.sendMessage();
                }
        }
        if (initdis == "block" && maindis == "none") { loginClick(); }
    }
});
