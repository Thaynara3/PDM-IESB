import { useContext, useState, useMemo } from "react";
import { View, Text, Dimensions, StyleSheet, ScrollView } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { MoneyContext } from "../../src/contexts/GlobalState";

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function Summary() {
  const { transactions, categories } = useContext(MoneyContext);
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());

  // Lógica pesada isolada no useMemo (seguindo a Aula 07 do professor)
  const totais = useMemo(() => {
    const transacoesFiltradas = transactions.filter(t => new Date(t.date).getMonth() === mesAtual);
    
    let saldoFinal = 0;
    const totaisPorCategoria = {};

    transacoesFiltradas.forEach(t => {
      const valor = Number(t.value);
      const isIncome = t.category?.isIncome;
      
      // Soma o Saldo Final
      if (isIncome) saldoFinal += valor;
      else saldoFinal -= valor;

      // Soma por Categoria
      if (!totaisPorCategoria[t.categoryId]) totaisPorCategoria[t.categoryId] = 0;
      totaisPorCategoria[t.categoryId] += valor;
    });

    return { saldoFinal, totaisPorCategoria };
  }, [transactions, mesAtual]);

  // Monta os dados para o Gráfico de Pizza
  const chartData = categories.map(cat => ({
    name: cat.displayName,
    population: totais.totaisPorCategoria[cat.id] || 0,
    color: cat.background || "#ccc",
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  })).filter(item => item.population > 0);

  const saldoStyle = totais.saldoFinal >= 0 ? "#37BF81" : "#DA5567";

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filtrar Resumo:</Text>
        <Picker style={styles.picker} selectedValue={mesAtual} onValueChange={setMesAtual}>
          {MESES.map((mes, index) => (
            <Picker.Item key={index} label={mes} value={index} />
          ))}
        </Picker>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Saldo do Mês</Text>
        <Text style={[styles.balanceValue, { color: saldoStyle }]}>
          {totais.saldoFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </Text>
      </View>

      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{ color: () => `black` }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute // Mostra os valores reais ao invés de porcentagem
        />
      ) : (
        <Text style={styles.empty}>Nenhuma movimentação neste mês.</Text>
      )}

      <View style={styles.listContainer}>
        {categories.map(cat => {
          const valorCat = totais.totaisPorCategoria[cat.id] || 0;
          if (valorCat === 0) return null; // Esconde se for zero
          
          return (
            <View key={cat.id} style={styles.listItem}>
              <View style={[styles.colorDot, { backgroundColor: cat.background }]} />
              <Text style={styles.listName}>{cat.displayName}</Text>
              <Text style={styles.listValue}>
                {valorCat.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  filterContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20, backgroundColor: "#fff", borderRadius: 8 },
  filterLabel: { paddingLeft: 10, fontWeight: "bold" },
  picker: { flex: 1 },
  balanceContainer: { alignItems: "center", marginBottom: 20, padding: 20, backgroundColor: "#fff", borderRadius: 8 },
  balanceText: { fontSize: 18, color: "#666" },
  balanceValue: { fontSize: 28, fontWeight: "bold", marginTop: 5 },
  empty: { textAlign: "center", color: "#888", marginVertical: 30 },
  listContainer: { marginTop: 20, paddingBottom: 40 },
  listItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 },
  colorDot: { width: 16, height: 16, borderRadius: 8, marginRight: 10 },
  listName: { flex: 1, fontSize: 16, color: "#333" },
  listValue: { fontSize: 16, fontWeight: "bold" }
});