import { Cluster } from "./Cluster";
import { Feature } from "./Feature";

export interface Profession {
  id: string;
  Name: string;
  Abbreviation?: string;
  Description?: string;
  Duties?: string;
  Opportunities?: string;
  Hazards?: string;
  Specializations?: string;
  Features: Feature[];
  Specialty: Specialty;
  FPPPool: { Cluster: Cluster; FPP: number }[];
}

export interface Specialty {
  id: string;
  Name: string;
  Description?: string;
  SelfEfects?: string;
  TargetEffects?: string;
}
