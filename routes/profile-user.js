import { client } from "../index.js";
import { getUserResponse } from "../controllers/usersController.js";

export const method = "get";
export const name = "/user/:id";

export const execute = async (req, res) => {
  const { id } = req.params;

  const tokens = [
    "MTIxNzg5NzEyODY3Mjc1NTc0Mw.Gf9VYg.7Qt6Ex97e3rQWP0I8tKKAl9R5ZN1symRB3Smv8",  // Coloque os tokens corretos aqui
    "",
    ""
  ];

  const getUsers = async () => {
    let response = null;

    // Tentar buscar os dados do usuário usando os tokens fornecidos
    for (const token of tokens) {
      try {
        response = await fetch(`https://canary.discord.com/api/v10/users/${id}/profile`, {
          headers: { Authorization: token },
        }).then((res) => res.json());

        // Verifica se a resposta é válida
        if (response && response.user && response.user.id && !response.message) {
          break;  // Sai do loop se a resposta estiver válida
        }
      } catch (error) {
        console.error(error);  // Captura o erro de conexão ou qualquer falha
      }
    }

    // Verifica se o usuário foi encontrado no Discord
    const target = await client.users?.fetch(id).catch(() => null);
    if (!target) {
      return res.status(400).json({ status: 400, message: "Coloque um id de usuário válido." });
    }

    // Se não obtivemos uma resposta válida da API, retorna erro
    if (!response || !response.user || !response.user.id) {
      return res.status(500).json({ status: 500, message: "Erro ao obter o perfil do usuário." });
    }

    // Processa a resposta do usuário
    try {
      const userResponse = await getUserResponse(response);
      return res.json(userResponse);  // Retorna a resposta do usuário
    } catch (error) {
      console.error(error);  // Captura erros no processamento da resposta
      return res.status(500).json({ status: 500, message: "Erro ao processar a resposta do usuário." });
    }
  };

  // Chama a função para buscar o usuário
  await getUsers();
};
