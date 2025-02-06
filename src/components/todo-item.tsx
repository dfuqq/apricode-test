import { observer } from 'mobx-react-lite';
import { TypeToDoItem } from '../types/types';

interface Props {
	todo: TypeToDoItem;
	onComplete: (id: number) => void;
	onRemove: (id: number) => void;
}

export const ToDoItem = observer(({ todo, onComplete, onRemove }: Props) => {
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
		</div>
	);
});
