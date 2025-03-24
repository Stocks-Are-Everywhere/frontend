interface Props {
  message: string;
  type: "success" | "error";
}

const FeedbackMessage: React.FC<Props> = ({ message, type }) => {
  const color =
    type === "success"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-600";

  return <div className={`mt-4 p-2 rounded text-sm ${color}`}>{message}</div>;
};

export default FeedbackMessage;
