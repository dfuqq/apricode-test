export interface TypeToDoSubItem {
	id: string;
	title: string;
	description?: string;
	type: 'sub';
	completed: boolean;
}

interface TypeToDoMainItem {
	id: string;
	title: string;
	description?: string;
	type: 'main';
	completed: boolean;
	subtasks?: TypeToDoSubItem[];
}

// Discriminated Union Type
export type TypeToDoItem = TypeToDoMainItem | TypeToDoSubItem;
