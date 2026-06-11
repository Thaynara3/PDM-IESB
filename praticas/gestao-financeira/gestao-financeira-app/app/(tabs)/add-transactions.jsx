import { useState, useContext } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Picker } from "@react-native-picker/picker";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { MoneyContext } from "../../src/contexts/GlobalState";
import { api } from "../../src/services/api";
import { router } from "expo-router";

export default function AddTransactions() {
  const { categories, loadData } = useContext(MoneyContext);
  
  const initialForm = {
    description: "",
    value: 0,
    date: new Date(),
    categoryId: categories.length > 0 ? categories[0].id : ""
  };

  const [form, setForm] = useState(initialForm);
  const [showPicker, setShowPicker] = useState(false);

  // Máscara de dinheiro (impede letras e formata)
  const handleCurrencyChange = (text) => {
    const formattedValue = text.replace(/\D/g, "");
    const numberValue = formattedValue ? parseFloat(formattedValue) / 100 : 0;
    setForm({ ...form, value: numberValue });
  };

  const handleDateChange = (_, selectDate) => {
    setShowPicker(false);
    if (selectDate) {
      setForm({ ...form, date: selectDate });
    }
  };

  const handleSave = async () => {
    if (!form.description || form.value <= 0) {
      Alert.alert("Erro", "Preencha uma descrição e um valor válido.");
      return;
    }

    try {
      await api.createTransaction({
        ...form,
        date: form.date.toISOString(), // Envia para a API no formato correto
      });
      
      await loadData(); // Recarrega os dados do banco
      setForm(initialForm); // Limpa o formulário após salvar!
      
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
        placeholder="Ex: Conta de Luz"
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput 
        style={styles.input} 
        keyboardType="numeric"
        value={form.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        onChangeText={handleCurrencyChange}
      />

      <Text style={styles.label}>Data</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <TextInput
          style={styles.input}
          value={form.date.toLocaleDateString("pt-BR")}
          editable={false}
        />
      </TouchableOpacity>
      {showPicker && (
        <RNDateTimePicker
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          value={form.date}
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Categoria (Define se é Renda ou Despesa)</Text>
      <View style={styles.pickerContainer}>
        <Picker 
          selectedValue={form.categoryId || (categories.length > 0 ? categories[0].id : "")} 
          onValueChange={(itemValue) => setForm({ ...form, categoryId: itemValue })}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat.id} label={cat.displayName} value={cat.id} />
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
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  label: { fontSize: 16, marginBottom: 5, color: "#666", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#B1B1B1", padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: "#FFF" },
  pickerContainer: { borderWidth: 1, borderColor: "#B1B1B1", borderRadius: 8, marginBottom: 20, backgroundColor: "#FFF" },
  button: { backgroundColor: "#37BF81", padding: 16, borderRadius: 8, alignItems: "center", marginBottom: 40 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 }
});