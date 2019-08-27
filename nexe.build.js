const { compile } = require("nexe");

compile({
  input: "./dist/app.js",
  output: "./bin/app"
  // geckodriver は同梱不可
  // resources: ["./geckodriver.exe"]
})
  .then(() => {
    console.log("success");
  })
  .catch(e => {
    console.log(e);
  });
