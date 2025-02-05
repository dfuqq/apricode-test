import { dummyData } from './data/dummy';
import { Container, ToDoItem } from './components/';

const App = () => {
	return (
		<>
			<Container>
				<div className='container mx-auto py-10 h-screen'>
					<h1 className='font-bold text-3xl text-center'>Planny</h1>

					<div className='flex-col items-center gap-1'>
						{dummyData.map((item) => (
							<ToDoItem todo={item} />
						))}
					</div>
				</div>
			</Container>
		</>
	);
};

export default App;
