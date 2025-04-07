<template>
	<div class="game-container">
		<div class="players-panel">
			<button @click="iniciarRonda" :disabled="spinning">
				Iniciar Ronda ({{ ronda }})
			</button>
			<button @click="agregarJugador">Agregar Jugador</button>
			<ul>
				<li v-for="(jugador, index) in jugadores" :key="jugador.id" class="jugador-item">
					<div class="jugador-info">
						<input v-model="jugador.nombre" placeholder="Nombre" />
						<select v-model="jugador.apuestaColor">
							<option value="rojo">Rojo</option>
							<option value="negro">Negro</option>
							<option value="verde">Verde</option>
						</select>
						<select v-model="jugador.apuestaNumero">
							<option v-for="num in numerosRuleta" :value="num">{{ num }}</option>
						</select>
						<button @click="eliminarJugador(index)" class="eliminar-btn">X</button>
					</div>
				</li>
			</ul>
		</div>

		<div class="ruleta-panel">
			<canvas ref="canvas" width="300" height="300"></canvas>
			<div class="ganador-numero">{{ numeroGanador !== null ? numeroGanador : '?' }}</div>
		</div>

		<div class="ganadores-panel">
			<div v-if="numeroGanador !== null">
				<p>
					Número ganador: <strong>{{ numeroGanador }}</strong>
					({{ colorGanador }})
				</p>
				<p v-if="ganadores.length > 0">
					Ganadores:
					<span
						v-for="(ganador, index) in ganadores"
						:key="index"
					>
						{{ ganador }}<span v-if="index < ganadores.length - 1">, </span>
					</span>
				</p>
				<p v-else>No hubo ganadores</p>
			</div>
			<p v-else>Esperando resultado...</p>
		</div>

		<button @click="reiniciarJuego" :disabled="spinning" class="reinicio-btn">
			Reiniciar Juego
		</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			ronda: 1,
			jugadores: [
				{ id: 1, nombre: 'Jugador 1', apuestaColor: 'rojo', apuestaNumero: 32 },
				{ id: 2, nombre: 'Jugador 2', apuestaColor: 'negro', apuestaNumero: 7 },
			],
			numeroGanador: null,
			colorGanador: null,
			ganadores: [],
			ruleta: [
				{ numero: 0, color: 'verde' }, { numero: 32, color: 'rojo' }, { numero: 15, color: 'negro' },
				{ numero: 19, color: 'rojo' }, { numero: 4, color: 'negro' }, { numero: 21, color: 'rojo' },
				{ numero: 2, color: 'negro' }, { numero: 25, color: 'rojo' }, { numero: 17, color: 'negro' },
				{ numero: 34, color: 'rojo' }, { numero: 6, color: 'negro' }, { numero: 27, color: 'rojo' },
				{ numero: 13, color: 'negro' }, { numero: 36, color: 'rojo' }, { numero: 11, color: 'negro' },
				{ numero: 30, color: 'rojo' }, { numero: 8, color: 'negro' }, { numero: 23, color: 'rojo' },
				{ numero: 10, color: 'negro' }, { numero: 5, color: 'rojo' }, { numero: 24, color: 'negro' },
				{ numero: 16, color: 'rojo' }, { numero: 33, color: 'negro' }, { numero: 1, color: 'rojo' },
				{ numero: 20, color: 'negro' }, { numero: 14, color: 'rojo' }, { numero: 31, color: 'negro' },
				{ numero: 9, color: 'rojo' }, { numero: 22, color: 'negro' }, { numero: 18, color: 'rojo' },
				{ numero: 29, color: 'negro' }, { numero: 7, color: 'rojo' }, { numero: 28, color: 'negro' },
				{ numero: 12, color: 'rojo' }, { numero: 35, color: 'negro' }, { numero: 3, color: 'rojo' },
				{ numero: 26, color: 'negro' },
			],
			angle: 0,
			spinning: false,
			numeroGanadorIndex: null,
			ultimoGanador: null
		};
	},
	computed: {
		numerosRuleta() {
			return this.ruleta.map(item => item.numero);
		}
	},
	methods: {
		agregarJugador() {
			const nuevoId = this.jugadores.length > 0 ? Math.max(...this.jugadores.map(j => j.id)) + 1 : 1;
			this.jugadores.push({
				id: nuevoId,
				nombre: `Jugador ${nuevoId}`,
				apuestaColor: 'rojo',
				apuestaNumero: 0
			});
		},
		eliminarJugador(index) {
			this.jugadores.splice(index, 1);
		},
		iniciarRonda() {
			if (this.spinning || this.jugadores.length === 0) return;
			this.spinning = true;

			this.numeroGanador = null;
			this.colorGanador = null;
			this.ganadores = [];
			this.numeroGanadorIndex = null;

			const total = this.ruleta.length;
			const angleStep = (2 * Math.PI) / total;

			this.numeroGanadorIndex = Math.floor(Math.random() * total);
			const resultado = this.ruleta[this.numeroGanadorIndex];

			const vueltas = 5;
			const angleOffset = angleStep * this.numeroGanadorIndex + angleStep / 2;
			const targetAngle = vueltas * 2 * Math.PI - angleOffset;

			const startAngle = this.angle % (2 * Math.PI);
			const totalRotation = targetAngle + startAngle;

			const startTime = performance.now();
			const duration = 4000;

			const animate = (now) => {
				const elapsed = now - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 4);
				this.angle = startAngle + (totalRotation - startAngle) * eased;

				this.drawRuleta();

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					this.angle = totalRotation;
					this.numeroGanador = resultado.numero;
					this.colorGanador = resultado.color;
					this.ultimoGanador = resultado;

					// Verificar ganadores
					this.ganadores = this.jugadores
						.filter(j =>
							j.apuestaNumero === resultado.numero || j.apuestaColor === resultado.color
						)
						.map(j => {
							if (j.apuestaNumero === resultado.numero && j.apuestaColor === resultado.color) {
								return `${j.nombre} (¡Acertó número y color!)`;
							}
							return j.nombre;
						});

					this.ronda++;
					this.spinning = false;
					this.drawRuleta();
				}
			};

			requestAnimationFrame(animate);
		},
		reiniciarJuego() {
			this.ronda = 1;
			this.jugadores = [];
			this.numeroGanador = null;
			this.colorGanador = null;
			this.ganadores = [];
			this.angle = 0;
			this.numeroGanadorIndex = null;
			this.ultimoGanador = null;
			this.drawRuleta();
		},
		drawRuleta() {
			const canvas = this.$refs.canvas;
			const ctx = canvas.getContext('2d');
			const total = this.ruleta.length;
			const angleStep = (2 * Math.PI) / total;
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const radius = 140;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(this.angle);

			for (let i = 0; i < total; i++) {
				const segmento = this.ruleta[i];

				ctx.beginPath();
				ctx.fillStyle = segmento.color;
				ctx.moveTo(0, 0);
				ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
				ctx.fill();

				if (this.numeroGanadorIndex !== null && i === this.numeroGanadorIndex) {
					ctx.beginPath();
					ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
					ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
					ctx.lineTo(0, 0);
					ctx.fill();
				}

				ctx.save();
				ctx.rotate(i * angleStep + angleStep / 2);
				ctx.fillStyle = 'white';
				ctx.font = 'bold 14px sans-serif';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(segmento.numero, radius - 20, 0);
				ctx.restore();
			}

			ctx.restore();

			ctx.beginPath();
			ctx.fillStyle = 'red';
			ctx.moveTo(centerX, 10);
			ctx.lineTo(centerX - 5, 25);
			ctx.lineTo(centerX + 5, 25);
			ctx.fill();
		},
	},
	mounted() {
		this.drawRuleta();
	},
};
</script>

<style scoped>
.game-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	padding: 20px;
	background: #222;
	color: #fff;
	font-family: sans-serif;
}

.players-panel {
	background: #2c3e50;
	padding: 20px;
	border-radius: 10px;
	width: 300px;
}

.ruleta-panel {
	position: relative;
}

.ganador-numero {
	position: absolute;
	top: -30px;
	left: 50%;
	transform: translateX(-50%);
	font-size: 30px;
	color: red;
}

.ganadores-panel {
	position: relative;
	margin-top: 20px;
	width: 100%;
	text-align: center;
	background: #fff;
	color: #000;
	padding: 10px;
	font-size: 18px;
	border-radius: 10px;
}

button {
	background: #34495e;
	border: none;
	padding: 10px 20px;
	font-weight: bold;
	color: #fff;
	border-radius: 5px;
	cursor: pointer;
	margin-bottom: 10px;
	width: 100%;
}

.reinicio-btn {
	background: #e74c3c;
}
</style>
