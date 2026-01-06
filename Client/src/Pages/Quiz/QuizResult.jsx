import { useLocation } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';

function QuizResult() {
  const { state } = useLocation();
  if (!state) return <HomeLayout><div className="min-h-[90vh] p-8">No result to show</div></HomeLayout>;

  const { totalMarks, obtainedMarks, details } = state;

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-4">Quiz Result</h1>
        <p className="mb-4">Score: {obtainedMarks} / {totalMarks}</p>
        <div className="grid gap-3">
          {details?.map((d) => (
            <div key={d.qIndex} className="bg-gray-900/80 p-3 rounded">
              <p>Question #{d.qIndex + 1} — {d.correctFlag ? 'Correct' : 'Wrong'}</p>
            </div>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
export default QuizResult;