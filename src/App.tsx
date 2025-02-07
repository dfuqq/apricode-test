import { Container, ToDoAdd, ToDoList } from './components/';

const App = () => {
	return (
		<>
			<Container>
				<div className='container mx-auto py-10 h-screen'>
					<h1 className='font-bold text-3xl text-center'>Planny</h1>

					<ToDoAdd />

					<ToDoList />
				</div>
			</Container>
		</>
	);
};

export default App;
