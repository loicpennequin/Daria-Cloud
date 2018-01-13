const express = require('express'),
      app = express();

 app.use(express.static('dist'));

app.listen(process.env.PORT || 8000, ()=>{
    console.log('server started');
})
