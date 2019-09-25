import { createContext } from "react";

const QueryParamsContext = createContext();
const QueryParamsProvider = QueryParamsContext.Provider;

export { QueryParamsContext, QueryParamsProvider };
