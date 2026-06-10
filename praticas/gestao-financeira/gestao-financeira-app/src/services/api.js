const BASE_URL = "http://SEU_IP:3000";

export const api = {
  getCategories: async () =>
    (await fetch(`${BASE_URL}/categories`)).json(),

  createCategory: async (data) =>
    fetch(`${BASE_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  deleteCategory: async (id) =>
    fetch(`${BASE_URL}/categories/${id}`, {
      method: "DELETE",
    }),

  getTransactions: async () =>
    (await fetch(`${BASE_URL}/transactions`)).json(),

  createTransaction: async (data) =>
    fetch(`${BASE_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  updateTransaction: async (id, data) =>
    fetch(`${BASE_URL}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),

  deleteTransaction: async (id) =>
    fetch(`${BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    }),
};