import { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MoneyContext } from "../../src/contexts/GlobalState";
import { api } from "../../src/services/api";
import { router } from "expo-router";

export default function AddTransactions() {
  const { categories, loadData } = useContext(MoneyContext);

  const [form, setForm] = useState({
    description: "",
    value: "",
    date: new Date().toISOString().slice(0, 10),
    categoryId: "",
  });

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((prev) => ({
        ...prev,
        categoryId: categories[0].id,
      }));
    }
  }, [categories]);

  const handleSave = async () => {
    if (!form.description || Number(form.value) <= 0 || !form.categoryId) {
      Alert.alert("Erro", "Preencha descrição, valor e categoria.");
      return;
    }

    try {
      await api.createTransaction({
        description: form.description,
        value: Number(String(form.value).replace(",", ".")),
        date: form.date,
        categoryId: form.categoryId,
      });

      await loadData();

      setForm({
        description: "",
        value: "",
        date: new Date().toISOString().slice(0, 10),
        categoryId: categories.length > 0 ? categories[0].id : "",
      });

      Alert.alert("Sucesso", "Transação salva!");
      router.push("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar.");
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={form.description}
        onChangeText={(text) => setForm({ ...form, description: text })}
        placeholder="Ex: Mercado"
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.value}
        onChangeText={(text) => setForm({ ...form, value: text })}
        placeholder="Ex: 25.50"
      />

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        value={form.date}
        onChangeText={(text) => setForm({ ...form, date: text })}
        placeholder="2026-04-29"
      />

      <Text style={styles.label}>Categoria</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.categoryId}
          onValueChange={(itemValue) =>
            setForm({ ...form, categoryId: itemValue })
          }
        >
          {categories.map((cat) => (
            <Picker.Item
              key={cat.id}
              label={cat.displayName}
              value={cat.id}
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Transação</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#B1B1B1",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#B1B1B1",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#FFF",
  },
  button: {
    backgroundColor: "#37BF81",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});