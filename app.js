const http = require("http")

const chalk = require("chalk")
const cof = require("./defaultcof")
const path=require("path")
const  route=require("./helper/route")
class Server{
    constructor(config)
    {
        this.cof=Object.assign({},cof,config)
    }
    start()
    {
        //test mdfff
        const server = http.createServer((req, res) => {
            const url = req.url;
            const filepath = path.join(this.cof.root, url);
            console.log(filepath)
            route(req,res,filepath,this.cof)

        })

        server.listen(this.cof.port, this.cof.httphost, () => {
            const addr = `http://${this.cof.httphost}:${this.cof.port}`
            console.info(`Server started at ${chalk.green(addr)}`)
        })
    }
}

module.exports=Server;
