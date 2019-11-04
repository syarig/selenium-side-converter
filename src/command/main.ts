
import { Create } from 'src/command/create';
import { Convert } from 'src/command/convert';
import { Converter } from 'src/command/converter';
import { Init, configFile } from 'src/command/init';
import { Command } from 'commander';
const program = new Command();

program.version('0.0.1', '-v, --version')
    .option('-i, --inputs-dir [inputsDir]', 'Selenium side file', /.*.side$/i)
    .option('-o, --outputs-dir [outputsDir]', 'Converted side file')
    .option('-s, --settings-dir [settingsDir]', 'Converted side file')
    .option('-f, --files-dir [filesDir]', 'Converted side file');

program.command('convert <input>')
    .alias('c')
    .description('Convert selenium side file. Please enter side file.')
    .option('-o --output [output]', 'Output file converted and merged input side file.')
    .action((input, options) => {
        const converter = new Convert(input, options.output);
        converter.exec();
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

program.parse(process.argv);
