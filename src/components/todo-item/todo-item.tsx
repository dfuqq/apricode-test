import { observer } from 'mobx-react-lite';
import { TypeToDoItem } from '../../types/types';
import { EditActions } from '..';
import { ToDoItemCheckbox, ToDoItemContent } from '.';
import { useState } from 'react';

interface Props {
	todo: TypeToDoItem;
	onComplete: (id: string) => void;
	onRemove: (id: string) => void;
	onEdit: (
		id: string,
		editTodoTitle: string,
		editTodoDescription: string | undefined
	) => void;
}

export const ToDoItem = observer(
	({ todo, onComplete, onRemove, onEdit }: Props) => {
		const [isEditing, setIsEditing] = useState(false);
		const [editTodoTitle, setEditTodoTitle] = useState(todo.title);
		const [editTodoDescription, setEditTodoDescription] = useState(
			todo.description
		);

		return (
			<div className='border rounded-md p-4 my-2 bg-white shadow-md select-none flex'>
				{todo.subtasks?.length && (
					<div className='border-l-2 border-gray-400 mr-2 ml-1'></div> // Vertical Line
				)}
				<div className='flex-1'>
					<div className='flex items-start justify-between'>
						<div className='flex items-center w-full'>
							<ToDoItemCheckbox
								id={todo.id}
								completed={todo.completed}
								onComplete={onComplete}
							/>

							<ToDoItemContent
								todo={todo}
								isEditing={isEditing}
								editTodoTitle={editTodoTitle}
								editTodoDescription={editTodoDescription}
								setEditTodoTitle={setEditTodoTitle}
								setEditTodoDescription={setEditTodoDescription}
							/>
						</div>

						<div className='flex items-center'>
							<EditActions
								isEditing={isEditing}
								onEdit={onEdit}
								onRemove={onRemove}
								todoId={todo.id}
								editTodoTitle={editTodoTitle}
								editTodoDescription={editTodoDescription}
								setIsEditing={setIsEditing}
							/>
						</div>
					</div>
					{todo.subtasks && (
						<div className='ml-6 mt-2'>
							{todo.subtasks.map((subtask) => (
								<ToDoItem
									key={subtask.id}
									todo={subtask}
									onComplete={onComplete}
									onRemove={onRemove}
									onEdit={onEdit}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		);
	}
);
