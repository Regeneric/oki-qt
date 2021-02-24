/*--INFO--*/
// Author: Hubert Batkiewicz (hbatkiewicz898@gmail.com)
// Contributors: -
// Date: 31/10/2020
// File: ./middlewares/readFiles.mid.js
/*-!INFO!-*/

const fs = require("fs");
const path = require("path");

function promiseAllP(items, block) {
    const promises = [];
    items.forEach(function(item, index) {
        promises.push( function(item, i) {
            return new Promise(function(resolve, reject) {
                return block.apply(this, [item, index, resolve, reject]);
            });
        }(item, index))
    }); return Promise.all(promises);
}


module.exports = {
    readFiles: function(dirname) {
        return new Promise((resolve, reject) => {
            fs.readdir(dirname, function(err, filenames) {
                if(err) return reject(err);
                promiseAllP(filenames,
                (filename, index, resolve, reject) =>  {
                    fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
                        if(err) return reject(err);
                        return resolve({name: filename, data: content});
                    });
                })
                .then(results => resolve(results))
                .catch(error => reject(error));
            });
        });
    }
};