
import { SystemLogger } from 'src/logger/system_logger';
import { Create } from 'src/command/create';
import { Merge } from 'src/command/merge';
import { Converter } from 'src/command/converter';
import { Init, configFile, Config, Setting } from 'src/command/init';
import { Command } from 'commander';
import { Convert } from 'src/command/convert';
import { walk } from 'src/walk';

const program = new Command();

async function getConfig(args: object = {}): Promise<Config> {
    const config = new Config();
    await config.init(args);
    return config;
}

async function getSetting(config: Config): Promise<Setting> {
    const setting = new Setting();
    await setting.init(config);
    return setting;
}

async function convertAll(config: Config): Promise<void> {
    const setting = await getSetting(config);
    SystemLogger.instance.log('Ready for conversion.');
    const convert = new Convert(config, setting);
    await walk(config.get('inputsDir'), convert);
    SystemLogger.instance.log('Finish converting all.');
}

async function convert(config: Config, input: string, output: string): Promise<void> {
    const setting = await getSetting(config);
    const converter = new Converter();
    await converter.init(input, config.get('filesDir'), setting);
    SystemLogger.instance.log(`Ready for ${input} conversion.`);
    converter.exec();
    await converter.save(output);
    SystemLogger.instance.log(`${input} converting finish.`);
}

function showHelp(): void {
    program.help((str: string): string => {
        return str.replace('*\n', '');
    });
}

program.version('0.0.1', '-v, --version')
    .description('Convert selenium side file. Please enter side file.');

program.command('convert').alias('c')
    .option('--all', 'convert all side files', false)
    .option('-i, --input <file>', 'Input file converted and merged input side file.')
    .option('-o, --output <file>', 'Output file converted input side file.', './output.side')
    .action(async (opts) => {
        const config = await getConfig();
        if (opts.all) {
            await convertAll(config);
            return;
        }

        if (opts.input !== undefined) {
            await convert(config, opts.input, opts.output);
            return;
        }

        console.error('Wrong usage. Require option of -i or --all');
    });

program.command('merge <files...>')
    .description('Merging each tests in side file so writing output.side by default.')
    .option('-p, --project <name>')
    .option('-o, --output <file>', 'Output file is merged file\'s name', './output.side')
    .option('--before-each <id>', 'Merge and Overwrite the test of the specified ID at the before each tests')
    .option('--after-each <id>', 'Merge and Overwrite the test of the specified ID at the after each tests')
    .action(async (files: Array<string>, opts) => {
        const config = await getConfig();
        const isValid = files.every((file: string) => {
            if (!config.isSideFileExtname(file)) {
                SystemLogger.instance.error(`Invalid extention file included that selected merge ${file}.`);
                return false;
            }
            return true;
        });
        if (!isValid) return;

        const isTask = (v: Promise<Array<void>> | undefined): boolean => v !== undefined;
        const merge = new Merge(opts.project);
        const tasks = [
            opts.beforeEach && merge.beforeEach(opts.beforeEach, files),
            opts.afterEach && merge.afterEach(opts.beforeEach, files)
        ].filter(isTask);

        if (tasks.length === 0) {
            await merge.exec(files, opts.output);
        }
        await Promise.all(tasks);
        SystemLogger.instance.log(`Merged side files ${files.join(',')}`);
    });

program.command('create <appPath>')
    .description('Create app template. Please enter app path')
    .action(async (appPath) => {
        const create = new Create(appPath);
        await create.exec();
        SystemLogger.instance.log(`Created ${appPath} project.`);
    });

program.command('init [appPath]')
    .description(`Generate ${configFile} config file for converting side`)
    .action(async (appPath = './') => {
        const init = new Init(appPath);
        await init.exec();
        SystemLogger.instance.log(`Created a ssconfig.json file.`);
    });

program.command('*')
    .description('Unexpected command')
    .action(() => {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    showHelp();
}