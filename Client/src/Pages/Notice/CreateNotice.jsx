import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import HomeLayout from "../../Layouts/HomeLayout";
import { createNotice } from "../../Redux/Slices/NoticeSlice";

function CreateNotice() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.data);

  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [preview, setPreview] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function handleImage(e) {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.description) return toast.error('All fields are required');

    const res = await dispatch(createNotice({ ...form, createdBy: user?.fullName || user?.email || 'Admin' }));
    if (res?.payload?._id) {
      toast.success('Notice created');
      navigate('/notice');
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] text-white flex items-center justify-center py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-gray-900/80 p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">Create Notice</h2>
          <div className="mb-3">
            <label className="block mb-1">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 bg-gray-800 rounded" rows={6} />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImage} />
            {preview && <img src={preview} alt="preview" className="mt-2 w-40 h-40 object-cover rounded" />}
          </div>
          <div className="flex gap-3">
            <button className="bg-yellow-500 px-4 py-2 rounded">Create</button>
            <button type="button" onClick={() => navigate('/notice')} className="px-4 py-2 rounded border">Cancel</button>
          </div>
        </form>
      </div>
    </HomeLayout>
  );
}
export default CreateNotice;