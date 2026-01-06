import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import NoticeCard from "../../Compontents/NoticeCard";
import { getAllNotices, deleteNotice } from "../../Redux/Slices/NoticeSlice";

function Notice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notices } = useSelector((state) => state.notice);
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    dispatch(getAllNotices());
  }, [dispatch]);

  async function handleDelete(notice) {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    const res = await dispatch(deleteNotice(notice._id));
    if (res?.payload?.success) {
      toast.success('Notice deleted');
      dispatch(getAllNotices());
    }
  }

  function handleEdit(notice) {
    navigate(`/notice/edit/${notice._id}`);
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex flex-col items-center gap-6 mx-5 sm:mx-16 md:mx-20 py-8">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notices</h1>
          {role === 'ADMIN' && (
            <button onClick={() => navigate('/notice/create')} className="bg-yellow-500 px-4 py-2 rounded">Create Notice</button>
          )}
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          {notices?.length === 0 ? (
            <p>No notices found</p>
          ) : (
            notices.map((n) => (
              <NoticeCard key={n._id} notice={n} isAdmin={role === 'ADMIN'} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </HomeLayout>
  );
}
export default Notice;