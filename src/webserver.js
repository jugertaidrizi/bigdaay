const sqlInjectReject = require('sql-inject-reject');
const express = require('express');
const multer = require('multer');
const mysql=require('mysql')
const path = require('path');
const fs = require('fs')
const cors=require('cors')
const bodyParser=require('body-parser');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');


//lidhja me db
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'webc',
    multipleStatements:true

})

db.connect()

//ketu do caktojm strategjin per auth...
let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'wowwow';


// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next)=> {
  console.log('payload received', jwt_payload);
//  let user = getUser({ id: jwt_payload.id })
let sql='SELECT *FROM adm WHERE id='+jwt_payload.id
db.query(sql,(err,result)=>{
if(err)throw err
else{
    if (result) {
        next(null, {data:result});
      } else {
        next(null,false);
      }
}
    
    });
    
})

passport.use(strategy);

//ketu mbaron



// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });


  // Init Upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('image');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only!');
    }
  }

  
  const app = express();

  
  //.... cors
  app.use(cors())
  // initialize passport with express
app.use(passport.initialize());


app.use((req, res, next) => {
    
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
      );
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      next();
    });
    
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  
  
// Public Folder
app.use(express.static('./public'));
//ketu do bejm postin


app.post('/post',(req,res)=>{
  let bod=req.body
  console.log(bod)
  
  
  if(!bod){
      res.status(400,{}).send({
          error:true,
          message:"te dhenat nuk jane te sakta"
          
      })
  }
  else{
    
      db.query('INSERT INTO post(first_name,last_name,location,phone_nr,post_type,body)\
       VALUES("?","?","?","?","?","?")',[req.body.first_name,req.body.last_name,req.body.location,req.body.phone_nr,req.body.post_type,req.body.body],
          
       (err,result,field)=>{
           if(err)throw err
           else{
               console.log('viij ketu')
              
              res.status(200).json({
  
                  message: "Postimi juaj u realizuar",
                  data: result
                  
              })
             
              
           }
          
           
  
      
          })
}
  
  
  
         
  
  })
  
//tn do hedhim fotot

app.post('/upload/img',(req,res)=>{ 
  upload(req, res, (err) => {
        
    console.log(req.body)
    
    if(err){
        console.log('jam tap')
      throw err
    } else {
      // kujdeeees
      let sql2='SELECT id FROM post ORDER BY ID DESC LIMIT 1'
      db.query(sql2,(err,rows)=>{
        if(err)throw err
else{
  let kjo=0;
    rows.forEach(row=> {
        kjo=row.id
        console.log(kjo)
    })
   console.log(JSON.stringify(req.file.path))

  db.query('INSERT INTO image (post_id,img_name,img_path) VALUES("?","?","?")',[kjo,req.file.filename,req.file.path], (err, result)=>{
     if(err)throw err 
   else{
     res.status(200).json({

      message: "Postimi juaj u realizuar",
      data: result
     
  })

}
     })
}
      })
   
    
    }
  });
  
})
  
//metoda get nqss ti klikon ke nje nga postimet
app.get('/car/rentcr/:id',(req,res)=>{
  let arraypath=[];
  
  
  let sql='SELECT *FROM post WHERE id='+[req.params.id]
  db.query(sql,(err,result)=>{
    if(err)throw err
    else{
      
      let sql2='SELECT img_path FROM image WHERE post_id='+[req.params.id]
      db.query(sql2,(err,rows)=>{
        if(err)throw err
        else{
          rows.forEach(row=> {
            arraypath.push(row.img_path)

            
                
          })
          console.log(arraypath)
            
          res.status(200).json({
            message:'ky eshte nje mesazh',
            data:result,arraypath
          })
        }
      })
    }

  
  })
})

//metoda get qe do i hedhesh ne state dhe do i shfaqesh si ke todo
app.get('/home',(req,res)=>{
  let sql='SELECT  p.id as id, p.first_name as first_name,\
   p.location as location, i.img_name as image_name,\
    i.img_path as image_path FROM post p inner join image i ON p.id=i.post_id group\
     by p.id ORDER BY p.id DESC LIMIT 0, 10'
     db.query(sql,(err,result)=>{
       if(err)throw err
       else{ 
         res.status(200).send(result)
    
       }
      }
     )
  
})


//ketu do fillojn cdo gje qe ka lidhjme me login 

//1 ketu kapim te gjith user admin
app.get('/users',(req, res)=> {
  let sql='SELECT *FROM adm'
  db.query(sql,(err,result)=>{
      if(err)throw err
      else{
          res.status(200).json(result)
      }
  })
 });

 //ketu do jete sing up/register
 app.post('/register', (req, res, next)=> {
  let tedhena=req.body
  if(!tedhena){
    res.status(400).send({
        error:true,
        message:"te dhenat nuk jane te sakta"
        
    })
}


else{
    let isExist;

    let sql2='SELECT username FROM adm'
    db.query(sql2,(err,rows)=>{
        if(err)throw err
        else{
            rows.forEach(row=>{
                if(row.username===req.body.username){
                    isExist=true;
                    return
                }
                else{
                    isExist=false;
                }
            })
            if(isExist){
                res.status(401).json({message:'useri ekz ju lutem zgjidhni nje tj'})
            }
            else{
                
        db.query('INSERT INTO adm(username,password) VALUES("'+req.body.username+'","'+req.body.password+'")',
          (err,result)=>{
        if(err)throw err
        else{
            res.status(200).json({message:'te dhenat u derguan',
                 data:result})
        }
    })
            }
        }
    })
    
}

});

app.post('/login', (req, res)=> {
  let userexist=req.body.username

  let password=req.body.password
  if(!userexist&&password){
      res.status(400).json({message:'provoni pereseri'})
  }
  else{
      let sql='SELECT *FROM adm'
    
  db.query(sql,(err,rows)=>{

      if(err)throw err
      else{
          let c=0;
          rows.forEach( row=> {
            console.log(row)
            console.log(userexist,row.username)
            console.log(userexist==row.username)
              if(userexist==row.username){
              
                  if(password==row.password){
                    console.log(password,row.password)
                      c++
                      // from now on we'll identify the user by the id and the id is the 
         // only personalized value that goes into our token
         
         let payload = { id: row.id };
         let token = jwt.sign(payload, jwtOptions.secretOrKey);
    
              res.json({ msg: 'ok', token: token });

                 }
                 else{
                  res.status(401).json({message:"pw nuk eshte i sakte"})
              }
              }
             
              
          });
          if(c!=1){
            res.status(401).json({message:'keq puna'})
        }
         
      }
  })
  }
  
  
     
      
})
app.get('/user/me', passport.authenticate('jwt', { session: false }), (req, res) =>{
  res.send(req.user)
  
})

app.delete('/delete/post/:id', passport.authenticate('jwt', { session: false }),(req,res)=>{ 

  console.log(req.user)
  let idi=req.params.id
 
  
  //fshijeme nga folderi fotot
  let sql='SELECT img_path FROM image WHERE post_id='+idi
  db.query(sql,(err,rows)=>{
    if(err)throw err
    else{
      let pathi;
     console.log('ketu1')
      rows.forEach(row=>{

         pathi=row.img_path
         pathi = pathi.substring(1, pathi.length-1);

        console.log(pathi)

        
        fs.unlink(pathi, (err) => {
          if (err) throw err
          return
            
            
          
        })
      })
    }
   
  })
 let sql2='DELETE FROM image WHERE post_id='+idi
 db.query(sql2,(err,result)=>{
   if(err)throw err
   
  else{
    console.log('ketu12')
    let sql3='DELETE FROM post WHERE id='+idi
    db.query(sql3,(err,result)=>{
      if(err)throw err
      else{
        console.log('ketu13')
        res.status(200).json({msg:'fshierja u krye'})
      }
    })
  }
 })





})


app.listen(5000,()=>{
    console.log('porta eshte e hapur')
})
