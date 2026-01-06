import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { getSubmissions, gradeSubmission } from '../../Redux/Slices/AssessmentSlice';
import toast from 'react-hot-toast';

export default function SubmissionList() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const submissions = useSelector((s) => s.assessment.submissions);
  const [marks, setMarks] = useState({});

  useEffect(() => { dispatch(getSubmissions(id)); }, [dispatch, id]);

  async function onGrade(submissionId) {
    const m = marks[submissionId];
    if (m == null) return toast.error('Enter marks');
    const res = await dispatch(gradeSubmission({ id, submissionId, marksAwarded: Number(m) }));
    if (res?.payload) { toast.success('Graded'); dispatch(getSubmissions(id)); }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl mb-6">Submissions</h1>
        {submissions?.length === 0 ? <p>No submissions yet</p> : (
          <div className="space-y-4">
            {submissions.map((s) => (
              <div key={s._id} className="bg-gray-900/80 p-4 rounded">
                <p><strong>Student:</strong> {s.student?.fullName || s.student}</p>
                <p><strong>Text:</strong> {s.submissionText || '—'}</p>
                {s.submissionFile?.secure_url && <p><a className="text-yellow-400" href={s.submissionFile.secure_url} target="_blank" rel="noreferrer">View file</a></p>}
                <div className="mt-2 flex gap-2">
                  <input type="number" className="p-1 bg-gray-800 rounded w-32" placeholder="Marks" value={marks[s._id] ?? ''} onChange={(e) => setMarks({ ...marks, [s._id]: e.target.value })} />
                  <button className="bg-green-500 px-3 py-1 rounded" onClick={() => onGrade(s._id)}>Grade</button>
                </div>
                <p className="mt-2">Awarded: {s.marksAwarded ?? 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </HomeLayout>
  );
}