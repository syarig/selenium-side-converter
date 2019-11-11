
import { Create } from 'src/command/create';
import { Converter } from 'src/command/converter';
import { Init, configFile, Config } from 'src/command/init';
import * as util from 'src/util';
import { Command } from 'commander';
import _ from 'lodash';
const program = new Command();

let isCompleted = false;

program.command('convert <input>')
    .alias('c')
    .action(() => {
        const config = util.readJson(configFile);
        isCompleted = true;
    });

program.command('create <appPath>')
    .description('Create app template. Please enter app path')
    .action((appPath: any) => {
        const create = new Create(appPath);
        create.exec();
        isCompleted = true;
    });

program.command('init')
    .description(`Generate ${configFile} config file for converting side`)
    .action(() => {
        const init = new Init();
        init.exec();
        isCompleted = true;
    });

async function exec(args: object = {}) {
    const converter = new Converter();
    const config = new Config();
    await config.init(args);
    await converter.init(program.input, config)
    converter.exec()
    converter.save(program.input);
}

if (!isCompleted) {
    program.version('0.0.1', '-v, --version')
        .description('Convert selenium side file. Please enter side file.')
        .requiredOption('-i, --input <file>', 'Input file converted and merged input side file.')
        .option('-o, --output <file>', 'Output file converted and merged input side file.', './output.side')
        .parse(process.argv);
    exec();
}
