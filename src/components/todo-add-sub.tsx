import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import todoStore from '../stores/todo-store';
import { TypeToDoItem } from '../types/types';

interface Props {
	todo: TypeToDoItem;
}

export const ToDoAddSub = observer(({ todo }: Props) => {
	const [newSubTodoTitle, setNewSubTodoTitle] = useState('');
	const [newSubTodoDescription, setNewSubTodoDescription] = useState('');
	const [isAddingNewSub, setIsAddingNewSub] = useState(false);

	const handleAddSubTodo = () => {
		if (newSubTodoTitle) {
			todoStore.addSubTodo(
				todo.id,
				newSubTodoTitle,
				newSubTodoDescription
			);
		} else {
			setIsAddingNewSub(false);
		}
		setNewSubTodoTitle('');
		setNewSubTodoDescription('');
		setIsAddingNewSub(false);
	};
	return (
		<>
			{isAddingNewSub ? (
				<form className='flex items-center'>
					<input
						type='text'
						value={newSubTodoTitle}
						onChange={(e) => setNewSubTodoTitle(e.target.value)}
						placeholder='Subtask title'
						className='border rounded p-2 m-2 flex-grow focus:outline-none'
					/>
					<input
						type='text'
						value={newSubTodoDescription}
						onChange={(e) =>
							setNewSubTodoDescription(e.target.value)
						}
						placeholder='Subtask description'
						className='border rounded p-2 m-2 flex-grow focus:outline-none'
					/>
					<button
						onClick={handleAddSubTodo}
						className='bg-blue-500 text-white rounded-md w-32 h-12 cursor-pointer m-2'>
						{newSubTodoTitle ? 'Add Subtodo' : 'Cancel'}
					</button>
				</form>
			) : (
				// TODO: disabled styling
				<button
					onClick={() => setIsAddingNewSub(true)}
					disabled={todo.completed}
					className='hover:bg-gray-300 rounded text-sm p-2 bg-blue-500 text-white cursor-pointer disabled:cursor-not-allowed'>
					Add Subtask
				</button>
			)}
		</>
	);
});
