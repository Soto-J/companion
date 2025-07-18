import { DEFAULT_PAGE } from "@/constants";

import { MeetingStatus } from "@/modules/meetings/types";

import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from "nuqs";

// if input is empty clears URL to default ""
// E.g. http://localhost:3000/agents?search=test
//  =>  http://localhost:3000/agents
export const useMeetingsFilters = () => {
  return useQueryStates({
    search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
    page: parseAsInteger
      .withDefault(DEFAULT_PAGE)
      .withOptions({ clearOnDefault: true }),
    status: parseAsStringEnum(Object.values(MeetingStatus)),
    agentId: parseAsString
      .withDefault("")
      .withOptions({ clearOnDefault: true }),
  });
};
