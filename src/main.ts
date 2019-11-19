
import { Create } from '@/command/create';
import { Converter } from '@/command/converter';
import { Init, configFile, Config } from '@/command/init';
import { Command } from 'commander';
import _ from 'lodash';
import { Convert } from '@/command/convert';
import { walk } from '@/walk';

const program = new Command();

async function exec(args: object = {}) {
}

async function getConfig(args: object = {}) {
    const config = new Config();
    await config.init(args);
    return config;
}

function convertAll() {
    getConfig().then((config) => {
        const convert = new Convert(config);
        walk(config.get('inputsDir'), convert);
    });
}

function convert(input: string, output: string) {
    getConfig({ inputsDir: '.' }).then((config) => {
        const converter = new Converter();
        converter.init(input, config)
        return converter

    }).then((converter) => {
        converter.exec()
        converter.save(output);
    });
}

program.version('0.0.1', '-v, --version')
    .description('Convert selenium side file. Please enter side file.')

program.command('convert').alias('c')
    .option('--all', 'convert all side files')
    .option('-i, --input <file>', 'Input file converted and merged input side file.')
    .option('-o, --output <file>', 'Output file converted and merged input side file.', './output.side')
    .action((opts) => {
        if (opts.all) {
            convertAll();
            return;
        }

        if (opts.input !== undefined) {
            convert(opts.input, opts.output);
            return;
        }
    });

program.command('create [appPath]')
    .description('Create app template. Please enter app path')
    .action((appPath: string = './') => {
        const create = new Create(appPath);
        create.exec();
    });

program.command('init [appPath]')
    .description(`Generate ${configFile} config file for converting side`)
    .action((appPath: string = './') => {
        const init = new Init(appPath);
        init.exec();
    });

program.parse(process.argv);
