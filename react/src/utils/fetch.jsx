class Fetch {
	
    processUrl(params) {
        var str = [];
        for(var p in params) {
            if (params.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
            }
        }
        return ("?" + str.join("&"));
    }

    processData(params) {
        let paramsString = Object.keys(params).reduce((previousValue, strkey)=> {
            let item = params[strkey];
            if (item === '') {
                return previousValue;
            }
            if( item instanceof Object){
                item = JSON.stringify(item)
            }
            item = encodeURIComponent(item)
            if (previousValue === '') {
                return strkey + '=' + item
            } else {
                return previousValue + '&' + strkey + '=' + item
            }
        }, '');
        return paramsString
    }

    get({url, params}) {
        if(params != undefined){
            let paramStr = this.processUrl(params);
            url = url + paramStr;
        }
        let fetchConfig = {
            credentials: "same-origin",
        };
        fetchConfig.headers = {
            "X-Requested-With": "XMLHttpRequest",
            "type": "GET",
        }
        return new Promise((resolve, reject)=> {
            fetch(url, fetchConfig).then(function (res) {
                if (res.ok) {
                    try {
                        res.json().then((data)=> {
                            resolve(data);
                        });
                    } catch (e) {
                        console.error("响应值解析json错误");
                    }
                } else {
                    reject();
                    console.error("错误的状态码:" + res.status);
                }
            }, function (e) {
                reject(e);
                console.error("拉取数据失败..." + e);
            });
        })
    }

    post({url, params}) {
        let fetchConfig = {
            method: "post",
            credentials: "same-origin"
        };
        if(params !== undefined){
            fetchConfig.body = this.processData(params)
        }
        fetchConfig.headers = {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded",
            "type":"POST"
        }
        return new Promise((resolve, reject)=> {
            fetch(url, fetchConfig).then(function (res) {
                if (res.ok) {
                    try {
                        res.json().then((data)=> {
                            resolve(data);
                        });
                    } catch (e) {
                        console.error("响应值解析json错误");
                    }
                } else {
                    reject();
                    console.error("错误的状态码:" + res.status);
                }
            }, function (e) {
                reject(e);
                console.error("拉取数据失败..." + e);
            });
        });
    }
}

export default new Fetch()