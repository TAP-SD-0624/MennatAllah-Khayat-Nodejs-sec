import {errorHandler} from './middleware/errorHandler.js';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

// const express = require('express');
// const bodyParser = require('body-parser');
// const fs = require('fs');
// const path = require('path');

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

//Home route - list all files
// app.get('/', (req, res) => {
//     fs.readdir(DATA_DIR, (err, files) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Unable to list files');
//         } else {
//             res.render('index', { files });
//         }
//     });
// });

app.get('/', (req, res,next) => {
    try{
        fs.readdir(DATA_DIR, (err, files) => {
            if (err) {
                throw new Error('Unable to list files');

            } else {
                res.render('index', { files });
            }
        });
    }
   catch(error){
    return next(error);
   }
});


// Create file form
app.get('/create', (req, res) => {
    res.render('create');
});

// Handle file creation
app.post('/create', (req, res ,next) => {
    try {
        const { filename, content } = req.body;
    const filepath = path.join(DATA_DIR, filename);

    fs.writeFile(filepath, content, err => {
        if (err) {
            throw new Error('Unable to create file');
        } else {
            res.redirect('/');
        }
    });
    } catch (error) {
        return next(error);
    }
    
});

// View file content
app.get('/files/:filename', (req, res,next) => {
    try {
        const filepath = path.join(DATA_DIR, req.params.filename);

        fs.readFile(filepath, 'utf8', (err, content) => {
            if (err) {
                throw new Error('Unable to read file');
              
            } else {
                res.render('detail', { filename: req.params.filename, content });
            }
        });
    } catch (error) {
        return next(error);
    }
   
});

// Handle file deletion
app.post('/files/delete/:filename', (req, res, next) => {
    try {
        const filepath = path.join(DATA_DIR, req.params.filename);

        fs.unlink(filepath, err => {
            if (err) {
                throw new Error('Unable to delete file');
               
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        return next(error);
    }
   
});

// Handle file renaming
app.post('/files/rename/:filename', (req, res ,next) => {
    try {
        const oldPath = path.join(DATA_DIR, req.params.filename);
        const newPath = path.join(DATA_DIR, req.body.newFilename);
    
        fs.rename(oldPath, newPath, err => {
            if (err) {
                throw new Error('Unable to rename file');
            } else {
                res.redirect('/');
            }
        });
    } catch (error) {
        return next(error);
    }
  
});
 app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
