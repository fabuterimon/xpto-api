"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = (req, resp, err, done) => {
    console.log(err);
    err.toJSON = () => {
        return {
            message: err.message
        };
    };
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                err.statuscode = 400;
            }
            break;
        case 'ValidatorError':
            err.statuscode = 400;
            break;
    }
    done();
};
