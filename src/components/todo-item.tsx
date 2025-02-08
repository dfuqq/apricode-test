import { observer } from 'mobx-react-lite';
import { TypeToDoItem } from '../types/types';
import { ToDoAddSub } from './todo-add-sub';

interface Props {
	todo: TypeToDoItem;
	onComplete: (id: string) => void;
	onRemove: (id: string) => void;
}

export const ToDoItem = observer(({ todo, onComplete, onRemove }: Props) => {
	return (
		<div className='border rounded-md p-4 my-2 bg-white shadow-md'>
			<div className='flex items-start justify-between'>
				<div className='flex items-center w-full'>
					<input
						type='checkbox'
						checked={todo.completed}
						onChange={() => onComplete(todo.id)}
						className='mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500'
					/>
					<div
						className={`w-full ${
							todo.completed
								? 'line-through text-gray-500'
								: 'text-gray-900'
						}`}>
						<h2 className='font-semibold'>{todo.title}</h2>
						{todo.description && (
							<p className='text-sm text-gray-600'>
								{todo.description}
							</p>
						)}

						<ToDoAddSub todo={todo} />
					</div>
				</div>

				{todo.type === 'main' && todo.subtasks ? (
					<div
						onClick={() => onRemove(todo.id)}
						className='cursor-pointer text-gray-600 hover:text-red-500'>
						❌
					</div>
				) : (
					<div
						onClick={() => onRemove(todo.id)}
						className='cursor-pointer text-gray-600 hover:text-red-500 mt-1'>
						❌
					</div>
				)}
			</div>

			{todo.type === 'main' && todo.subtasks && (
				<div className='ml-6 mt-2'>
					{todo.subtasks.map((subtask) => (
						<ToDoItem
							key={subtask.id}
							todo={subtask}
							onComplete={onComplete}
							onRemove={onRemove}
						/>
					))}
				</div>
			)}
		</div>
	);
});
