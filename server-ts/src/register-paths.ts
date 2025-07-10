import { register } from 'tsconfig-paths';
import { compilerOptions } from '../tsconfig.json';

register({
  baseUrl: compilerOptions.baseUrl,
  paths: compilerOptions.paths,
});
