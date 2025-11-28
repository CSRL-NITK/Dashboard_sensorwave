const developmentLogger = require("./developmentLogger");
let logger = null;

if(process.env.NODE_ENV !== "production"){
    logger = developmentLogger();
}

module.exports = logger;