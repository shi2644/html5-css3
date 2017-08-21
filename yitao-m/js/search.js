   function Search() {
        this.dom = null;
        this.but = null;
        this.val = "";
        Search.prototype.init = function () {
            this.dom = document.querySelector("#searchTxt");
            this.but = document.querySelector("#searchBut");
            console.log(this.dom);
            console.log(this.but);
        };
        Search.prototype.binding = function () {
            var self = this;
            this.but.addEventListener("touchstart",function () {
                self.val = self.dom.value;
                window.location.href = "h5css3/yitao-m/html/search.html?search_text="+self.val;
            })
        };
        this.init();
        this.binding();
    }
    new Search();
