const {spawn} = require("child_process")
const program = require("commander")
const nunjucks = require("nunjucks")
const fs = require("fs")
const web3 = require("web3")

const roles = require("./roles")
const initHolders = require("./init-holders")

program.option("-c, --chainid <chainid>", "chain id", "188")


require("./generate-validatorset");

const {toJSON} = require("lodash/seq");

program.version("0.0.1")
program.option(
    "-o, --output <output-file>",
    "Genesis json file",
    "./genesis.json"
)
program.option(
    "-t, --template <template>",
    "Genesis template json",
    "./genesis-template.json"
)


program.option("--docker <docker>",
    "if use docker solc",
    true);

program.parse(process.argv)

// compile contract
function compileContract(key, contractFile, contractName) {
    return new Promise((resolve, reject) => {
        let ls;
        if (program.docker) {
            ls = spawn("docker", [
                "run",
                "--rm",
                "-v",
                process.cwd() + ":/contract",
                "ethereum/solc:0.6.4",
                "--bin-runtime",
                "/=/",
                "--optimize",
                "--optimize-runs",
                "200",
                "/contract/" + contractFile
            ])
        } else {
            ls = spawn("solc", [
                "--bin-runtime",
                "/=/",
                "--optimize",
                "--optimize-runs",
                "200",
                contractFile
            ])
        }
        const result = []
        ls.stdout.on("data", data => {
            console.error(`data===: ${data}`)
            result.push(data.toString())
        })
        ls.stderr.on("data", data => {
            console.error(`stderr: ${data}`)
        })
        ls.on("message", data => {
            console.error(`msg====: ${data}`)
        })
        ls.on("close", code => {
            console.log(`child process exited with code ${code}`)
            console.log("res====" + result)
            resolve(result.join(""))
        })
    }).then(compiledData => {
        compiledData = compiledData.replace(
            `======= ${program.docker ? "/contract/" : ''}${contractFile}:${contractName} =======\nBinary of the runtime part:`,
            "@@@@"
        )
        const matched = compiledData.match(/@@@@\n([a-f0-9]+)/)
        return {key, compiledData: matched[1], contractName, contractFile}
    })
}

// compile files
Promise.all([
    compileContract(
        "validatorContract",
        "contracts/BMCValidatorSet.sol",
        "BMCValidatorSet"
    )
]).then(result => {

    const data = {
        chainId: program.chainid,
        initHolders: initHolders,
        extraData: web3.utils.bytesToHex(roles.extraValidatorBytes)
    }
    result.forEach(r => {
        data[r.key] = r.compiledData
    })
    const templateString = fs.readFileSync(program.template).toString()
    const resultString = nunjucks.renderString(templateString, data)
    fs.writeFileSync(program.output, resultString)

})
