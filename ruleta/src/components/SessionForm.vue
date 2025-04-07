<template>
  <div class="">
    <h2 class="crearSesion">Crear Sesion</h2>
    
    <button @click="crearSesion" class="btnNueva">
      Crear nueva Sesion
    </button>

    <div v-if="sessionId">
    <!--   <p class="mb-2">ID de la Sesion: <strong>{{ sessionId }}</strong></p>
 -->
      <div class="group">
        <input
          v-model="playerName"
          placeholder="Nombre del jugador"
          class="inputAdd"
        />
        <button @click="agregarJugador" class="btn buttonAdd">
          Agregar jugador
        </button>
      </div>

      <ul>
        <li v-for="(player, index) in jugadores" :key="index">
          {{ player.name }}
        </li>
      </ul>

      <button
        class="btn btnInciarJuego"
        @click="$emit('sesionIniciada', { sessionId, jugadores })"
      >
        Iniciar juego 
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { createSession, addPlayerToSession } from '../services/api'

const sessionId = ref(null)
const playerName = ref('')
const jugadores = ref([])

const crearSesion = async () => {
  const res = await createSession()
  sessionId.value = res.sessionId || res.id || res // Ajustar según respuesta real
  jugadores.value = []
}

const agregarJugador = async () => {
  if (!playerName.value) return
  await addPlayerToSession(sessionId.value, playerName.value)
  jugadores.value.push({ name: playerName.value })
  playerName.value = ''
}
</script>
