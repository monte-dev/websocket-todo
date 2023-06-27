import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import shortid from 'shortid';

const App = () => {
	const [socket, setSocket] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [taskName, setTaskName] = useState('');
	const shortId = shortid.generate();

	useEffect(() => {
		const socket = io('http://localhost:8000');
		setSocket(socket);

		socket.on('updateData', (tasks) => {
			updateTasks(tasks);
		});

		socket.on('removeTask', (taskId) => {
			removeTask(taskId);
		});

		socket.on('addTask', (taskId) => {
			addTask(taskId);
		});
		// remove double render of addTask
		return () => {
			socket.disconnect();
		};
	}, []);

	const updateTasks = (tasks) => {
		setTasks(tasks);
	};

	const removeTask = (taskId, localRemoval) => {
		setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
		if (localRemoval) {
			socket.emit('removeTask', taskId);
		}
	};

	const addTask = (newTask) => {
		setTasks((tasks) => [...tasks, newTask]);
	};

	const submitForm = (e) => {
		e.preventDefault();
		const newTask = {
			name: taskName,
			id: shortId,
		};
		addTask(newTask);
		socket.emit('addTask', newTask);
		setTaskName('');
	};

	return (
		<div className="App">
			<header>
				<h1>ToDoList.app</h1>
			</header>

			<section className="tasks-section" id="tasks-section">
				<h2>Tasks</h2>
				<ul className="tasks-section__list" id="tasks-list">
					{tasks.map((task) => (
						<li key={task.id} className="task">
							{task.name}
							<button
								className="btn btn--red"
								onClick={() => removeTask(task.id, true)}
							>
								Remove
							</button>
						</li>
					))}
				</ul>

				<form id="add-task-form" onSubmit={submitForm}>
					<input
						className="text-input"
						autoComplete="off"
						type="text"
						placeholder="Type your description"
						id="task-name"
						value={taskName}
						onChange={(event) => setTaskName(event.target.value)}
					/>
					<button className="btn" type="submit">
						Add
					</button>
				</form>
			</section>
		</div>
	);
};

export default App;
