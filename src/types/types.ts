interface TypeToDoSubItem {
	id: number;
	title: string;
	description?: string;
	type: 'sub';
	completed: boolean;
}

interface TypeToDoMainItem {
	id: number;
	title: string;
	description?: string;
	type: 'main';
	completed: boolean;
	subtasks?: TypeToDoSubItem[];
}

// Discriminated Union Type
export type TypeToDoItem = TypeToDoMainItem | TypeToDoSubItem;
