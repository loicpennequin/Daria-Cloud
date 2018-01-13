const express = require('express'),
      app = express();

 app.use(express.static('dist'));

app.listen(8000, ()=>{
    console.log('server started');
})
