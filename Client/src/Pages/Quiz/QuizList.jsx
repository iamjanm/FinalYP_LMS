import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { getAllQuizzes } from '../../Redux/Slices/QuizSlice';

function QuizList() {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quiz.quizzes);

  useEffect(() => {
    dispatch(getAllQuizzes());
  }, [dispatch]);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white p-8">
        <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {quizzes?.length === 0 ? (
            <p>No quizzes available</p>
          ) : (
            quizzes.map((q) => (
              <div key={q._id} className="bg-gray-900/80 p-4 rounded">
                <h2 className="font-semibold text-xl">{q.title}</h2>
                <p className="text-sm text-gray-300">{q.description}</p>
                <div className="mt-3">
                  <Link to={`/quiz/${q._id}`} className="bg-yellow-500 px-3 py-1 rounded">Take Quiz</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
export default QuizList;