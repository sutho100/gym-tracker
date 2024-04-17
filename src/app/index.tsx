import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import ExerciseListItem from "../components/ExerciseListItem";
import { useInfiniteQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import client from "../graphqlClient";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "../providers/AuthContext";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Exercise } from "../modals";

// type Exercise = {
//   name: string;
//   muscle: string;
//   equipment: string;
// };

type Page = {
  exercises: Exercise[];
};

type QueryData = {
  pageParams: number[];
  pages: Page[];
  exercises: Exercise[];
};

const exercisesQuery = gql`
  query exercises($muscle: String, $name: String, $offset: Int) {
    exercises(muscle: $muscle, name: $name, offset: $offset) {
      name
      muscle
      equipment
    }
  }
`;

export default function ExercisesScreen() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearchTerm = useDebounce(search.trim(), 1000);

  const { data, isLoading, error, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery<QueryData, Error>({
      queryKey: ["exercises", debouncedSearchTerm],
      queryFn: ({ pageParam }) =>
        client.request(exercisesQuery, {
          offset: pageParam,
          name: debouncedSearchTerm,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => pages.length * 10,
    });

  const { username } = useAuth();

  const loadMore = () => {
    if (isFetchingNextPage) {
      return;
    }

    fetchNextPage();
  };

  if (!username) {
    return <Redirect href={"/auth"} />;
  }

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch exercises</Text>;
  }

  const exercises = data?.pages.flatMap((page) => page.exercises) ?? [];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            placeholder: "Search...",
            onChangeText: (event) => setSearch(event.nativeEvent.text),
            hideWhenScrolling: false,
          },
        }}
      />

      <FlatList
        data={exercises}
        contentContainerStyle={{ gap: 5 }}
        style={{ padding: 10 }}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => <ExerciseListItem item={item} />}
        onEndReachedThreshold={1}
        onEndReached={loadMore}
        contentInsetAdjustmentBehavior="automatic"
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
