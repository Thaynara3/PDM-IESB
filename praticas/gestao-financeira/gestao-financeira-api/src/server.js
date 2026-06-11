const { z } = require("zod");
const express = require("express");
const cors = require("cors");
const prisma = require("./lib/prisma");

const app = express();

app.use(cors());
app.use(express.json());

const transactionSchema = z.object({
  description: z.string().min(1),
  value: z.number().positive(),
  date: z.string().min(1),
  categoryId: z.string().min(1),
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "gestao-financeira-api",
  });
});

app.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: {
      displayName: "asc",
    },
  });

  res.json(categories);
});

app.post("/categories", async (req, res) => {
  try {
    const { name, displayName, icon, background, isIncome } = req.body;

    const category = await prisma.category.create({
      data: {
        name,
        displayName,
        icon,
        background,
        isIncome,
        isDefault: false,
      },
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao criar categoria",
      details: error.message,
    });
  }
});

app.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.update({
      where: { id },
      data: req.body,
    });

    res.json(category);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao atualizar categoria",
      details: error.message,
    });
  }
});

app.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({
        error: "Categoria não encontrada",
      });
    }

    if (category.isDefault) {
      return res.status(400).json({
        error: "Categorias padrão não podem ser excluídas",
      });
    }

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: "Erro ao excluir categoria",
      details: error.message,
    });
  }
});

app.post("/transactions", async (req, res) => {
  try {
    const validatedData = transactionSchema.parse(req.body);

    const { description, value, date, categoryId } = validatedData;

    const transaction = await prisma.transaction.create({
      data: {
        description,
        value,
        date: new Date(date),
        categoryId,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.issues,
      });
    }

    res.status(400).json({
      error: "Erro ao criar transação",
      details: error.message,
    });
  }
});

app.get("/transactions", async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    include: {
      category: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  res.json(transactions);
});

app.delete("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.transaction.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error: "Erro ao excluir transação",
      details: error.message,
    });
  }
});

app.put("/transactions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, value, date, categoryId } = req.body;

    const data = {};

    if (description !== undefined) data.description = description;
    if (value !== undefined) data.value = Number(value);
    if (date !== undefined) data.date = new Date(date);
    if (categoryId !== undefined) data.categoryId = categoryId;

    const transaction = await prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    res.json(transaction);
  } catch (error) {
    res.status(400).json({
      error: "Erro ao atualizar transação",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});