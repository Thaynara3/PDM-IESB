import { View, Text, StyleSheet } from "react-native";

export default function AddTransactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Transação</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold" },
});