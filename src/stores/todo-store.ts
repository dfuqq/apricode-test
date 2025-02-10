import { makeAutoObservable, reaction } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { TypeToDoItem } from '../types/types';

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
	 * @param description description for todo (optional)
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

	/**
	 * A function for adding new sub todo
	 * @param parentTodoId main task which we attaching subtask
	 * @param title the title of sub todo
	 * @param description description of sub todo (optional)
	 */
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

	/**
	 *
	 * @param todo where attach new subtask
	 * @param parentTodoId whom the main task is
	 * @param newTodo new subtask with TypeToDoItem
	 * @returns new object with nested subtasks
	 */
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

	/**
	 * Filters out initial object and returns new ones without given task
	 * @param todos
	 * @param id
	 * @returns
	 */
	private recursivelyRemoveTodo = (
		todos: TypeToDoItem[],
		id: string
	): TypeToDoItem[] => {
		return todos
			.filter((todo) => todo.id !== id)
			.map((todo) => {
				if (todo.subtasks) {
					return {
						...todo,
						subtasks: this.recursivelyRemoveTodo(todo.subtasks, id),
					};
				}
				return todo;
			});
	};

	completeToDo = (id: string) => {
		this.todos = this.recursivelyCompleteTodo(this.todos, id);
	};

	/**
	 * Finds out task and changes state of checked, gets it to subtasks if needed
	 * @param todos
	 * @param id
	 * @returns
	 */
	private recursivelyCompleteTodo = (
		todos: TypeToDoItem[],
		id: string
	): TypeToDoItem[] => {
		return todos
			.map((todo) => {
				if (todo.id === id) {
					const newCompleted = !todo.completed;
					let updatedTodo = { ...todo, completed: newCompleted };

					if (updatedTodo.subtasks) {
						updatedTodo = {
							...updatedTodo,
							subtasks: this.completeAllSubtasks(
								updatedTodo.subtasks,
								newCompleted
							),
						};
					}
					return updatedTodo;
				}

				if (todo.subtasks) {
					return {
						...todo,
						subtasks: this.recursivelyCompleteTodo(
							todo.subtasks,
							id
						),
					};
				}

				return todo;
			})
			.map((todo) => this.updateParentCompletion(todo)); // Chain to update parents
	};

	private completeAllSubtasks = (
		subtasks: TypeToDoItem[],
		completed: boolean
	): TypeToDoItem[] => {
		return subtasks.map((subtask) => {
			let updatedSubtask = { ...subtask, completed: completed };
			if (updatedSubtask.subtasks) {
				updatedSubtask = {
					...updatedSubtask,
					subtasks: this.completeAllSubtasks(
						updatedSubtask.subtasks,
						completed
					),
				};
			}
			return updatedSubtask;
		});
	};

	/**
	 * Finds out where all subtasks completed and checks main task as completed
	 * @param todo
	 * @returns
	 */
	private updateParentCompletion = (todo: TypeToDoItem): TypeToDoItem => {
		if (todo.subtasks && todo.subtasks.length > 0) {
			const allSubtasksCompleted = todo.subtasks.every(
				(subtask) => subtask.completed
			);
			if (todo.completed !== allSubtasksCompleted) {
				return { ...todo, completed: allSubtasksCompleted };
			}
		}
		return todo;
	};

	/**
	 * A function for editing note
	 * @param id task's id
	 * @param newTitle can be either same as old, or completely new
	 * @param newDescription can be either same as old, or completely new (optional)
	 */
	editTodo = (id: string, newTitle: string, newDescription?: string) => {
		this.todos = this.recursivelyEditTodo(
			this.todos,
			id,
			newTitle,
			newDescription
		);
	};

	/**
	 * Finds out task by id and changes it's title + description
	 * @param todos
	 * @param id
	 * @param newTitle
	 * @param newDescription
	 * @returns object with updated content
	 */
	private recursivelyEditTodo = (
		todos: TypeToDoItem[],
		id: string,
		newTitle: string,
		newDescription?: string
	): TypeToDoItem[] => {
		return todos.map((todo) => {
			if (todo.id === id) {
				return {
					...todo,
					title: newTitle,
					description: newDescription,
				};
			}
			if (todo.subtasks) {
				return {
					...todo,
					subtasks: this.recursivelyEditTodo(
						todo.subtasks,
						id,
						newTitle,
						newDescription
					),
				};
			}
			return todo;
		});
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
