var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM members ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('members',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('members',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('members/add', {
        name: '',
        field: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let name = req.body.name;
    let field = req.body.field;
    let errors = false;

    if(name.length === 0 || field.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and interested field");
        // render to add.ejs with flash message
        res.render('members/add', {
            name: name,
            field: field
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            name: name,
            field: field
        }
        
        // insert query
        dbConn.query('INSERT INTO members SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('members/add', {
                    name: form_data.name,
                    field: form_data.field                    
                })
            } else {                
                req.flash('success', ' Added successfully');
                res.redirect('/members');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM members WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Member not found with id = ' + id)
            res.redirect('/members')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('members/edit', {
                title: 'Edit', 
                id: rows[0].id,
                name: rows[0].name,
                field: rows[0].field
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let name = req.body.name;
    let field = req.body.field;
    let errors = false;

    if(name.length === 0 || field.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter name and interested field");
        // render to add.ejs with flash message
        res.render('members/edit', {
            id: req.params.id,
            name: name,
            field: field
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            name: name,
            field: field
        }
        // update query
        dbConn.query('UPDATE members SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('members/edit', {
                    id: req.params.id,
                    name: form_data.name,
                    field: form_data.field
                })
            } else {
                req.flash('success', 'Updated successfully !');
                res.redirect('/members');
            }
        })
    }
})
   
// delete member
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM members WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to members page
            res.redirect('/members')
        } else {
            // set flash message
            req.flash('success', 'Deleted successfully!!')
            // redirect to members page
            res.redirect('/members')
        }
    })
})

module.exports = router;