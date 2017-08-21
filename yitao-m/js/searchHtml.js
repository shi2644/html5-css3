window.onload = function () {
    function SearchHtml() {
        this.dom = null;
        this.Top = null;
        this.searchText = "";
        this.previousBut = null;
        this.page = 1;
        this.pagesize = 10;
        this.max = 0;
        this.sewheel = 0;
        this.timer = 0;
        SearchHtml.prototype.init = function () {
            this.dom = document.querySelector("#searchGoods ul");
            this.searchText = getQueryString("search_text");
            this.previousBut = document.querySelector("#classify");
            this.Top = document.querySelector("#Top");
            this.sewheel = document.body.scrollTop;
        };
        SearchHtml.prototype.binding = function () {
            this.previousBut.addEventListener("touchstart",function () {
                window.history.go(-1);
            })
        };
        SearchHtml.prototype.requestAjax = function () {
            var self = this;
            var html = "";
            Ajax('GET',"api_goods.php?search_text="+self.searchText+"&page="+ self.page+"&pagesize=" +self.pagesize+"","",function (response) {
                console.log(response);
                self.max = response.page.page_count;
                for(var i = 0; i < response.data.length; i++){
                    var obj = response.data[i];
                    html += "<li><a href=../html/details.html?goods_id"+ obj.goods_id+"><img src="+obj.goods_thumb+" alt=''><h1>"+obj.goods_name +"</h1><span>￥"+ obj.price+"</span></a></li>"
                }
                self.dom.innerHTML += html;
            })
        };
        SearchHtml.prototype.scroll = function () {
            var self = this;
            document.addEventListener("scroll",function (event) {
                var bodyHeight = document.body.scrollHeight;
                var windowHeight = document.documentElement.clientHeight;
                var sewheel = document.body.scrollTop;
                if(sewheel + windowHeight === bodyHeight){
                    self.page++;
                    if(self.page >= self.max) return;
                    self.requestAjax();
                }
            });
            self.Top.addEventListener("touchstart",function () {
                self.sewheel = document.body.scrollTop;
                self.timer = setInterval(function(){
                    self.sewheel -= 30;
                    if(self.sewheel < 0){
                        self.sewheel = 0;
                        clearInterval(self.timer);
                        document.body.scrollTop = self.sewheel;
                        return;
                    }else{
                        document.body.scrollTop = self.sewheel;
                    }
                },5);
            })
        };
        this.init();
        this.binding();
        this.requestAjax();
        this.scroll();
    }
    new SearchHtml();
};