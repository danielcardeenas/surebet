import { ArbGroup } from '@models';

export function arbLogger(arbGroup: ArbGroup) {
  let print = `\n================================================= \n`;

  // Placement info
  arbGroup.forEach(({ bet, stake, bookie }) => {
    print += `${bookie.name} ${bet.genetic ? '(' + bet.genetic + ')' : ''}: ${bet.title} @ ${bet.odds} => ${stake} \n`;
  });

  print += `\n`;

  // Results info
  arbGroup.forEach(({ profit, currency, bet, bookie }) => {
    // prettier-ignore
    print += `[${bet.genetic ? bet.genetic.toString() : bookie.name}]: ${profit} ${currency}\n`;
  });

  print += `=================================================`;

  console.log(print);
}
