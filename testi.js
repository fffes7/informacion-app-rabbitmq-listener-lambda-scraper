/**
 * Created by xadrian on 21/12/17.
 */
require('dotenv').config();
var main = require('./index');
main.produce((data)=> {
    console.log(data);
})