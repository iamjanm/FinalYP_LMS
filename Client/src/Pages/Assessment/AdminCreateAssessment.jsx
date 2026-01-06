import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import toast from 'react-hot-toast';
import { createAssessment } from '../../Redux/Slices/AssessmentSlice';

export default function AdminCreateAssessment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.data);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return toast.error('Title required');
    const payload = { title, description, dueDate, totalMarks, createdBy: user?.fullName || 'ADMIN' };
    const res = await dispatch(createAssessment(payload));
    if (res?.payload?._id) { toast.success('Assessment created'); navigate('/assessments'); }
    else toast.error('Failed to create assessment');
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl mb-6">Create Assessment</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <input className="w-full p-2 bg-gray-800 rounded mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full p-2 bg-gray-800 rounded mb-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="mb-2 flex gap-2">
            <input type="datetime-local" className="p-2 bg-gray-800 rounded" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <input type="number" className="p-2 bg-gray-800 rounded w-32" value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} />
          </div>
          <div className="flex gap-3"><button type="submit" className="bg-yellow-500 px-4 py-2 rounded">Create</button></div>
        </form>
      </div>
    </HomeLayout>
  );
}
