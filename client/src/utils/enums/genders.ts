export enum Genders {
    Male = 0,
    Female = 1,
};

export const genderLabels: Record<Genders, string> = {
  [Genders.Male]: 'Мужской',
  [Genders.Female]: 'Женский',
};
