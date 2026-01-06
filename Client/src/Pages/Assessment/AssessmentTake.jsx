import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { getAssessmentById, submitAssessment } from '../../Redux/Slices/AssessmentSlice';
import toast from 'react-hot-toast';

export default function AssessmentTake() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const assessment = useSelector((s) => s.assessment.currentAssessment);
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => { dispatch(getAssessmentById(id)); }, [dispatch, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text && !file) return toast.error('Provide submission text or file');
    const res = await dispatch(submitAssessment({ id, submissionText: text, file }));
    if (res?.payload) { toast.success('Submitted'); navigate(`/assessment/result/${id}`, { state: res.payload }); }
  }

  if (!assessment) return <HomeLayout><div className="min-h-[90vh] p-16">Loading...</div></HomeLayout>;

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 px-16 text-white">
        <h1 className="text-3xl mb-2">{assessment.title}</h1>
        <p className="mb-4">{assessment.description}</p>
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <textarea className="w-full p-2 bg-gray-800 rounded mb-2" placeholder="Submission text" value={text} onChange={(e) => setText(e.target.value)} />
          <input type="file" className="mb-2" onChange={(e) => setFile(e.target.files[0])} />
          <div className="flex gap-3"><button type="submit" className="bg-yellow-500 px-4 py-2 rounded">Submit</button></div>
        </form>
      </div>
    </HomeLayout>
  );
}
