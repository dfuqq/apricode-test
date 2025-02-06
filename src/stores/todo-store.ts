import { makeAutoObservable } from 'mobx';
import { TypeToDoItem } from '../types/types';

class TodoStore {
	todos: TypeToDoItem[] = [
		{
			id: 1,
			title: 'Test 1',
			description: 'This is a test 1 description',
			completed: false,
			type: 'main',
			subtasks: [
				{
					id: 4,
					title: 'test4',
					completed: false,
					description: 'subtask for task 1',
					type: 'sub',
				},
				{
					id: 5,
					title: 'test5',
					completed: false,
					type: 'sub',
				},
			],
		},
		{
			id: 2,
			title: 'Test 2',
			description: 'Test 2 desc',
			type: 'main',
			completed: false,
		},
		{ id: 3, title: 'Test 3', type: 'main', completed: true },
	];

	constructor() {
		makeAutoObservable(this);
	}

	addTodo = (todo: TypeToDoItem) => {
		this.todos.push(todo);
	};

	removeTodo = (id: number) => {
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
		id: number,
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

	completeToDo = (id: number) => {
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
