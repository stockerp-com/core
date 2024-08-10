export default function AuthTitle(props: { title: string; message: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1>{props.title}</h1>
      <p>{props.message}</p>
    </div>
  );
}
