export interface TypeToDoItem {
	id: string;
	title: string;
	description?: string;
	completed: boolean;
	subtasks?: TypeToDoItem[];
}
