import { BookieName } from '@models';

export interface InputScript {
  bookieName: BookieName;
  args: {
    config: {
      headless: boolean;
    };
    currencyCode: string;
  };
  retriever: string;
  credentials?: { user: string; password: string };
}
