require('dotenv/config');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

const argv = process.argv.slice(2);
const subcommand = argv[0];
const migrationName = argv[1];

if (subcommand !== 'migration:revert' && !migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const migrationsDir =
  'src/dal/migrations' || process.env.TYPEORM_MIGRATIONS_DIR;

const dataSource = 'src/config/orm.config.ts';

const subcommandsMap = {
  'migration:generate': `tsx -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate ${migrationsDir}/${migrationName} -d ${dataSource}`,
  'migration:create': `tsx -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ${migrationsDir}/${migrationName}`,
  'migration:revert': `tsx -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ${dataSource}`,
};

const command = subcommandsMap[subcommand];

if (!command) {
  console.error('Invalid subcommand');
  process.exit(1);
}

console.log(command);

process.env.FORCE_COLOR = 1;

const cmd = exec(command);
cmd.stdout.pipe(process.stdout);
cmd.stderr.pipe(process.stderr);
