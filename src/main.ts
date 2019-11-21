
import { SystemLogger } from 'src/logger/system_logger';
import { Create } from 'src/command/create';
import { Converter } from 'src/command/converter';
import { Init, configFile, Config, Setting } from 'src/command/init';
import { Command } from 'commander';
import _ from 'lodash';
import { Convert } from 'src/command/convert';
import { walk } from 'src/walk';

const program = new Command();

async function getConfig(args: object = {}) {
    const config = new Config();
    await config.init(args);
    return config;
}

async function getSetting(config: Config) {
    const setting = new Setting();
    setting.init(config);
    return setting;
}

function convertAll(config: Config) {
    getSetting(config).then((setting) => {
        SystemLogger.instance.info('Ready for conversion.');
        const convert = new Convert(config, setting);
        walk(config.get('inputsDir'), convert);
        SystemLogger.instance.info('Finish converting all.');
    });
}

function convert(config: Config, input: string, output: string) {
    getSetting(config).then((setting) => {
        const converter = new Converter();
        converter.init(input, setting).then(() => {
            SystemLogger.instance.info(`Ready for ${input} conversion.`);
            converter.exec()
            converter.save(output);
            SystemLogger.instance.info(`${input} converting finish.`);
        });
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
            getConfig().then((config) => {
                convertAll(config);
            });
            return;
        }

        if (opts.input !== undefined) {
            getConfig({ inputsDir: '.' }).then((config) => {
                convert(config, opts.input, opts.output);
            });
            return;
        }

        console.error('Wrong usage. Require option of -i or --all');
        process.exit(1);
    });

program.command('create [appPath]')
    .description('Create app template. Please enter app path')
    .action((appPath: string = './') => {
        const create = new Create(appPath);
        create.exec();
        SystemLogger.instance.info(`Created ${appPath} project.`);
    });

program.command('init [appPath]')
    .description(`Generate ${configFile} config file for converting side`)
    .action((appPath: string = './') => {
        const init = new Init(appPath);
        init.exec();
    });

program.command('*')
    .action(() => {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
        process.exit(1);
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.help((str: string): string => {
        return str.replace('*\n', '');
    });
}