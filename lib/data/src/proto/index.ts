import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

if (process.argv.length < 3) {
  throw new Error('Target app was not defined.');
}

const root = process.argv[0].replace('/node_modules/ts-node/dist/bin.js', '');
const targetApp = process.argv[process.argv.length - 1];
const protoDefinitionsFile = path.join(root, `/apps/${targetApp}/proto.txt`);
const bundleOut = path.join(root, '/dist/apps/proto');

try {
  const data = fs.readFileSync(protoDefinitionsFile, 'utf8').split('\n');
  const protoFiles: string[] = [];
  data.forEach((namespace) => {
    const protoFile = path.join(
      root,
      'apps',
      targetApp,
      'data',
      namespace,
      'schemas.proto',
    );
    protoFiles.push(protoFile);
  });
  const command = `mkdir -p ${root}/dist/apps/proto && pbjs -t json ${protoFiles.join(
    ' ',
  )} > ${bundleOut}/bundle.json`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
  });

  console.log(command);
} catch (err) {
  console.error(err);
}

/*
try {
  const data = fs.readFileSync(protoDefinitionsFile, 'utf8').split('\n');
  const protoFiles: string[] = [];
  data.forEach((namespace) => {
    const [app, proto] = namespace.split('.');
    const protoFile = path.join(
      protoDirectoryPath,
      app,
      'data',
      proto,
      'schemas.proto',
    );
    protoFiles.push(protoFile);
  });
  console.log('Proto OUT =>>', bundleOut);
  const command = `pbjs -t json ${protoFiles.join(
    ' ',
  )} > ${bundleOut}/bundle.json`;
  exec(command, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }

    // the *entire* stdout and stderr (buffered)
    // console.log(`stdout: ${stdout}`);
    // console.log(`stderr: ${stderr}`);
  });

  console.log(command);
} catch (err) {
  console.error(err);
}
*/
