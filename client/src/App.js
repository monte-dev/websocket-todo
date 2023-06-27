import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import shortId from 'shortid';
const App = () => {
	const [socket, setSocket] = useState(null);
	const [tasks, setTasks] = useState([]);
	const [taskName, setTaskName] = useState('');
	const id = shortId();

	useEffect(() => {
		const socket = io('http://localhost:8000');
		setSocket(socket);
	}, []);

	const removeTask = (taskId) => {
		setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
	};

	const submitForm = (e) => {
		e.preventDefault();
		const newTask = { name: taskName, id: id };
		addTask(newTask);
		socket.emit('addTask', newTask);
		setTaskName('');
	};

	const addTask = (newTask) => {
		setTasks((tasks) => [...tasks, newTask]);
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
								onClick={() => removeTask(task.id)}
							>
								Remove
							</button>
						</li>
					))}
				</ul>

				<form id="add-task-form" onSubmit={submitForm}>
					<input
						className="text-input"
						autocomplete="off"
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
