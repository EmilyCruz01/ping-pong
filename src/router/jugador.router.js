const router = require('express').Router();
const Jugador = require("../model/jugador.model");
const { Op } = require('sequelize');


router.get('/jugadores', async (req, res) => {
    try {
        const fechaActual = new Date();
        const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), fechaActual.getDate());

        const jugadores = await Jugador.findAll({
            attributes: ['matricula', 'nombre_completo'],
            where: {
                updatedAt: {
                    [Op.gte]: fechaInicio
                }
            }
        });

        res.render('listaJugadores', { jugadores });
    } catch (error) {
        console.error("Error al obtener los jugadores:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/registrar-jugadores', (req, res) => {
    res.render('registrarJugadores');
});

router.post('/registrar-jugadores', async (req, res) => {
    try {
        // Obtener los datos del cuerpo de la solicitud
        const { matricula, nombre_completo } = req.body;

        // Crear un nuevo jugador en la base de datos
        const nuevoJugador = await Jugador.create({
            matricula,
            nombre_completo
        });

        // Enviar una respuesta con el jugador recién creado
        res.status(201).json({
            ok: true,
            status: 201,
            msg: "Jugador registrado exitosamente",
            jugador: nuevoJugador
        });
    } catch (error) {
        // Manejar errores y enviar una respuesta de error al cliente
        console.error("Error al registrar el jugador:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});





module.exports = router;
