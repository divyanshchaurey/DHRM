import KarmPage from '../KarmPage';

export default function KarmPageExample() {
  return (
    <KarmPage
      language="en"
      onStreakChange={(streak) => console.log('Streak changed:', streak)}
    />
  );
}
