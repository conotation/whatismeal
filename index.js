'use strict'

const express = require('express');
const app = express();
const bp = require('body-parser');
const calcium = require('calcium');

const scode = 'B100000658';
const port = 8001

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

/*
 * status code
 *
 * 201 : index
 * 400 : params error
 * 401 : list null
 * 402 : date null
 *
 */

app.get('/', (req, res) => { res.status(200).json({ code: 201 }); });

app.get('/:year/:month', (req, res) => {
   const year = parseInt(req.params.year, 10);
   const month = parseInt(req.params.month, 10);

   if(!year || !month) return res.status(400).json({ code: 400});

   calcium.get(scode, year, month, (e, d) => {
      res.status(200).json(d);
   });
});

app.get('/:year/:month/:day', (req, res) => {
   const year = parseInt(req.params.year, 10);
   const month = parseInt(req.params.month, 10);
   const day = parseInt(req.params.day, 10);

   if(!year || !month || !day) return res.status(400).json({ code: 400 });

   calcium.get(scode, year, month, (e, d) => {
     const m = d;
     if(!m) return res.status(401).json({ code: 401 });
   
     var resp = "";
     if(d[day] != null) resp = d[day]
     else return res.status(402).json({ code: 402 });

     return res.status(200).json(resp);
   });
});

app.listen(port, () => { console.log("Run Server"); });
