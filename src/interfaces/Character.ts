import { Cluster } from "./Cluster";
import { Feature } from "./Feature";
import { Faith } from "./Faith";
import { Item } from "./Item";
import { Species } from "./Species";
import { Profession } from "./Profession";

export interface Character {
  id: string;
  Name: string;
  Description: string;
  Created: Date;
  HP: number;
  MaxHP: number;
  Features: Feature[];
  ClusterFPPs: { Cluster: string; FPP: number }[];
  Items: { Item: string; Quantity: number }[];
  Species: string;
  Faith?: string;
  Profession: string;
}
