import { View, Text, StyleSheet } from "react-native";

export default function Transactions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>
      <Text>Você entrou no app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold" },
});