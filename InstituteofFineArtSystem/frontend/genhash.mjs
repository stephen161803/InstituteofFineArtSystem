import { createRequire } from 'module';
import { execSync } from 'child_process';
import { join } from 'path';

const npmRoot = execSync('npm root -g').toString().trim();
const { createRequire: cr } = await import('module');
const require = cr(import.meta.url);

// install locally if needed
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('password123', 10);
console.log(hash);
