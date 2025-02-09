interface Props {
	id: string;
	completed: boolean;
	onComplete: (id: string) => void;
}

export const ToDoItemCheckbox = ({ id, completed, onComplete }: Props) => {
	return (
		<input
			type='checkbox'
			checked={completed}
			onChange={() => onComplete(id)}
			className='mr-2 h-5 w-5 text-blue-500 focus:ring-blue-500'
		/>
	);
};
