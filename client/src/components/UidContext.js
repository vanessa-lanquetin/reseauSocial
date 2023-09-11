import { createContext } from "react";

export const UidContext = createContext({
  /** @type {string | null} */
  uid: null,
  /** @type {(string) => void} */
  setUid: () => {}
});
export default UidContext;