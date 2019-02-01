const fs = require("fs")
const path = require("path")
const promisify = require('util').promisify;
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const Handlebars = require("handlebars")
const telPath = path.join(__dirname, '../template/dir.tpl')
const source = fs.readFileSync(telPath)
// console.log(source.toString())
const template = Handlebars.compile(source.toString());
// const cof = require("../defaultcof");
const memitype = require("./mime");
const compress = require("./compress");
const range = require("./range");
const isFresh = require("./cache");
module.exports = async function (req, res, filepath,cof) {
    try {
        const stats = await stat(filepath);
        if (stats.isFile()) {
            const mime = memitype(filepath);
            console.log(mime);
            res.setHeader("Content-Type", mime);

            if (isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            res.statusCode = 200;

            const {code, start, end} = range(stats.size, req, res)
            let rs
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filepath)
            } else {
                res.statusCode = code;
                rs = fs.createReadStream(filepath, {start, end})
            }


            let ext = path.extname(filepath)

            if (ext.match(cof.compress)) {
                rs = compress(rs, req, res)
            }
            rs.pipe(res)
            // res.end()
        } else if (stats.isDirectory()) {
            const files = await readdir(filepath);
            res.statusCode = 200;
            res.setHeader("Content-Type", "text/html");
            const dir = path.relative(cof.root, filepath)
            const data = {
                title: path.basename(filepath),
                path_a: dir ? `/${dir}` : "",
                files: files.map((file) => {
                    return {
                        file,
                        icon: memitype(file)
                    }
                })
            }

            res.end(template(data))

        }
    } catch (e) {
        res.end(`${filepath} is not dir or file ${e}`)
    }

}
