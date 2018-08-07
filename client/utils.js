// example: makeRequest('GET', 'http://example.com');
(function utils(){
    window.utils = {};
    window.utils.makeRequest = function makeRequest (method, url) {
        return new Promise(function (resolve, reject) {
          var xhr = new XMLHttpRequest();
          xhr.open(method, url);
          xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
              resolve(xhr.response);
            } else {
              reject({
                status: this.status,
                statusText: xhr.statusText
              });
            }
          };
          xhr.onerror = function () {
            reject({
              status: this.status,
              statusText: xhr.statusText
            });
          };
          xhr.send();
        });
    }

    window.utils.loadImageElement = function loadImageElement(url) {
        return new Promise(function (resolve, reject){
          const image = new Image();
          image.onload = function(){
            resolve(image);
          }
          image.src = url;
        });
    }
})();