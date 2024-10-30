const express = require('express');
// const newsApi = require('./news-api')
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Blog = require('../model/blog');
const con = require('../db/db_connection');
let route = express.Router();

route.get('/', (req,res) => {
    res.redirect('/home')
});
route.get('/home', async(req,res) => {
    try {
        let url = 'https://newsapi.org/v2/top-headlines?language=en&apiKey=2602fcf2eab74d3d9a64ef51153a0526';
        let newsGet = await axios.get(url);
        res.render('index', {articles:newsGet.data.articles,title:'Home'});
    } catch (error) {
        if (error.response){
            console.error(error)
        }
    }
});
route.get('/technology', async(req,res) => {
    try {
        let url = 'https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey=2602fcf2eab74d3d9a64ef51153a0526';
        let newsGet = await axios.get(url);
        res.render('technology', {articles:newsGet.data.articles,title:'Technology'});
    } catch (error) {
        if (error.response){
            console.error(error)
        }
    }
});
route.get('/business', async(req,res) => {
    try {
        let url = 'https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=2602fcf2eab74d3d9a64ef51153a0526';
        let newsGet = await axios.get(url);
        res.render('business', {articles:newsGet.data.articles,title:'Business'});
    } catch (error) {
        if (error.response){
            console.error(error)
        }
    }
});
route.get('/health', async(req,res) => {
    try {
        let url = 'https://newsapi.org/v2/top-headlines?category=health&language=en&apiKey=2602fcf2eab74d3d9a64ef51153a0526';
        let newsGet = await axios.get(url);
        res.render('health', {articles:newsGet.data.articles,title:'Health'});
    } catch (error) {
        if (error.response){
            console.error(error)
        }
    }
});
route.get('/politics', async(req,res) => {
    try {
        let url = 'https://newsapi.org/v2/top-headlines?category=politics&language=en&apiKey=2602fcf2eab74d3d9a64ef51153a0526';
        let newsGet = await axios.get(url);
        res.render('politics', {articles:newsGet.data.articles,title:'Politics'});
    } catch (error) {
        if (error.response){
            console.error(error)
        }
    }
});
route.get('/posts', (req, res) => {
    Blog.find().sort({createdAt: -1})
        .then((result) => {
            res.render('posts', {title: 'Our posts', blogs: result});
            // res.send('home page')
        })
        .catch((err) => {
            console.log(err)
        })
        // console.log(__dirname)

});
// route.post('/posts', (req, res, next) => {
//     const blog = new Blog(req.body);

//     blog.save()
//         .then((result) => {
//             res.redirect('/posts');
//         })
//         .catch((err) => {
//             console.log(err)
//         })
//     // res.send(req.body)
// });
route.get('/posts/:id', (req,res) =>{
    const id = req.params.id;
    Blog.findById(id)
        .then((result) => {
            res.render('details', {blog:result, title:'Blog Details'})
            // console.log(result)
        })
        .catch((err) => {
            console.log(err)
        })
        // console.log(__dirname)
});
route.get('/dashboard', (req,res) => {
    if(req.session.loggedin === true){
        res.render('dashboard', {
            title:'Dashboard',
            profile_name:req.session.username,
            // profile_email:req.session.email
        })
    }else{
        res.redirect('/login')
    }
    // res.render('dashboard', {title:'Dashboard'})
});
route.post("/dashboard", (req, res) => {
    const aBlog = new Blog(req.body);
  
    aBlog
      .save()
      .then((result) => {
        res.redirect("/posts");
      })
      .catch((err) => {
        console.log(err);
      });
  });
// route.post('/register', (req, res) => {
//     let firstname = req.body.firstname;
//     let lastname = req.body.lastname;
//     let username = req.body.username;
//     let email = req.body.email;
//     let password = req.body.password;
//     let cpassword = req.body.cpassword;
//     // let body = req.body;
  
//     let sql_stm = 'INSERT INTO users(firstname, lastname, username, email, password) VALUES (?,?,?,?,?)';
//     // const insert_stm = con.format(sql_stm, [])
//     // let sql_stm = 'INSERT INTO `users`(`firstname`, `lastname`, `username`, `email`, `password`) VALUES (?,?,?,?,?)'
//     if(password === cpassword && password <= 50){
//       const encrypt = async() => {
//         const hashpassword = await bcrypt.hash(password, 8);
//         const insert_stm = con.format(sql_stm, [firstname, lastname, username, email, hashpassword])
//         // res.send('Passwords match');
//           con.query(insert_stm, (err, data) => {
//             if(err){
//               res.render("register", { title: "Register",error:'Username already exists'})
//             }else{
//               res.redirect("/home")
//             }
//           })
//         // })
  
//       }
//     //   encrypt();
//     }else if(password > 50){
//         res.render("register", { title: "Register",error:'Password too long' }) 
//     }
//     else{
//       res.render("register", { title: "Register",error:'Password Mismatch' })
//     }
//     encrypt();
// });
route.get('/login', (req, res) => {
    res.render('login', {title: 'Login as admin',error:''})
});
route.post('/login', (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    let sql = 'SELECT * FROM users WHERE username = ?';
    con.query(sql, [username], async(error,result) => {
        if(error){
            console.log(error)
        }
        console.log(result[0])
        if(result.length > 0){
            bcrypt.compare(password, result[0].password, (err, response) => {
                // console.log(typeof(result[0].password))
                // console.log(typeof(password))
                console.log(response)
                if(err){
                    console.log(err)
                } else if (response == true){
                    req.session.loggedin = true;
                    req.session.username = result[0].username;
                    res.redirect('/dashboard')
                    // console.log(response)
                } else if (response == false){
                    res.render('login', {title: 'Login as admin',error:'Password does not match'})
                }
            })
        } //else{
        //     res.render('login', {title: 'Login as admin',error:'Password does not match'})
        // }
        // console.log(result.length)
        // console.log(result)
        // console.log(username)
    })
    // let user = 'SELECT * FROM users WHERE username = ? AND password = ?', [username, password]
});
route.get('/user-info', (req, res) => {
    res.render('user-info', { title: 'User-info', error:''})
});
route.post('/user-info', (req,res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let occupation = req.body.occupation;
    let experience = req.body.experience;

    con.query('SELECT email FROM prospects WHERE email = ?', [email], (error, result) => {
        if(error){
            console.log(error)
        }

        if(result.length > 0 ){
            res.render("user-info", { title: "user-info",error:'Email already exists'})
        }
    })

    let sql_stm = 'INSERT INTO prospects(firstname, lastname, email, occupation, experience) VALUES (?,?,?,?,?)';
    const insert_stm = con.format(sql_stm, [firstname, lastname, email,occupation, experience])
          con.query(insert_stm, (err, data) => {
            if(err){
              res.render("user-info", { title: "user-info",error:err})
            }else{
                res.render("user-info", { title: "user-info",error:'Credentials submitted'})
            }
          })
});

route.get('/register', (req, res) => {
    res.render('register', { title: 'Register As Admin', error:'', message:''})
});
route.post('/register', (req,res) => { 
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;


    con.query('SELECT username FROM users WHERE username = ?', [username], async (error, result) => {
        if(error){
            console.log(error)
        }

        if(result.length > 0 ){
            return res.render("register", { title: "Register As Admin",error:'Username already exists'})
        } else if(password !== confirmPassword){
            return res.render("register", { title: "Register As Admin",error:'Passwords do not match'})
        }
        let hashPassword = await bcrypt.hash(password, 8)
        console.log(hashPassword)

        con.query('INSERT INTO users SET ?',{firstname: firstname, lastname: lastname, username: username, email:email, password: hashPassword}, (err, data) => {
            if(err){
                res.render("register", { title: "Register As Admin",error:'Database server error'})
                console.log(err)
            }else{
                return res.render("register", { title: "Register As Admin",error:'User registered'})
            }
        })
    })
});
route.use((req, res) => {
    res.status(404).render("404", { title: "Page not found" });
  });


module.exports = route; 