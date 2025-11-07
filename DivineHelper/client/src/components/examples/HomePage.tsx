import HomePage from '../HomePage';

export default function HomePageExample() {
  return (
    <HomePage
      language="en"
      onNavigate={(page) => console.log('Navigate to:', page)}
    />
  );
}
