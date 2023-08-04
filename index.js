import express from "express";
import cors from "cors";
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
        identificadorUser: 0,
        email: "teste1@teste.com",
        senha: "teste1"
    },
    {
        nome: "Teste 2",
        identificadorUser: 1,
        email: "teste2@teste.com",
        senha: "teste2",
    },
];
const messages = [{
    descricao: "Ola",
    corpo: "hello world",
    identificadorUser: 1,
    idMensagem: 1

}]

let contador = usuarios.length;
let idRecado = messages.length + 1

const app = express();

app.use(express.json());
app.use(cors())


app.post("/login", function (requisicao, resposta) {
    const email = requisicao.body.email;
    const senha = requisicao.body.senha;


    // usando o find
    const usuario = usuarios.find(function (usuario) {
        if (usuario.email === email && usuario.senha === senha) {
            return true;
        }
    });
    //função para filtrar mensagens já é embutida no login
    if (usuario) {
        const mensagensUsuario = messages.filter(function (message) {
            return parseFloat(message.identificadorUser) === usuario.identificadorUser;
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
        identificadorUser: contador,
        email: requisicao.body.email,
        senha: requisicao.body.senha,

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
        contador++;
    }

    console.log("possui mesmo", possuiMesmoEmail);
    console.log(usuarios);


});

app.post("/escrever-recado/", function (requisicao, resposta) {
    const novoRecado = {
        descricao: requisicao.body.descricao,
        corpo: requisicao.body.corpo,
        identificadorUser: requisicao.body.identificadorUser,
        idMensagem: idRecado
    }

    const usuarioExistente = usuarios.find(function (usuario) {
        return usuario.identificadorUser === novoRecado.identificadorUser;
    });

    if (usuarioExistente) {
        messages.push(novoRecado);
        idRecado++;

        resposta.status(200);
        resposta.send(messages);
    } else {
        resposta.status(404);
        resposta.send("Usuário não encontrado");
    }
});


app.put("/editar-recado", function (requisicao, resposta) {
    const editarRecado = {
        descricao: requisicao.body.descricao,
        corpo: requisicao.body.corpo,
        identificadorUser: requisicao.body.identificadorUser,
        idMensagem: requisicao.body.idMensagem
    };

    for (let message of messages) {
        if (editarRecado.identificadorUser === message.identificadorUser && editarRecado.idMensagem === message.idMensagem) {
            message.descricao = editarRecado.descricao;
            message.corpo = editarRecado.corpo;
        } else {
            console.log("Identificador ou usuário inválido")
        }
    }

    resposta.send(messages);
    resposta.status(200)
});

app.delete("/deletar-recado/:identificadorUser/:idMensagem", function (requisicao, resposta) {
    const identificadorUser = parseInt(requisicao.params.identificadorUser);
    const idMensagem = parseInt(requisicao.params.idMensagem);

    const index = messages.findIndex(function (message) {
        return message.identificadorUser === identificadorUser && message.idMensagem === idMensagem;
    });

    if (index !== -1) {
        messages.splice(index, 1);
        resposta.send(messages);
        console.log("Mensagem deletada com sucesso");
    } else {
        resposta.status(404).send("Recado não encontrado");
    }
});



app.listen(3000, () => {
    console.log("Aplicação está rodando na porta 3000: http://localhost:3000");
    console.log("ip local: http://:3000");
});

