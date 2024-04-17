export type Exercise = {
  name: string;
  muscle: string;
  instructions: string;
  equipment: string;
};

export type ExerciseData = {
  exercises: Exercise[];
};

export type ExerciseQueryVariables = {
  name: string;
};
