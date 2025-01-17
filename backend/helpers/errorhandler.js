'use strict';

const config = require('../config');

class ErrorHandler extends Error {

    constructor (statusCode, message, error) {
        super();
        // console.log(statusCode, message, error);
        this.statusCode = statusCode || 200;
        this.message = message || config.common_err_msg;
        this.error = error;
        this.error_message = (error && error.message) ? error.message : undefined;
    };   
}

const handleError = (err, res) => {
    let { statusCode, message, error, error_message } = err;
    console.log('---------------', err);
    // console.log(statusCode, message, error);
    statusCode = statusCode || 500;
    message = message || config.common_err_msg;
    error = error;
    error_message = (error && error.message) ? error.message : undefined;
    res.status(statusCode).json({
        success: false,
        message,
        error,
        error_message: error_message
    });
};

module.exports = {
    ErrorHandler,
    handleError
};