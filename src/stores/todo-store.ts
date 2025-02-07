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
	 * A function for adding new todo to MobX, default 'main' task
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

	addSubTodo = (
		parentTodoId: string,
		title: string,
		description?: string
	) => {
		const newTodo: TypeToDoItem = {
			id: uuidv4(),
			title,
			type: 'sub',
			description,
			completed: false,
		};

		this.todos = this.todos.map((todo) => {
			if (todo.id === parentTodoId) {
				if (todo.type === 'main') {
					const updatedTodo: TypeToDoItem = {
						...todo,
						subtasks: [...(todo.subtasks || []), newTodo], // Add to existing or create new
					};

					return updatedTodo;
				}
			}
			return todo;
		});
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
		this.todos = this.todos.map((todo) => {
			if (todo.id === id) {
				// Create a *new* object with the toggled completed state.
				return { ...todo, completed: !todo.completed };
			}
			return todo; // Return the original todo if it's not the one we're updating.
		});

		// If it's a main task and completing, complete all subtasks
		this.todos.forEach((todo) => {
			if (todo.type === 'main' && todo.id === id && todo.subtasks) {
				this.completeAllSubtasks(todo.subtasks, todo.completed); // The completed flag has already been toggled
			}
		});
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
