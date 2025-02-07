import { useState } from 'react';
import todoStore from '../stores/todo-store';

export const ToDoAdd = () => {
	const [newTodo, setNewTodo] = useState('');
	const [newDescription, setNewDescription] = useState('');

	const handleAddTodo = () => {
		todoStore.addTodo(newTodo, newDescription);
		setNewTodo('');
		setNewDescription('');
	};

	return (
		<>
			<input
				type='text'
				value={newTodo}
				className='gap-2 my-4 border rounded-md p-2 m-4 border-gray-400 bg-white hover:bg-slate-50 grow select-none'
				onChange={(e) => setNewTodo(e.target.value)}
				placeholder='Title...'
			/>
			{newTodo && (
				<>
					<input
						type='text'
						value={newDescription}
						className='gap-2 my-4 border rounded-md p-2 m-4 border-gray-400 bg-white hover:bg-slate-50 grow select-none'
						onChange={(e) => setNewDescription(e.target.value)}
						placeholder='Description...'
					/>
				</>
			)}
			<button
				onClick={handleAddTodo}
				disabled={!newTodo}
				className='border-2 p-2 disabled:bg-red-500'>
				Add Todo
			</button>
		</>
	);
};
