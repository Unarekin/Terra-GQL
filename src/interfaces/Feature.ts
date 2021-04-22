export interface Feature {
  id: string;
  Name: string;
  Description?: string;
  Requirements?: string;
  EffectsSelf?: string;
  EffectsTarget?: string;
  EffectsLearn?: string;
  Children?: Feature[];
}
