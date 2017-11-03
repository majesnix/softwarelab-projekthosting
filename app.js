const express = require('express');
const path = require('path');

const lg = require('./db.js');
const usr = require('./user.js');

////////////////////TEMPORARY///////////////////

let u = usr("123");
u.name = 'user1';
u.projects = ['p1', 'p2'];

/////////////////////////////////////////////////

const app = express();

const pages = [
    "dashboard",
    "project",
    "gitlab", 
    "databases", 
    "node"];
const pages_without_sidebar = [
    "settings", 
    "testtest"];

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static(path.join(__dirname, 'public'),{extensions: ['css', 'js', 'otf']}));

app.get('*', function(req, res){
    console.log(req.path);
    
    //gets the last part of the path after the last/
    let page = req.path.split("/").pop();
    page = page.split('.')[0];
    
    let sidebar = true;
    // if index of _title is more than -1 it is in the array.
    if((pages_without_sidebar.indexOf(page)+1)){
        sidebar = false;
    } 
    /*
    else if (!((pages.indexOf(page)+1))){
        if(page === '')
    }
    */
    
    //----------------------------------------
    //TODO: AUTH!!
    let authorized = true;
    //----------------------------------------

    //render has to get following variables:
    // -title  (page title)
    // -page   (what content should be displayed)
    // -sidebar (true if should be rendered, false if not)
    if(authorized){

        // write userdata in cookie

        console.log(page, sidebar);
        res.locals.user = u;
        res.render('main.pug', {
            page: page,
            sidebar: sidebar
        });
    }else{
        res.render('login.pug');
    }
});
app.listen(3000);