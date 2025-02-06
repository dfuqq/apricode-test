import { makeAutoObservable } from 'mobx';
import { TypeToDoItem } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

class TodoStore {
	todos: TypeToDoItem[] = [
		{
			id: '1',
			title: 'Test 1',
			description: 'This is a test 1 description',
			completed: false,
			type: 'main',
			subtasks: [
				{
					id: '4',
					title: 'test4',
					completed: false,
					description: 'subtask for task 1',
					type: 'sub',
				},
				{
					id: '5',
					title: 'test5',
					completed: false,
					type: 'sub',
				},
			],
		},
		{
			id: '2',
			title: 'Test 2',
			description: 'Test 2 desc',
			type: 'main',
			completed: false,
		},
		{ id: '3', title: 'Test 3', type: 'main', completed: true },
	];

	constructor() {
		makeAutoObservable(this);
	}

	/**
	 * A function for adding new todo to MobX, default 'main' subtask
	 * @param title the title of todo
	 * @param description description for todo
	 */
	addTodo = (title: string, description?: string) => {
		const newTodo: TypeToDoItem = {
			id: uuidv4(),
			title: title,
			type: 'main',
			description: description,
			completed: false,
		};

		console.log(newTodo.id, typeof newTodo.id);

		this.todos.push(newTodo);
	};

	removeTodo = (id: string) => {
		this.todos = this.todos.filter((todo) => todo.id !== id);

		// Remove from subtasks if needed
		this.todos.forEach((todo) => {
			if (todo.type === 'main' && todo.subtasks) {
				todo.subtasks = todo.subtasks.filter(
					(subtask) => subtask.id !== id
				);
			}
		});
	};

	private findTodoAndParentById = (
		id: string,
		todos: TypeToDoItem[],
		parent: TypeToDoItem | null = null
	): { todo: TypeToDoItem | undefined; parent: TypeToDoItem | null } => {
		for (const todo of todos) {
			if (todo.id === id) {
				return { todo, parent };
			}

			if (todo.type === 'main' && todo.subtasks) {
				const result = this.findTodoAndParentById(
					id,
					todo.subtasks,
					todo
				);
				if (result.todo) {
					console.log(result);

					return result;
				}
			}
		}
		return { todo: undefined, parent };
	};

	private completeAllSubtasks = (
		subtasks: TypeToDoItem[],
		completed: boolean
	) => {
		subtasks.forEach((subtask) => {
			subtask.completed = completed;
		});
	};

	completeToDo = (id: string) => {
		const { todo } = this.findTodoAndParentById(id, this.todos);
		if (todo) {
			todo.completed = !todo.completed;

			if (todo.type === 'main' && todo.subtasks) {
				this.completeAllSubtasks(todo.subtasks, todo.completed);
			}
		}
	};
}

const todoStore = new TodoStore();
export default todoStore;
