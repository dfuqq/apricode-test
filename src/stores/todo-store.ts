import { makeAutoObservable, reaction } from 'mobx';
import { TypeToDoItem, TypeToDoSubItem } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

class TodoStore {
	todos: TypeToDoItem[] = [];

	constructor() {
		makeAutoObservable(this);
		this.loadFromLocalStorage();

		// Auto Save to localStorage when todos array changes
		reaction(
			() => this.todos,
			(todos) => {
				localStorage.setItem('todos', JSON.stringify(todos));
			}
		);
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

		this.todos = [...this.todos, newTodo];
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

	private loadFromLocalStorage = () => {
		const todosLocal = localStorage.getItem('todos');
		if (todosLocal) {
			try {
				const parsedTodos = JSON.parse(todosLocal) as TypeToDoItem[];

				// Need to rehydrate the todos that were loaded from localstorage, localstorage doesn't retain prototypes
				this.todos = parsedTodos.map((todo) => {
					// Type check and assign back to it
					if (todo.type === 'main' && todo.subtasks) {
						return {
							...todo,
							subtasks: todo.subtasks.map(
								(subtask: TypeToDoSubItem) => {
									return {
										...(subtask as TypeToDoSubItem),
									};
								}
							),
						};
					}
					// Otherwise simply re-assign the props back
					return {
						...(todo as TypeToDoItem),
					};
				});
			} catch (error) {
				console.error(
					'Error loading or parsing todos from local storage:',
					error
				);
				// Optionally, clear the invalid data from local storage:
				localStorage.removeItem('todos');
			}
		}
	};
}

const todoStore = new TodoStore();
export default todoStore;
