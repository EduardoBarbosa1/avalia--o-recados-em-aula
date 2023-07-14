import express from "express";
/* lista de ususarios
   cada item é um objeto
   o objeto possui as seguintes propriedades
    - nome
    - identificador (unico para cada usuario)
    - email
    - senha
*/
const usuarios = [
    {
        nome: "Teste 1",
        identificador: 0,
        email: "teste1@teste.com",
        senha: "teste1",
    },
    {
        nome: "Teste 2",
        identificador: 1,
        email: "teste2@teste.com",
        senha: "teste2",
    },
];
const messages = [{
    descricao: "Ola",
    corpo: "hello world",
    identificador: "1"
}]

let contador = 2;
const app = express();

app.use(express.json());


app.post("/login", function (requisicao, resposta) {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;


    // usando o find
    const usuario = usuarios.find(function (usuario) {
        if (usuario.email === email && usuario.senha === senha) {
            return true;
        }
    });

    if (usuario) {
        const mensagensUsuario = messages.filter(function (message) {
            return parseFloat(message.identificador) === usuario.identificador;
        });

        resposta.status(200);
        resposta.json(mensagensUsuario);
    }
    else {
        resposta.status(400);
        resposta.send("usuário inválido");
    }
});

app.post("/cadastro-de-usuario", function (requisicao, resposta) {
    if (
        requisicao.body.nome === undefined ||
        requisicao.body.email === undefined ||
        requisicao.body.senha === undefined
    ) {
        resposta.status(400);
        resposta.send("Você deve enviar nome, email e senha");
        return;
    }
    const novoUsuario = {
        nome: requisicao.body.nome,
        email: requisicao.body.email,
        senha: requisicao.body.senha,
        identificador: contador,
    };

    let possuiMesmoEmail = false;
    for (const usuario of usuarios) {
        if (usuario.email === novoUsuario.email) {
            possuiMesmoEmail = true;
        }
    }

    if (possuiMesmoEmail) {
        resposta.status(400);
        resposta.send("Já existe um usário cadastrado com esse email");
    } else {
        resposta.status(201)
        resposta.send("Usuário cadastrado com sucesso");
        usuarios.push(novoUsuario);
    }

    console.log("possui mesmo", possuiMesmoEmail);
    console.log(usuarios);
    // AQUI DENTRO VAI A REGRA PARA CADASTRAR USUÁRIOS
    contador++;
});

app.post("/escrever-recado", function (requisicao, resposta) {
    const novoRecado = {
        descricao: requisicao.body.descricao,
        corpo: requisicao.body.corpo,
        identificador: requisicao.body.identificador
    }
    messages.push(novoRecado)
    resposta.status(200)
    resposta.send(messages)


})

app.put("/editar-recado", function (requisicao, resposta) {
    const editarRecado = {
        descricao: requisicao.body.descricao,
        corpo: requisicao.body.corpo,
        identificador: requisicao.body.identificador
    };

    for (let message of messages) {
        if (editarRecado.identificador === message.identificador) {
            message.descricao = editarRecado.descricao;
            message.corpo = editarRecado.corpo;
        } else {
            console.log("Identificador inválido")
        }

    }

    resposta.send(messages);
    resposta.status(200)
});

app.delete("/deletar-recado/:identificador", function (requisicao, resposta) {
    const identificador = requisicao.params.identificador;

    const index = messages.findIndex(function (message) {
        return message.identificador === identificador;
    });

    if (index !== -1) {
        messages.splice(index, 1);
        resposta.send(messages);
        console.log("Mensagem deletada com sucesso")
    } else {
        resposta.status(404).send("Recado não encontrado");
    }
});



app.listen(3000, () => {
    console.log("Aplicação está rodando na porta 3000: http://localhost:3000");
    console.log("ip local: http://:3000");
});