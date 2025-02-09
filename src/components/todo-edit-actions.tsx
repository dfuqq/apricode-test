import { observer } from 'mobx-react-lite';

interface Props {
	isEditing: boolean;
	onEdit: (
		id: string,
		editTodoTitle: string,
		editTodoDescription?: string
	) => void;
	onRemove: (id: string) => void;
	todoId: string;
	editTodoTitle: string;
	editTodoDescription?: string;
	setIsEditing: (editing: boolean) => void;
}

export const EditActions = observer(
	({
		isEditing,
		onEdit,
		onRemove,
		todoId,
		editTodoTitle,
		editTodoDescription,
		setIsEditing,
	}: Props) => {
		return isEditing ? (
			<>
				<div
					onClick={() => {
						onEdit(todoId, editTodoTitle, editTodoDescription);
						setIsEditing(false);
					}}
					className='cursor-pointer mr-2 mt-1'>
					💾
				</div>
				<div
					onClick={() => setIsEditing(false)}
					className='cursor-pointer mt-1'>
					❌
				</div>
			</>
		) : (
			<div className='flex items-center'>
				<div
					onClick={() => setIsEditing(true)}
					className='mt-1 mr-2 cursor-pointer'>
					🖊️
				</div>
				<div
					onClick={() => onRemove(todoId)}
					className='cursor-pointer mt-1'>
					🗑️
				</div>
			</div>
		);
	}
);
