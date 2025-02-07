import { observer } from 'mobx-react-lite';
import { TypeToDoItem } from '../types/types';
import { useState } from 'react';
import todoStore from '../stores/todo-store';

interface Props {
	todo: TypeToDoItem;
	onComplete: (id: string) => void;
	onRemove: (id: string) => void;
}

export const ToDoItem = observer(({ todo, onComplete, onRemove }: Props) => {
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
		}
		setNewSubTodoTitle('');
		setNewSubTodoDescription('');
		setIsAddingNewSub(false);
	};

	return (
		<div className='flex items-center gap-2 my-4 border rounded-md p-2 border-gray-400 bg-white hover:bg-slate-50 grow select-none'>
			<label className='flex-grow flex items-center gap-2'>
				<input
					type='checkbox'
					checked={todo.completed}
					onChange={() => onComplete(todo.id)}
					className='scale-125 mx-2'
				/>

				<div
					className={`w-full ${
						todo.completed ? 'line-through' : ''
					}`}>
					<h2 className='font-semibold text-gray-900'>
						{todo.title}
					</h2>
					{todo.description && (
						<p className='text-gray-500 text-sm'>
							{todo.description}
						</p>
					)}

					{todo.type === 'main' &&
						todo?.subtasks?.map((subtask) => (
							<ToDoItem
								key={subtask.id}
								todo={subtask}
								onComplete={onComplete}
								onRemove={onRemove}
							/>
						))}
				</div>
			</label>
			{/* FIXME: X goes line-through when main completed */}
			<div
				className='cursor-pointer m-2'
				onClick={() => onRemove(todo.id)}>
				<p>❌</p>
			</div>

			{/* TODO: Separate */}
			{todo.type === 'main' && (
				<div>
					{!isAddingNewSub ? (
						<button
							onClick={() => setIsAddingNewSub(true)}
							className='border-2 p-2'>
							Add new Sub
						</button>
					) : (
						<div>
							<input
								type='text'
								value={newSubTodoTitle}
								onChange={(e) =>
									setNewSubTodoTitle(e.target.value)
								}
								placeholder='Title...'
								className='gap-2 my-4 border rounded-md p-2 m-4 border-gray-400 bg-white hover:bg-slate-50 grow select-none'
							/>
							{newSubTodoTitle && (
								<input
									type='text'
									value={newSubTodoDescription}
									onChange={(e) =>
										setNewSubTodoDescription(e.target.value)
									}
									placeholder='Description...'
									className='gap-2 my-4 border rounded-md p-2 m-4 border-gray-400 bg-white hover:bg-slate-50 grow select-none'
								/>
							)}
							<button
								onClick={handleAddSubTodo}
								className='border-2 p-2 disabled:bg-red-500'
								disabled={!newSubTodoTitle}>
								Save Subtodo
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
});
