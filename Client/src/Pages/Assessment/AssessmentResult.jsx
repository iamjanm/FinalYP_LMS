import { useLocation } from 'react-router-dom';
import HomeLayout from '../../Layouts/HomeLayout';

export default function AssessmentResult() {
  const { state } = useLocation();
  // show only sanitized submission details — do not display raw logs or JSON
  const submission = state?.submission || state || {};

  return (
    <HomeLayout>
      <div className="min-h-[90vh] p-8 text-white">
        <h1 className="text-3xl mb-4"></h1>
        {!submission || Object.keys(submission).length === 0 ? (
          <p>No submission data</p>
        ) : (
          <div className="bg-gray-900/80 p-4 rounded">
            <p><strong>Marks:</strong> {submission.obtainedMarks ?? submission.marksAwarded ?? 'N/A'} / {submission.totalMarks ?? 'N/A'}</p>

            <div className="mt-4">
              <p className="font-semibold">Submission</p>
              <div className="mt-2 text-sm text-gray-200">
                {submission.submissionText ? (
                  <p className="whitespace-pre-wrap">{submission.submissionText}</p>
                ) : (
                  <p className="text-gray-400">No text submission provided.</p>
                )}

                {submission.submissionFile?.secure_url && (
                  <p className="mt-2"><a className="text-yellow-400" href={submission.submissionFile.secure_url} target="_blank" rel="noreferrer">View attached file</a></p>
                )}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-300">
              <p><strong>Graded by:</strong> {submission.gradedBy ?? 'Not graded yet'}</p>
              <p><strong>Graded at:</strong> {submission.gradedAt ? new Date(submission.gradedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
        )}
      </div>
    </HomeLayout>
  );
}
