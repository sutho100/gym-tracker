type Exercise = {
  name: string;
  muscle: string;
  instructions: string;
  equipment: string;
};

type ExerciseData = {
  exercises: Exercise[];
};

type ExerciseQueryVariables = {
  name: string;
};
