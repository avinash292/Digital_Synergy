const cors = require('cors');

const corsEnable = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Content-Range, Accept, Content-Disposition, Content-Description, Authorization, multipart/form-data");
	res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Content-Range, Content-Disposition, Content-Description,  Access-Control-Request-Method, Access-Control-Request-Headers, Authorization");

    cors({
        exposedHeaders: ['X-Sub-Domain']
    })
    next();
};

module.exports = {
    corsEnable: corsEnable,
};
