const express = require('express');
const app = express();
const socket = require('socket.io');

const tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
	console.log('Server is running...');
});
const io = socket(server);

io.on('connection', (socket) => {
	socket.emit('updateData', tasks);

	socket.on('addTask', (task) => {
		tasks.push(task);
		socket.broadcast.emit('addTask', task);
	});

	socket.on('removeTask', (id) => {
		const taskIndex = tasks.findIndex((task) => task.id === id);
		if (taskIndex !== -1) {
			tasks.splice(taskIndex, 1);
		}
		socket.broadcast.emit('removeTask', id);
	});
});

app.use((req, res) => {
	res.status(404).send({ message: 'Not found' });
});
