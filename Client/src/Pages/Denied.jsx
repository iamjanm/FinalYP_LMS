import { useNavigate } from "react-router-dom";

function Denied() {
  const navigate = useNavigate();

  const handleOpenEmail = () => {
    window.open("https://mail.google.com", "_blank");
  };

  return (
    <main className="h-screen w-full flex flex-col items-center justify-center bg-[#1A2238] gap-4">
      
      <div className="bg-black text-white px-6 py-2 text-sm rounded">
        Please check your email to verify your account.
      </div>

      <button
        onClick={handleOpenEmail}
        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded font-semibold"
      >
        Open Email
      </button>

    </main>
  );
}

export default Denied;
