import { Feature } from "./Feature";

export interface Cluster {
  id: string;
  Name: string;
  Description?: string;
  Features: Feature[];
  Icon?: string;
  IconType?: string;
  ShowOnMenu?: boolean;
  FeatureCount?: number;
}
