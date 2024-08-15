import { closeArber } from './close-arber';
import { closeBookie } from './close-bookie';
import { maximizeBookie } from './maximize-bookie';
import { pauseArber } from './pause-arber';
import { pauseBookie } from './pause-bookie';
import { resumeArber } from './resume-arber';
import { resumeBookie } from './resume-bookie';
import { updateArberInvestment } from './update-arber-investment';
import { updateBookieBalance } from './update-bookie-balance';

const repo = {
  pauseArber: pauseArber,
  resumeArber: resumeArber,
  updateArberInvestment: updateArberInvestment,
  closeArber: closeArber,
  pauseBookie: pauseBookie,
  resumeBookie: resumeBookie,
  maximizeBookie: maximizeBookie,
  updateBookieBalance: updateBookieBalance,
  closeBookie: closeBookie,
};

export { repo };
