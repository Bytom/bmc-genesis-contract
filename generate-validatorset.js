const program = require("commander");
const fs = require("fs");
const nunjucks = require("nunjucks");


program.version("0.0.1");
program.option(
    "-t, --template <template>",
    "validatorSet template file",
    "./contracts/BMCValidatorSet.template"
);

program.option(
    "-o, --output <output-file>",
    "BMCValidatorSet.sol",
    "./contracts/BMCValidatorSet.sol"
)

program.option(
    "--initValidatorSetBytes <initValidatorSetBytes>",
    "initValidatorSetBytes",
    ""
)
program.option(
    "--initOwnerBytes <initOwnerBytes>",
    "initOwnerBytes",
    ""
)


program.option("--mock <mock>",
    "if use mock",
    false);

program.parse(process.argv);

const roles = require("./roles")
let initValidatorSetBytes = program.initValidatorSetBytes;
if (initValidatorSetBytes == "") {
    initValidatorSetBytes = roles.validatorSetBytes.slice(2);
}
let initOwnerBytes = program.initOwnerBytes;

if (initOwnerBytes == "") {
    initOwnerBytes = roles.ownerBytes.slice(2);
}
const data = {
    initValidatorSetBytes: initValidatorSetBytes,
    initOwnerBytes: initOwnerBytes,
    mock: program.mock,
};

const templateString = fs.readFileSync(program.template).toString();
const resultString = nunjucks.renderString(templateString, data);
fs.writeFileSync(program.output, resultString);
console.log("BMCValidatorSet file updated.");
