var express = require("express");
var app = express();
app.use("/", express.static(`${process.env.APP_PATH}/dist`));

app.listen(process.env.PORT, function() {
   console.log(
      `${new Date().toString()} | App listening on : ${process.env.PORT}`
   );
});
