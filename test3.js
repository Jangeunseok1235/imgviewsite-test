const ps = require('querystring');
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
//const multer = require('multer');

      
//----------------------------------------------------------------

const { request, response } = require('express');
const express = require('express');
//npm i express --save 로 express 모듈을 현 디렉토리에 설치 후 선언함
const hbs = require('express-handlebars');
//npm i express-handlebars --save 로 express-handlebars 모듈을 현 디렉토리에 설치 후 선언함
const testserver = express();
// testserver 라는 서버 선언


/*const router = express.Router();
const storage = multer.diskStorage({
    destination(request, file, cb) {
        cb(null, 'data/img/');
    },
    filename(request, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({storage: storage});*/


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
    //이미지 폴더 셋
testserver.use((request, response, next) => {
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
           
                    let FileList = templateList(description);
                
        
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
        
                    let FileList = templateList(description);
                    
        
                    response.status(200).render('main',{
                        filename:title,
                        fileDescription:description,
                        imgList:FileList
                        //여기에 설정한 값이, 만들어 놓은 hbs파일(express-handlebars파일) 값에 입력된다.
                    });
                })
            })
        }

    } //if(pathname === '/')
 //------------------------------------------------------------------------------------------ 

}) // testserver.get('/')
//--------------------------------------------------------------------------------------------

testserver.get('/create', (request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;  
    let title = queryData.id;  
 
    if(pathname === '/create'){
        console.log('create 부분임');
        response.status(200).render('create',{
            

        });
    }


})//testserver.get('/create')
//--------------------------------------------------------------------------------------------

testserver.post('/create_process', (request, response) => {
    let _url = request.url;
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;  
    let title = queryData.id; 
 
    if(pathname === '/create_process'){
        console.log('create_process 초입 부분임');
        
        let body = '';
          request.on('data', function(data){
            body = body + data;
            console.log('create_process data 선언 부분임');
          });
        request.on('end', function(){
            let qs = require('querystring');
            let post = qs.parse(body);
            
            let title = post.title;
            let description = post.description;
            console.log('create_process request.on(end) 부분임');
            
        fs.writeFile(`data/description/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`}, 'utf8');
          response.redirect(`/`);
        })
      });
    }


})//testserver.post('/create_process')
//--------------------------------------------------------------------------------------------
/*testserver.post('/upload', upload.single('userfile'), (request,response) => {
    console.log('update 부분임');
    console.log('request :' + request.file);
    //response.redirect(`/create`);
})*/


testserver.get('/update/:pageId', function(request, response){
    fs.readdir('./data/description', function(error, filelist){
      let filteredId = path.parse(request.params.pageId).base;
      
      fs.readFile(`data/description/${filteredId}`, 'utf8', function(err, description){
        let title = request.params.pageId;
        console.log('update 부분임');
        response.status(200).render('update',{
            updateFileName:title,
            updateFileDescription:description

        });
      });
    });
   
  });

//testserver.get('/update')
//--------------------------------------------------------------------------------------------


testserver.post('/update_process', (request, response) => {
    let body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      const qs = require('querystring');
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
        console.log('id : '+id);
        let filteredId = path.parse(id).base;
        console.log('filteredId :' + filteredId);
      fs.rename(`data/description/${id}`, `data/description/${title}`, function(error){
        fs.writeFile(`data/description/${title}`, description, 'utf8', function(err){
          response.redirect(`/?id=${title}`);
        })
      });
  });
  
})//testserver.post('/update_process')
//--------------------------------------------------------------------------------------------


testserver.get('/delete/:pageId', function(request, response){
    fs.readdir('./data/description', function(error, filelist){
      let filteredId = path.parse(request.params.pageId).base;
      
      fs.readFile(`data/description/${filteredId}`, 'utf8', function(err, description){
        let title = request.params.pageId;
        console.log('delete 부분임');
        response.status(200).render('delete',{
            deleteFileName:title,
            deleteFileDescription:description

        });
      });
    });
});//testserver.get('/delete/:pageId)
//--------------------------------------------------------------------------------------------


testserver.post('/delete_process', (request, response) => {
    let body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      const qs = require('querystring');
      let post = qs.parse(body);
      let id = post.id;
      let title = post.title;
      let description = post.description;
        console.log('id : '+id);
        let filteredId = path.parse(id).base;
        console.log('filteredId :' + filteredId);
      fs.unlink(`data/description/${id}`, function(error){
        
          response.redirect(`/`);
        
      });
  });
  
})



testserver.listen(3000, () => {
    
    console.log("서버 동작 시작 21-04-04(일)");
    });