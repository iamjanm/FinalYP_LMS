import React from 'react';
import { useNavigate } from 'react-router-dom';

function NoticeCard({ notice, isAdmin, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900/80 p-4 rounded-md shadow-md w-full">
      <div className="flex items-start gap-4">
        {notice.image?.secure_url ? (
          <img src={notice.image.secure_url} alt={notice.title} className="w-24 h-24 object-cover rounded" />
        ) : (
          <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center">Img</div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{notice.title}</h3>
          <p className="text-sm text-gray-300 mt-2">{notice.description}</p>
          <p className="text-xs text-gray-400 mt-2">By: {notice.createdBy} • {new Date(notice.createdAt).toLocaleString()}</p>
        </div>
        {isAdmin && (
          <div className="flex flex-col gap-2">
            <button onClick={() => onEdit(notice)} className="text-green-400">Edit</button>
            <button onClick={() => onDelete(notice)} className="text-red-400">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NoticeCard;