/*
    ########## Your setup goes here ##########
    
    These functions and scripts will be loaded site-wide on all pages

*/
waitless.scripts.push({
    src: "https://qjr4nd.csb.app/generalNav.js",
    location: "body",
    callback: generalNavLoaded,
  });
  function generalNavLoaded() {
    console.log("generalNav is done loading");
  }
  
  console.log("global.js");
  