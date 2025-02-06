import { useState } from 'react';
import { Container } from './components/';
import { ToDoList } from './components/';
import todoStore from './stores/todo-store';

const App = () => {
	const [newTodo, setNewTodo] = useState('');

	const handleAddTodo = () => {
		todoStore.addTodo(newTodo, 'testtttttttt');
		setNewTodo('');
	};

	return (
		<>
			<Container>
				<div className='container mx-auto py-10 h-screen'>
					<h1 className='font-bold text-3xl text-center'>Planny</h1>

					<input
						type='text'
						value={newTodo}
						className='gap-2 my-4 border rounded-md p-2 m-4 border-gray-400 bg-white hover:bg-slate-50 grow select-none'
						onChange={(e) => setNewTodo(e.target.value)}
					/>
					<button
						onClick={handleAddTodo}
						className='border-2 p-2'>
						Add Todo
					</button>

					<ToDoList />
				</div>
			</Container>
		</>
	);
};

export default App;
