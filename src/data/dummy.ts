import { TypeToDoItem } from '../types/types';

export const dummyData: TypeToDoItem[] = [
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
