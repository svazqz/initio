import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const protoDirectoryPath = path.join(__dirname, '../../../../apps');

const protoDefinitionsFile = path.join(
  protoDirectoryPath,
  '/proto/schemas.txt',
);

const bundleOut =
  process.env.NODE_ENV === 'production'
    ? './'
    : path.join(__dirname, '../../../../dist/apps/proto');

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
