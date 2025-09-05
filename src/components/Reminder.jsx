import toast from "react-hot-toast";
import Button from "./Button";
import alertSound from "../assets/alert.mp3";

export default function Reminder(message) {
  const sound = new Audio(alertSound);
  sound.play();
  return toast.custom(
    (t) => (
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg flex ring-1 ring-gray-600 p-3">
        <div className="flex-1 w-0">
          <p className="text-sm text-gray-900">{message}</p>
        </div>
        <div className="ml-3 flex-shrink-0 flex">
          <Button onClick={() => toast.dismiss(t.id)} variant="logout"></Button>
        </div>
      </div>
    ),
    {
      duration: 20000, // stays for 20 seconds unless closed
      position: "top-center",
    }
  );
}
