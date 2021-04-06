import * as z from "zod";

export const callbackSchema = z.object({
  oauth_token: z.string(),
  oauth_verifier: z.string(),
});
