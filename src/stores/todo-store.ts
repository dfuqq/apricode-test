import { makeAutoObservable, reaction } from 'mobx';
import { TypeToDoItem } from '../types/types';
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
			description: description,
			completed: false,
			subtasks: [],
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
			description,
			completed: false,
			subtasks: [],
		};

		this.todos = this.todos.map((todo) =>
			this.recursivelyAddSubTodo(todo, parentTodoId, newTodo)
		);
	};

	private recursivelyAddSubTodo = (
		todo: TypeToDoItem,
		parentTodoId: string,
		newTodo: TypeToDoItem
	): TypeToDoItem => {
		if (todo.id === parentTodoId) {
			return { ...todo, subtasks: [...(todo.subtasks || []), newTodo] };
		}

		if (todo.subtasks) {
			const updatedSubtasks = todo.subtasks.map((subtask) =>
				this.recursivelyAddSubTodo(subtask, parentTodoId, newTodo)
			);
			return { ...todo, subtasks: updatedSubtasks };
		}

		return todo;
	};

	removeTodo = (id: string) => {
		this.todos = this.recursivelyRemoveTodo(this.todos, id);
	};

	private recursivelyRemoveTodo = (
		todos: TypeToDoItem[],
		id: string
	): TypeToDoItem[] => {
		return todos
			.filter((todo) => todo.id !== id) // Filter out the todo to remove
			.map((todo) => {
				if (todo.subtasks) {
					return {
						...todo,
						subtasks: this.recursivelyRemoveTodo(todo.subtasks, id),
					}; // Recursively filter subtasks
				}
				return todo;
			});
	};

	private completeAllSubtasks = (
		subtasks: TypeToDoItem[],
		completed: boolean
	) => {
		subtasks.forEach((subtask) => {
			subtask.completed = completed;
			if (subtask.subtasks) {
				this.completeAllSubtasks(subtask.subtasks, completed); // Recursive call
			}
		});
	};

	completeToDo = (id: string) => {
		this.todos = this.todos.map((todo) =>
			this.recursivelyCompleteTodo(todo, id)
		);
	};

	private recursivelyCompleteTodo = (
		todo: TypeToDoItem,
		id: string
	): TypeToDoItem => {
		if (todo.id === id) {
			const completed = !todo.completed; // Toggle completed state
			if (todo.subtasks) {
				this.completeAllSubtasks(todo.subtasks, completed); // Complete all subtasks
			}
			return { ...todo, completed: completed };
		}

		if (todo.subtasks) {
			const updatedSubtasks = todo.subtasks.map((subtask) =>
				this.recursivelyCompleteTodo(subtask, id)
			);
			return { ...todo, subtasks: updatedSubtasks };
		}

		return todo;
	};

	private loadFromLocalStorage = () => {
		const todosLocal = localStorage.getItem('todos');
		if (todosLocal) {
			try {
				const parsedTodos = JSON.parse(todosLocal) as TypeToDoItem[];

				this.todos = parsedTodos;
			} catch (error) {
				console.error(
					'Error loading or parsing todos from local storage:',
					error
				);
				localStorage.removeItem('todos');
			}
		}
	};
}

const todoStore = new TodoStore();
export default todoStore;
