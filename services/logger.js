const fs = require('fs');
const path = require('path');

const logWrite = async (msg, name = 'log') => {
    const file = `./log/${name}.log`;
    await fs.promises.mkdir(path.dirname(file), {recursive: true});
    await fs.appendFile(file, `${new Date().toLocaleString('en-GB')}: ${msg} \r\n`, ()=>{});
};

module.exports = logWrite;