import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { createQuiz } from '../../Redux/Slices/QuizSlice';
import toast from 'react-hot-toast';

function AdminCreateQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.data);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', ''], correctOption: 0, marks: 1 },
  ]);

  function addQuestion() {
    setQuestions((q) => [...q, { question: '', options: ['', ''], correctOption: 0, marks: 1 }]);
  }

  function updateQuestion(idx, field, value) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  }

  function updateOption(qIdx, optIdx, val) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].options[optIdx] = val;
      return copy;
    });
  }

  function addOption(qIdx) {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].options.push('');
      return copy;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return toast.error('Title required');
    if (questions.some((q) => !q.question || q.options.some((o) => !o))) return toast.error('All questions and options must be filled');

    const payload = { title, description, questions, createdBy: user?.fullName || 'ADMIN' };
    const res = await dispatch(createQuiz(payload));
    if (res?.payload?._id) {
      toast.success('Quiz created');
      navigate('/quizzes');
    } else {
      toast.error('Failed to create quiz');
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl mb-4">Create Quiz</h1>
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="mb-3"><input className="w-full p-2 bg-gray-800 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div className="mb-3"><textarea className="w-full p-2 bg-gray-800 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          {questions.map((q, idx) => (
            <div key={idx} className="mb-4 bg-gray-900/80 p-3 rounded">
              <input className="w-full p-2 bg-gray-800 rounded mb-2" placeholder={`Question ${idx + 1}`} value={q.question} onChange={(e) => updateQuestion(idx, 'question', e.target.value)} />
              <div className="grid gap-2">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center gap-2">
                    <input className="flex-1 p-2 bg-gray-800 rounded" placeholder={`Option ${oIdx + 1}`} value={opt} onChange={(e) => updateOption(idx, oIdx, e.target.value)} />
                    <label className="text-sm">Correct
                      <input type="radio" name={`correct-${idx}`} checked={q.correctOption === oIdx} onChange={() => updateQuestion(idx, 'correctOption', oIdx)} />
                    </label>
                  </div>
                ))}
                <button type="button" onClick={() => addOption(idx)} className="text-sm text-yellow-400">Add option</button>
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button type="button" onClick={addQuestion} className="px-3 py-2 border rounded">Add Question</button>
            <button type="submit" className="bg-yellow-500 px-4 py-2 rounded">Create</button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}
export default AdminCreateQuiz;