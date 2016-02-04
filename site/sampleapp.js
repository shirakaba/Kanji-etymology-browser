var http = require('http');
        //require: load libraries, name of object
        //http: object
var fs = require('fs');
        /*ファイルの読み込み(非同期)
                fs.readFile(filePath, encode, callBack)

                読み込み開始したらすぐに次の処理。
                読み込みはバックグラウンド。
                完了したら読み込み後の処理（コールバック関数）
        */
var server = http.createServer();
        /*
         * create http.Server object

         Could be...
        http.createServer(function()){
         statements
        }).listen();

        argument of createServer: サーバーでリクエストを受け取った時の処理を用意しておく
        listen:待ち受けのためのメソッド*/




server.on('request', doRequest);
        //on: 指定のイベント処理を組み込むためのもの。first arg = イベント名, second arg= 組み込む関数
        //request: http.Server がクライアントからのリクエストを受け取った時に発生するイベント。ブラウザからサーバーにアクセスした時のサーバー側の処理

server.listen(1234);//port number. if changed to 80, port number won't be set
        //listen: サーバーが待ち受け状態になる。クライアントからリクエストがあれば受け取り処理する
        //2nd arg= ホスト名
        //3rd arg= バックログ
        //4th arg= コールバック関数

console.log('Server running!');

// リクエストの処理
        // req = reqest Object. http.IncomingMessage=クライアントからのリクエストに関する機能
        // res = response Object. http.serverResponse＝サーバーからクライアントへ戻されるレスポンスに関する機能
function doRequest(req, res) {
        var number = Math.floor(Math.random()*3);
        fs.readFile('./hello.html', 'UTF-8', function(err, data){
                var title=["Page A", "Page B", "Page C"];
                var content = ["This is a sample.", "Another contents.", "Last contents"];
                var data2 = data.
                        replace(/@title@/g, title[number]).
                        replace(/@content@/g, content[number]);

                res.writeHead(200, {'Content-Type': 'text/html'});
                //header information
                //  1 arg = status code
                //  2 arg = header info {'Content-Type': 'text/plain'} = Content-type: ヘッダー情報, text/plain: 値

                res.write(data2);
                //Body contentsの書き出し

                res.end();
});
    /*'./hello.html': filePath
     * callBack : err = エラーが発生した時のエラーメッセージ
     *  data= 読み込まれたテキスト。これをresponse.writeで書き出す
     * */

}