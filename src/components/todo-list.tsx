import { observer } from 'mobx-react-lite';
import todoStore from '../stores/todo-store';
import { ToDoItem } from './todo-item/todo-item';

export const ToDoList = observer(() => {
	const handleComplete = (id: string) => {
		todoStore.completeToDo(id);
	};

	const handleRemove = (id: string) => {
		todoStore.removeTodo(id);
	};

	const handleEdit = (
		id: string,
		editTodoTitle: string,
		editTodoDescription: string | undefined
	) => {
		todoStore.editTodo(id, editTodoTitle, editTodoDescription);
	};

	return (
		<div className='flex-col items-center gap-1 w-full bg-red-100 rounded-md p-6'>
			{todoStore.todos.map((item) => (
				<ToDoItem
					key={item.id}
					todo={item}
					onComplete={handleComplete}
					onRemove={handleRemove}
					onEdit={handleEdit}
				/>
			))}
			{!todoStore.todos.length && (
				<h3 className='text-center'>No Todos Yet!</h3>
			)}
		</div>
	);
});
