import { TypeToDoItem } from '../types/types';

interface Props {
	todo: TypeToDoItem;
}

export const ToDoItem = ({ todo }: Props) => {
	return (
		<label
			key={todo.id}
			className='flex items-center gap-2 my-4 border rounded-md p-2 border-gray-400 bg-white hover:bg-slate-50 grow select-none'>
			<input
				type='checkbox'
				className='scale-125 mx-2'
			/>

			<div className='w-full'>
				<h2 className='font-semibold text-gray-900'>{todo.title}</h2>
				{todo.description && (
					<p className='text-gray-500 text-sm'>{todo.description}</p>
				)}

				{todo.type === 'main' &&
					todo?.subtasks?.map((subtask) => (
						<ToDoItem todo={subtask} />
					))}
			</div>
		</label>
	);
};
