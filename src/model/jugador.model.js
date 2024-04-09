const { Sequelize, Model, DataTypes } = require("sequelize");
const mqtt = require('mqtt');
const client = mqtt.connect("mqtt://18.213.95.105:1883");

const sequelize = new Sequelize("pingpong", "admin", "6wQtP6MgryW90hlm9TuA", {
    host: "pingpong.c322asyegxd6.us-east-1.rds.amazonaws.com",
    dialect: "mysql",
    port: 3306
});


class Jugador extends Model {}
Jugador.init({
    matricula: {
        type: DataTypes.STRING(6),
        allowNull: false,
        primaryKey: true
    },
    nombre_completo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    total_victorias: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    updated_at_lista: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW // Esto establece la fecha actual por defecto
      }
}, {
    sequelize,
    modelName: "Jugador",
});

client.on("connect",()=>{
    client.subscribe("emqx/esp32");
}) 

client.on("message", async (topic, message) => {
    try {
        const matricula = message.toString();

        // Buscar un jugador en la base de datos con la matrícula recibida
        const jugadorEncontrado = await Jugador.findOne({ where: { matricula } });

        if (jugadorEncontrado) {
            // Si se encontró el jugador, actualizar su información (solo updatedAt)
            await jugadorEncontrado.update({ updated_at_lista: new Date() });

            // Publicar un mensaje de matrícula válida
            client.publish("emqx/esp32-2", "matricula valida");
        } else {
            // Si no se encontró el jugador, publicar un mensaje de matrícula inválida
            client.publish("emqx/esp32-2", "matricula invalida");
        }
    } catch (error) {
        console.error("Error al buscar o actualizar el jugador en la base de datos:", error);
    }
});



module.exports = Jugador;
