import { observer } from 'mobx-react-lite';
import { TypeToDoItem } from '../../types/types';
import { ToDoAddSub } from '../todo-add-sub';

interface Props {
	todo: TypeToDoItem;
	isEditing: boolean;
	editTodoTitle: string;
	editTodoDescription: string | undefined;
	setEditTodoTitle: (title: string) => void;
	setEditTodoDescription: (description: string) => void;
}

export const ToDoItemContent = observer(
	({
		todo,
		isEditing,
		editTodoTitle,
		editTodoDescription,
		setEditTodoTitle,
		setEditTodoDescription,
	}: Props) => {
		return isEditing ? (
			<form className='w-full my-1'>
				<input
					type='text'
					value={editTodoTitle}
					onChange={(e) => setEditTodoTitle(e.target.value)}
					placeholder='New title'
					className='w-full border-b font-semibold text-gray-900 p-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
				/>
				<input
					value={editTodoDescription}
					onChange={(e) => setEditTodoDescription(e.target.value)}
					placeholder='New optional description'
					className='w-full border-b text-sm text-gray-600 p-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 mt-1'
				/>
			</form>
		) : (
			<div
				className={`w-full ${
					todo.completed
						? 'line-through text-gray-500'
						: 'text-gray-900'
				}`}>
				<h2 className='font-semibold'>{todo.title}</h2>
				{todo.description && (
					<p className='text-sm text-gray-600'>{todo.description}</p>
				)}

				<ToDoAddSub todo={todo} />
			</div>
		);
	}
);
