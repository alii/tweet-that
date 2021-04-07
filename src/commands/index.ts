import {Command} from "../types/command";
import {login} from "./twitter/login";
import {tweet} from "./twitter/tweet";
import {ping} from "./util/ping";
import {whoami} from "./twitter/whoami";

export const commands: Command[] = [ping, login, tweet, whoami];

const commandsWithAliases = commands.reduce((all, command) => {
  return [...new Set(command.aliases)].reduce((previous, commandName) => {
    return {...previous, [commandName]: command};
  }, all);
}, {} as Record<string, Command>);

export const aliases = new Map<string, Command>(Object.entries(commandsWithAliases));

const allCommandAliases = commands.map(c => c.aliases).flat();

const duplicateAliases = allCommandAliases.filter((c, i, a) => a.indexOf(c) !== i);

if (duplicateAliases.length > 0) {
  throw new Error(`Encountered duplicate aliases: ${duplicateAliases.join(", ")}`);
}
