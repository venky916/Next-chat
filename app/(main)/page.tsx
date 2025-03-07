import AuthForm from "./_components/AuthForm";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto max-w-md">
      <div className="bg-white flex justify-center items-center w-full shadow-xl rounded-lg mt-10 mb-5">
        <h1 className="text-4xl font-workSans p-1">Let&apos;s Chat</h1>
      </div>
      <AuthForm />
    </div>
  );
}
