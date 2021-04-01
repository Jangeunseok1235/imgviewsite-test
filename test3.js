const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const ps = require('querystring');

//----------------------------------------------------------------

const { request, response } = require('express');
const express = require('express');
//npm i express --save 로 express 모듈을 현 디렉토리에 설치 후 선언함
const hbs = require('express-handlebars');
//npm i express-handlebars --save 로 express-handlebars 모듈을 현 디렉토리에 설치 후 선언함
const testserver = express();
// testserver 라는 서버 선언

//---------------------------------------------------------------------

testserver.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout:'layout', 
    //가장 기초가 되는 레이아웃 페이지를 들어갔을때 메뉴 같은 코드를 반복적으로 작성하지 않고, 레이아웃만 만들어서 그안에서 페이지를 동작하는 방식으로 설정함
    layoutsDir:__dirname+'/views/layouts',

    partialsDir:__dirname+'/views/partials'
        //객체나 함수같은 느낌임
}))
testserver.set("view engine", "hbs");
    //express-handlebars 사용하게끔 셋

testserver.use(express.static(__dirname+"/data/img"));
testserver.use((request, response,next) => {
    //config
    next()
});
/*
testserver.use 를 이용하는 것은 미들웨어를 생성하겠다는 뜻
express.static 는 static 파일의 경로를 설정하는 것 

실행 순서는, 7번째 줄에서 이미지 폴더의 경로를 설정했고
18번째 줄을 수행하면  main.html이 불러와지면서 main.html이 실행된다.

만일, use를 사용하여 폴더를 지정하지 않으면 실행이 되지 않는다.
*/

//---------------------------------------------------------------------------------------

testserver.get('/', (request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;  
    let title = queryData.id;  
//------------------------------------------------------------------------------------

    if(pathname === '/'){
        if(title === undefined){

            fs.readdir('./data/description', function(error, fileList){
                title = 'Welcome';

                function templateList(filelist){
                    let list = '<ul>';
                    let i = 0;
                    let a = fileList.length;
                    while( i < a ) {
                        list = list + `<li><a href="/?id=${fileList[i]}"> ${fileList[i]}</a></li>`;
                        i = i + 1;
                    }
                    list = list+'</ul>'
                    return list; 
                }
        
                fs.readFile(`data/description/${title}`, 'utf8', function(err, description){
           
                    if(err){
                        console.log("(if) 에러 났엉...");
                    }
                    let FileList = templateList(description);
                    //
        
                    response.status(200).render('main',{
                        filename:title,
                        fileDescription:description,
                        imgList:FileList
    
                    });
                })
            })
        }//if문
        
        else {

            fs.readdir('./data/description', function(error, fileList){
                function templateList(filelist){
                    let list = '<ul>';
                    let i = 0;
                    let a = fileList.length;
                    while( i < a ) {
                        list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
                        i = i + 1;
                    }
                    list = list+'</ul>'
                    return list; 
                }
        
                fs.readFile(`data/description/${title}`, 'utf8', function(err, description){
           
                    if(err){
                        console.log("(else) 에러 났엉...");
                    }
                    let FileList = templateList(description);
                    //
        
                    response.status(200).render('main',{
                        filename:title,
                        fileDescription:description,
                        imgList:FileList
                        //여기에 설정한 값이, 만들어 놓은 hbs파일(express-handlebars파일) 값에 입력된다.
                    });
                })
            })
        }

    } 
 //------------------------------------------------------------------------------------------   
    

//--------------------------------------------------------------------------------------------    

}).listen(3000, () => {
    console.log("서버 동작 시작 21-04-01");
    });