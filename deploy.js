const shell = require('shelljs');
const fs = require('fs')
let outputs = fs.readFileSync('./cdk/outputs.json', {encoding:'utf8', flag:'r'})
outputs = JSON.parse(outputs)
shell.exec('aws amplify create-backend-environment --app-id '+outputs.CdkStack.amplifyEnv+' --environment-name backend')
shell.exec('amplify pull --appId '+outputs.CdkStack.amplifyEnv+' --envName backend -y')