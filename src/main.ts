
import { Create } from 'src/command/create';
import { Converter } from 'src/command/converter';
import { Init, configFile, Config } from 'src/command/init';
import { Command } from 'commander';
import _ from 'lodash';
import { Convert } from 'src/command/convert';
import { walk } from 'src/walk';
const program = new Command();


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
