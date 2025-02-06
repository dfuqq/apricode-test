import { observer } from 'mobx-react-lite';
import todoStore from '../stores/todo-store';
import { ToDoItem } from './todo-item';

export const ToDoList = observer(() => {
	const handleComplete = (id: number) => {
		todoStore.completeToDo(id);
	};

	const handleRemove = (id: number) => {
		todoStore.removeTodo(id);
	};

	return (
		<div className='flex-col items-center gap-1'>
			{todoStore.todos.map((item) => (
				<ToDoItem
					key={item.id}
					todo={item}
					onComplete={handleComplete}
					onRemove={handleRemove}
				/>
			))}
		</div>
	);
});
