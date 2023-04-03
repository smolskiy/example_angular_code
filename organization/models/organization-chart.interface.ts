export interface IFormattedData {
  name: ChartNames;
  limitPoints: string[];
  points: string;
  total: number;
}

export enum ChartNames {
  Monthly = 'monthly',
  Bonus = 'bonus',
}
