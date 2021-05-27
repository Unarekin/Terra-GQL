import { Character } from "./Character";

export interface Faith {
  id: string;
  Name: string;
  Pronunciation?: string;
  Description: string;
  Hierarchy?: string;
  Politics?: string;
  History?: string;
  ShowOnMenu?: boolean;
  Icon?: string;
  IconType?: string;
}
