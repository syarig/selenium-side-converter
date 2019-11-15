
import { Create } from 'src/command/create';
import { Converter } from 'src/command/converter';
import { Walker } from 'src/command/walker';
import { Init, configFile, Config } from 'src/command/init';
import fs from 'fs';
import { promises } from 'fs';
import path from 'path';
import { Command } from 'commander';
import _ from 'lodash';
import { Convert } from 'src/command/convert';
const program = new Command();


async function walk(dirpath: string, walker: Walker) {
    let dirents: Array<fs.Dirent> = [];
    try {
        dirents = await promises.readdir(dirpath, { withFileTypes: true })

    } catch (e) {
        walker.catch(e)
        return;
    }

    dirents.forEach((dirent: fs.Dirent) => {
        const nextDirpath = path.join(dirpath, dirent.name);
        if (dirent.isDirectory()) {
            walk(nextDirpath, walker);

        } else {
            walker.default(nextDirpath);
        }
    });
}

async function exec(args: object = {}) {
    const converter = new Converter();
    await converter.init(program.input, await getConfig(args))
    converter.exec()
    converter.save(program.output);
}

async function getConfig(args: object = {}) {
    const config = new Config();
    await config.init(args);
    return config;
}

let isCommand = false;

program.version('0.0.1', '-v, --version')
    .description('Convert selenium side file. Please enter side file.')
    .option('-i, --input <file>', 'Input file converted and merged input side file.')
    .option('-o, --output <file>', 'Output file converted and merged input side file.', './output.side');

program.command('convert')
    .alias('c')
    .action(() => {
        getConfig().then((config) => {
            const convert = new Convert(config);
            walk(config.get('inputsDir'), convert);
        });
        
        isCommand = true;
    });

program.command('create <appPath>')
    .description('Create app template. Please enter app path')
    .action((appPath: any) => {
        const create = new Create(appPath);
        create.exec();
        isCommand = true;
    });

program.command('init')
    .description(`Generate ${configFile} config file for converting side`)
    .action(() => {
        const init = new Init();
        init.exec();
        isCommand = true;
    });

program.parse(process.argv);

if (!isCommand && program.input !== undefined) {
    exec({ inputsDir: '.' });
}
