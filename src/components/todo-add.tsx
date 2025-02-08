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
		<form className='flex justify-center w-full'>
			<input
				type='text'
				value={newTodo}
				className='outline-none m-4 p-2 rounded-md border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] select-none'
				onChange={(e) => setNewTodo(e.target.value)}
				placeholder='Title...'
			/>
			{newTodo && (
				<>
					<input
						type='text'
						value={newDescription}
						className='outline-none m-4 p-2 rounded-md border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040] select-none'
						onChange={(e) => setNewDescription(e.target.value)}
						placeholder='Description...'
					/>
				</>
			)}
			<button
				onClick={handleAddTodo}
				disabled={!newTodo}
				className={`border-2 p-2 rounded-md m-4 px-6
                    ${
						newTodo
							? 'bg-green-200 hover:bg-green-300 active:bg-green-400 cursor-pointer'
							: 'bg-red-400 text-gray-500 cursor-not-allowed'
					}
                `}>
				✍🏻
			</button>
		</form>
	);
};
