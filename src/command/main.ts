
import { Create } from 'src/command/create';
import { Converter } from 'src/command/converter';
import { Init, configFile, Config } from 'src/command/init';
import * as util from 'src/util';
import { Command } from 'commander';
import _ from 'lodash';
const program = new Command();

program.version('0.0.1', '-v, --version')
    .description('Convert selenium side file. Please enter side file.')
    .option('-i, --input <file>', 'Input file converted and merged input side file.')
    .option('-o, --output <file>', 'Output file converted and merged input side file.', './output.side')
    .parse(process.argv);

if (program.input) {
    console.log('  - peppers');
    exec();
}

async function exec() {
    const converter = new Converter();
    const config = await init();
    await converter.init(program.input, config.config)
    converter.exec()
    converter.save(program.output);
}

async function init() {
    const config = new Config();
    await config.init();
    return config;
}

program.command('convert <input>')
    .alias('c')
    .action(() => {
        const config = util.readJson(configFile);
    });

program.command('create <appPath>')
    .description('Create app template. Please enter app path')
    .action((appPath: any) => {
        const create = new Create(appPath);
        create.exec();
    });

program.command('init')
    .description(`Generate ${configFile} config file for converting side`)
    .action(() => {
        const init = new Init();
        init.exec();
    });

