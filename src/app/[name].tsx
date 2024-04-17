import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, FC } from "react";
import { Stack } from "expo-router";
import { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { ExerciseData, ExerciseQueryVariables } from "../modals";

import graphqlClient from "../graphqlClient";
import NewSetInput from "../components/NewSetInput";
import SetsList from "../components/SetsList";

const exerciseQuery = gql`
  query exercises($name: String) {
    exercises(name: $name) {
      name
      muscle
      instructions
      equipment
    }
  }
`;

type ExerciseDetailsScreenProps = {};

export const ExerciseDetailsScreen: FC<ExerciseDetailsScreenProps> = () => {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { data, isLoading, error } = useQuery<ExerciseData, Error>({
    queryKey: ["exercises", name],
    queryFn: () =>
      graphqlClient.request<ExerciseData, ExerciseQueryVariables>(
        exerciseQuery,
        { name }
      ),
  });

  const [isInstructionExpanded, setIsInstructionExpanded] =
    useState<boolean>(false);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch data</Text>;
  }

  const exercise = data?.exercises[0];

  if (!exercise) {
    return <Text>Exercise not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: exercise.name }} />

      <SetsList
        exerciseName={exercise.name}
        ListHeaderComponent={() => (
          <View style={{ gap: 5 }}>
            <View style={styles.panel}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>

              <Text style={styles.exerciseSubtitle}>
                <Text style={styles.subValue}>{exercise.muscle}</Text> |{" "}
                <Text style={styles.subValue}>{exercise.equipment}</Text>
              </Text>
            </View>

            <View style={styles.panel}>
              <Text
                style={styles.instructions}
                numberOfLines={isInstructionExpanded ? 0 : 3}
              >
                {exercise.instructions}
              </Text>
              <Text
                onPress={() => setIsInstructionExpanded(!isInstructionExpanded)}
                style={styles.seeMore}
              >
                {isInstructionExpanded ? "See less" : "See more"}
              </Text>
            </View>

            <NewSetInput exerciseName={exercise.name} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  panel: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "500",
  },
  exerciseSubtitle: {
    color: "dimgray",
  },
  subValue: {
    textTransform: "capitalize",
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
  },
  seeMore: {
    alignSelf: "center",
    padding: 5,
    fontWeight: "600",
    color: "gray",
  },
});

export default ExerciseDetailsScreen;
