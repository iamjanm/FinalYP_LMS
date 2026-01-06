import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';
import { getAllAssessments } from '../../Redux/Slices/AssessmentSlice';

export default function AssessmentList() {
  const dispatch = useDispatch();
  const assessments = useSelector((state) => state.assessment.assessments);

  useEffect(() => { dispatch(getAllAssessments()); }, [dispatch]);

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Assessments</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {assessments?.length === 0 ? (
            <p>No assessments available</p>
          ) : (
            assessments.map((a) => (
              <div key={a._id} className="bg-gray-900/80 p-4 rounded">
                <h2 className="font-semibold text-xl">{a.title}</h2>
                <p className="text-sm text-gray-300">{a.description}</p>
                <p className="text-sm text-gray-400">Due: {a.dueDate ? new Date(a.dueDate).toLocaleString() : 'No due date'}</p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/assessment/${a._id}`} className="bg-yellow-500 px-3 py-1 rounded">Open</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
