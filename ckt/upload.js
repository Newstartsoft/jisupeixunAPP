(function ($, window) {
    $.extend($.fn, {
        fileUpload: function (opts) {
            this.each(function () {
                var $self = $(this);
                var doms = {
                    "fileToUpload": $self.find(".fileToUpload"),
                    "thumb": $self.find(".thumb"),
                    "progress": $self.find(".upload-progress")

                };
                var funs = {
                    //选择文件，获取文件大小，也可以在这里获取文件格式，限制用户上传非要求格式的文件
                    "fileSelected": function () {
                        var files = (doms.fileToUpload)[0].files;
                        var count = files.length;
                        for (var index = 0; index < count; index++) {
                            var file = files[index];
                            var fileSize = 0;
                            if (file.size > 1024 * 1024)
                                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
                            else
                                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
                        }
                        funs.uploadFile();
                    },
                    //异步上传文件
                    uploadFile: function () {
                        var fd = new FormData(); //创建表单数据对象
                        var files = (doms.fileToUpload)[0].files;
                        var count = files.length;
                        for (var index = 0; index < count; index++) {
                            var file = files[index];
                            fd.append(opts.file, file); //将文件添加到表单数据中
                            funs.previewImage(file); //上传前预览图片，也可以通过其他方法预览txt
                        }
                        var xhr = new XMLHttpRequest();
                        doms.progress.show();
                        //alert(doms.progress.html());
                        xhr.upload.addEventListener("progress", funs.uploadProgress, false); //监听上传进度
                        xhr.addEventListener("load", funs.uploadComplete, false);
                        xhr.addEventListener("error", opts.uploadFailed, false);
                        xhr.open("POST", opts.url);
                        xhr.send(fd);
                    },
                    //文件预览
                    previewImage: function (file) {
                        // var gallery = doms.thumb;
                        //  var img = document.createElement("img");
                        //  img.file = file;
                        //  doms.thumb.html(img);
                        // 使用FileReader方法显示图片内容
                        // var reader = new FileReader();
                        //  reader.onload = (function (aImg) {
                        //      return function (e) {
                        //          aImg.src = e.target.result;
                        //      };
                        //  })(img);
                        //  reader.readAsDataURL(file);
                    },
                    uploadProgress: function (evt) {
                        if (evt.lengthComputable) {
                            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                            doms.progress.html(percentComplete.toString() + '%');
                            if (percentComplete == 100) {
                                doms.progress.html('处理中');
                            }
                        }
                    },
                    "uploadComplete": function (evt) {
                        doms.progress.hide();
                        //获得新的图片
                        var newkc = JSON.parse(evt.target.responseText);
                        for (var i = 0; i < newkc.length; i++) {
                            kecheng.push(newkc[i]);
                            //alert(evt.target.responseText)
                            //插入界面上
                            var khtml = "<div class=\"swiper-slide\"><div class=\"swiper-zoom-container\"><img src=\"" + newkc[i].url + "\"  ></div><div class=\"yinpin\"><span>)</span><span>)</span><span style=\"font-size:21px;\">)</span><div class=\"yinnumber\" id=\"yinnumber\">0</div></div></div>";
                            mySwiper.appendSlide(khtml);
                        }
                        mySwiper.slideTo(kecheng.length - 1, 1000, false); //切换到第一个slide，速度为1秒
                        //上传服务器
                        gengxin();
                    }
                };
                doms.fileToUpload.on("change", function () {
                //  alert("点案例");
                    doms.progress.find("span").width("0");
                    funs.fileSelected();
                });
            });
        }
    });
})(Zepto, window);
