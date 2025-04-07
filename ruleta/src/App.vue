<!-- src/App.vue -->
<template>
	<div class="max-w-xl mx-auto mt-10">
	  <SessionForm v-if="!sesionIniciada" @sesionIniciada="manejarInicioSesion" />
	  <RouletteGame v-else :sessionId="sessionId" :jugadores="jugadores" />
	</div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import SessionForm from './components/SessionForm.vue'
  import RouletteGame from './components/RouletteGame.vue'
  
  const sesionIniciada = ref(false)
  const sessionId = ref(null)
  const jugadores = ref([])
  
  const manejarInicioSesion = ({ sessionId: id, jugadores: lista }) => {
	sessionId.value = id
	jugadores.value = lista
	sesionIniciada.value = true
  }
  </script>
  