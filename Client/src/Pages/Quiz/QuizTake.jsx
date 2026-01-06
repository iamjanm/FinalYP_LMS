import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { getQuizById, submitQuiz } from '../../Redux/Slices/QuizSlice';
import toast from 'react-hot-toast';

function QuizTake() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quiz = useSelector((state) => state.quiz.currentQuiz);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    dispatch(getQuizById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (quiz) {
      setAnswers(quiz.questions.map(() => ({ selectedOption: null })));
    }
  }, [quiz]);

  function selectOption(qIndex, optIndex) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = { selectedOption: optIndex, qIndex };
      return copy;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = answers.map((a) => ({ qIndex: a.qIndex, selectedOption: a.selectedOption }));
    const res = await dispatch(submitQuiz({ id, answers: payload }));
    if (res?.payload) {
      navigate(`/quiz/result/${id}`, { state: res.payload });
    }
  }

  if (!quiz) return <HomeLayout><div className="min-h-[90vh] p-8">Loading...</div></HomeLayout>;

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
        <p className="mb-6">{quiz.description}</p>
        <form onSubmit={handleSubmit}>
          {quiz.questions.map((q, idx) => (
            <div key={q._id} className="mb-6 bg-gray-900/80 p-4 rounded">
              <h3 className="font-semibold">{idx + 1}. {q.question}</h3>
              <div className="mt-2 grid gap-2">
                {q.options.map((opt, oIdx) => (
                  <label key={oIdx} className="flex items-center gap-2">
                    <input type="radio" name={`q-${idx}`} checked={answers[idx]?.selectedOption === oIdx} onChange={() => selectOption(idx, oIdx)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="bg-yellow-500 px-4 py-2 rounded" onClick={() => { if (!answers.some(a => a.selectedOption !== null)) { toast.error('Please answer at least one question'); } }}>Submit</button>
        </form>
      </div>
    </HomeLayout>
  );
}

export default QuizTake;